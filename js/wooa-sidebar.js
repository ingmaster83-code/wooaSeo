/**
 * wooa-sidebar.js (KO)
 * tool-sidebar : AdSense(1419180025) + Coupang(974224)
 * index-sidebar: AdSense(1419180025) + AdSense(6255378195) + Coupang(974224)
 * 도구 페이지 인콘텐츠 광고는 wooahouse-originals-tool.js 에서 처리
 */
(function () {
  function init() {
    var t = document.querySelector('.tool-sidebar') || document.querySelector('.index-sidebar');
    if (!t || t.children.length > 0) return;

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

    // AdSense 1 (공통)
    var card1 = mkCard();
    card1.appendChild(mkIns('1419180025'));
    t.appendChild(card1);
    (window.adsbygoogle = window.adsbygoogle || []).push({});

    // AdSense 2 — 인덱스 페이지 전용
    // (도구 페이지는 wooahouse-originals-tool.js 가 인콘텐츠로 처리)
    if (isIndex) {
      var card2 = mkCard('margin-top:16px');
      card2.appendChild(mkIns('6255378195'));
      t.appendChild(card2);
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }

    // Coupang (공통)
    var coupangCard = mkCard('margin-top:16px;overflow:hidden');
    var coupangScript = document.createElement('script');
    coupangScript.src = 'https://ads-partners.coupang.com/g.js';
    coupangScript.async = true;
    coupangScript.onload = function () {
      new PartnersCoupang.G({
        id: 974224,
        trackingCode: 'AF5600192',
        subId: null,
        template: 'carousel',
        width: '300',
        height: '250'
      });
    };
    coupangCard.appendChild(coupangScript);
    t.appendChild(coupangCard);

    // 쿠팡 파트너스 고지
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
