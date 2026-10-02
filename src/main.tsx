import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'

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

/* Two surfaces. `/` is the showcase (one long scroll, anchor nav). `/audit` is the client
   audit instrument, which runs full-screen with none of the showcase chrome — on a client
   call the only thing on screen should be the conversation.

   The audit carries its own question bank, which is most of the bundle, so it is split out:
   the showcase never downloads it, and the audit never downloads the showcase.

   BrowserRouter rather than HashRouter because the showcase's own nav is anchor-based
   (`#color`, `#components`) and a hash router would fight it. Deep links need the SPA
   rewrite in vercel.json. */
const Audit = React.lazy(() =>
  import('./audit/Audit').then((m) => ({ default: m.Audit })),
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/audit"
          element={
            <React.Suspense fallback={<div className="min-h-screen bg-canvas" />}>
              <Audit />
            </React.Suspense>
          }
        />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
