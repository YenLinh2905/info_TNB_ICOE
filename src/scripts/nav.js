const backToTop = document.querySelector('.back-to-top');

// Show/hide the "back to top" button once the page has been scrolled past
// one viewport height. Purely a visual enhancement - the button is a plain
// anchor (#page-top) and works even if this script fails to run.
if (backToTop) {
  const toggleBackToTop = () => {
    backToTop.classList.toggle('is-visible', window.scrollY > window.innerHeight);
  };
  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
}

// #page-top links (back-to-top button): scroll explicitly via JS instead of
// relying only on native anchor jump, which can be flaky when the target
// sits right at the very top of a page with sticky/fixed elements.
document.querySelectorAll('a[href="#page-top"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState(null, '', '#page-top');
  });
});
