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
    // preserveSymlinks defeats Vite's automatic React deduping, which lets a
    // dependency (react-router-dom) pre-bundle against a second React copy and
    // throws "Invalid hook call" at runtime. Pin them explicitly.
    dedupe: ['react', 'react-dom'],
  },
  // Pre-bundle the router with everything else so it shares one React instance.
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', 'react-router-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        // Split heavy vendors AND the biggest app feature-families into their own chunks so the
        // entry JS stays small and each area caches independently. Two hard rules:
        //   1. the whole React ecosystem MUST stay in ONE chunk (one React instance) — never
        //      separate react / react-dom / react-router, or the dedupe above can't prevent
        //      "Invalid hook call". It is matched first and broadly below.
        //   2. shared DS primitives (components/ui + lib) live in ONE leaf chunk (`ds-core`) that
        //      the entry and every feature chunk import — so no feature chunk imports back into the
        //      entry, which would be a circular chunk dependency and risk init-order crashes.
        manualChunks(id) {
          const n = id.replace(/\\/g, '/')
          if (n.includes('/node_modules/')) {
            if (/\/node_modules\/(react|react-dom|react-router|react-router-dom|@remix-run|scheduler|use-sync-external-store|react-is)\//.test(n))
              return 'react-vendor'
            if (/\/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(n)) return 'motion'
            if (n.includes('/node_modules/lucide-react/')) return 'icons'
            return 'vendor'
          }
          // Shared design-system core — imported by the entry and by every feature chunk (leaf).
          if (n.includes('/src/components/ui/') || n.includes('/src/lib/')) return 'ds-core'
          // Heavy, leaf feature implementations (each imports ds-core; only its section imports it).
          if (n.includes('/src/components/calculators/')) return 'feat-calculators'
          if (n.includes('/src/components/lead-magnets/')) return 'feat-leadmagnets'
          if (
            n.includes('/src/components/positioning-hero/') ||
            n.includes('/src/components/section-folders/') ||
            n.includes('/src/components/scroll-blue/') ||
            n.includes('/src/components/this-vs-that/') ||
            n.includes('/src/components/dashboards/') ||
            n.includes('/src/components/platform-dashboard/')
          )
            return 'feat-positioning'
          if (n.includes('/src/components/emails/') || n.includes('/src/components/signature/')) return 'feat-comms'
          // everything else (App, showcase section glue, data, brand) → the entry chunk
        },
      },
    },
  },
  server: {
    watch: { usePolling: true, interval: 300 },
  },
})
