import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
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

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    // The service worker belongs to the client build only; running it for the SSR build would
    // drop registerSW.js and the web manifest into dist/server.
    ...(isSsrBuild
      ? []
      : [
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
