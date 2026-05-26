(function () {
  const SITES = [
    { host: 'pdfkit.wooahouse.com',      badge: 'WOOOAPDF',    color: '#FF4444', icon: '📄', title: 'Free Online PDF Tools',              desc: 'Convert, merge, split, compress, rotate & watermark PDFs. Files never leave your browser — 100% safe and free.',    url: 'https://pdfkit.wooahouse.com' },
    { host: 'imagekit.wooahouse.com',     badge: 'WOOAIMAGE',   color: '#6366F1', icon: '🖼️', title: 'Free Online Image Tools',            desc: 'Compress, resize, convert & remove backgrounds — all in your browser, no upload needed.',                            url: 'https://imagekit.wooahouse.com' },
    { host: 'colorkit.wooahouse.com',     badge: 'WOOACOLOR',   color: '#F59E0B', icon: '🎨', title: 'Color Picker & Palette Generator',   desc: 'Extract colors from images, convert HEX/RGB, and generate beautiful palettes instantly.',                            url: 'https://colorkit.wooahouse.com' },
    { host: 'textkit.wooahouse.com',      badge: 'WOOATEXT',    color: '#10B981', icon: '✏️', title: 'Text Transform & Edit Tools',        desc: 'Convert, sort, number lines, and edit text — all your text tasks in one place.',                                      url: 'https://textkit.wooahouse.com' },
    { host: 'qrkit.wooahouse.com',        badge: 'WOOAQR',      color: '#3B82F6', icon: '📱', title: 'QR Code Generator & Scanner',        desc: 'Generate QR codes for URLs, text, contacts and more — free, fast, no limits.',                                      url: 'https://qrkit.wooahouse.com' },
    { host: 'calckit.wooahouse.com',      badge: 'WOOALCALC',   color: '#8B5CF6', icon: '🧮', title: 'Unit Converter & Calculator',        desc: 'Convert length, weight, temperature and more. Calculate formulas in one place.',                                    url: 'https://calckit.wooahouse.com' },
    { host: 'fontkit.wooahouse.com',      badge: 'WOOAFONT',    color: '#EC4899', icon: '🔤', title: 'Free Commercial Fonts',              desc: 'Handpicked free fonts for commercial use — official download links, no copyright worries.',                          url: 'https://fontkit.wooahouse.com' },
    { host: 'mactools.wooahouse.com',     badge: 'WOOAMAC',     color: '#6B7280', icon: '🍎', title: 'Essential Mac Apps',                 desc: 'Must-have apps after buying or reformatting a Mac — all official download links.',                                   url: 'https://mactools.wooahouse.com' },
    { host: 'pctools.wooahouse.com',      badge: 'WOOAPC',      color: '#0EA5E9', icon: '🖥️', title: 'Essential Windows Programs',         desc: 'Must-have programs after a Windows reformat — all official download links.',                                        url: 'https://pctools.wooahouse.com' },
    { host: 'vskit.wooahouse.com',        badge: 'WOOAVS',      color: '#007ACC', icon: '💻', title: 'VS Code Extensions Collection',      desc: 'Curated VS Code extensions to boost your development productivity.',                                                url: 'https://vskit.wooahouse.com' },
    { host: 'wooaaudio.wooahouse.com',    badge: 'WOOAAUDIO',   color: '#F97316', icon: '🎵', title: 'Online Audio Tools',                 desc: 'Convert, edit, trim, and record audio — all free, directly in your browser.',                                       url: 'https://wooaaudio.wooahouse.com' },
    { host: 'wooavideo.wooahouse.com',    badge: 'WOOAVIDEO',   color: '#EF4444', icon: '🎬', title: 'Online Video Tools',                 desc: 'Convert, compress, and edit videos — free, no upload to server required.',                                          url: 'https://wooavideo.wooahouse.com' },
    { host: 'wooaviewer.wooahouse.com',   badge: 'WOOAVIEWER',  color: '#14B8A6', icon: '🔍', title: 'File Viewer Collection',             desc: 'Open and view various file formats directly in your browser — no software needed.',                                  url: 'https://wooaviewer.wooahouse.com' },
    { host: 'wooadev.wooahouse.com',      badge: 'WOOADEV',     color: '#64748B', icon: '🛠️', title: 'Developer Tools',                    desc: 'JSON formatter, Base64, URL encoder and more dev tools — all in one place.',                                        url: 'https://wooadev.wooahouse.com' },
    { host: 'wooaocr.wooahouse.com',      badge: 'WOOAOCR',     color: '#A855F7', icon: '🔎', title: 'OCR — Extract Text from Images',     desc: 'Automatically recognize and extract text from images and scanned documents.',                                      url: 'https://wooaocr.wooahouse.com' },
    { host: 'wooasheet.wooahouse.com',    badge: 'WOOASHEET',   color: '#22C55E', icon: '📊', title: 'Online Spreadsheet Tools',           desc: 'Open, edit, and convert CSV & Excel files directly in your browser.',                                               url: 'https://wooasheet.wooahouse.com' },
    { host: 'wooaseo.wooahouse.com',      badge: 'WOOASEO',     color: '#F59E0B', icon: '🔎', title: 'SEO Analysis Tools',                 desc: 'Analyze SEO scores, research keywords, and generate meta tags for your website.',                                   url: 'https://wooaseo.wooahouse.com' },
    { host: 'wooagosa.wooahouse.com',     badge: 'WOOAGOSA',    color: '#6366F1', icon: '📝', title: 'Free License Mock Tests',            desc: 'Practice for driving licenses and certification exams — 49 exam types, free.',                                      url: 'https://wooagosa.wooahouse.com' },
  ];

  function bgLuminance() {
    const bg = getComputedStyle(document.body).backgroundColor;
    const m = bg.match(/\d+/g);
    if (!m || m.length < 3) return 255;
    return 0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2];
  }
  const dark = bgLuminance() < 80;

  const isToolPage = !!document.querySelector('.wooa-orig-anchor');
  const currentHost = window.location.hostname;
  const utmSource = currentHost.replace('.wooahouse.com', '');
  const picks = SITES
    .filter(s => s.host !== currentHost)
    .sort(() => Math.random() - 0.5)
    .slice(0, isToolPage ? 4 : 5);

  if (!picks.length) return;

  const style = document.createElement('style');
  style.textContent = `
    .wooa-orig-wrap {
      margin: 0 0 40px;
    }
    .wooa-orig-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }
    .wooa-orig-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: #3B82F6;
      flex-shrink: 0;
    }
    .wooa-orig-label {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: .08em;
      color: ${dark ? '#e2e8f0' : '#333'};
    }
    .wooa-orig-sub {
      font-size: 13px;
      color: ${dark ? '#94a3b8' : '#888'};
      margin: 0 0 20px 18px;
    }
    .wooa-orig-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 14px;
    }
    .wooa-orig-card {
      background: ${dark ? '#1e293b' : '#fff'};
      border: 1px solid ${dark ? '#334155' : '#e5e7eb'};
      border-radius: 14px;
      padding: 20px;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: box-shadow .15s, transform .15s;
      overflow: hidden;
      position: relative;
    }
    .wooa-orig-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 4px;
      background: var(--wooa-color);
    }
    .wooa-orig-card:hover {
      box-shadow: 0 6px 20px rgba(0,0,0,${dark ? '.4' : '.1'});
      transform: translateY(-2px);
    }
    .wooa-orig-top {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 4px;
    }
    .wooa-orig-icon {
      font-size: 28px;
      line-height: 1;
    }
    .wooa-orig-badge {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .06em;
      color: ${dark ? '#64748b' : '#888'};
    }
    .wooa-orig-title {
      font-size: 16px;
      font-weight: 700;
      color: ${dark ? '#e2e8f0' : '#111'};
      line-height: 1.4;
    }
    .wooa-orig-desc {
      font-size: 13px;
      color: ${dark ? '#94a3b8' : '#666'};
      line-height: 1.6;
      flex: 1;
    }
    .wooa-orig-link {
      font-size: 13px;
      font-weight: 600;
      color: ${dark ? '#60a5fa' : '#3B82F6'};
      margin-top: 4px;
    }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.className = 'wooa-orig-wrap';
  wrap.innerHTML = `
    <div class="wooa-orig-header">
      <span class="wooa-orig-dot"></span>
      <span class="wooa-orig-label">👀 Looking for something else?</span>
    </div>
    <p class="wooa-orig-sub">More free tools from WooaHouse</p>
    <div class="wooa-orig-grid">
      ${picks.map(s => `
        <a href="${s.url}?utm_source=${utmSource}&utm_medium=originals&utm_campaign=wooahouse" class="wooa-orig-card" style="--wooa-color:${s.color}" target="_blank" rel="noopener">
          <div class="wooa-orig-top">
            <span class="wooa-orig-icon">${s.icon}</span>
            <span class="wooa-orig-badge">${s.badge}</span>
          </div>
          <div class="wooa-orig-title">${s.title}</div>
          <div class="wooa-orig-desc">${s.desc}</div>
          <div class="wooa-orig-link">Visit →</div>
        </a>
      `).join('')}
    </div>
  `;

  const anchor = document.querySelector('.wooa-orig-anchor');
  const toolsSection = document.querySelector('.tools-section');
  if (anchor) anchor.replaceWith(wrap);
  else if (toolsSection) toolsSection.prepend(wrap);
  else {
    const fallback = document.querySelector('footer');
    if (fallback) fallback.before(wrap);
    else document.body.appendChild(wrap);
  }

  if (!isToolPage) {
    requestAnimationFrame(() => {
      const grid = wrap.querySelector('.wooa-orig-grid');
      if (!grid || grid.children.length < 2) return;
      const items = [...grid.children];
      const topFirst = Math.round(items[0].getBoundingClientRect().top);
      const perRow = items.filter(el => Math.round(el.getBoundingClientRect().top) === topFirst).length;
      if (perRow < 1 || perRow >= items.length) return;
      const rem = items.length % perRow;
      if (rem !== 0) items.slice(-rem).forEach(el => el.remove());
    });
  }
})();
