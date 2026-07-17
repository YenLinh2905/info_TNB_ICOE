const lightbox = document.querySelector('.image-lightbox');
const lightboxImage = document.querySelector('.image-lightbox__img');
const lightboxCaption = document.querySelector('.image-lightbox__caption');
const lightboxClose = document.querySelector('.image-lightbox__close');
let lastScrollTop = 0;
let lastScrollLeft = 0;
let lastTrigger = null;

function lockPageScroll() {
  document.body.dataset.scrollTop = String(lastScrollTop);
  document.body.dataset.scrollLeft = String(lastScrollLeft);
  document.body.style.position = 'fixed';
  document.body.style.top = `-${lastScrollTop}px`;
  document.body.style.left = `-${lastScrollLeft}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
}

function unlockPageScroll() {
  const scrollTop = Number(document.body.dataset.scrollTop || '0');
  const scrollLeft = Number(document.body.dataset.scrollLeft || '0');

  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  delete document.body.dataset.scrollTop;
  delete document.body.dataset.scrollLeft;

  window.scrollTo({
    top: scrollTop,
    left: scrollLeft,
    // 'instant' forces an immediate jump regardless of the page-wide
    // `scroll-behavior: smooth`. 'auto' would defer to that CSS setting
    // and animate the restore, which reads as the page "sliding" after
    // closing the lightbox.
    behavior: 'instant',
  });
}

function openLightbox(source, caption = '', options = {}) {
  const isTeamImage = Boolean(options.isTeamImage);

  lastScrollTop = window.scrollY || document.documentElement.scrollTop || 0;
  lastScrollLeft = window.scrollX || document.documentElement.scrollLeft || 0;
  lastTrigger = options.imageElement || null;

  lockPageScroll();
  lightboxImage.src = source;
  lightboxImage.alt = caption;
  lightboxImage.classList.toggle('team-image', isTeamImage);
  lightboxCaption.textContent = caption;

  if (typeof lightbox.showModal === 'function') {
    lightbox.showModal();
  } else {
    lightbox.setAttribute('open', '');
  }
}

function closeLightbox() {
  if (typeof lightbox.close === 'function' && lightbox.open) {
    lightbox.close();
  } else {
    lightbox.removeAttribute('open');
  }

  unlockPageScroll();

  if (lastTrigger && typeof lastTrigger.focus === 'function') {
    lastTrigger.focus({ preventScroll: true });
  }

  lightboxImage.removeAttribute('src');
  lightboxImage.alt = '';
  lightboxCaption.textContent = '';
  lastTrigger = null;
}

document.addEventListener('click', (event) => {
  // Only real trigger buttons open the lightbox now (keyboard-accessible:
  // native <button> gets Enter/Space activation for free). Plain <img>
  // elsewhere on the page - hero banner, header logo - are inert.
  const trigger = event.target.closest('.image-zoom-trigger');

  if (!trigger || lightbox.contains(trigger)) {
    return;
  }

  const imageElement = trigger.querySelector('img');
  if (!imageElement) {
    return;
  }

  // `data-full` (set by the {% image %} build-time shortcode) points at the
  // largest generated copy - the thumbnail's `currentSrc` may be a much
  // smaller responsive-image candidate chosen for its small on-page size.
  const source = imageElement.dataset.full || imageElement.currentSrc || imageElement.src;
  const caption = imageElement.alt || '';
  const isTeamImage = Boolean(trigger.closest('#team'));

  openLightbox(source, caption, {
    isTeamImage,
    // Focus returns to the trigger button (not the <img>, which was never
    // focusable) once the dialog is closed.
    imageElement: trigger,
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.open) {
    closeLightbox();
  }
});
