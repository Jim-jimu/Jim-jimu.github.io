import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';

const read = name => readFile(name, 'utf8');
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const publications = JSON.parse(await read('data/publications.json'));
const news = JSON.parse(await read('data/news.json'));
const honors = JSON.parse(await read('data/honors.json'));

function publication(pub, index, prefix = '') {
  const links = (pub.tags || []).filter(tag => tag.link && tag.link !== '#').map(tag => `<a href="${escape(tag.link)}" target="_blank" rel="noopener noreferrer">${escape(tag.text)}</a>`).join('');
  const paperLink = (pub.tags || []).find(tag => tag.link && tag.link !== '#')?.link;
  const title = paperLink ? `<a href="${escape(paperLink)}" target="_blank" rel="noopener noreferrer">${escape(pub.title)}</a>` : escape(pub.title);
  const visualClass = pub.shortTitle === 'MethodMate' ? 'topic-hci' : pub.shortTitle === 'LLM Sycophancy' ? 'topic-decisions' : '';
  const visual = pub.image
    ? `<a class="publication-visual publication-figure" href="${escape(prefix + pub.image)}" target="_blank" rel="noopener noreferrer" aria-label="View ${escape(pub.shortTitle)} figure at full size"><img src="${escape(prefix + pub.image)}" alt="${escape(pub.imageAlt)}" width="${escape(pub.imageWidth)}" height="${escape(pub.imageHeight)}" loading="lazy" decoding="async"></a>`
    : `<div class="publication-visual ${visualClass}" aria-hidden="true"><span class="paper-wordmark">${escape(pub.shortTitle)}</span><span class="paper-topic">${escape(pub.topic)}</span></div>`;
  return `<article class="publication-card" data-publication data-status="${escape(pub.type)}" data-first="${Boolean(pub.isFirstAuthor)}" data-topics="${escape((pub.topics || []).join(','))}">
    ${visual}
    <div class="publication-content"><h3 class="paper-title">${title}</h3><div class="publication-authors-shell"><div class="publication-authors" id="authors-${index}">${pub.authors}</div><button class="publication-authors-toggle" type="button" aria-controls="authors-${index}" aria-expanded="false" aria-label="Expand author list" hidden>▶</button></div>${links ? `<div class="publication-links">${links}</div>` : ''}<p class="publication-venue">${escape(pub.venue)}${pub.venue.includes(pub.year) ? '' : ` · ${escape(pub.year)}`}</p><p class="publication-description">${escape(pub.description)}</p></div>
  </article>`;
}
function renderNews(items) {
  return items.map(item => `<li class="news-entry"><span class="news-date-badge">${escape(item.date)}</span> ${item.content} ${(item.links || []).map(link => `<a href="${escape(link.url)}" target="_blank" rel="noopener noreferrer">${escape(link.text)}</a>`).join(' ')}</li>`).join('\n');
}
function renderHonors(items) {
  return items.map(item => `<li><span class="news-date-badge">${escape(item.date)}</span> <strong>${escape(item.title)}</strong><span class="award-detail">${escape(item.description)}</span></li>`).join('\n');
}
function filters(items) {
  const options = [
    ['all', 'All', () => true],
    ['gui', 'GUI Agents', pub => pub.topics.includes('gui')],
    ['hci', 'Human–AI Interaction', pub => pub.topics.includes('hci')],
    ['first-author', 'First / co-first', pub => pub.isFirstAuthor],
    ['accepted', 'Published / accepted', pub => pub.type === 'accepted']
  ];
  return `<div class="tag-filter" role="group" aria-label="Filter publications">${options.map(([key, label, match]) => `<button type="button" class="tag-btn${key === 'all' ? ' active' : ''}" data-filter="${key}" aria-pressed="${key === 'all'}">${label}<span class="tag-count" aria-hidden="true">${items.filter(match).length}</span></button>`).join('')}</div><p id="filter-status" class="visually-hidden" role="status" aria-live="polite">${items.length} works shown</p>`;
}
const date = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Shanghai', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());
function footer(prefix = '') {
  return `<footer class="mountain-footer" aria-label="Contact and credits"><div class="mountain-stage"><picture><source type="image/webp" srcset="${prefix}assets/landscape/background-960.webp 960w, ${prefix}assets/landscape/background-1440.webp 1440w, ${prefix}assets/landscape/background-1920.webp 1920w" sizes="100vw"><img class="mountain-img" src="${prefix}assets/landscape/background.jpeg" alt="A planet’s illuminated horizon against space" loading="lazy" decoding="async" width="1920" height="1080"></picture><div class="mountain-content"><h2>Keep Exploring</h2><p class="mountain-sub">Learning to build agents that keep learning.</p><a href="mailto:yikejin02@gmail.com" class="mountain-cta"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span>Get in Touch</span></a><p class="mountain-footnote"><span>Yike Jin · Zhejiang University</span><span class="mountain-updated">Last updated: ${date}.</span><span class="mountain-template">Template by <a href="https://github.com/w-r-s/academic-homepage-template" target="_blank" rel="noopener noreferrer">w-r-s</a> · <a href="https://github.com/Jim-jimu/Jim-jimu.github.io" target="_blank" rel="noopener noreferrer">Source</a></span></p></div></div></footer>`;
}
const controls = '<button id="backToTop" type="button" aria-label="Back to top" title="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg></button><div id="toast" class="toast-message" role="status" aria-live="polite"></div>';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/pages', { recursive: true });
await cp('assets', 'dist/assets', { recursive: true });
await cp('data', 'dist/data', { recursive: true });
await cp('styles.css', 'dist/styles.css');
await cp('script.js', 'dist/script.js');
const featured = publications.filter(pub => pub.showOnHomepage).sort((a, b) => a.featuredOrder - b.featuredOrder);
let homepage = await read('index.html');
homepage = homepage.replace('<!-- NEWS -->', renderNews(news)).replace('<!-- HONORS -->', renderHonors(honors)).replace('<!-- FILTERS -->', filters(featured)).replace('<!-- PUBLICATIONS -->', featured.map((pub, index) => publication(pub, index)).join('\n')).replace('<!-- FOOTER -->', footer()).replace('<!-- CONTROLS -->', controls);
await writeFile('dist/index.html', homepage);

