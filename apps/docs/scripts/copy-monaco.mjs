import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const root = dirname(dirname(fileURLToPath(import.meta.url)))
const publicDir = join(root, 'public')
const dest = join(publicDir, 'monaco', 'vs')

let pkgPath
try {
  pkgPath = require.resolve('monaco-editor/package.json')
}
catch {
  console.warn('monaco-editor is not installed — skip copying Monaco assets')
  process.exit(0)
}

if (existsSync(join(dest, 'loader.js'))) {
  console.log('monaco: public/monaco/vs already present')
  process.exit(0)
}

const source = join(dirname(pkgPath), 'min', 'vs')
mkdirSync(dirname(dest), { recursive: true })
cpSync(source, dest, { recursive: true })
console.log('monaco: copied min/vs -> public/monaco/vs')
