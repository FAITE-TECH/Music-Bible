import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server:{
    proxy:{
      '/api':{
        target:'http://46.202.163.146:5000',
        secure:true,
        changeOrigin:true
      }
    }
  }

 
})