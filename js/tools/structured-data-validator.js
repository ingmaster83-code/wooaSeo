TK.tool('structured-data-validator', {
  sampleExpectError: true,
  inputs: [{ id: 'in', label: ['JSON-LD 또는 구조화 데이터가 들어 있는 HTML', 'JSON-LD or HTML containing structured data'], rows: 16, sample: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@graph": [\n    {"@type": "Organization", "@id": "https://example.com/#org", "name": "Example Inc.", "url": "https://example.com/", "logo": "https://example.com/logo.png"},\n    {"@type": "Product", "name": "Wireless Mouse", "image": ["https://example.com/mouse.jpg"], "description": "Quiet wireless mouse.",\n     "offers": {"@type": "Offer", "price": "29.90", "priceCurrency": "USD", "availability": "https://schema.org/InStock", "url": "https://example.com/mouse"},\n     "aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.6", "reviewCount": "128"}},\n    {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "Is it Bluetooth?", "acceptedAnswer": {"@type": "Answer"}}]},\n    {"@type": "BlogPosting", "headline": "Launch", "datePublished": "2026-13-45", "author": "Kim"}\n  ]\n}\n</script>' }],
  options: [{ id: 'strict', type: 'checkbox', label: ['권장(recommended) 속성 누락도 경고로 표시', 'Also warn about missing recommended properties'], default: true }],
  outputs: [{ id: 'table', label: ['엔티티', 'Entities'], kind: 'table' }, { id: 'issues', label: ['점검 결과', 'Findings'], kind: 'list' }, { id: 'out', label: ['정리된 JSON-LD', 'Formatted JSON-LD'], kind: 'code', ext: 'json' }],
  run: function (v, o, t) {
    var src = String(v['in'] == null ? '' : v['in']); if (!src.trim()) throw new Error(t('JSON-LD 를 입력하세요', 'Enter JSON-LD'));
    var blocks = [], issues = [], rows = [];
    function add(sev, msg) { issues.push({ sev: sev, msg: msg }); }
    var re = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, m;
    if (/^\s*</.test(src)) { while ((m = re.exec(src))) blocks.push(m[1]); if (!blocks.length) add('error', t('<script type="application/ld+json"> 블록을 찾지 못했습니다', 'No <script type="application/ld+json"> block found')); }
    else blocks.push(src);
    if (/itemscope|itemtype=/i.test(src) && !blocks.length) add('info', t('Microdata/RDFa 는 지원하지 않습니다. JSON-LD 로 바꾸는 것을 권장합니다 (Google 권장 형식)', 'Microdata / RDFa are not supported; JSON-LD is the format Google recommends'));
    var docs = [];
    blocks.forEach(function (b, bi) {
      var txt = b.trim(); if (!txt) return;
      try { docs.push({ data: JSON.parse(txt), idx: bi + 1 }); } catch (e) {
        var pos = /position (\d+)/.exec(e.message), ctx = '';
        if (pos) { var p = +pos[1]; ctx = ' … ' + txt.slice(Math.max(0, p - 20), p + 20).replace(/\s+/g, ' ') + ' …'; }
        add('error', t('블록 ' + (bi + 1) + ' JSON 구문 오류: ' + e.message + ctx + (/,\s*[}\]]/.test(txt) ? ' (마지막 쉼표 확인)' : ''), 'Block ' + (bi + 1) + ' JSON syntax error: ' + e.message + ctx + (/,\s*[}\]]/.test(txt) ? ' (check trailing commas)' : '')));
      }
    });
    /* 타입별 요구 속성: [필수 req, 권장 rec] (Google 리치 결과 기준의 요약) */
    var SPEC = {
      Article: [['headline', 'image', 'datePublished', 'author'], ['dateModified', 'publisher', 'description']], NewsArticle: 'Article', BlogPosting: 'Article',
      Product: [['name', 'image', 'offers|review|aggregateRating'], ['description', 'sku', 'brand', 'aggregateRating']],
      Offer: [['price', 'priceCurrency'], ['availability', 'url', 'priceValidUntil']],
      AggregateRating: [['ratingValue', 'reviewCount|ratingCount'], ['bestRating', 'worstRating']],
      Review: [['author', 'reviewRating'], ['datePublished', 'itemReviewed']], Rating: [['ratingValue'], ['bestRating', 'worstRating']],
      FAQPage: [['mainEntity'], []], Question: [['name', 'acceptedAnswer'], []], Answer: [['text'], []],
      BreadcrumbList: [['itemListElement'], []], ListItem: [['position', 'name'], ['item']],
      Organization: [['name'], ['url', 'logo', 'sameAs', 'contactPoint']], LocalBusiness: [['name', 'address'], ['telephone', 'openingHoursSpecification', 'geo', 'url', 'image', 'priceRange']], Restaurant: 'LocalBusiness', Store: 'LocalBusiness',
      Brand: [['name'], ['url', 'logo']], Person: [['name'], ['url', 'sameAs', 'image']], PostalAddress: [['streetAddress|addressLocality'], ['addressRegion', 'postalCode', 'addressCountry']],
      WebSite: [['name|url'], ['potentialAction', 'url']], SearchAction: [['target', 'query-input'], []],
      Event: [['name', 'startDate', 'location'], ['description', 'endDate', 'image', 'offers', 'eventStatus', 'organizer']], Place: [['name|address'], []],
      Recipe: [['name', 'image'], ['author', 'datePublished', 'description', 'recipeIngredient', 'recipeInstructions', 'recipeYield', 'prepTime', 'cookTime', 'nutrition', 'aggregateRating', 'video']],
      VideoObject: [['name', 'thumbnailUrl', 'uploadDate'], ['description', 'contentUrl|embedUrl', 'duration']],
      HowTo: [['name', 'step'], ['image', 'totalTime', 'estimatedCost', 'supply', 'tool']], HowToStep: [['text|name'], ['image', 'url']],
      JobPosting: [['title', 'description', 'datePosted', 'hiringOrganization', 'jobLocation|applicantLocationRequirements'], ['validThrough', 'employmentType', 'baseSalary', 'identifier']],
      Course: [['name', 'description', 'provider'], ['offers', 'hasCourseInstance']], SoftwareApplication: [['name', 'offers|aggregateRating'], ['operatingSystem', 'applicationCategory']], MobileApplication: 'SoftwareApplication', WebApplication: 'SoftwareApplication',
      Book: [['name', 'author'], ['isbn', 'workExample', 'url']], Movie: [['name', 'image'], ['dateCreated', 'director', 'aggregateRating']], ImageObject: [['contentUrl|url'], ['creator', 'license', 'acquireLicensePage', 'creditText', 'copyrightNotice']],
      ItemList: [['itemListElement'], []], CollectionPage: [['name'], []], WebPage: [['name|headline'], ['description']], QAPage: [['mainEntity'], []], ProfilePage: [['mainEntity'], []],
      MonetaryAmount: [['currency', 'value'], []], QuantitativeValue: [['value'], ['unitText']], GeoCoordinates: [['latitude', 'longitude'], []], ContactPoint: [['telephone|email', 'contactType'], []]
    };
    var DATE_PROPS = /^(datePublished|dateModified|dateCreated|uploadDate|startDate|endDate|datePosted|validThrough|priceValidUntil|birthDate|foundingDate)$/;
    var URL_PROPS = /^(url|image|logo|thumbnailUrl|contentUrl|embedUrl|sameAs|item|target|acquireLicensePage|license)$/;
    var ENUMS = { availability: ['InStock', 'OutOfStock', 'PreOrder', 'BackOrder', 'Discontinued', 'LimitedAvailability', 'OnlineOnly', 'InStoreOnly', 'SoldOut', 'PreSale'], itemCondition: ['NewCondition', 'UsedCondition', 'RefurbishedCondition', 'DamagedCondition'], eventStatus: ['EventScheduled', 'EventCancelled', 'EventMovedOnline', 'EventPostponed', 'EventRescheduled'] };
    function types(n) { var ty = n['@type']; return ty === undefined ? [] : [].concat(ty).map(String); }
    function resolve(ty) { var s = SPEC[ty]; return typeof s === 'string' ? SPEC[s] : s; }
    function has(n, prop) { return prop.split('|').some(function (p) { var v2 = n[p]; return v2 !== undefined && v2 !== null && v2 !== '' && !(Array.isArray(v2) && !v2.length); }); }
    function isoDate(s) { var m2 = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/.exec(s); if (!m2) return false; var y = +m2[1], mo = +m2[2], d = +m2[3]; if (mo < 1 || mo > 12 || d < 1) return false; var dim = new Date(Date.UTC(y, mo, 0)).getUTCDate(); if (d > dim) return false; if (m2[4] !== undefined && (+m2[4] > 23 || +m2[5] > 59 || (m2[6] !== undefined && +m2[6] > 59))) return false; return true; }
    var seenIds = {}, refs = [], count = 0;
    function visit(n, path, depth, inheritedCtx) {
      if (Array.isArray(n)) { n.forEach(function (x, i) { visit(x, path + '[' + i + ']', depth, inheritedCtx); }); return; }
      if (n === null || typeof n !== 'object') return;
      var tys = types(n);
      if (!tys.length) {
        if (n['@id'] && Object.keys(n).length === 1) { refs.push({ id: n['@id'], path: path }); return; }
        if (n['@graph']) { visit(n['@graph'], path + '.@graph', depth, inheritedCtx); return; }
        if (depth > 0 && Object.keys(n).length) add('warn', t(path + ': @type 이 없는 객체입니다', path + ': object without @type'));
        Object.keys(n).forEach(function (k) { if (k.charAt(0) !== '@' && typeof n[k] === 'object') visit(n[k], path + '.' + k, depth + 1, inheritedCtx); });
        return;
      }
      count++;
      if (n['@id']) { if (seenIds[n['@id']]) add('warn', t(path + ': @id "' + n['@id'] + '" 이(가) 중복됩니다', path + ': duplicate @id "' + n['@id'] + '"')); seenIds[n['@id']] = true; }
      var ty = tys[0], spec = null; tys.forEach(function (x) { if (!spec) spec = resolve(x); });
      var req = [], rec = [];
      if (spec) { spec[0].forEach(function (p) { if (!has(n, p)) req.push(p); }); spec[1].forEach(function (p) { if (!has(n, p)) rec.push(p); }); }
      else add('info', t(path + ': 타입 "' + tys.join(', ') + '" 은(는) 이 검사기의 규칙에 없습니다 (구문만 확인)', path + ': type "' + tys.join(', ') + '" has no rules in this checker (syntax only)'));
      /* 값 형식 */
      Object.keys(n).forEach(function (k) {
        var val = n[k];
        if (k.charAt(0) === '@') return;
        if (DATE_PROPS.test(k) && typeof val === 'string' && !isoDate(val)) add('error', t(path + '.' + k + ': "' + val + '" 은(는) 올바른 ISO 8601 날짜가 아닙니다 (예: 2026-10-17 또는 2026-10-17T09:00:00+09:00)', path + '.' + k + ': "' + val + '" is not a valid ISO 8601 date (e.g. 2026-10-17 or 2026-10-17T09:00:00+09:00)'));
        if (URL_PROPS.test(k)) [].concat(val).forEach(function (u) { if (typeof u === 'string' && !/^https?:\/\//i.test(u) && !(k === 'target' && /\{search_term_string\}/.test(u))) add('warn', t(path + '.' + k + ': 절대 URL(https://…)이 필요합니다 → "' + u.slice(0, 40) + '"', path + '.' + k + ': an absolute URL (https://...) is required → "' + u.slice(0, 40) + '"')); });
        if ((k === 'price' || k === 'ratingValue' || k === 'reviewCount' || k === 'ratingCount' || k === 'latitude' || k === 'longitude') && typeof val === 'string' && (val.trim() === '' || isNaN(Number(val.replace(/,/g, ''))) || /,/.test(val))) add('error', t(path + '.' + k + ': 숫자여야 합니다 ("' + val + '"). 천 단위 쉼표나 통화 기호를 넣지 마세요', path + '.' + k + ': must be a number ("' + val + '"); no thousands separators or currency symbols'));
        if (k === 'priceCurrency' && typeof val === 'string' && !/^[A-Z]{3}$/.test(val)) add('error', t(path + '.priceCurrency: ISO 4217 3글자 대문자 코드여야 합니다 ("' + val + '")', path + '.priceCurrency: must be a 3-letter upper-case ISO 4217 code ("' + val + '")'));
        if (ENUMS[k] && typeof val === 'string') { var nm = val.replace(/^https?:\/\/schema\.org\//, ''); if (ENUMS[k].indexOf(nm) < 0) add('warn', t(path + '.' + k + ': "' + val + '" 은(는) schema.org 의 표준 값이 아닙니다 (' + ENUMS[k].slice(0, 4).join(', ') + ' …)', path + '.' + k + ': "' + val + '" is not a standard schema.org value (' + ENUMS[k].slice(0, 4).join(', ') + ' ...)')); else if (!/^https:\/\/schema\.org\//.test(val)) add('info', t(path + '.' + k + ': 전체 URL(https://schema.org/' + nm + ')로 쓰는 것이 안전합니다', path + '.' + k + ': prefer the full URL https://schema.org/' + nm)); }
        if (k === 'ratingValue' && n.bestRating === undefined && Number(val) > 5) add('warn', t(path + '.ratingValue: 5 를 넘는데 bestRating 이 없습니다', path + '.ratingValue exceeds 5 but bestRating is missing'));
        if (k === 'position' && typeof val === 'string') add('warn', t(path + '.position: 문자열 대신 숫자를 쓰세요', path + '.position: use a number, not a string'));
        if (typeof val === 'object' && val !== null) visit(val, path + '.' + k, depth + 1, inheritedCtx);
      });
      if (tys.indexOf('Product') >= 0 && n.offers && !(Array.isArray(n.offers) ? n.offers : [n.offers]).every(function (of) { return of && (of.price !== undefined || of.priceSpecification || of.lowPrice !== undefined); }) ) add('error', t(path + '.offers: price 가 없습니다 (Product 리치 결과 필수)', path + '.offers: price is missing (required for Product rich results)'));
      if (tys.indexOf('FAQPage') >= 0) { [].concat(n.mainEntity || []).forEach(function (q, i) { if (q && !q.acceptedAnswer) add('error', t(path + '.mainEntity[' + i + ']: acceptedAnswer 가 없습니다', path + '.mainEntity[' + i + ']: acceptedAnswer is missing')); else if (q && q.acceptedAnswer && !q.acceptedAnswer.text) add('error', t(path + '.mainEntity[' + i + '].acceptedAnswer.text 가 비어 있습니다', path + '.mainEntity[' + i + '].acceptedAnswer.text is empty')); }); }
      if (tys.indexOf('BreadcrumbList') >= 0) { var pos = [].concat(n.itemListElement || []).map(function (e) { return Number(e && e.position); }); pos.forEach(function (p, i) { if (p !== i + 1) { add('warn', t(path + '.itemListElement: position 이 1부터 연속되지 않습니다', path + '.itemListElement: position values are not consecutive from 1')); pos.length = 0; } }); }
      if (tys.some(function (x) { return /^(Article|NewsArticle|BlogPosting)$/.test(x); }) && typeof n.author === 'string') add('warn', t(path + '.author: 문자열보다 {"@type":"Person","name":"…"} 객체가 권장됩니다', path + '.author: a {"@type":"Person","name":"..."} object is recommended over a string'));
      if (tys.some(function (x) { return /^(Article|NewsArticle|BlogPosting)$/.test(x); }) && typeof n.headline === 'string' && n.headline.length > 110) add('warn', t(path + '.headline: 110자를 넘으면 검색 결과에서 잘릴 수 있습니다', path + '.headline: over 110 characters may be truncated'));
      req.forEach(function (p) { add('error', t(path + ' (' + ty + '): 필수 속성 ' + p + ' 이(가) 없습니다', path + ' (' + ty + '): required property ' + p + ' is missing')); });
      if (o.strict) rec.forEach(function (p) { add('warn', t(path + ' (' + ty + '): 권장 속성 ' + p + ' 이(가) 없습니다', path + ' (' + ty + '): recommended property ' + p + ' is missing')); });
      rows.push([tys.join(', '), path, n.name || n.headline || n.title || n['@id'] || '—', spec ? (req.length ? '⛔ ' + t('필수 누락 ', 'missing ') + req.length : (rec.length && o.strict ? '⚠️ ' + t('권장 누락 ', 'rec. missing ') + rec.length : '✅')) : 'ℹ️']);
    }
    docs.forEach(function (d) {
      var ctx = d.data['@context'] || (Array.isArray(d.data) && d.data[0] && d.data[0]['@context']);
      if (!ctx) add('error', t('블록 ' + d.idx + ': @context 가 없습니다 ("https://schema.org" 필요)', 'Block ' + d.idx + ': @context is missing ("https://schema.org" is required)'));
      else if (!/schema\.org/i.test(JSON.stringify(ctx))) add('warn', t('블록 ' + d.idx + ': @context 가 schema.org 가 아닙니다 (' + JSON.stringify(ctx).slice(0, 50) + ')', 'Block ' + d.idx + ': @context is not schema.org (' + JSON.stringify(ctx).slice(0, 50) + ')'));
      else if (/^http:\/\/schema\.org/i.test(typeof ctx === 'string' ? ctx : '')) add('info', t('블록 ' + d.idx + ': @context 는 https://schema.org 를 권장합니다 (http 도 동작)', 'Block ' + d.idx + ': https://schema.org is preferred for @context (http also works)'));
      visit(d.data, '$' + (docs.length > 1 ? '#' + d.idx : ''), 0, ctx);
    });
    refs.forEach(function (r) { if (!seenIds[r.id]) add('info', t(r.path + ': @id 참조 "' + r.id + '" 의 정의가 이 입력에 없습니다 (다른 페이지에 있을 수 있음)', r.path + ': @id reference "' + r.id + '" is not defined in this input (it may live on another page)')); });
    if (docs.length && !count) add('warn', t('@type 이 있는 엔티티를 찾지 못했습니다', 'No entity with @type was found'));
    if (rows.some(function (r) { return /Product/.test(r[0]); }) && !rows.some(function (r) { return /Offer/.test(r[0]); })) add('warn', t('Product 에 Offer 가 없으면 가격 리치 결과가 표시되지 않습니다', 'A Product without an Offer will not show price rich results'));
    if (rows.some(function (r) { return /FAQPage/.test(r[0]); })) add('info', t('FAQ 리치 결과는 2023년 이후 정부·보건 사이트 등 일부에만 표시됩니다. 마크업은 유효해도 노출은 보장되지 않습니다', 'Since 2023 FAQ rich results are shown only for a limited set of sites (e.g. authoritative government and health sites); valid markup does not guarantee display'));
    add('info', t('Google 리치 결과 테스트와 Schema.org 검증기를 대체하지 않습니다. 필수·권장 속성은 자주 쓰는 타입 위주의 요약이므로 배포 전에 공식 도구로 한 번 더 확인하세요', 'This does not replace Google\'s Rich Results Test or the Schema.org validator; the required / recommended lists summarise common types, so verify with the official tools before release'));
    var order = { error: 0, warn: 1, info: 2 }, ICON = { error: '⛔', warn: '⚠️', info: 'ℹ️' };
    var seen = {}, list = issues.filter(function (x) { var k = x.sev + x.msg; if (seen[k]) return false; seen[k] = 1; return true; }).sort(function (a, b) { return order[a.sev] - order[b.sev]; });
    var errs = list.filter(function (x) { return x.sev === 'error'; }).length, warns = list.filter(function (x) { return x.sev === 'warn'; }).length;
    var pretty = docs.map(function (d) { return JSON.stringify(d.data, null, 2); }).join('\n\n');
    return { _status: errs ? { ok: false, msg: t('⛔ 오류 ' + errs + '건 · 경고 ' + warns + '건 — 엔티티 ' + count + '개', '⛔ ' + errs + ' error(s), ' + warns + ' warning(s) - ' + count + ' entity(ies)') } : t('✅ 오류 없음' + (warns ? ' · 경고 ' + warns + '건' : '') + ' — 엔티티 ' + count + '개', '✅ No errors' + (warns ? ' · ' + warns + ' warning(s)' : '') + ' - ' + count + ' entity(ies)'), table: { head: [['@type', '@type'], ['경로', 'Path'], ['이름', 'Name'], ['상태', 'Status']], rows: rows, empty: ['엔티티가 없습니다', 'No entities'] }, issues: list.map(function (x) { return ICON[x.sev] + ' ' + x.msg; }), out: pretty };
  }
});
