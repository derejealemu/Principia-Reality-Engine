import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'strip-import-map',
      transformIndexHtml(html) {
        // Automatically remove the importmap if the environment re-injects it
        return html.replace(/<script type="importmap">[\s\S]*?<\/script>/, '');
      }
    }
  ],
})