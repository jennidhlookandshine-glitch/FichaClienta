import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',   // o elimina esta línea, por defecto es '/'
  plugins: [react()],
})
