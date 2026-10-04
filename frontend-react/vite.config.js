import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // مجبورش می‌کنیم روی IPv4 گوش بده، نه IPv6 (::1)
    port: 5173,
    strictPort: true, // اگه پورت اشغال بود، بره سراغ پورت دیگه نره، خطا بده (تا گیج نشیم)
  },
})
