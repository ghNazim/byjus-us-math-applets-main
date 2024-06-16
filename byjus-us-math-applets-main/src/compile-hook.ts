import glob from 'fast-glob'
import { basename, dirname } from 'path'
import { CompileTimeFunctionResult } from 'vite-plugin-compile-time'

export default async (): Promise<CompileTimeFunctionResult> => {
  const entryPaths = await glob('src/applets/*/index.ts')
  return {
    data: entryPaths.map((p) => basename(dirname(p))),
    watchFiles: entryPaths,
  }
}
