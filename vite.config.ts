import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  // 도메인 루트에 배포합니다 (Vercel/Netlify 기본 방식).
  // 이전에는 해시 라우팅 + 상대경로('./')를 썼지만,
  // 이제 실제 경로 라우팅(/apps/xxx)을 쓰므로 절대경로가 필요합니다.
  // 상대경로로 두면 /apps/xxx 페이지를 새로고침할 때
  // 자산(JS/CSS) 경로가 /apps/assets/... 로 잘못 계산되어 깨집니다.
  base: '/',
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  plugins: [react()],
  server: { port: 5174 },
})
