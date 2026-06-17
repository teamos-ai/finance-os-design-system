import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// Built on a network share (SMB) — usePolling makes the file watcher reliable
// when HMR can't see SMB change notifications.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
    // The project lives on an SMB share reached via a `subst` drive. Vite/rollup
    // realpath() resolves Q:\ back to the spaced (and mangled) UNC path and the
    // build fails. preserveSymlinks keeps the clean drive-letter path.
    preserveSymlinks: true,
  },
  server: {
    watch: { usePolling: true, interval: 300 },
  },
})
