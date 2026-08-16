import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const projectDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(projectDir, 'node_modules/react'),
      'react-dom': path.resolve(projectDir, 'node_modules/react-dom'),
    },
  },
})