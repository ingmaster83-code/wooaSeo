/**
 * wooa-sidebar.js (KO)
 * tool-sidebar / index-sidebar: AdSense(1419180025) + Coupang(974224)
 * 도구 페이지 인콘텐츠 광고는 wooahouse-originals-tool.js 에서 처리
 *
 * Coupang G() : container 파라미터에 DOM 노드 전달 → 해당 요소에 직접 append
 */
(function () {
  function init() {
    var t = document.querySelector('.tool-sidebar') || document.querySelector('.index-sidebar');
    if (!t || t.children.length > 0) return;

    function mkCard(extraStyle) {
      var d = document.createElement('div');
      d.className = 'ad-card';
      if (extraStyle) d.style.cssText = extraStyle;
      return d;
    }

    function mkIns(slot) {
      var ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.cssText = 'display:block;width:100%';
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

    // ── Coupang ────────────────────────────────────────────
    var coupangCard = mkCard('margin-top:16px;overflow:hidden');
    t.appendChild(coupangCard);

    function renderCoupang() {
      new PartnersCoupang.G({
        id: 974224,
        trackingCode: 'AF5600192',
        subId: null,
        template: 'carousel',
        width: '300',
        height: '250',
        container: coupangCard   // ← DOM 노드 직접 지정
      });
    }

    if (typeof PartnersCoupang !== 'undefined') {
      renderCoupang();
    } else {
      var gs = document.createElement('script');
      gs.src = 'https://ads-partners.coupang.com/g.js';
      gs.async = true;
      gs.onload = renderCoupang;
      document.head.appendChild(gs);
    }

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
