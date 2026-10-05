import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';

const read = name => readFile(name, 'utf8');
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const publications = JSON.parse(await read('data/publications.json'));
const news = JSON.parse(await read('data/news.json'));
const honors = JSON.parse(await read('data/honors.json'));

function publication(pub) {
  const statusClass = pub.type === 'accepted' ? 'tag-conference' : 'tag-under-review';
  const links = (pub.tags || []).filter(tag => tag.link && tag.link !== '#').map(tag => `<a class="pub-link-btn" href="${escape(tag.link)}" target="_blank" rel="noopener noreferrer">${escape(tag.text)}</a>`).join('');
  return `<li class="pub-list-item" data-publication data-status="${escape(pub.type)}" data-first="${Boolean(pub.isFirstAuthor)}"><article class="pub-content-wrapper"><div class="pub-line-3 mb-3"><span class="pub-venue-tag ${statusClass}">${escape(pub.venue)}</span><span class="pub-year">${escape(pub.year)}</span></div><h3 class="pub-title-text mb-3">${escape(pub.title)}</h3><p class="pub-line-2">${pub.authors}</p><p class="pub-description">${escape(pub.description)}</p>${links ? `<div class="pub-line-4">${links}</div>` : ''}</article></li>`;
}
function renderNews(items) {
  return items.map(item => `<div class="news-item"><span class="news-date">${escape(item.date)}</span><div class="news-content">${item.content} ${(item.links || []).map(link => `<a href="${escape(link.url)}" target="_blank" rel="noopener noreferrer">${escape(link.text)}</a>`).join(' ')}</div></div>`).join('\n');
}
function renderHonors(items) {
  return items.map(item => `<div class="honor-item"><div class="honor-year">${escape(item.date)}</div><div class="honor-content"><h3>${escape(item.title)}</h3><p>${escape(item.description)}</p></div></div>`).join('\n');
}
const footer = `<footer class="site-footer border-t border-neutral-200"><div class="max-w-7xl mx-auto px-5 sm:px-8 py-7 flex flex-wrap justify-between gap-3 text-xs text-neutral-500"><p>© ${new Date().getUTCFullYear()} Yike Jin</p><p>Built with <a href="https://github.com/yihangtao/AcaNova-X" target="_blank" rel="noopener noreferrer">AcaNova-X</a> · <a href="https://github.com/Jim-jimu/Jim-jimu.github.io" target="_blank" rel="noopener noreferrer">Source</a></p></div></footer>`;

await rm('dist', { recursive: true, force: true });
await mkdir('dist/pages', { recursive: true });
await cp('assets', 'dist/assets', { recursive: true });
await cp('data', 'dist/data', { recursive: true });
await cp('styles.css', 'dist/styles.css');
await cp('script.js', 'dist/script.js');
let homepage = await read('index.html');
homepage = homepage.replace('<!-- NEWS -->', renderNews(news)).replace('<!-- HONORS -->', renderHonors(honors)).replace('<!-- PUBLICATIONS -->', publications.filter(pub => pub.showOnHomepage).sort((a, b) => a.featuredOrder - b.featuredOrder).map(publication).join('\n')).replace('<!-- FOOTER -->', footer);
await writeFile('dist/index.html', homepage);

function subpage(title, content, path, description) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} | Yike Jin</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="https://jinyike.dev/pages/${path}"><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../assets/tailwind.generated.css"><link rel="stylesheet" href="../styles.css"><script src="../script.js" defer></script></head><body class="bg-background text-foreground antialiased font-sans"><a class="skip-link" href="#main-content">Skip to content</a><nav class="top-nav glass fixed top-0 left-0 right-0 z-50" aria-label="Main navigation"><div class="max-w-7xl mx-auto px-5 sm:px-8 h-16 lg:h-20 flex justify-between items-center"><a href="../" class="font-sans text-2xl font-semibold text-primary">Yike Jin<span class="brand-dot">.</span></a><a href="../" class="text-sm text-neutral-600">← Back to homepage</a></div></nav><main id="main-content" class="content-container min-h-screen"><header class="mb-8"><p class="eyebrow mb-2">Yike Jin · Zhejiang University</p><h1 class="font-sans text-4xl font-bold text-primary">${escape(title)}</h1></header>${content}</main>${footer}</body></html>`;
}
const filters = `<p class="text-sm text-neutral-500">* Equal contribution. Manuscripts under review are labeled separately.</p><div class="publication-filters mb-4" aria-label="Filter publications"><a href="?filter=all" class="filter-link active" data-filter="all" aria-current="page">All works</a><a href="?filter=first-author" class="filter-link" data-filter="first-author">First / co-first author</a><a href="?filter=accepted" class="filter-link" data-filter="accepted">Published / accepted</a></div><p id="filter-status" class="text-xs text-neutral-500 mb-6" role="status" aria-live="polite">${publications.length} works shown</p><ul class="pub-list-ul">${publications.map(publication).join('\n')}</ul>`;
await writeFile('dist/pages/all-publications.html', subpage('Publications & Manuscripts', filters, 'all-publications.html', 'Publications and manuscripts by Yike Jin, including GUIHub, MethodMate, and research on LLM sycophancy.'));
await writeFile('dist/pages/all-news.html', subpage('News', `<div class="news-list space-y-5">${renderNews(news)}</div>`, 'all-news.html', 'Research news and updates from Yike Jin.'));
await writeFile('dist/pages/all-honors.html', subpage('Honors & Awards', renderHonors(honors), 'all-honors.html', 'Selected honors and awards received by Yike Jin.'));
await writeFile('dist/CNAME', 'jinyike.dev\n');
await writeFile('dist/.nojekyll', '');
await writeFile('dist/robots.txt', 'User-agent: *\nAllow: /\nSitemap: https://jinyike.dev/sitemap.xml\n');
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['', 'pages/all-publications.html', 'pages/all-news.html', 'pages/all-honors.html'].map(path => `<url><loc>https://jinyike.dev/${path}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/404.html', '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Yike Jin</title><style>body{font:18px/1.7 "Trebuchet MS",Helvetica,sans-serif;color:#1e293b;max-width:600px;margin:15vh auto;padding:24px}a{color:#926725}</style></head><body><h1>Page not found</h1><p>Looking for an older article? My notes have moved to a new home.</p><p><a href="/jimjimu-notes/">Visit Jimjimu Notes →</a></p><p><a href="/">Return to my academic homepage →</a></p><script>const p=location.pathname;if([\'blog\',\'gallery\',\'projects\',\'tags\',\'about\'].includes(p.split(\'/\')[1]))location.replace(\'/jimjimu-notes\'+p+location.search+location.hash);</script></body></html>');
console.log(`Built homepage, ${publications.length} publications, ${honors.length} awards, and archive pages.`);
