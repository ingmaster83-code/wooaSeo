(function () {
  const SITES = [
    { host: 'pdfkit.wooahouse.com',      badge: 'WOOOAPDF',    color: '#FF4444', icon: '📄', title: '무료 온라인 PDF 도구 모음',        url: 'https://pdfkit.wooahouse.com' },
    { host: 'imagekit.wooahouse.com',     badge: 'WOOAIMAGE',   color: '#6366F1', icon: '🖼️', title: '무료 온라인 이미지 도구 모음',     url: 'https://imagekit.wooahouse.com' },
    { host: 'colorkit.wooahouse.com',     badge: 'WOOACOLOR',   color: '#F59E0B', icon: '🎨', title: '색상 추출·변환·팔레트 생성',       url: 'https://colorkit.wooahouse.com' },
    { host: 'textkit.wooahouse.com',      badge: 'WOOATEXT',    color: '#10B981', icon: '✏️', title: '텍스트 변환·정렬·편집 도구',       url: 'https://textkit.wooahouse.com' },
    { host: 'qrkit.wooahouse.com',        badge: 'WOOAQR',      color: '#3B82F6', icon: '📱', title: 'QR 코드 생성·스캔',                url: 'https://qrkit.wooahouse.com' },
    { host: 'calckit.wooahouse.com',      badge: 'WOOALCALC',   color: '#8B5CF6', icon: '🧮', title: '단위 변환·수식 계산기',            url: 'https://calckit.wooahouse.com' },
    { host: 'fontkit.wooahouse.com',      badge: 'WOOAFONT',    color: '#EC4899', icon: '🔤', title: '무료 상업용 폰트 모음',            url: 'https://fontkit.wooahouse.com' },
    { host: 'mactools.wooahouse.com',     badge: 'WOOAMAC',     color: '#6B7280', icon: '🍎', title: '맥 필수 앱 모음',                  url: 'https://mactools.wooahouse.com' },
    { host: 'pctools.wooahouse.com',      badge: 'WOOAPC',      color: '#0EA5E9', icon: '🖥️', title: '포맷 후 필수 프로그램 모음',       url: 'https://pctools.wooahouse.com' },
    { host: 'vskit.wooahouse.com',        badge: 'WOOAVS',      color: '#007ACC', icon: '💻', title: 'VS Code 확장 프로그램 모음',       url: 'https://vskit.wooahouse.com' },
    { host: 'wooaaudio.wooahouse.com',    badge: 'WOOAAUDIO',   color: '#F97316', icon: '🎵', title: '온라인 오디오 도구',               url: 'https://wooaaudio.wooahouse.com' },
    { host: 'wooavideo.wooahouse.com',    badge: 'WOOAVIDEO',   color: '#EF4444', icon: '🎬', title: '온라인 비디오 도구',               url: 'https://wooavideo.wooahouse.com' },
    { host: 'wooaviewer.wooahouse.com',   badge: 'WOOAVIEWER',  color: '#14B8A6', icon: '🔍', title: '파일 뷰어 모음',                   url: 'https://wooaviewer.wooahouse.com' },
    { host: 'wooadev.wooahouse.com',      badge: 'WOOADEV',     color: '#64748B', icon: '🛠️', title: '개발자 도구 모음',                 url: 'https://wooadev.wooahouse.com' },
    { host: 'wooaocr.wooahouse.com',      badge: 'WOOAOCR',     color: '#A855F7', icon: '🔎', title: 'OCR 이미지 텍스트 추출',           url: 'https://wooaocr.wooahouse.com' },
    { host: 'wooasheet.wooahouse.com',    badge: 'WOOASHEET',   color: '#22C55E', icon: '📊', title: '온라인 스프레드시트 도구',         url: 'https://wooasheet.wooahouse.com' },
    { host: 'wooaseo.wooahouse.com',      badge: 'WOOASEO',     color: '#F59E0B', icon: '🔎', title: 'SEO 분석 도구',                    url: 'https://wooaseo.wooahouse.com' },
    { host: 'wooagosa.wooahouse.com',     badge: 'WOOAGOSA',    color: '#6366F1', icon: '📝', title: '자격증·면허 무료 모의고사',        url: 'https://wooagosa.wooahouse.com' },
  ];

  // 배경색 밝기 감지 (0~255, 80 미만이면 어두운 배경)
  function bgLuminance() {
    const bg = getComputedStyle(document.body).backgroundColor;
    const m = bg.match(/\d+/g);
    if (!m || m.length < 3) return 255;
    return 0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2];
  }
  const dark = bgLuminance() < 80;

  const currentHost = window.location.hostname;
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
      <span class="wooa-tool-label">🛠️ 다른 작업도 여기서 해결하세요</span>
    </div>
    <p class="wooa-tool-sub">WooaHouse 무료 도구 모음</p>
    <div class="wooa-tool-grid">
      ${picks.map(s => `
        <a href="${s.url}" class="wooa-tool-card" style="--wooa-color:${s.color}" target="_blank" rel="noopener">
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
