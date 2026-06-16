import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  css: {
    // 禁用默认的 CSS 压缩器，防止它吞掉 backdrop-filter 多值之间的空格
    // 例如 blur(12px) brightness(0.7) 被压缩成 blur(12px)brightness(.7) 导致浏览器无法解析
    postcss: './postcss.config.js',
  },
  build: {
    cssMinify: false,
  },
})
