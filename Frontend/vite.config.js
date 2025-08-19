import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/bolls': {
        target: 'https://bolls.life',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bolls/, ''),
        secure: false
      },
      '/api/bible': {
        target: 'https://api.scripture.api.bible/v1/bibles',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bible/, ''),
        headers: {
          'api-key': '2641dfc33a1910ef977df34e39c2fac0'
        }
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})