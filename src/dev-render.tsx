import { createRoot } from 'react-dom/client'

import App from 'App'

// Only ever loaded by `entry-client.tsx` under `import.meta.env.DEV`. `vite dev` does not run the
// `prerender` plugin, so there the `<!--app-html-->` placeholder is still empty and something has
// to put the app there. This module is never part of a build.
const container = document.querySelector('#app')

if (!container) {
  throw new Error('#app is missing from index.html')
}

createRoot(container).render(<App />)
