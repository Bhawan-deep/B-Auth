import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
     tailwindcss(),
    react(), viteStaticCopy({
      targets: [
        { src: 'public/_redirects', dest: '.' } // this ensures _redirects goes to dist/
      ]
    })],
    
     base: '/',
})
