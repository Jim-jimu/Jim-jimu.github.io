# Yike Jin — Academic Homepage

Personal academic homepage of Yike Jin, an undergraduate at Zhejiang University.

- Website: https://jinyike.dev/
- GitHub Pages: https://jim-jimu.github.io/ (redirects to the custom domain)
- Personal blog: https://jinyike.dev/jimjimu-notes/
- Blog repository and original history: https://github.com/Jim-jimu/jimjimu-notes

Based on [AcaNova-X](https://github.com/yihangtao/AcaNova-X), with its two-column profile, research cards, publication list, and gold/slate visual style. Template source revision: `39b5544`. The homepage uses local styles, scripts, images, and system fonts at runtime. Typography follows [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io): `Trebuchet MS`, with `Helvetica` and `sans-serif` fallbacks for both headings and body text.

## Update content

| Content | Source |
| --- | --- |
| Profile, research, education, patent, contact | `index.html` |
| Publications and manuscripts | `data/publications.json` |
| News | `data/news.json` |
| Awards | `data/honors.json` |
| Avatar and university emblem | `assets/` |
| Styling | `styles.css`, `tailwind.config.cjs` |
| Page generation and archive pages | `build.mjs` |

Publication entries support `type` (`accepted` or `under-review`), `isFirstAuthor`, `showOnHomepage`, `featuredOrder`, and real resource links in `tags`. The homepage labels work under review explicitly. Ongoing work is shown separately in the research section. Keep publication status and research claims current when editing. News content and publication authors allow trusted HTML such as `<strong>`.

## Preview and deploy

Requires Node.js 22 or later.

```sh
npm ci
npm run check
npm run build
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173/. Pushing to `main` builds the site and deploys `dist/` through GitHub Actions. Configure GitHub Pages to use **GitHub Actions** and set its custom domain to `jinyike.dev`. DNS for the domain remains pointed at GitHub Pages.

The build renders publications, news, and awards into static HTML, so the academic content remains available without JavaScript. JavaScript adds mobile navigation and publication filters. The 404 page forwards older blog, gallery, project, and tag URLs to the migrated blog.

## Credits

- [AcaNova-X](https://github.com/yihangtao/AcaNova-X) by Yihang Tao: original academic homepage template and base stylesheet.
- Personal content and avatar adapted from the previous Jimjimu website and the owner's supplied CV.
- [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io): reference for the sans-serif font stack.
