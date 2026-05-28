(function () {
  const SITES = [
    { icon: '🔗', name: 'WooaHouse', host: 'wooahouse.com',           url: 'https://wooahouse.com/' },
    { icon: '📄', name: 'WooaPDF',   host: 'pdfkit.wooahouse.com',    url: 'https://pdfkit.wooahouse.com/' },
    { icon: '🖼️', name: 'WooaImage', host: 'imagekit.wooahouse.com',  url: 'https://imagekit.wooahouse.com/' },
    { icon: '🎨', name: 'WooaColor', host: 'colorkit.wooahouse.com',  url: 'https://colorkit.wooahouse.com/' },
    { icon: '✏️', name: 'WooaText',  host: 'textkit.wooahouse.com',   url: 'https://textkit.wooahouse.com/' },
    { icon: '📱', name: 'WooaQR',    host: 'qrkit.wooahouse.com',     url: 'https://qrkit.wooahouse.com/' },
    { icon: '🧮', name: 'WooaCalc',  host: 'calckit.wooahouse.com',   url: 'https://calckit.wooahouse.com/' },
    { icon: '🔤', name: 'WooaFont',  host: 'fontkit.wooahouse.com',   url: 'https://fontkit.wooahouse.com/' },
    { icon: '🍎', name: 'WooaMac',   host: 'mactools.wooahouse.com',  url: 'https://mactools.wooahouse.com/' },
    { icon: '🖥️', name: 'WooaPC',    host: 'pctools.wooahouse.com',   url: 'https://pctools.wooahouse.com/' },
    { icon: '💻', name: 'WooaVS',    host: 'vskit.wooahouse.com',     url: 'https://vskit.wooahouse.com/' },
    { icon: '🎵', name: 'WooaAudio', host: 'wooaaudio.wooahouse.com', url: 'https://wooaaudio.wooahouse.com/' },
    { icon: '🎬', name: 'WooaVideo', host: 'wooavideo.wooahouse.com', url: 'https://wooavideo.wooahouse.com/' },
    { icon: '🔍', name: 'WooaViewer',host: 'wooaviewer.wooahouse.com',url: 'https://wooaviewer.wooahouse.com/' },
    { icon: '🛠️', name: 'WooaDev',   host: 'wooadev.wooahouse.com',   url: 'https://wooadev.wooahouse.com/' },
    { icon: '🔎', name: 'WooaOCR',   host: 'wooaocr.wooahouse.com',   url: 'https://wooaocr.wooahouse.com/' },
    { icon: '📊', name: 'WooaSheet', host: 'wooasheet.wooahouse.com', url: 'https://wooasheet.wooahouse.com/' },
    { icon: '🔎', name: 'WooaSEO',   host: 'wooaseo.wooahouse.com',   url: 'https://wooaseo.wooahouse.com/' },
    { icon: '📝', name: 'WooaGosa',  host: 'wooagosa.wooahouse.com',  url: 'https://wooagosa.wooahouse.com/' },
  ];

  const currentHost = window.location.hostname;
  const isEN = window.location.pathname.includes('/en/');
  const label = isEN ? '🏠 WooaHouse Family Sites' : '🏠 우아하우스 패밀리 사이트 · 도구모음';

  // 기존 our-sites-bar 교체 또는 header 뒤에 삽입
  const existing = document.querySelector('.our-sites-bar');
  const bar = document.createElement('div');
  bar.className = 'our-sites-bar';
  bar.innerHTML = `
    <div class="our-sites-inner">
      <span class="our-sites-label">${label}</span>
      <div class="our-sites-links">
        ${SITES.map(s => `<a href="${s.url}"${s.host === currentHost ? ' class="active"' : ''} ${s.host === currentHost ? '' : 'target="_blank" rel="noopener"'}>${s.icon} ${s.name}</a>`).join('')}
      </div>
    </div>
  `;

  if (existing) {
    existing.replaceWith(bar);
  } else {
    const header = document.querySelector('header');
    if (header) header.insertAdjacentElement('afterend', bar);
    else document.body.prepend(bar);
  }
})();
