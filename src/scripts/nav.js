const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');
const backToTop = document.querySelector('.back-to-top');
const siteHeader = document.querySelector('.site-header');

function closeNav() {
  siteNav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

function toggleNav() {
  const isOpen = siteNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', toggleNav);

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
      closeNav();
      navToggle.focus();
    }
  });
}

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

// #page-top links (logo + back-to-top button): scroll explicitly via JS
// instead of relying only on native anchor jump. Anchor-only navigation to
// an id sitting right behind a `position: sticky` header can be a no-op in
// some browsers, since the sticky element is treated as already in view.
document.querySelectorAll('a[href="#page-top"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState(null, '', '#page-top');
  });
});

// Highlight the nav link matching the section currently in view.
// Progressive enhancement - navigation works via plain anchors without this.
if (siteNav && 'IntersectionObserver' in window) {
  const navLinks = new Map();
  siteNav.querySelectorAll('a[href^="#"]').forEach((link) => {
    navLinks.set(link.getAttribute('href').slice(1), link);
  });

  const sections = [...navLinks.keys()].map((id) => document.getElementById(id)).filter(Boolean);

  const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
  const visibleSectionIds = new Set();

  function updateActiveLink() {
    // Several sections can be inside the detection band at once (e.g. a
    // short section right after a long one). The correct match is the
    // LAST one in document order among those currently visible - i.e.
    // the section whose heading most recently crossed the top line.
    let activeId = null;
    for (const section of sections) {
      if (visibleSectionIds.has(section.id)) {
        activeId = section.id;
      }
    }
    navLinks.forEach((link, id) => {
      link.classList.toggle('is-active', id === activeId);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSectionIds.add(entry.target.id);
        } else {
          visibleSectionIds.delete(entry.target.id);
        }
      });
      updateActiveLink();
    },
    {
      rootMargin: `-${headerHeight + 1}px 0px -50% 0px`,
      threshold: 0,
    },
  );

  sections.forEach((section) => observer.observe(section));
}
