TK.tool('utm-builder', {
  inputs: [{ id: 'in', label: ['대상 URL (한 줄에 하나 — 여러 개면 한꺼번에 UTM 을 붙입니다)', 'Destination URLs (one per line - UTM is added to each)'], rows: 4, sample: 'https://example.com/pricing\nhttps://example.com/blog/launch?ref=home#plans' }],
  options: [
    { id: 'source', type: 'text', label: ['utm_source (필수 · 유입처)', 'utm_source (required - where from)'], default: 'newsletter', placeholder: ['google, naver, newsletter', 'google, newsletter'] },
    { id: 'medium', type: 'text', label: ['utm_medium (필수 · 매체)', 'utm_medium (required - channel type)'], default: 'email', placeholder: ['cpc, email, social', 'cpc, email, social'] },
    { id: 'campaign', type: 'text', label: ['utm_campaign (필수 · 캠페인)', 'utm_campaign (required - campaign)'], default: 'Fall Sale 2026' },
    { id: 'term', type: 'text', label: ['utm_term (선택 · 키워드)', 'utm_term (optional - keyword)'], default: '' },
    { id: 'content', type: 'text', label: ['utm_content (선택 · 소재/버전)', 'utm_content (optional - creative / variant)'], default: 'header_button' },
    { id: 'id', type: 'text', label: ['utm_id (선택 · 캠페인 ID, GA4)', 'utm_id (optional - campaign ID, GA4)'], default: '' },
    { id: 'norm', type: 'select', label: ['값 정리', 'Value cleanup'], choices: [['lower_', ['소문자 + 공백은 _ (권장)', 'lower case + spaces → _ (recommended)']], ['lower-', ['소문자 + 공백은 -', 'lower case + spaces → -']], ['keep', ['입력 그대로 (공백은 %20)', 'Keep as typed (spaces → %20)']]], default: 'lower_' },
    { id: 'replace', type: 'checkbox', label: ['URL 에 이미 있는 utm_* 값은 덮어쓰기', 'Overwrite existing utm_* parameters in the URL'], default: true }
  ],
  outputs: [{ id: 'out', label: ['UTM 이 붙은 URL', 'URLs with UTM'], kind: 'code', ext: 'txt' }, { id: 'table', label: ['적용된 매개변수', 'Applied parameters'], kind: 'table' }, { id: 'issues', label: ['점검 결과', 'Findings'], kind: 'list' }],
  run: function (v, o, t) {
    var lines = String(v['in'] || '').split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (!lines.length) throw new Error(t('URL 을 입력하세요', 'Enter at least one URL'));
    var issues = [], KEYS = ['source', 'medium', 'campaign', 'term', 'content', 'id'];
    function clean(val) {
      var s = String(val == null ? '' : val).trim();
      if (!s) return '';
      if (o.norm === 'keep') return s;
      var sep = o.norm === 'lower-' ? '-' : '_';
      return s.toLowerCase().replace(/\s+/g, sep);
    }
    var vals = {}; KEYS.forEach(function (k) { vals[k] = clean(o[k]); });
    ['source', 'medium', 'campaign'].forEach(function (k) { if (!vals[k]) issues.push('⛔ ' + t('utm_' + k + ' 는 필수입니다. 비워 두면 GA4 에서 (not set) 으로 집계됩니다', 'utm_' + k + ' is required; without it GA4 reports (not set)')); });
    var MEDIUMS = ['cpc', 'ppc', 'paid', 'paidsearch', 'email', 'social', 'organic', 'referral', 'display', 'banner', 'affiliate', 'video', 'sms', 'push', 'audio', 'cpm', 'retargeting', 'qr', 'print', 'offline'];
    if (vals.medium && MEDIUMS.indexOf(vals.medium.toLowerCase()) < 0) issues.push('ℹ️ ' + t('utm_medium "' + vals.medium + '" 은(는) GA4 기본 채널 그룹이 인식하는 값(cpc, email, social, display, affiliate, referral 등)이 아닙니다. 채널 분류가 "Unassigned" 가 될 수 있습니다', 'utm_medium "' + vals.medium + '" is not one of the values GA4\'s default channel groups recognise (cpc, email, social, display, affiliate, referral ...); it may land in Unassigned'));
    if (/[A-Z]/.test(String(o.source || '') + String(o.medium || '') + String(o.campaign || '')) && o.norm === 'keep') issues.push('⚠️ ' + t('대문자가 섞여 있습니다. GA 는 대소문자를 구분해 "Email" 과 "email" 을 다른 값으로 집계합니다', 'Upper-case letters are present; GA treats "Email" and "email" as different values'));
    if (/\s/.test(String(o.source || '') + String(o.medium || '') + String(o.campaign || '')) && o.norm === 'keep') issues.push('ℹ️ ' + t('공백은 %20 으로 인코딩됩니다. 보고서에서 읽기 어려우니 _ 나 - 를 권장합니다', 'Spaces are encoded as %20; _ or - is easier to read in reports'));
    var rows = [], outs = [];
    function enc(s) { return encodeURIComponent(s).replace(/%20/g, '%20'); }
    lines.forEach(function (raw, i) {
      var u;
      try { u = new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : 'https://' + raw); } catch (e) { issues.push('⛔ ' + t((i + 1) + '번째 줄 "' + raw + '" 은(는) 올바른 URL 이 아닙니다', 'Line ' + (i + 1) + ' "' + raw + '" is not a valid URL')); return; }
      if (!/^https?:$/.test(u.protocol)) { issues.push('⛔ ' + t((i + 1) + '번째 줄: http(s) URL 만 지원합니다', 'Line ' + (i + 1) + ': only http(s) URLs are supported')); return; }
      if (!/^[a-z][a-z0-9+.-]*:/i.test(raw)) issues.push('ℹ️ ' + t((i + 1) + '번째 줄에 https:// 를 붙였습니다', 'Added https:// to line ' + (i + 1)));
      var existing = [];
      u.searchParams.forEach(function (val, key) { if (/^utm_/i.test(key)) existing.push(key); });
      var params = new URLSearchParams();
      u.searchParams.forEach(function (val, key) { if (/^utm_/i.test(key) && o.replace) return; params.append(key, val); });
      if (existing.length && !o.replace) issues.push('⚠️ ' + t((i + 1) + '번째 줄에 이미 ' + existing.join(', ') + ' 가 있습니다. 중복되어 보고서가 꼬일 수 있으니 "덮어쓰기"를 켜세요', 'Line ' + (i + 1) + ' already has ' + existing.join(', ') + '; duplicates confuse reports - turn on overwrite'));
      if (existing.length && o.replace) issues.push('ℹ️ ' + t((i + 1) + '번째 줄의 기존 ' + existing.join(', ') + ' 를 덮어썼습니다', 'Overwrote existing ' + existing.join(', ') + ' on line ' + (i + 1)));
      var parts = [];
      params.forEach(function (val, key) { parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(val)); });
      KEYS.forEach(function (k) { if (vals[k]) parts.push('utm_' + k + '=' + enc(vals[k])); });
      var out = u.origin + u.pathname + (parts.length ? '?' + parts.join('&') : '') + u.hash;
      outs.push(out);
      if (out.length > 2000) issues.push('⚠️ ' + t((i + 1) + '번째 URL 이 2,000자를 넘습니다. 일부 브라우저·서버가 잘라 낼 수 있습니다', 'URL ' + (i + 1) + ' is over 2,000 characters; some browsers and servers truncate it'));
      if (u.hash && /utm_/.test(u.hash) === false && parts.length) issues.push('ℹ️ ' + t((i + 1) + '번째 URL 의 #' + u.hash.slice(1) + ' 앞에 쿼리가 붙도록 정리했습니다 (# 뒤의 UTM 은 서버로 전달되지 않음)', 'The query of URL ' + (i + 1) + ' was placed before the #' + u.hash.slice(1) + ' fragment (UTM after # never reaches the server)'));
      if (i === 0) {
        KEYS.forEach(function (k) { if (vals[k]) rows.push(['utm_' + k, vals[k], enc(vals[k]) !== vals[k] ? enc(vals[k]) : '—']); });
        if (u.searchParams.has('ref') || [].concat(Array.from(u.searchParams.keys())).some(function (k) { return !/^utm_/i.test(k); })) rows.push([t('기존 매개변수 유지', 'Existing parameters kept'), Array.from(params.keys()).join(', ') || '—', '—']);
      }
    });
    issues.push('ℹ️ ' + t('사이트 내부 링크(같은 사이트의 다른 페이지로 가는 링크)에는 UTM 을 붙이지 마세요. 방문자의 원래 유입 출처가 덮어써집니다', 'Do not put UTM on internal links; it overwrites the visitor\'s original traffic source'));
    issues.push('ℹ️ ' + t('같은 캠페인은 같은 철자와 대소문자를 계속 써야 보고서가 합쳐집니다. 팀 공용 이름 규칙(예: 소스_매체_캠페인_연월)을 정해 두세요', 'Reuse the exact spelling and case for a campaign so reports merge; agree a naming convention (e.g. source_medium_campaign_yyyymm)'));
    var bad = issues.filter(function (x) { return x.indexOf('⛔') === 0; }).length;
    return { _status: bad ? { ok: false, msg: t('⛔ 문제 ' + bad + '건', '⛔ ' + bad + ' problem(s)') } : t('✅ URL ' + outs.length + '개에 UTM 을 붙였습니다', '✅ UTM added to ' + outs.length + ' URL(s)'), out: outs.join('\n'), table: { head: [['매개변수', 'Parameter'], ['값', 'Value'], ['인코딩', 'Encoded']], rows: rows }, issues: issues };
  }
});
