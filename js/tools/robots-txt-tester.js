TK.tool('robots-txt-tester', {
  sampleExpectError: true,
  sampleOptions: { ua: '*' },
  inputs: [
    { id: 'robots', label: ['robots.txt 내용', 'robots.txt content'], rows: 12, sample: 'User-agent: *\nDisallow: /admin/\nDisallow: /search\nDisallow: /*.pdf$\nAllow: /admin/public/\n\nUser-agent: Googlebot\nDisallow: /private/\nCrawl-delay: 5\n\nUser-agent: AhrefsBot\nUser-agent: SemrushBot\nDisallow: /\n\nSitemap: https://example.com/sitemap.xml' },
    { id: 'urls', label: ['검사할 URL 또는 경로 (한 줄에 하나)', 'URLs or paths to test (one per line)'], rows: 6, sample: '/\n/admin/\n/admin/public/page.html\n/search?q=seo\n/docs/guide.pdf\n/private/data\nhttps://example.com/blog/post-1' }
  ],
  options: [
    { id: 'ua', type: 'select', label: ['크롤러 (User-agent)', 'Crawler (User-agent)'], choices: [['Googlebot', 'Googlebot'], ['Googlebot-Image', 'Googlebot-Image'], ['Bingbot', 'Bingbot'], ['Yeti', ['Yeti (네이버)', 'Yeti (Naver)']], ['Daumoa', ['Daumoa (다음)', 'Daumoa (Daum)']], ['GPTBot', 'GPTBot (OpenAI)'], ['ClaudeBot', 'ClaudeBot (Anthropic)'], ['CCBot', 'CCBot (Common Crawl)'], ['AhrefsBot', 'AhrefsBot'], ['*', ['그 외 모든 봇 (*)', 'Any other bot (*)']]], default: 'Googlebot' },
    { id: 'custom', type: 'text', label: ['직접 입력한 User-agent (선택)', 'Custom User-agent (optional)'], default: '' }
  ],
  outputs: [{ id: 'table', label: ['URL 별 판정', 'Verdict per URL'], kind: 'table' }, { id: 'rules', label: ['적용되는 규칙', 'Applicable rules'], kind: 'table' }, { id: 'issues', label: ['점검 결과', 'Findings'], kind: 'list' }],
  run: function (v, o, t) {
    var txt = String(v.robots == null ? '' : v.robots); if (!txt.trim()) throw new Error(t('robots.txt 내용을 입력하세요', 'Enter the robots.txt content'));
    var issues = [], groups = [], cur = null, sitemaps = [], lastWasUA = false, lineNo = 0;
    if (txt.charCodeAt(0) === 0xFEFF) { txt = txt.slice(1); issues.push('ℹ️ ' + t('파일 맨 앞에 BOM 이 있습니다. 대부분의 크롤러가 무시하지만 제거하는 것이 안전합니다', 'The file starts with a BOM; most crawlers ignore it but removing it is safer')); }
    if (new TextEncoder().encode(txt).length > 500 * 1024) issues.push('⚠️ ' + t('robots.txt 가 500KiB 를 넘습니다. Google 은 초과분을 무시합니다', 'robots.txt is over 500 KiB; Google ignores the excess'));
    var KNOWN = { 'user-agent': 1, allow: 1, disallow: 1, sitemap: 1, 'crawl-delay': 1, host: 1, 'clean-param': 1, noindex: 1, 'request-rate': 1, 'visit-time': 1 };
    txt.split(/\r\n|\r|\n/).forEach(function (raw) {
      lineNo++;
      var line = raw.replace(/#.*$/, '').trim();
      if (!line) { return; }
      var m = /^([A-Za-z\-]+)\s*:\s*(.*)$/.exec(line);
      if (!m) { issues.push('⚠️ ' + t(lineNo + '번째 줄을 해석할 수 없습니다: ' + raw.slice(0, 40), 'Line ' + lineNo + ' cannot be parsed: ' + raw.slice(0, 40))); return; }
      var key = m[1].toLowerCase(), val = m[2].trim();
      if (!KNOWN[key]) { issues.push('⚠️ ' + t(lineNo + '번째 줄의 지시어 "' + m[1] + '" 은(는) 표준이 아니어서 무시될 수 있습니다', 'Line ' + lineNo + ': the directive "' + m[1] + '" is non-standard and may be ignored')); return; }
      if (key === 'user-agent') {
        if (!lastWasUA || !cur) { cur = { uas: [], rules: [], delay: null, line: lineNo }; groups.push(cur); }
        cur.uas.push(val.toLowerCase()); lastWasUA = true; return;
      }
      lastWasUA = false;
      if (key === 'sitemap') { sitemaps.push(val); if (!/^https?:\/\//i.test(val)) issues.push('⚠️ ' + t(lineNo + '번째 줄: Sitemap 은 절대 URL(https://…)이어야 합니다', 'Line ' + lineNo + ': Sitemap must be an absolute URL (https://...)')); return; }
      if (key === 'noindex') { issues.push('⛔ ' + t(lineNo + '번째 줄: robots.txt 의 Noindex 는 2019년부터 Google 이 지원하지 않습니다. 메타 robots 나 X-Robots-Tag 를 쓰세요', 'Line ' + lineNo + ': Noindex in robots.txt has not been supported by Google since 2019; use the robots meta tag or X-Robots-Tag')); return; }
      if (key === 'host' || key === 'clean-param') { issues.push('ℹ️ ' + t(lineNo + '번째 줄의 ' + m[1] + ' 은(는) Yandex 전용 지시어로 Google·Bing 은 무시합니다', 'Line ' + lineNo + ': ' + m[1] + ' is Yandex-only; Google and Bing ignore it')); return; }
      if (!cur) { issues.push('⚠️ ' + t(lineNo + '번째 줄: User-agent 보다 먼저 나온 규칙은 무시됩니다', 'Line ' + lineNo + ': a rule before any User-agent is ignored')); return; }
      if (key === 'crawl-delay') { cur.delay = val; return; }
      if (key === 'allow' || key === 'disallow') {
        if (val && val[0] !== '/' && val[0] !== '*') issues.push('⚠️ ' + t(lineNo + '번째 줄: 경로는 / 또는 * 로 시작해야 합니다 ("' + val + '")', 'Line ' + lineNo + ': a path must start with / or * ("' + val + '")'));
        cur.rules.push({ type: key, path: val, line: lineNo });
      }
    });
    if (!groups.length) issues.push('⛔ ' + t('User-agent 그룹이 하나도 없습니다. 이 파일은 아무 효과가 없습니다', 'There is no User-agent group, so this file has no effect'));
    function toRe(path) {
      var re = '', i;
      for (i = 0; i < path.length; i++) { var c = path[i]; if (c === '*') re += '.*'; else if (c === '$' && i === path.length - 1) re += '$'; else re += c.replace(/[.+?^${}()|[\]\\\/]/g, '\\$&'); }
      return new RegExp('^' + re);
    }
    var uaWanted = (String(o.custom || '').trim() || o.ua || 'Googlebot').toLowerCase();
    /* 가장 구체적인 그룹 선택: 제품 토큰이 UA 에 포함되는 것 중 가장 긴 것, 없으면 * */
    var best = null, bestLen = -1;
    groups.forEach(function (g) { g.uas.forEach(function (u) { if (u === '*') return; if (uaWanted === u || uaWanted.indexOf(u) === 0 || u.indexOf(uaWanted) === 0 && uaWanted !== '*') { if (u.length > bestLen) { best = g; bestLen = u.length; } } }); });
    var star = groups.filter(function (g) { return g.uas.indexOf('*') >= 0; });
    var applicable = [];
    if (best) applicable = best.rules; else star.forEach(function (g) { applicable = applicable.concat(g.rules); });
    var chosen = best ? t('"' + best.uas.join(', ') + '" 그룹', 'group "' + best.uas.join(', ') + '"') : (star.length ? t('"*" 그룹', 'group "*"') : t('(해당 그룹 없음 — 모두 허용)', '(no matching group - everything allowed)'));
    if (best && star.length) issues.push('ℹ️ ' + t('이 크롤러는 구체적인 그룹을 쓰므로 "*" 그룹의 규칙은 적용되지 않습니다 (그룹은 합쳐지지 않음)', 'This crawler uses its specific group, so the "*" group does not apply (groups are not merged)'));
    var rules = applicable.map(function (r) { return { type: r.type, path: r.path, line: r.line, re: r.path === '' ? null : toRe(r.path), len: r.path.replace(/\*/g, '').length }; });
    var rows = [];
    String(v.urls == null ? '' : v.urls).split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (u) {
      var path = u;
      try { if (/^https?:\/\//i.test(u)) { var uu = new URL(u); path = uu.pathname + uu.search; } else if (u[0] !== '/') path = '/' + u; } catch (e) { rows.push([u, '⛔ ' + t('URL 오류', 'bad URL'), '—', '—']); return; }
      try { path = decodeURI(path).replace(/%2F/gi, '/'); } catch (e) { }
      var matched = null;
      rules.forEach(function (r) { if (r.type === 'disallow' && r.path === '') return; if (r.re && r.re.test(path)) { if (!matched || r.len > matched.len || (r.len === matched.len && r.type === 'allow' && matched.type === 'disallow')) matched = r; } });
      var allowed = !matched || matched.type === 'allow';
      rows.push([u, allowed ? '✅ ' + t('허용', 'allowed') : '⛔ ' + t('차단', 'blocked'), matched ? (matched.type === 'allow' ? 'Allow: ' : 'Disallow: ') + matched.path + ' (' + t('줄 ', 'line ') + matched.line + ')' : t('일치하는 규칙 없음 → 허용', 'no matching rule → allowed'), String(matched ? matched.len : 0)]);
    });
    var ruleRows = applicable.map(function (r) { return [r.type === 'allow' ? 'Allow' : 'Disallow', r.path || t('(비어 있음 = 모두 허용)', '(empty = allow all)'), String(r.line)]; });
    /* 일반 점검 */
    groups.forEach(function (g) {
      if (g.uas.indexOf('*') >= 0 && g.rules.some(function (r) { return r.type === 'disallow' && r.path === '/'; }) && !g.rules.some(function (r) { return r.type === 'allow'; })) issues.push('⛔ ' + t('"User-agent: *" 에 "Disallow: /" 가 있어 모든 검색엔진 크롤링이 차단됩니다. 개발 환경이 아니라면 의도한 것인지 확인하세요', '"User-agent: *" has "Disallow: /", which blocks all search-engine crawling; make sure this is intended outside a staging site'));
      g.rules.forEach(function (r) { if (r.type === 'disallow' && /\.(css|js)(\$)?$|^\/(wp-includes|assets|static|_next|js|css)\//i.test(r.path) && g.uas.some(function (u) { return u === '*' || /googlebot/.test(u); })) issues.push('⚠️ ' + t(r.line + '번째 줄 "' + r.path + '": CSS·JS 를 막으면 Google 이 페이지를 제대로 렌더링하지 못해 순위에 불리할 수 있습니다', 'Line ' + r.line + ' "' + r.path + '": blocking CSS / JS stops Google rendering the page properly and can hurt rankings')); });
      if (g.delay && g.uas.some(function (u) { return /googlebot|\*/.test(u); })) issues.push('ℹ️ ' + t('Crawl-delay 는 Googlebot 이 무시합니다 (Bing·Yandex·Naver 는 지원). Google 은 Search Console 에서 크롤링 속도를 조절합니다', 'Googlebot ignores Crawl-delay (Bing, Yandex and Naver honour it); Google tunes crawl rate in Search Console'));
    });
    var seenUA = {}; groups.forEach(function (g) { g.uas.forEach(function (u) { if (seenUA[u]) issues.push('⚠️ ' + t('User-agent "' + u + '" 그룹이 두 번 정의되었습니다. 크롤러에 따라 첫 그룹만 쓰거나 합칠 수 있으니 하나로 합치세요', 'The User-agent "' + u + '" group is defined twice; crawlers may use only one or merge them, so combine them')); seenUA[u] = 1; }); });
    if (!sitemaps.length) issues.push('ℹ️ ' + t('Sitemap 줄이 없습니다. 크롤러가 사이트맵을 찾을 수 있도록 Sitemap: https://… 를 추가하는 것을 권장합니다', 'No Sitemap line; adding Sitemap: https://... helps crawlers find your sitemap'));
    else issues.push('ℹ️ ' + t('Sitemap ' + sitemaps.length + '개: ' + sitemaps.join(', '), sitemaps.length + ' sitemap(s): ' + sitemaps.join(', ')));
    issues.push('ℹ️ ' + t('판정 규칙(RFC 9309): 일치하는 규칙 중 경로가 가장 긴 것이 우선하고, 같은 길이면 Allow 가 이깁니다. * 는 임의 문자열, 끝의 $ 는 URL 끝을 뜻합니다. robots.txt 로 막아도 외부 링크가 있으면 검색 결과에 URL 만 노출될 수 있습니다', 'Verdict rules (RFC 9309): the longest matching path wins and Allow beats Disallow on a tie. * matches any string and a trailing $ anchors the end. A URL blocked by robots.txt can still appear in results (URL only) if other sites link to it'));
    var blocked = rows.filter(function (r) { return r[1].indexOf('⛔') === 0; }).length;
    var errs = issues.filter(function (x) { return x.indexOf('⛔') === 0; }).length;
    return { _status: errs ? { ok: false, msg: t('⛔ 문제 ' + errs + '건 · ' + (rows.length ? rows.length + '개 중 ' + blocked + '개 차단' : 'URL 없음'), '⛔ ' + errs + ' problem(s) · ' + (rows.length ? blocked + ' of ' + rows.length + ' blocked' : 'no URLs')) } : t('✅ ' + (rows.length ? rows.length + '개 중 ' + blocked + '개 차단' : '규칙 해석 완료') + ' — ' + chosen, '✅ ' + (rows.length ? blocked + ' of ' + rows.length + ' blocked' : 'Rules parsed') + ' - ' + chosen), table: { head: [['URL', 'URL'], ['판정', 'Verdict'], ['결정한 규칙', 'Deciding rule'], ['규칙 길이', 'Rule length']], rows: rows, empty: ['검사할 URL 을 입력하세요', 'Enter URLs to test'] }, rules: { head: [['종류', 'Type'], ['경로', 'Path'], ['줄', 'Line']], rows: ruleRows, empty: ['적용되는 규칙이 없습니다', 'No applicable rules'] }, issues: issues };
  }
});
