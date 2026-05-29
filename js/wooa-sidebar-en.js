/**
 * wooa-sidebar-en.js (EN)
 * tool-sidebar 또는 index-sidebar를 동적으로 채웁니다. (영문 페이지용)
 * 구조: AdSense(1419180025) → AdSense(6255378195)
 * Coupang 없음 (EN 페이지에서는 쿠팡 미노출)
 */
(function () {
  function init() {
    var t = document.querySelector('.tool-sidebar') || document.querySelector('.index-sidebar');
    if (!t || t.children.length > 0) return; // 이미 채워진 경우 스킵

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

    // ── AdSense 1 ──────────────────────────────────────────
    var card1 = mkCard();
    card1.appendChild(mkIns('1419180025'));
    t.appendChild(card1);
    (window.adsbygoogle = window.adsbygoogle || []).push({});

    // ── AdSense 2 ──────────────────────────────────────────
    var card2 = mkCard('margin-top:16px');
    card2.appendChild(mkIns('6255378195'));
    t.appendChild(card2);
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
