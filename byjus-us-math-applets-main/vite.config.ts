import react from '@vitejs/plugin-react'
import { UserConfig } from 'vite'
import compileTime from 'vite-plugin-compile-time'
import tsconfigPaths from 'vite-tsconfig-paths'
// https://vitejs.dev/config/
export default {
  base: './',
  plugins: [react(), tsconfigPaths(), compileTime()],
  assetsInclude: ['**/*.riv'],
} satisfies UserConfig
