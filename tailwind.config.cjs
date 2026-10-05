module.exports = {
  content: ['./index.html', './build.mjs', './pages/*.html', './data/*.json'],
  theme: { extend: {
    colors: { background: '#fefffe', foreground: '#0f172a', primary: '#1e293b', accent: '#b7833d', 'accent-dark': '#926725', muted: '#64748b' },
    fontFamily: { sans: ['Trebuchet MS', 'Helvetica', 'sans-serif'] }
  } }
};
