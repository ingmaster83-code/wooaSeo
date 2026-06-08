/**
 * wooa-footer-ja.js (JA)
 * <footer class="footer"> を共用 WooaHouse 4列フッターで埋めます。(日本語)
 * KO ページは wooa-footer.js、EN ページは wooa-footer-en.js を使用
 */
(function () {
  function init() {
    var t = document.querySelector('footer.footer');
    if (!t || t.children.length > 0) return;
    t.innerHTML =
      '<div class="footer-inner">' +
        '<div class="footer-grid">' +
          '<div class="footer-col">' +
            '<h4>🏠 WooaHouse</h4>' +
            '<p style="color:#9CA3AF;font-size:.84rem;line-height:1.6">インストール不要・ログイン不要<br>ブラウザでそのまま使える無料ツール集</p>' +
            '<a href="https://wooahouse.com" target="_blank" style="margin-top:10px;display:inline-block;color:#10B981;">wooahouse.com →</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>ドキュメント・メディア</h4>' +
            '<a href="https://pdfkit.wooahouse.com" target="_blank">📄 WooaPDF</a>' +
            '<a href="https://imagekit.wooahouse.com" target="_blank">🖼️ WooaImage</a>' +
            '<a href="https://wooaocr.wooahouse.com" target="_blank">🔍 WooaOCR</a>' +
            '<a href="https://wooaaudio.wooahouse.com" target="_blank">🎵 WooaAudio</a>' +
            '<a href="https://wooavideo.wooahouse.com" target="_blank">📹 WooaVideo</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Web・開発・計算</h4>' +
            '<a href="https://colorkit.wooahouse.com" target="_blank">🎨 WooaColor</a>' +
            '<a href="https://textkit.wooahouse.com" target="_blank">📝 WooaText</a>' +
            '<a href="https://qrkit.wooahouse.com" target="_blank">🔲 WooaQR</a>' +
            '<a href="https://calckit.wooahouse.com" target="_blank">🧮 WooaCalc</a>' +
            '<a href="https://wooaviewer.wooahouse.com" target="_blank">👁️ WooaViewer</a>' +
            '<a href="https://wooasheet.wooahouse.com" target="_blank">📊 WooaSheet</a>' +
            '<a href="https://wooadev.wooahouse.com" target="_blank">🛠️ WooaDev</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>情報</h4>' +
            '<a href="about.html">About</a>' +
            '<a href="privacy.html">プライバシーポリシー</a>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">&copy; 2026 WooaHouse. All rights reserved.</div>' +
      '</div>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
