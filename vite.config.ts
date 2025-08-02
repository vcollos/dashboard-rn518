import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./components"),
      "@/utils": path.resolve(__dirname, "./utils"),
      "@/hooks": path.resolve(__dirname, "./hooks"),
      "@/services": path.resolve(__dirname, "./services"),
      "@/styles": path.resolve(__dirname, "./styles"),
      "@/types": path.resolve(__dirname, "./types")
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', '@radix-ui/react-select', '@radix-ui/react-dialog'],
          charts: ['recharts'],
          supabase: ['@supabase/supabase-js']
        }
      }
    },
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'recharts',
      '@supabase/supabase-js'
    ]
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  css: {
    devSourcemap: true
  }
})