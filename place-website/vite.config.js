import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                path: resolve(__dirname, 'index.html'),
            }
        }
    }
})