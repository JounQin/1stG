import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const src = fileURLToPath(new URL('src', import.meta.url))

// The sources import from the project root ("App", "views/Home", "assets/github.png") rather than
// with relative paths, so those roots have to stay resolvable. tsconfig.json mirrors these paths.
const alias = {
  App: `${src}/App.tsx`,
  assets: `${src}/assets`,
  components: `${src}/components`,
  views: `${src}/views`,
}

// Renders the page into the built index.html. This has to be a plugin rather than a step in
// build/static.sh, because it must run before VitePWA's own closeBundle: otherwise the service
// worker precaches the copy that still has the placeholder in it, and offline navigation serves an
// empty shell. Plugin hooks run in array order, so this is listed before VitePWA.
function prerender(): Plugin {
  return {
    name: 'prerender',
    apply: 'build',
    async closeBundle() {
      // The SSR build runs first and lands here; see the build script. The specifier is built at
      // runtime because the config itself is bundled before dist/server exists, and a literal
      // relative specifier would be resolved (and fail) while loading this file.
      const { render } = (await import(
        pathToFileURL(path.resolve('dist/server/entry-server.mjs')).href
      )) as { render: () => string }

      const target = fileURLToPath(
        new URL('dist/static/index.html', import.meta.url),
      )
      const template = readFileSync(target, 'utf8')
      const rendered = template.replace('<!--app-html-->', render())

      if (rendered === template) {
        throw new Error(
          'index.html has no <!--app-html--> placeholder to fill in',
        )
      }

      writeFileSync(target, rendered)
    },
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    // The service worker belongs to the client build only; running it for the SSR build would
    // drop registerSW.js and the web manifest into dist/server.
    ...(isSsrBuild
      ? []
      : [
          prerender(),
          VitePWA({
            registerType: 'autoUpdate',
            // The old sw-precache setup cached cross-origin requests network-first; keep that.
            workbox: {
              globPatterns: ['**/*.{js,css,html,ico,png,webp,svg,woff2}'],
              runtimeCaching: [
                {
                  urlPattern: /^https?:\/\//,
                  handler: 'NetworkFirst',
                },
              ],
            },
          }),
        ]),
  ],
  resolve: { alias },
  css: {
    modules: {
      // Matches the previous css-loader setting: `styles.reactHn` for `.react-hn`.
      localsConvention: 'camelCase',
    },
  },
  build: {
    outDir: isSsrBuild ? 'dist/server' : 'dist/static',
    emptyOutDir: true,
    cssCodeSplit: false,
    // The webpack build inlined assets under 8KB via url-loader; keep the same threshold.
    assetsInlineLimit: 8192,
    rollupOptions: {
      output: {
        // A stable name, so build/prerender.mts can import it without globbing.
        entryFileNames: isSsrBuild
          ? 'entry-server.mjs'
          : 'assets/[name].[hash].js',
        // One vendor chunk and one app chunk, as the webpack build produced. Vite 8 bundles with
        // Rolldown, which only accepts the function form of manualChunks.
        manualChunks: isSsrBuild
          ? undefined
          : (id: string) =>
              id.includes('node_modules') ? 'vendors' : undefined,
      },
    },
  },
  ssr: {
    // React is bundled into the SSR output so the prerender needs no node_modules at runtime.
    noExternal: true,
  },
}))
