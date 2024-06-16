import glob from 'fast-glob'
import { basename, dirname } from 'path'
import { rimraf } from 'rimraf'
import { build } from 'vite'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

import baseConfig from './vite.config'

async function buildApplet(appletName: string) {
  const appletPath = `src/applets/${appletName}/index.ts`

  await build({
    plugins: [...baseConfig.plugins, libInjectCss()],
    assetsInclude: [...baseConfig.assetsInclude],
    define: { 'process.env.NODE_ENV': '"production"' },
    build: {
      lib: {
        entry: appletPath,
        name: appletName,
        formats: ['umd'],
        fileName: '[format]/index',
      },
      outDir: `dist/applets/${appletName}`,
      rollupOptions: {
        external: ['react', 'react-dom', 'styled-components'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'styled-components': 'styled',
          },
          interop: 'compat',
        },
      },
    },
    configFile: false,
  })
}

async function buildApplets(entryPaths?: string[]) {
  await rimraf('./dist')

  if (!entryPaths || entryPaths.length === 0) entryPaths = await glob('src/applets/*/index.ts')
  for (const entry of entryPaths) {
    // Extract the applet name from the entry path
    const entryDir = dirname(entry)
    const appletName = basename(entryDir)
    await buildApplet(appletName)
  }
}

// Make a cli with args giving the names of the changed files
const args = process.argv.slice(2).map((arg) => {
  if (arg.startsWith('src/applets')) return arg.split('/')[2]
  else return arg
})
buildApplets(args)
