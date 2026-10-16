import { existsSync, readFileSync, statSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const extensions = ['.ts', '.tsx', '.mjs', '.js', '.json']

function isFile(path) {
  return existsSync(path) && statSync(path).isFile()
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    const parent = context.parentURL ? fileURLToPath(context.parentURL) : process.cwd()
    const base = specifier.startsWith('/') ? specifier : join(dirname(parent), specifier)
    const candidates = [base, ...extensions.map(extension => base + extension)]
    for (const candidate of candidates) {
      if (!isFile(candidate))
        continue
      if (candidate.endsWith('.ts') || candidate.endsWith('.tsx'))
        return { url: pathToFileURL(candidate).href, shortCircuit: true, format: 'module' }
      return nextResolve(pathToFileURL(candidate).href, context)
    }
  }
  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  if (url.endsWith('.ts') || url.endsWith('.tsx')) {
    const source = stripTypeScriptTypes(readFileSync(fileURLToPath(url), 'utf8'), { mode: 'strip' })
    return { format: 'module', source, shortCircuit: true }
  }
  return nextLoad(url, context)
}
