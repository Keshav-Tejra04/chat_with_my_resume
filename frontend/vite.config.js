import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        // Optional: Proxy API requests to backend during dev if you want to avoid CORS issues
        proxy: {
            '/api': 'http://localhost:8000'
        }
    }
})