import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/

export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        { src: '../manifest/manifest.json', dest: '' },
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        popup: 'src/popup.html',
      },
      output: {
        entryFileNames: '[name].js',
      }
    }
  }
});