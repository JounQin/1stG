import { hydrateRoot } from 'react-dom/client'

import App from 'App'

const container = document.querySelector('#app')

if (!container) {
  throw new Error('#app is missing from index.html')
}

hydrateRoot(container, <App />)
