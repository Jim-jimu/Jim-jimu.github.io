document.documentElement.classList.add('js');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateAuthorToggles() {
  document.querySelectorAll('.publication-authors-shell').forEach(shell => {
    const authors = shell.querySelector('.publication-authors');
    const button = shell.querySelector('.publication-authors-toggle');
    if (!authors || !button || shell.closest('[data-publication]')?.hidden) return;
    const expanded = shell.classList.contains('expanded');
    shell.classList.remove('expanded');
    button.hidden = authors.scrollHeight <= authors.clientHeight + 1;
    shell.classList.toggle('expanded', expanded);
  });
}
document.querySelectorAll('.publication-authors-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.closest('.publication-authors-shell').classList.toggle('expanded');
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Collapse author list' : 'Expand author list');
    button.textContent = expanded ? '▼' : '▶';
  });
});

const filters = [...document.querySelectorAll('[data-filter]')];
const publications = [...document.querySelectorAll('[data-publication]')];
function applyFilter() {
  if (!filters.length) return;
  const requested = new URLSearchParams(location.search).get('filter') || 'all';
  const filter = filters.some(button => button.dataset.filter === requested) ? requested : 'all';
  filters.forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  publications.forEach(item => {
    item.hidden = filter === 'accepted' ? item.dataset.status !== 'accepted'
      : filter === 'first-author' ? item.dataset.first !== 'true'
      : filter === 'all' ? false : !item.dataset.topics.split(',').includes(filter);
    if (!item.hidden) count++;
  });
  const status = document.getElementById('filter-status');
  if (status) status.textContent = `${count} ${count === 1 ? 'work' : 'works'} shown`;
  updateAuthorToggles();
}
filters.forEach(button => button.addEventListener('click', () => {
  const url = new URL(location.href);
  if (button.dataset.filter === 'all') url.searchParams.delete('filter');
  else url.searchParams.set('filter', button.dataset.filter);
  history.pushState({}, '', url);
  applyFilter();
}));
window.addEventListener('popstate', applyFilter);
applyFilter();

const navLinks = [...document.querySelectorAll('.section-drip-nav a')];
const sectionNav = document.querySelector('.section-drip-nav');
const footer = document.querySelector('.mountain-footer');
const backToTop = document.getElementById('backToTop');
function updateScrollControls() {
  backToTop?.classList.toggle('visible', window.scrollY > 300);
  let current = navLinks[0];
  for (const link of navLinks) {
    if (document.querySelector(link.getAttribute('href'))?.getBoundingClientRect().top <= 160) current = link;
  }
  navLinks.forEach(link => {
    link.classList.toggle('active', link === current);
    if (link === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  if (sectionNav && footer) {
    sectionNav.classList.toggle('is-footer-visible', footer.getBoundingClientRect().top < sectionNav.getBoundingClientRect().bottom + 28);
  }
}
let scrollFrame;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => { updateScrollControls(); scrollFrame = null; });
}, { passive: true });
window.addEventListener('resize', () => { updateAuthorToggles(); updateScrollControls(); }, { passive: true });
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' }));
updateScrollControls();

let toastTimer;
function toast(message) {
  const element = document.getElementById('toast');
  if (!element) return;
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 2500);
}
async function copyText(text, message) {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else throw new Error('Clipboard unavailable');
    toast(message);
  } catch {
    toast('Copy unavailable. Please select and copy the text.');
  }
}
document.querySelector('.email-copy')?.addEventListener('click', () => copyText('yikejin02@gmail.com', 'Email address copied.'));
document.querySelector('.bio-copy')?.addEventListener('click', () => copyText('Yike Jin is pursuing a Bachelor of Engineering (B.Eng.) in Industrial Design at Zhejiang University. Research interests include GUI agents, multimodal large language models, and lifelong agent learning. Yike is seeking Ph.D. or M.S. opportunities in Computer Science for Fall 2027.', 'Short biography copied.'));

// Preserve links to sections from the previous homepage layout.
const legacySections = { '#educations': '#education', '#honors': '#awards', '#latest-news': '#news', '#contact': '.mountain-footer' };
if (legacySections[location.hash]) document.querySelector(legacySections[location.hash])?.scrollIntoView();
