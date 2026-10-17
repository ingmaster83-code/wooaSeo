/* WooaDev Tool Kit — 공용 도구 UI 런타임
 * 각 도구는 js/tools/{slug}.js 에서 TK.tool(slug, def) 로 입력·옵션·출력 정의와 run() 로직만 선언한다.
 * node 테스트 환경(document 없음)에서는 등록만 하고 UI는 그리지 않는다.
 */
(function (g) {
  'use strict';
  var TK = g.TK = g.TK || {};
  TK.tools = TK.tools || {};
  var hasDOM = typeof document !== 'undefined' && !!document.getElementById;
  TK.LANG = (hasDOM && /^en/i.test(document.documentElement.lang || '')) ? 1 : 0;
  TK.T = function (v) { return Array.isArray(v) ? v[TK.LANG] : v; };
  TK.t = function (ko, en) { return TK.LANG ? en : ko; };
  TK.esc = function (s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var esc = TK.esc, T = TK.T;
  var MAX_RENDER = 300000;

  TK.tool = function (slug, def) {
    def.slug = slug;
    TK.tools[slug] = def;
    if (hasDOM) {
      var go = function () { var r = document.getElementById('tk-root'); if (r && !r.getAttribute('data-ready')) mount(r, def); };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
    }
  };

  function copyText(text, btn) {
    var done = function () {
      if (!btn) return;
      var old = btn.getAttribute('data-label') || btn.textContent;
      btn.setAttribute('data-label', old);
      btn.textContent = TK.t('복사됨 ✓', 'Copied ✓');
      setTimeout(function () { btn.textContent = old; }, 1200);
    };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* 무시 */ }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  }

  function download(name, text, mime) {
    var blob = new Blob([text], { type: (mime || 'text/plain') + ';charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 0);
  }

  function renderTable(head, rows) {
    var h = '<div class="tk-table-wrap"><table class="tk-table">';
    if (head && head.length) h += '<thead><tr>' + head.map(function (c) { return '<th>' + esc(T(c)) + '</th>'; }).join('') + '</tr></thead>';
    h += '<tbody>' + rows.map(function (r) {
      return '<tr' + (r.cls ? ' class="' + r.cls + '"' : '') + '>' + (r.cells || r).map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody></table></div>';
    return h;
  }

  function mount(root, def) {
    root.setAttribute('data-ready', '1');
    var slug = def.slug, inputs = def.inputs || [], options = def.options || [], outputs = def.outputs || [];
    var files = {};
    var h = '';

    // ── 입력 영역
    var textIn = inputs.filter(function (i) { return i.type !== 'file'; });
    h += '<div class="dev-panel tk-panel">';
    h += '<div class="tk-inputs' + (inputs.length === 2 ? ' tk-two' : '') + '">';
    inputs.forEach(function (i) {
      h += '<div class="tk-field" data-in="' + i.id + '"><div class="tk-label-row"><label class="dev-label" for="tk-in-' + i.id + '">' + esc(T(i.label)) + '</label>';
      if (i.type !== 'file') h += '<span class="tk-count" id="tk-cnt-' + i.id + '"></span>';
      h += '</div>';
      if (i.type === 'file') {
        h += '<input type="file" class="tk-file" id="tk-in-' + i.id + '"' + (i.accept ? ' accept="' + i.accept + '"' : '') + '><div class="tk-fileinfo" id="tk-fi-' + i.id + '"></div>';
      } else if (i.type === 'text') {
        h += '<input type="text" class="dev-input" id="tk-in-' + i.id + '" placeholder="' + esc(T(i.placeholder || '')) + '" spellcheck="false" autocomplete="off">';
      } else {
        h += '<textarea class="dev-textarea tk-ta" id="tk-in-' + i.id + '" rows="' + (i.rows || 9) + '" placeholder="' + esc(T(i.placeholder || '')) + '" spellcheck="false" autocomplete="off" autocapitalize="off" wrap="off"></textarea>';
      }
      h += '</div>';
    });
    h += '</div>';

    // ── 옵션
    if (options.length) {
      h += '<div class="tk-opts">';
      options.forEach(function (o) {
        h += '<div class="tk-opt" data-op="' + o.id + '">';
        if (o.type === 'checkbox') {
          h += '<label class="dev-checkbox-row"><input type="checkbox" id="tk-op-' + o.id + '"> <span>' + esc(T(o.label)) + '</span></label>';
        } else {
          h += '<label class="tk-oplabel" for="tk-op-' + o.id + '">' + esc(T(o.label)) + '</label>';
          if (o.type === 'select') {
            h += '<select class="dev-select" id="tk-op-' + o.id + '">' + o.choices.map(function (c) {
              return '<option value="' + esc(c[0]) + '">' + esc(T(c[1])) + '</option>';
            }).join('') + '</select>';
          } else if (o.type === 'number') {
            h += '<input type="number" class="dev-input tk-num" id="tk-op-' + o.id + '"' + (o.min != null ? ' min="' + o.min + '"' : '') + (o.max != null ? ' max="' + o.max + '"' : '') + (o.step != null ? ' step="' + o.step + '"' : '') + '>';
          } else {
            h += '<input type="text" class="dev-input tk-optext" id="tk-op-' + o.id + '" spellcheck="false" autocomplete="off">';
          }
        }
        h += '</div>';
      });
      h += '</div>';
    }

    // ── 버튼
    h += '<div class="dev-btn-row tk-btns">';
    if (def.auto === false) h += '<button type="button" class="dev-btn" id="tk-run">' + esc(T(def.runLabel || ['실행', 'Run'])) + '</button>';
    textIn.some(function (i) { return i.sample != null; }) && (h += '<button type="button" class="dev-btn secondary" id="tk-sample">' + TK.t('예시 불러오기', 'Load sample') + '</button>');
    if (def.swap) h += '<button type="button" class="dev-btn secondary" id="tk-swap">' + esc(T(def.swap.label || ['결과를 입력으로', 'Use result as input'])) + '</button>';
    h += '<button type="button" class="dev-btn secondary" id="tk-clear">' + TK.t('지우기', 'Clear') + '</button>';
    h += '</div></div>';

    // ── 상태 / 오류
    h += '<div id="tk-status" class="alert" style="display:none"></div>';

    // ── 출력
    h += '<div id="tk-outs">';
    outputs.forEach(function (o) {
      h += '<div class="dev-panel tk-outbox" id="tk-ob-' + o.id + '" style="display:none"><div class="tk-label-row"><div class="dev-label" style="margin:0">' + esc(T(o.label)) + '</div><div class="tk-out-btns">';
      if (o.kind === 'text' || o.kind === 'code' || o.copy) h += '<button type="button" class="dev-btn secondary tk-mini" data-copy="' + o.id + '">' + TK.t('복사', 'Copy') + '</button>';
      if ((o.kind === 'text' || o.kind === 'code') && o.download !== false) h += '<button type="button" class="dev-btn secondary tk-mini" data-dl="' + o.id + '">' + TK.t('다운로드', 'Download') + '</button>';
      h += '</div></div><div class="tk-outbody" id="tk-out-' + o.id + '"></div></div>';
    });
    h += '</div>';
    root.innerHTML = h;

    var $ = function (id) { return document.getElementById(id); };
    var texts = {};      // 출력 id → 복사/다운로드용 원문

    // ── 기본값
    function setDefaults() {
      options.forEach(function (o) {
        var el = $('tk-op-' + o.id);
        if (o.type === 'checkbox') el.checked = !!o.default; else el.value = o.default != null ? o.default : '';
      });
    }
    setDefaults();

    function readValues() {
      var v = {}, o = {};
      inputs.forEach(function (i) { v[i.id] = i.type === 'file' ? (files[i.id] || null) : $('tk-in-' + i.id).value; });
      options.forEach(function (op) {
        var el = $('tk-op-' + op.id);
        if (op.type === 'checkbox') o[op.id] = el.checked;
        else if (op.type === 'number') o[op.id] = el.value === '' ? (op.default != null ? op.default : 0) : Number(el.value);
        else if (op.type === 'select' && op.num) o[op.id] = Number(el.value);
        else o[op.id] = el.value;
      });
      return { v: v, o: o };
    }

    function refreshVisibility() {
      var cur = readValues();
      inputs.forEach(function (i) { if (i.show) document.querySelector('[data-in="' + i.id + '"]').style.display = i.show(cur.o) ? '' : 'none'; });
      options.forEach(function (op) { if (op.show) document.querySelector('[data-op="' + op.id + '"]').style.display = op.show(cur.o) ? '' : 'none'; });
      return cur;
    }

    function updateCounts() {
      textIn.forEach(function (i) {
        var c = $('tk-cnt-' + i.id); if (!c) return;
        var val = $('tk-in-' + i.id).value;
        c.textContent = val ? val.length.toLocaleString() + TK.t('자', ' chars') + (i.type !== 'text' ? ' · ' + (val.split('\n').length).toLocaleString() + TK.t('줄', ' lines') : '') : '';
      });
    }

    var statusEl = $('tk-status');
    function showStatus(kind, msg) {
      statusEl.className = 'alert alert-' + kind;
      statusEl.textContent = msg;
      statusEl.style.display = msg ? 'block' : 'none';
    }
    function hideOutputs() { outputs.forEach(function (o) { $('tk-ob-' + o.id).style.display = 'none'; }); }

    function renderOutput(o, val) {
      var box = $('tk-ob-' + o.id), body = $('tk-out-' + o.id);
      if (val == null || val === '' || (Array.isArray(val) && !val.length && o.kind !== 'table')) { box.style.display = 'none'; return; }
      box.style.display = '';
      var k = o.kind || 'text';
      if (k === 'text' || k === 'code') {
        var s = String(val); texts[o.id] = s;
        var shown = s.length > MAX_RENDER ? s.slice(0, MAX_RENDER) + '\n… (' + TK.t('표시 생략 — 복사·다운로드는 전체 포함', 'display truncated — copy/download includes everything') + ')' : s;
        body.innerHTML = '<pre class="tk-out"><code>' + esc(shown) + '</code></pre><div class="tk-meta">' + s.length.toLocaleString() + TK.t('자', ' chars') + ' · ' + s.split('\n').length.toLocaleString() + TK.t('줄', ' lines') + '</div>';
      } else if (k === 'table') {
        var rows = val.rows || [];
        texts[o.id] = [(val.head || []).map(T).join('\t')].concat(rows.map(function (r) { return (r.cells || r).join('\t'); })).join('\n');
        body.innerHTML = rows.length ? renderTable(val.head, rows.slice(0, 5000)) + (rows.length > 5000 ? '<div class="tk-meta">' + TK.t('처음 5,000행만 표시', 'Showing first 5,000 rows') + '</div>' : '') : '<div class="tk-empty">' + esc(T(val.empty || ['결과가 없습니다', 'No results'])) + '</div>';
        box.style.display = '';
      } else if (k === 'kv') {
        texts[o.id] = val.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n');
        body.innerHTML = renderTable(null, val.map(function (r) { return [T(r[0]), r[1]]; }));
      } else if (k === 'diff') {
        texts[o.id] = val.map(function (r) { return (r[0] === ' ' ? '  ' : r[0] + ' ') + r[1]; }).join('\n');
        body.innerHTML = '<pre class="tk-out tk-diff">' + val.slice(0, 8000).map(function (r) {
          return '<span class="' + (r[0] === '+' ? 'add' : r[0] === '-' ? 'del' : 'ctx') + '">' + esc((r[0] === ' ' ? '  ' : r[0] + ' ') + r[1]) + '</span>';
        }).join('\n') + '</pre>';
      } else if (k === 'list') {
        texts[o.id] = val.join('\n');
        body.innerHTML = '<ul class="tk-list">' + val.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
      } else if (k === 'html') {
        texts[o.id] = ''; body.innerHTML = val;
      }
    }

    function render(r) {
      r = r || {};
      var st = r._status;
      if (typeof st === 'string') showStatus('success', st);
      else if (st && st.msg) showStatus(st.ok === false ? 'error' : st.ok === 'info' ? 'info' : 'success', st.msg);
      else showStatus('', '');
      outputs.forEach(function (o) { renderOutput(o, r[o.id]); });
    }

    var timer = null, seq = 0, firstRun = true;
    function run() {
      var cur = refreshVisibility();
      updateCounts();
      var empty = !def.allowEmpty && textIn.every(function (i) { return !cur.v[i.id]; }) && inputs.every(function (i) { return i.type !== 'file' || !cur.v[i.id]; });
      if (empty) { showStatus('', ''); hideOutputs(); return; }
      var my = ++seq, res;
      try { res = def.run(cur.v, cur.o, TK.t); } catch (e) { return fail(e); }
      Promise.resolve(res).then(function (r) { if (my === seq) render(r); }, function (e) { if (my === seq) fail(e); });
    }
    function fail(e) {
      hideOutputs();
      showStatus('error', '❌ ' + (e && e.message ? e.message : String(e)));
    }
    function schedule() { if (def.auto === false) return; clearTimeout(timer); timer = setTimeout(run, def.delay || 220); }

    inputs.forEach(function (i) {
      var el = $('tk-in-' + i.id);
      if (i.type === 'file') {
        el.addEventListener('change', function () {
          var f = el.files && el.files[0];
          if (!f) { files[i.id] = null; $('tk-fi-' + i.id).textContent = ''; return schedule(); }
          var rd = new FileReader();
          rd.onload = function () {
            files[i.id] = { name: f.name, type: f.type, size: f.size, dataUrl: i.binary ? rd.result : null, text: (i.binary || i.buffer) ? null : rd.result, buf: i.buffer ? rd.result : null };
            $('tk-fi-' + i.id).textContent = f.name + ' · ' + f.size.toLocaleString() + ' bytes';
            schedule();
          };
          if (i.buffer) rd.readAsArrayBuffer(f); else if (i.binary) rd.readAsDataURL(f); else rd.readAsText(f);
        });
      } else {
        el.addEventListener('input', schedule);
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Tab' && !e.shiftKey && el.tagName === 'TEXTAREA' && i.tabIndent) {
            e.preventDefault();
            var s = el.selectionStart; el.value = el.value.slice(0, s) + '  ' + el.value.slice(el.selectionEnd); el.selectionStart = el.selectionEnd = s + 2;
          }
        });
      }
    });
    options.forEach(function (o) { var el = $('tk-op-' + o.id); el.addEventListener('input', schedule); el.addEventListener('change', schedule); });

    var runBtn = $('tk-run'); if (runBtn) runBtn.addEventListener('click', run);
    var sampleBtn = $('tk-sample');
    if (sampleBtn) sampleBtn.addEventListener('click', function () {
      textIn.forEach(function (i) { if (i.sample != null) $('tk-in-' + i.id).value = T(i.sample); });
      if (def.sampleOptions) Object.keys(def.sampleOptions).forEach(function (k) {
        var el = $('tk-op-' + k); if (!el) return;
        if (el.type === 'checkbox') el.checked = !!def.sampleOptions[k]; else el.value = def.sampleOptions[k];
      });
      run();
    });
    $('tk-clear').addEventListener('click', function () {
      textIn.forEach(function (i) { $('tk-in-' + i.id).value = ''; });
      inputs.forEach(function (i) { if (i.type === 'file') { files[i.id] = null; $('tk-in-' + i.id).value = ''; $('tk-fi-' + i.id).textContent = ''; } });
      setDefaults(); showStatus('', ''); hideOutputs(); updateCounts(); refreshVisibility();
    });
    var swapBtn = $('tk-swap');
    if (swapBtn) swapBtn.addEventListener('click', function () {
      var src = texts[def.swap.from]; if (src == null) return;
      $('tk-in-' + def.swap.to).value = src;
      if (def.swap.set) Object.keys(def.swap.set).forEach(function (k) { var el = $('tk-op-' + k); if (el) el.value = def.swap.set[k]; });
      run();
    });
    root.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button[data-copy],button[data-dl]') : null;
      if (!b) return;
      var id = b.getAttribute('data-copy') || b.getAttribute('data-dl');
      var o = outputs.filter(function (x) { return x.id === id; })[0];
      if (b.hasAttribute('data-copy')) copyText(texts[id] || '', b);
      else download((def.fileName || slug) + '-' + id + '.' + (o.ext || 'txt'), texts[id] || '', o.mime);
    });

    if (def.mount) def.mount(root, {
      run: run, readValues: readValues, $: $,
      setOutput: function (id, text) {
        texts[id] = text;
        var code = document.querySelector('#tk-out-' + id + ' code');
        if (code) code.textContent = text;
        var box = $('tk-ob-' + id); if (box) box.style.display = text ? '' : 'none';
      }
    });

    // 입력이 비어 있어도 첫 화면에서 예시를 한 번 보여주는 도구
    if (def.autoSample) { var sb = $('tk-sample'); if (sb) sb.click(); }
    refreshVisibility(); updateCounts();
  }
})(typeof window !== 'undefined' ? window : globalThis);
