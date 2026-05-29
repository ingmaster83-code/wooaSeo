/**
 * wooa-sidebar.js (KO)
 * ① tool-sidebar / index-sidebar: AdSense(1419180025) + Coupang(974224)
 * ② .wooa-orig-anchor 앞: 인콘텐츠 AdSense(6255378195)
 * EN 페이지는 wooa-sidebar-en.js 사용
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

      // Coupang
      var card2 = mkCard('margin-top:16px;overflow:hidden');
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
      card2.appendChild(coupangScript);
      t.appendChild(card2);

      // 쿠팡 파트너스 고지
      var p = document.createElement('p');
      p.style.cssText = 'margin-top:8px;font-size:.72rem;color:#9CA3AF;line-height:1.5;text-align:center';
      p.innerHTML = '이 포스팅은 쿠팡 파트너스 활동의 일환으로,<br>이에 따른 일정액의 수수료를 제공받습니다.';
      t.appendChild(p);
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
