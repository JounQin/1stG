// Production serves a page that the `prerender` plugin in vite.config.ts already rendered to
// static HTML at build time: it fills the `<!--app-html-->` placeholder, and every interactive
// effect on it - the rotated grid, its borders, the hover reveals - is pure CSS. Hydrating that in
// production had nothing to take over, so it only tore the prerendered DOM down and rebuilt it,
// and the four grid squares' `transition`s replayed from their initial state: the flash on every
// load.
//
// `vite dev` never runs the prerender, so there the placeholder stays empty and the app really
// does have to render; `./dev-render` does that. The import is dynamic and this branch is
// statically dead in a build, so neither React nor the app reaches the production bundle. A static
// import would not work here: `App` pulls in a stylesheet, and Rollup has to keep a module with
// side effects even when nothing uses it.
if (import.meta.env.DEV) {
  void import('./dev-render')
}

// The root font size is the one piece of client behaviour production needs. The inline script in
// index.html already sets it before the first paint; this keeps it in sync afterwards.
const WIDTH_THRESHOLD = 900
const HEIGHT_THRESHOLD = 600

const resize = () => {
  // `globalThis.inner*` is the viewport. `documentElement.offsetHeight` would be the whole document
  // height once the page is rendered, which is not the same thing this is meant to measure.
  const { innerWidth, innerHeight } = globalThis

  document.documentElement.style.fontSize =
    innerWidth < WIDTH_THRESHOLD || innerHeight < HEIGHT_THRESHOLD
      ? Math.min(innerWidth / WIDTH_THRESHOLD, innerHeight / HEIGHT_THRESHOLD) *
          100 +
        'px'
      : ''
}

resize()
addEventListener('resize', resize)
