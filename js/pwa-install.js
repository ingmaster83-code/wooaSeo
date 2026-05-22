(function() {
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    const heroBtn = document.getElementById('heroInstallBtn');
    if (heroBtn) heroBtn.style.display = 'inline-flex';
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    closePWABanner();
    const heroBtn = document.getElementById('heroInstallBtn');
    if (heroBtn) heroBtn.style.display = 'none';
  });

  document.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      const heroBtn = document.getElementById('heroInstallBtn');
      if (heroBtn) heroBtn.style.display = 'none';
      return;
    }
    const heroBtn = document.getElementById('heroInstallBtn');
    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
            heroBtn.style.display = 'none';
          });
        } else {
          alert('주소창 오른쪽의 설치 아이콘(⊕)을 클릭해 홈 화면에 추가하세요.');
        }
      });
    }
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        setTimeout(showPWABanner, 1500);
      });
    }
  });

  var CONVERT_IDS = ['generateBtn','analyzeBtn','convertBtn','buildBtn','createBtn','processBtn'];
  var adDone = false;

  document.addEventListener('click', function(e) {
    var id = e.target && e.target.id;
    if (CONVERT_IDS.indexOf(id) === -1) return;
    if (adDone) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    var btn = e.target;
    showConvertAd(function() {
      adDone = true;
      btn.click();
    });
  }, true);

  window.showPWABanner = function() {
    if (sessionStorage.getItem('pwa_shown')) return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    sessionStorage.setItem('pwa_shown', '1');

    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var btnHtml = (!isIOS && deferredPrompt)
      ? '<button class="pwa-btn-install" onclick="window.triggerPWAInstall()">설치하기</button>'
      : (isIOS ? '<span class="pwa-ios-hint">Safari 메뉴 → 홈 화면에 추가</span>' : '');

    if (!isIOS && !deferredPrompt) return;

    var style = document.createElement('style');
    style.textContent = [
      '#pwa-install-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#1A1A2E;border-top:3px solid #4F46E5;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 -4px 20px rgba(0,0,0,0.3);animation:slideUp 0.3s ease}',
      '@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}',
      '.pwa-banner-icon{font-size:2rem;flex-shrink:0}',
      '.pwa-banner-text{flex:1}',
      '.pwa-banner-text strong{display:block;color:#fff;font-size:0.95rem}',
      '.pwa-banner-text span{color:rgba(255,255,255,0.7);font-size:0.82rem}',
      '.pwa-ios-hint{color:rgba(255,255,255,0.7);font-size:0.82rem}',
      '.pwa-btn-install{background:#4F46E5;color:#fff;border:none;border-radius:8px;padding:8px 18px;font-size:0.88rem;font-weight:700;cursor:pointer;white-space:nowrap;flex-shrink:0}',
      '.pwa-btn-close{background:none;border:none;color:rgba(255,255,255,0.5);font-size:1.2rem;cursor:pointer;padding:4px;flex-shrink:0}'
    ].join('');
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = '<div class="pwa-banner-icon">🔎</div>' +
      '<div class="pwa-banner-text">' +
        '<strong>WooaSEO 바로가기 추가</strong>' +
        '<span>' + (isIOS ? 'Safari 메뉴 → 홈 화면에 추가' : '앱처럼 설치해서 빠르게 접근하세요!') + '</span>' +
      '</div>' +
      btnHtml +
      '<button class="pwa-btn-close" onclick="window.closePWABanner()">✕</button>';
    document.body.appendChild(banner);
    setTimeout(closePWABanner, 20000);
  };

  window.triggerPWAInstall = function() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => { deferredPrompt = null; closePWABanner(); });
  };

  window.closePWABanner = function() {
    var el = document.getElementById('pwa-install-banner');
    if (el) el.remove();
  };

  window.showConvertAd = function(callback) {
    if (window.matchMedia('(display-mode: standalone)').matches) { callback(); return; }

    var style = document.createElement('style');
    style.textContent = [
      '#dl-ad-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:10000;display:flex;align-items:center;justify-content:center;animation:dlFadeIn .2s ease}',
      '@keyframes dlFadeIn{from{opacity:0}to{opacity:1}}',
      '#dl-ad-box{background:#fff;border-radius:16px;padding:20px 20px 16px;max-width:360px;width:92%;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,0.4)}',
      '#dl-ad-converting{font-size:1rem;font-weight:700;color:#333;margin-bottom:12px;display:flex;align-items:center;justify-content:center;gap:8px}',
      '#dl-ad-converting::before{content:"";display:inline-block;width:16px;height:16px;border:2px solid #ddd;border-top-color:#333;border-radius:50%;animation:dlSpin .8s linear infinite}',
      '@keyframes dlSpin{to{transform:rotate(360deg)}}',
      '#dl-ad-close{margin-top:14px;padding:7px 22px;background:#222;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:.83rem}'
    ].join('');
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.id = 'dl-ad-overlay';
    overlay.innerHTML = '<div id="dl-ad-box">' +
      '<div id="dl-ad-converting">생성 중입니다...</div>' +
      '<ins class="adsbygoogle" style="display:block;min-height:100px"' +
        ' data-ad-client="ca-pub-6464921081676309"' +
        ' data-ad-slot="9432796175"' +
        ' data-ad-format="auto"' +
        ' data-full-width-responsive="true"></ins>' +
      '<button id="dl-ad-close">닫기</button>' +
    '</div>';
    document.body.appendChild(overlay);

    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}

    var finish = function() {
      var ov = document.getElementById('dl-ad-overlay');
      if (ov) ov.remove();
      callback();
    };

    document.getElementById('dl-ad-close').addEventListener('click', finish);

    setTimeout(finish, 3000);
  };
})();
