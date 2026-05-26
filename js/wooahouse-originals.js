(function () {
  const SITES = [
    { host: 'pdfkit.wooahouse.com',      badge: 'WOOOAPDF',    color: '#FF4444', icon: '📄', title: '무료 온라인 PDF 도구 모음',        desc: 'PDF 변환·합치기·분할·압축·회전·워터마크까지. 파일이 서버에 저장되지 않아 안전한 무료 PDF 작업 도구.', url: 'https://pdfkit.wooahouse.com' },
    { host: 'imagekit.wooahouse.com',     badge: 'WOOAIMAGE',   color: '#6366F1', icon: '🖼️', title: '무료 온라인 이미지 도구 모음',     desc: '이미지 압축·리사이즈·변환·배경 제거까지 브라우저에서 바로.',                                          url: 'https://imagekit.wooahouse.com' },
    { host: 'colorkit.wooahouse.com',     badge: 'WOOACOLOR',   color: '#F59E0B', icon: '🎨', title: '색상 추출·변환·팔레트 생성',       desc: '이미지에서 색상 추출, HEX/RGB 변환, 팔레트 자동 생성.',                                               url: 'https://colorkit.wooahouse.com' },
    { host: 'textkit.wooahouse.com',      badge: 'WOOATEXT',    color: '#10B981', icon: '✏️', title: '텍스트 변환·정렬·편집 도구',       desc: '텍스트 변환·정렬·줄 번호 추가 등 다양한 텍스트 작업을 한 곳에서.',                                     url: 'https://textkit.wooahouse.com' },
    { host: 'qrkit.wooahouse.com',        badge: 'WOOAQR',      color: '#3B82F6', icon: '📱', title: 'QR 코드 생성·스캔',                desc: 'URL·텍스트·연락처 등 다양한 QR 코드를 무료로 생성.',                                                  url: 'https://qrkit.wooahouse.com' },
    { host: 'calckit.wooahouse.com',      badge: 'WOOALCALC',   color: '#8B5CF6', icon: '🧮', title: '단위 변환·수식 계산기',            desc: '길이·무게·온도 등 단위 변환과 수식 계산을 한 곳에서.',                                                url: 'https://calckit.wooahouse.com' },
    { host: 'fontkit.wooahouse.com',      badge: 'WOOAFONT',    color: '#EC4899', icon: '🔤', title: '무료 상업용 폰트 모음',            desc: '저작권 걱정 없이 쓸 수 있는 무료 상업용 폰트 공식 다운로드 링크 모음.',                                 url: 'https://fontkit.wooahouse.com' },
    { host: 'mactools.wooahouse.com',     badge: 'WOOAMAC',     color: '#6B7280', icon: '🍎', title: '맥 필수 앱 모음',                  desc: 'Mac 구입·포맷 후 꼭 설치해야 할 필수 앱 공식 다운로드 링크 모음.',                                    url: 'https://mactools.wooahouse.com' },
    { host: 'pctools.wooahouse.com',      badge: 'WOOAPC',      color: '#0EA5E9', icon: '🖥️', title: '포맷 후 필수 프로그램 모음',       desc: '윈도우 포맷 후 필요한 필수 프로그램 공식 다운로드 링크 모음.',                                         url: 'https://pctools.wooahouse.com' },
    { host: 'vskit.wooahouse.com',        badge: 'WOOAVS',      color: '#007ACC', icon: '💻', title: 'VS Code 확장 프로그램 모음',       desc: '개발 생산성을 높여주는 VS Code 확장 프로그램 추천 모음.',                                              url: 'https://vskit.wooahouse.com' },
    { host: 'wooaaudio.wooahouse.com',    badge: 'WOOAAUDIO',   color: '#F97316', icon: '🎵', title: '온라인 오디오 도구',               desc: '오디오 변환·편집·녹음 등 다양한 오디오 작업을 무료로.',                                               url: 'https://wooaaudio.wooahouse.com' },
    { host: 'wooavideo.wooahouse.com',    badge: 'WOOAVIDEO',   color: '#EF4444', icon: '🎬', title: '온라인 비디오 도구',               desc: '영상 변환·편집·압축 등 다양한 비디오 작업을 무료로.',                                                 url: 'https://wooavideo.wooahouse.com' },
    { host: 'wooaviewer.wooahouse.com',   badge: 'WOOAVIEWER',  color: '#14B8A6', icon: '🔍', title: '파일 뷰어 모음',                   desc: '다양한 형식의 파일을 브라우저에서 바로 열어보세요.',                                                   url: 'https://wooaviewer.wooahouse.com' },
    { host: 'wooadev.wooahouse.com',      badge: 'WOOADEV',     color: '#64748B', icon: '🛠️', title: '개발자 도구 모음',                 desc: 'JSON 포맷터·Base64·URL 인코더 등 개발에 필요한 도구 모음.',                                           url: 'https://wooadev.wooahouse.com' },
    { host: 'wooaocr.wooahouse.com',      badge: 'WOOAOCR',     color: '#A855F7', icon: '🔎', title: 'OCR 이미지 텍스트 추출',           desc: '이미지 속 텍스트를 자동으로 인식하고 추출.',                                                          url: 'https://wooaocr.wooahouse.com' },
    { host: 'wooasheet.wooahouse.com',    badge: 'WOOASHEET',   color: '#22C55E', icon: '📊', title: '온라인 스프레드시트 도구',         desc: 'CSV·엑셀 파일을 브라우저에서 바로 열고 편집.',                                                        url: 'https://wooasheet.wooahouse.com' },
    { host: 'wooaseo.wooahouse.com',      badge: 'WOOASEO',     color: '#F59E0B', icon: '🔎', title: 'SEO 분석 도구',                    desc: '웹사이트 SEO 점수 분석·키워드 도구·메타 태그 생성.',                                                  url: 'https://wooaseo.wooahouse.com' },
    { host: 'wooagosa.wooahouse.com',     badge: 'WOOAGOSA',    color: '#6366F1', icon: '📝', title: '자격증·면허 무료 모의고사',        desc: '운전면허·자격증 시험을 무료로 준비하세요. 49개 시험, 오답노트 지원.',                                   url: 'https://wooagosa.wooahouse.com' },
  ];

  // 배경색 밝기 감지 (0~255, 128 미만이면 어두운 배경)
  function bgLuminance() {
    const bg = getComputedStyle(document.body).backgroundColor;
    const m = bg.match(/\d+/g);
    if (!m || m.length < 3) return 255;
    return 0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2];
  }
  const dark = bgLuminance() < 80;

  // 현재 사이트 제외 + 랜덤 N개 (인덱스: 5개, 툴 페이지: 4개)
  const isToolPage = !!document.querySelector('.wooa-orig-anchor');
  const currentHost = window.location.hostname;
  const picks = SITES
    .filter(s => s.host !== currentHost)
    .sort(() => Math.random() - 0.5)
    .slice(0, isToolPage ? 4 : 5);

  if (!picks.length) return;

  // CSS 주입
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

  // HTML 생성
  const wrap = document.createElement('div');
  wrap.className = 'wooa-orig-wrap';
  wrap.innerHTML = `
    <div class="wooa-orig-header">
      <span class="wooa-orig-dot"></span>
      <span class="wooa-orig-label">👀 혹시 이것도 필요하세요?</span>
    </div>
    <p class="wooa-orig-sub">WooaHouse의 다른 무료 도구들</p>
    <div class="wooa-orig-grid">
      ${picks.map(s => `
        <a href="${s.url}" class="wooa-orig-card" style="--wooa-color:${s.color}" target="_blank" rel="noopener">
          <div class="wooa-orig-top">
            <span class="wooa-orig-icon">${s.icon}</span>
            <span class="wooa-orig-badge">${s.badge}</span>
          </div>
          <div class="wooa-orig-title">${s.title}</div>
          <div class="wooa-orig-desc">${s.desc}</div>
          <div class="wooa-orig-link">바로가기 →</div>
        </a>
      `).join('')}
    </div>
  `;

  // 삽입 위치 결정
  const anchor = document.querySelector('.wooa-orig-anchor');
  const toolsSection = document.querySelector('.tools-section');
  if (anchor) anchor.replaceWith(wrap);
  else if (toolsSection) toolsSection.prepend(wrap);
  else {
    const fallback = document.querySelector('footer');
    if (fallback) fallback.before(wrap);
    else document.body.appendChild(wrap);
  }

  // 인덱스 페이지: 렌더 후 마지막 줄에 혼자 남은 카드 자동 제거
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
