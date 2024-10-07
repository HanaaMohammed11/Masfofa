import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      css: {
        additionalData: '@import "./src/index.css";' // تأكد من استيراد ملف CSS الخاص بك
      },
    },
  },
});
