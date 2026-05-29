/**
 * wooa-sidebar.js (KO)
 * tool-sidebar / index-sidebar: AdSense(1419180025) + Coupang(974224)
 * 도구 페이지 인콘텐츠 광고는 wooahouse-originals-tool.js 에서 처리
 *
 * Coupang G()는 body에 강제 append → MutationObserver로 잡아서 카드 안으로 이동
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

    function loadAndRenderCoupang() {
      // G()가 body에 append하는 요소를 잡아 coupangCard로 이동
      var snapshot = new Set(Array.from(document.body.children));

      var obs = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (node) {
            if (node.nodeType === 1 && !snapshot.has(node) && node.parentNode === document.body) {
              coupangCard.appendChild(node);
              obs.disconnect();
            }
          });
        });
      });
      obs.observe(document.body, { childList: true });

      new PartnersCoupang.G({
        id: 974224,
        trackingCode: 'AF5600192',
        subId: null,
        template: 'carousel',
        width: '300',
        height: '250'
      });

      // 안전장치: 5초 후 observer 해제
      setTimeout(function () { obs.disconnect(); }, 5000);
    }

    if (typeof PartnersCoupang !== 'undefined') {
      loadAndRenderCoupang();
    } else {
      var gs = document.createElement('script');
      gs.src = 'https://ads-partners.coupang.com/g.js';
      gs.async = true;
      gs.onload = loadAndRenderCoupang;
      document.head.appendChild(gs);
    }

    // ── 쿠팡 파트너스 고지 ──────────────────────────────────
    var p = document.createElement('p');
    p.style.cssText = 'margin-top:8px;font-size:.72rem;color:#9CA3AF;line-height:1.5;text-align:center';
    p.innerHTML = '이 포스팅은 쿠팡 파트너스 활동의 일환으로,<br>이에 따른 일정액의 수수료를 제공받습니다.';
    t.appendChild(p);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
