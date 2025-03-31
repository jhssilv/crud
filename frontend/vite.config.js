import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Explicitly set your Vite port
    strictPort: true, // Don't try other ports if 5174 is taken
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Proxy error:', err)
          })
          proxy.on('proxyReq', (proxyReq) => {
            console.log('Proxying:', proxyReq.path)
          })
        }
      }
    }
  }
})