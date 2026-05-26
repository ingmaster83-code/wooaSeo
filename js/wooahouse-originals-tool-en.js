(function () {
  const SITES = [
    { host: 'pdfkit.wooahouse.com',      badge: 'WOOOAPDF',    color: '#FF4444', icon: '📄', title: 'Free Online PDF Tools',           url: 'https://pdfkit.wooahouse.com' },
    { host: 'imagekit.wooahouse.com',     badge: 'WOOAIMAGE',   color: '#6366F1', icon: '🖼️', title: 'Free Online Image Tools',         url: 'https://imagekit.wooahouse.com' },
    { host: 'colorkit.wooahouse.com',     badge: 'WOOACOLOR',   color: '#F59E0B', icon: '🎨', title: 'Color Picker & Palette',          url: 'https://colorkit.wooahouse.com' },
    { host: 'textkit.wooahouse.com',      badge: 'WOOATEXT',    color: '#10B981', icon: '✏️', title: 'Text Transform Tools',            url: 'https://textkit.wooahouse.com' },
    { host: 'qrkit.wooahouse.com',        badge: 'WOOAQR',      color: '#3B82F6', icon: '📱', title: 'QR Code Generator',               url: 'https://qrkit.wooahouse.com' },
    { host: 'calckit.wooahouse.com',      badge: 'WOOALCALC',   color: '#8B5CF6', icon: '🧮', title: 'Unit Converter & Calculator',     url: 'https://calckit.wooahouse.com' },
    { host: 'fontkit.wooahouse.com',      badge: 'WOOAFONT',    color: '#EC4899', icon: '🔤', title: 'Free Commercial Fonts',           url: 'https://fontkit.wooahouse.com' },
    { host: 'mactools.wooahouse.com',     badge: 'WOOAMAC',     color: '#6B7280', icon: '🍎', title: 'Essential Mac Apps',              url: 'https://mactools.wooahouse.com' },
    { host: 'pctools.wooahouse.com',      badge: 'WOOAPC',      color: '#0EA5E9', icon: '🖥️', title: 'Essential Windows Programs',      url: 'https://pctools.wooahouse.com' },
    { host: 'vskit.wooahouse.com',        badge: 'WOOAVS',      color: '#007ACC', icon: '💻', title: 'VS Code Extensions',              url: 'https://vskit.wooahouse.com' },
    { host: 'wooaaudio.wooahouse.com',    badge: 'WOOAAUDIO',   color: '#F97316', icon: '🎵', title: 'Online Audio Tools',              url: 'https://wooaaudio.wooahouse.com' },
    { host: 'wooavideo.wooahouse.com',    badge: 'WOOAVIDEO',   color: '#EF4444', icon: '🎬', title: 'Online Video Tools',              url: 'https://wooavideo.wooahouse.com' },
    { host: 'wooaviewer.wooahouse.com',   badge: 'WOOAVIEWER',  color: '#14B8A6', icon: '🔍', title: 'File Viewer Collection',          url: 'https://wooaviewer.wooahouse.com' },
    { host: 'wooadev.wooahouse.com',      badge: 'WOOADEV',     color: '#64748B', icon: '🛠️', title: 'Developer Tools',                 url: 'https://wooadev.wooahouse.com' },
    { host: 'wooaocr.wooahouse.com',      badge: 'WOOAOCR',     color: '#A855F7', icon: '🔎', title: 'OCR — Extract Text from Images',  url: 'https://wooaocr.wooahouse.com' },
    { host: 'wooasheet.wooahouse.com',    badge: 'WOOASHEET',   color: '#22C55E', icon: '📊', title: 'Online Spreadsheet Tools',        url: 'https://wooasheet.wooahouse.com' },
    { host: 'wooaseo.wooahouse.com',      badge: 'WOOASEO',     color: '#F59E0B', icon: '🔎', title: 'SEO Analysis Tools',              url: 'https://wooaseo.wooahouse.com' },
    { host: 'wooagosa.wooahouse.com',     badge: 'WOOAGOSA',    color: '#6366F1', icon: '📝', title: 'Free License Mock Tests',         url: 'https://wooagosa.wooahouse.com' },
  ];

  function bgLuminance() {
    const bg = getComputedStyle(document.body).backgroundColor;
    const m = bg.match(/\d+/g);
    if (!m || m.length < 3) return 255;
    return 0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2];
  }
  const dark = bgLuminance() < 80;

  const currentHost = window.location.hostname;
  const utmSource = currentHost.replace('.wooahouse.com', '');
  const picks = SITES
    .filter(s => s.host !== currentHost)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  if (!picks.length) return;

  const style = document.createElement('style');
  style.textContent = `
    .wooa-tool-wrap {
      margin: 2rem auto;
      max-width: 800px;
      padding: 0 1rem;
    }
    .wooa-tool-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .wooa-tool-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #3B82F6;
      flex-shrink: 0;
    }
    .wooa-tool-label {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: .06em;
      color: ${dark ? '#e2e8f0' : '#333'};
    }
    .wooa-tool-sub {
      font-size: 12px;
      color: ${dark ? '#94a3b8' : '#999'};
      margin: 0 0 12px 16px;
    }
    .wooa-tool-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    @media (max-width: 600px) {
      .wooa-tool-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .wooa-tool-card {
      background: ${dark ? '#1e293b' : '#fff'};
      border: 1px solid ${dark ? '#334155' : '#e5e7eb'};
      border-radius: 10px;
      padding: 12px 14px;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
      overflow: hidden;
      transition: box-shadow .15s, transform .15s;
    }
    .wooa-tool-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: var(--wooa-color);
    }
    .wooa-tool-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,${dark ? '.4' : '.1'});
      transform: translateY(-1px);
    }
    .wooa-tool-icon {
      font-size: 22px;
      line-height: 1;
      flex-shrink: 0;
    }
    .wooa-tool-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    .wooa-tool-badge {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: .05em;
      color: ${dark ? '#64748b' : '#aaa'};
    }
    .wooa-tool-title {
      font-size: 12px;
      font-weight: 700;
      color: ${dark ? '#e2e8f0' : '#111'};
      line-height: 1.3;
    }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.className = 'wooa-tool-wrap';
  wrap.innerHTML = `
    <div class="wooa-tool-header">
      <span class="wooa-tool-dot"></span>
      <span class="wooa-tool-label">🛠️ More tools to try</span>
    </div>
    <p class="wooa-tool-sub">All free at WooaHouse</p>
    <div class="wooa-tool-grid">
      ${picks.map(s => `
        <a href="${s.url}?utm_source=${utmSource}&utm_medium=originals&utm_campaign=wooahouse" class="wooa-tool-card" style="--wooa-color:${s.color}" target="_blank" rel="noopener">
          <span class="wooa-tool-icon">${s.icon}</span>
          <div class="wooa-tool-info">
            <span class="wooa-tool-badge">${s.badge}</span>
            <span class="wooa-tool-title">${s.title}</span>
          </div>
        </a>
      `).join('')}
    </div>
  `;

  const anchor = document.querySelector('.wooa-orig-anchor');
  if (anchor) anchor.replaceWith(wrap);
  else {
    const footer = document.querySelector('footer');
    if (footer) footer.before(wrap);
    else document.body.appendChild(wrap);
  }
})();
