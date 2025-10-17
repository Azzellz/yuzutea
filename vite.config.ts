import react from '@vitejs/plugin-react-swc'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [UnoCSS(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
