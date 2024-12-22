import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@context', replacement: path.resolve(__dirname, 'src/context') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@storage', replacement: path.resolve(__dirname, 'src/storage') },
      { find: '@router', replacement: path.resolve(__dirname, 'src/router') },
    ],
  },
})
