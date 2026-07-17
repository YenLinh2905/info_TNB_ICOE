document.querySelectorAll('.show-more-btn').forEach((button) => {
  const target = document.getElementById(button.dataset.showMore);
  if (!target) {
    return;
  }

  const moreLabel = button.textContent.trim();
  button.setAttribute('aria-expanded', 'false');

  button.addEventListener('click', () => {
    const isExpanded = target.classList.toggle('is-expanded');
    button.setAttribute('aria-expanded', String(isExpanded));
    button.textContent = isExpanded ? 'Thu gọn' : moreLabel;

    if (isExpanded) {
      // Move focus into the newly revealed content so keyboard/screen-reader
      // users land somewhere sensible.
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    } else {
      // Collapsing: the button itself may now be far below the still-visible
      // rows (e.g. a long table), so bring it back into view.
      button.scrollIntoView({ block: 'nearest' });
    }
  });
});
