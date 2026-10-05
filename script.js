const menuButton = document.querySelector('.mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
function closeMenu() {
  menu?.classList.add('hidden');
  menuButton?.setAttribute('aria-expanded', 'false');
}
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  menu.classList.toggle('hidden', !expanded);
});
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
function highlightSection() {
  let current = navLinks[0];
  for (const link of navLinks) {
    const section = document.querySelector(link.getAttribute('href'));
    if (section && section.getBoundingClientRect().top <= 160) current = link;
  }
  navLinks.forEach(link => {
    link.classList.toggle('active', link === current);
    if (link === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', highlightSection, { passive: true });
highlightSection();

const filters = [...document.querySelectorAll('[data-filter]')];
const publications = [...document.querySelectorAll('[data-publication]')];
function applyFilter() {
  const requested = new URLSearchParams(location.search).get('filter') || 'all';
  const filter = ['all', 'first-author', 'accepted'].includes(requested) ? requested : 'all';
  filters.forEach(link => {
    const active = link.dataset.filter === filter;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  let count = 0;
  publications.forEach(item => {
    item.hidden = filter === 'accepted' ? item.dataset.status !== 'accepted' : filter === 'first-author' ? item.dataset.first !== 'true' : false;
    if (!item.hidden) count++;
  });
  const status = document.getElementById('filter-status');
  if (status) status.textContent = `${count} ${count === 1 ? 'work' : 'works'} shown`;
}
filters.forEach(link => link.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  history.pushState({}, '', link.href);
  applyFilter();
}));
window.addEventListener('popstate', applyFilter);
applyFilter();
