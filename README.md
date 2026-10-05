# Yike Jin — Academic Homepage

Personal academic homepage of Yike Jin, an undergraduate at Zhejiang University.

- Website: https://jinyike.dev/
- GitHub Pages: https://jim-jimu.github.io/ (redirects to the custom domain)
- Personal blog: https://jinyike.dev/jimjimu-notes/
- Blog repository and original history: https://github.com/Jim-jimu/jimjimu-notes

Adapted from [w-r-s/academic-homepage-template](https://github.com/w-r-s/academic-homepage-template), revision `3e688b9cdb8928aa90ce2469b932cd4661723f97`. It retains the template's compact 800px layout, profile and portrait, orange accents, date badges, publication cards, topic filters, author expansion, and landscape footer. The site uses the owner's preferred sans-serif stack: `Trebuchet MS`, `Helvetica`, `sans-serif`.

## Update content

| Content | Source |
| --- | --- |
| Profile, research, education, patent, contact | `index.html` |
| Publications and manuscripts | `data/publications.json` |
| News | `data/news.json` |
| Awards | `data/honors.json` |
| Avatar and university emblem | `assets/` |
| Publication figures | `assets/publications/` |
| Template footer imagery | `assets/landscape/` |
| Styling | `styles.css` |
| Page generation and archive pages | `build.mjs` |
| Filters, author expansion, copy buttons, section navigation | `script.js` |

Publication entries retain their acceptance/review status and authorship. `topics` controls the subject filters; `isFirstAuthor` includes co-first authors. `image`, `imageAlt`, `imageWidth`, and `imageHeight` display a supplied paper figure with a link to the full-size image. Without an image, `shortTitle` and `topic` form the typographic cover panels. Add real links under `tags`; no placeholder links are displayed. Author lists and news content accept trusted HTML such as `<strong>`.

## Preview and deploy

Requires Node.js 22 or later; no external packages or runtime CDNs are needed.

```sh
npm ci
npm run check
npm run build
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173/. Pushing to `main` builds and deploys `dist/` through GitHub Actions. GitHub Pages uses **GitHub Actions**, with custom domain `jinyike.dev`.

Academic content is rendered into static HTML and remains readable without JavaScript. The legacy publication/news/awards URLs remain available with the new design. The 404 page continues forwarding old blog, gallery, project, and tag URLs to the migrated blog.

## Credits

- [w-r-s/academic-homepage-template](https://github.com/w-r-s/academic-homepage-template): layout, base styles, publication presentation, and footer imagery.
- [AcadHomepage](https://github.com/RayeRen/acad-homepage.github.io): reference for the owner's preferred sans-serif font stack.
- Personal content and avatar: the owner's previous website and supplied CV.

The earlier AcaNova-X version is retained in the repository's Git history.
