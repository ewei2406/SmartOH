import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
      proxy: {
          '/api': {
              target: 'http://172.29.186.20:3000',
              changeOrigin: true,
              secure: false,    
              ws: true,
          }
      }
  }
})