function subpage(title, content, path, description) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} | Yike Jin</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="https://jinyike.dev/pages/${path}"><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../styles.css"><script src="../script.js" defer></script></head><body><a class="skip-link" href="#main-content">Skip to content</a><main id="main-content" class="page-shell archive-shell"><header class="archive-header"><a href="../">← Yike Jin · Homepage</a><br><h1 class="section-heading">${escape(title)}</h1></header>${content}</main>${footer('../')}${controls}</body></html>`;
}
await writeFile('dist/pages/all-publications.html', subpage('Publications & Manuscripts', `<p>* Equal contribution. Work under review is labeled below.</p>${filters(publications)}<div class="publications-list">${publications.map((pub, index) => publication(pub, index, '../')).join('\n')}</div>`, 'all-publications.html', 'Publications and manuscripts by Yike Jin, including GUIHub, MethodMate, and research on LLM sycophancy.'));
await writeFile('dist/pages/all-news.html', subpage('News', `<ul class="news-entries">${renderNews(news)}</ul>`, 'all-news.html', 'Research news and updates from Yike Jin.'));
await writeFile('dist/pages/all-honors.html', subpage('Awards and Honors', `<ul class="awards-list">${renderHonors(honors)}</ul>`, 'all-honors.html', 'Selected honors and awards received by Yike Jin.'));
await writeFile('dist/CNAME', 'jinyike.dev\n');
await writeFile('dist/.nojekyll', '');
await writeFile('dist/robots.txt', 'User-agent: *\nAllow: /\nSitemap: https://jinyike.dev/sitemap.xml\n');
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['', 'pages/all-publications.html', 'pages/all-news.html', 'pages/all-honors.html'].map(path => `<url><loc>https://jinyike.dev/${path}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/404.html', '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Yike Jin</title><style>body{font:18px/1.7 "Trebuchet MS",Helvetica,sans-serif;color:#111;max-width:600px;margin:15vh auto;padding:24px}a{color:#ae6600}</style></head><body><h1>Page not found</h1><p>The page you are looking for could not be found.</p><p><a href="/">Return to my academic homepage →</a></p><script>const p=location.pathname;if([\'blog\',\'gallery\',\'projects\',\'tags\',\'about\'].includes(p.split(\'/\')[1]))location.replace(\'/jimjimu-notes\'+p+location.search+location.hash);</script></body></html>');
console.log(`Built w-r-s homepage, ${publications.length} publications, ${honors.length} awards, and archive pages.`);
