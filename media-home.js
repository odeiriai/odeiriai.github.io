(() => {
  'use strict';
  const dialog = document.getElementById('media-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const title = document.getElementById('media-dialog-title');
  const product = document.getElementById('media-dialog-product');
  const video = document.getElementById('dialog-video');
  const image = document.getElementById('dialog-image');
  let trigger = null;

  function resetMedia() {
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.hidden = true;
    image.hidden = true;
    image.removeAttribute('src');
    image.onload = null;
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-video], a[data-image]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    resetMedia();
    trigger = link;
    title.textContent = link.dataset.title || '画面と動画';
    product.textContent = link.dataset.product || '画像を拡大して表示しています。';
    dialog.dataset.orientation = link.dataset.orientation || 'landscape';
    if (link.hasAttribute('data-video')) {
      video.src = link.href;
      video.hidden = false;
      dialog.showModal();
      video.play().catch(() => { /* Native controls and the original media link remain available. */ });
    } else {
      image.alt = link.dataset.title || 'アプリの画面';
      image.onload = () => {
        dialog.dataset.orientation = image.naturalHeight > image.naturalWidth ? 'portrait' : 'landscape';
      };
      image.src = link.href;
      image.hidden = false;
      dialog.showModal();
    }
  });

  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    resetMedia();
    if (trigger && document.contains(trigger)) trigger.focus({ preventScroll: true });
    trigger = null;
  });
})();
