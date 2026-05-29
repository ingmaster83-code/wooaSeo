/**
 * wooa-sidebar-en.js (EN)
 * ① tool-sidebar / index-sidebar: AdSense(1419180025)
 * ② .wooa-orig-anchor 앞: 인콘텐츠 AdSense(6255378195)
 * Coupang 없음 (EN 페이지)
 */
(function () {
  function init() {
    // ── ① 사이드바 ──────────────────────────────────────────
    var t = document.querySelector('.tool-sidebar') || document.querySelector('.index-sidebar');
    if (t && t.children.length === 0) {
      var isIndex = t.classList.contains('index-sidebar');
      var c = isIndex ? 'index-ad-card' : 'ad-card';

      function mkCard(extraStyle) {
        var d = document.createElement('div');
        d.className = c;
        if (extraStyle) d.style.cssText = extraStyle;
        return d;
      }

      function mkIns(slot) {
        var ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.cssText = 'display:block;width:100%;min-height:250px';
        ins.setAttribute('data-ad-client', 'ca-pub-6464921081676309');
        ins.setAttribute('data-ad-slot', slot);
        ins.setAttribute('data-ad-format', 'auto');
        ins.setAttribute('data-full-width-responsive', 'true');
        return ins;
      }

      // AdSense 1
      var card1 = mkCard();
      card1.appendChild(mkIns('1419180025'));
      t.appendChild(card1);
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }

    // ── ② 인콘텐츠 광고 (.wooa-orig-anchor 앞) ───────────────
    var anchor = document.querySelector('.wooa-orig-anchor');
    if (anchor) {
      var wrap = document.createElement('div');
      wrap.style.cssText = 'margin:28px 0;overflow:hidden';

      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.cssText = 'display:block';
      ins.setAttribute('data-ad-client', 'ca-pub-6464921081676309');
      ins.setAttribute('data-ad-slot', '6255378195');
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');

      wrap.appendChild(ins);
      anchor.parentNode.insertBefore(wrap, anchor);
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
