import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
    }),
    // Bundle analyzer - only run when ANALYZE env var is set
    process.env.ANALYZE && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Optimize bundle size
    cssCodeSplit: true, // Split CSS for better caching
    assetsInlineLimit: 4096, // Inline small assets as base64
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React dependencies - loaded on every page
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor';
          }
          // Router - needed for navigation
          if (id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
          // GSAP and animation libraries - used in multiple components
          if (id.includes('node_modules/gsap') || id.includes('node_modules/framer-motion')) {
            return 'animations';
          }
          // Supabase - separate chunk for better caching
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          // Vercel analytics - async load
          if (id.includes('node_modules/@vercel')) {
            return 'vercel';
          }
          // Utility libraries
          if (id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge') || id.includes('node_modules/class-variance-authority')) {
            return 'utils';
          }
          // Return undefined for other modules - let Rollup decide
          return undefined;
        },
        // Optimize asset naming
        assetFileNames: (assetInfo) => {
          if (/\.(webp|png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,  // Multiple passes for better optimization
      },
      mangle: {
        safari10: true,  // Fix Safari 10 issues
      },
      format: {
        comments: false,  // Remove all comments
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'gsap',
      '@supabase/supabase-js'
    ],
    // Exclude heavy dependencies that should be loaded separately
    exclude: ['@vercel/blob']
  },
  // Server optimizations
  server: {
    fs: {
      strict: false
    },
    // Warm up commonly used files for faster dev server
    warmup: {
      clientFiles: [
        './src/components/Landing.jsx',
        './src/components/Featured.jsx',
        './src/App.jsx'
      ]
    }
  }
})
