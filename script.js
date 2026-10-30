// Theme: an explicit choice is remembered, otherwise the OS setting applies
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
  const root = document.documentElement;
  const isDark = root.dataset.theme
    ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = isDark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

// Mobile menu
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.getElementById('nav-links');
const setMenu = (open) => {
  navLinks.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('is-open')));
navLinks.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Highlight the nav item for the section in view
const links = [...navLinks.querySelectorAll('a')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((a) => {
      const current = a.getAttribute('href') === `#${entry.target.id}`;
      if (current) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });
links.forEach((a) => {
  const target = document.querySelector(a.getAttribute('href'));
  if (target) spy.observe(target);
});

// Reveal content once as it scrolls into view
const reveal = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    reveal.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach((el) => reveal.observe(el));

// Copy email, with a status message screen readers announce
const copyBtn = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.email);
    copyStatus.textContent = 'Email address copied.';
  } catch (e) {
    copyStatus.textContent = copyBtn.dataset.email;
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
