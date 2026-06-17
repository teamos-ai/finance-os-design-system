import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider } from './lib/theme'

// Self-hosted brand faces — Spline Sans (display) + Anonymous Pro (body/mono).
// No external (Google Fonts) dependency: faster, offline, private, deploy-safe.
import '@fontsource/spline-sans/latin-400.css'
import '@fontsource/spline-sans/latin-500.css'
import '@fontsource/spline-sans/latin-600.css'
import '@fontsource/spline-sans/latin-700.css'
import '@fontsource/anonymous-pro/latin-400.css'
import '@fontsource/anonymous-pro/latin-400-italic.css'
import '@fontsource/anonymous-pro/latin-700.css'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
