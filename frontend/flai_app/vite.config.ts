import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'

// https://vitejs.dev/config/
export default () => {
  dotenv.config()

  return defineConfig({
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: `${process.env.REST_HOSTNAME}:${process.env.REST_PORT}/`,
          changeOrigin: true,
        },
      },
    },
  })
}
