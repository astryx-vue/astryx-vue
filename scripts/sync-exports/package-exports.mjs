// 维护 `packages/core/package.json` 的 `exports` 和 `publishConfig.exports`。
// 只局部替换这两个字段的 JSON 文本，文件其余部分的写法原样保留。
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { componentDirs } from './source-layout.mjs'

const STATIC_EXPORT_KEYS = new Set([
  './package.json',
  './reset.css',
  './styles.css',
])

function standardComponentExport(dir) {
  return {
    source: `./src/${dir}/index.ts`,
    types: `./dist/${dir}/index.d.ts`,
    import: `./dist/${dir}/index.js`,
  }
}

function sourceFileExists(rootDir, entry) {
  if (entry == null || typeof entry !== 'object' || Array.isArray(entry))
    return true
  if (typeof entry.source !== 'string')
    return true
  return existsSync(join(rootDir, 'packages/core', entry.source))
}

function withoutSource(entry) {
  if (entry == null || typeof entry !== 'object' || Array.isArray(entry))
    return entry
  if (!Object.hasOwn(entry, 'source'))
    return entry
  const next = { ...entry }
  delete next.source
  return next
}

function publishedExports(exportsObject) {
  const result = {}
  for (const [key, value] of Object.entries(exportsObject))
    result[key] = withoutSource(value)
  return result
}

function publishConfigFor(json, exportsObject) {
  const current = { ...(json.publishConfig ?? {}) }
  const access = current.access
  delete current.access
  delete current.exports
  const next = {}
  if (access !== undefined)
    next.access = access
  Object.assign(next, current)
  next.exports = publishedExports(exportsObject)
  return next
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

/** 按两格缩进序列化，续行再多缩进一层，好嵌在顶层字段的位置。 */
function serializeJsonValue(value) {
  const lines = JSON.stringify(value, null, 2).split('\n')
  return lines.map((line, index) => index === 0 ? line : `  ${line}`).join('\n')
}

/** 找到顶层字段 `key` 的对象值在文本里的起止位置。 */
function findJsonValue(text, key) {
  const token = `"${key}":`
  const keyAt = text.indexOf(token)
  if (keyAt < 0)
    throw new Error(`package.json 里没有 ${key}`)
  let index = keyAt + token.length
  while (text[index] === ' ' || text[index] === '\n' || text[index] === '\r')
    index += 1
  if (text[index] !== '{')
    throw new Error(`${key} 不是对象`)
  const start = index
  let depth = 0
  let inString = false
  let escaped = false
  for (; index < text.length; index += 1) {
    const char = text[index]
    if (inString) {
      if (escaped)
        escaped = false
      else if (char === '\\')
        escaped = true
      else if (char === '"')
        inString = false
      continue
    }
    if (char === '"') {
      inString = true
    }
    else if (char === '{') {
      depth += 1
    }
    else if (char === '}') {
      depth -= 1
      if (depth === 0)
        return { start, end: index + 1 }
    }
  }
  throw new Error(`${key} 没有正常结束`)
}

function replaceJsonValue(text, key, value) {
  const location = findJsonValue(text, key)
  return `${text.slice(0, location.start)}${serializeJsonValue(value)}${text.slice(location.end)}`
}

function replaceOrInsertTopLevel(text, key, value) {
  if (text.includes(`"${key}":`))
    return replaceJsonValue(text, key, value)
  const trimmed = text.replace(/\s*$/, '')
  if (!trimmed.endsWith('}'))
    throw new Error('package.json 没有以 } 结束')
  const body = trimmed.slice(0, -1).trimEnd()
  const comma = body.endsWith(',') ? '' : ','
  return `${body}${comma}\n  "${key}": ${serializeJsonValue(value)}\n}\n`
}

/** 返回 `{ file, text, changed }`。`changed` 为 false 时 `text` 就是原文。 */
export function renderPackageExports(rootDir) {
  const file = join(rootDir, 'packages/core/package.json')
  const text = readFileSync(file, 'utf8')
  const json = JSON.parse(text)
  const current = json.exports ?? {}
  const keys = Object.keys(current)
  const dirs = componentDirs(rootDir)

  for (const dir of dirs) {
    const key = `./${dir}`
    if (keys.includes(key))
      continue
    const rank = dir.toLowerCase()
    const index = keys.findIndex(existing => !STATIC_EXPORT_KEYS.has(existing)
      && existing !== '.'
      && existing.startsWith('./')
      && existing.slice(2).toLowerCase() > rank)
    const staticIndex = keys.findIndex(existing => STATIC_EXPORT_KEYS.has(existing))
    keys.splice(index === -1 ? (staticIndex === -1 ? keys.length : staticIndex) : index, 0, key)
  }

  const exportsObject = {}
  if (!keys.includes('.'))
    keys.unshift('.')

  for (const key of keys) {
    if (key === '.') {
      exportsObject[key] = current[key] ?? {
        source: './src/index.ts',
        types: './dist/index.d.ts',
        import: './dist/index.js',
      }
      continue
    }
    const dir = key.startsWith('./') ? key.slice(2) : ''
    if (dirs.includes(dir)) {
      const standard = standardComponentExport(dir)
      exportsObject[key] = current[key] && sameJson(current[key], standard) ? current[key] : standard
      continue
    }
    // 源文件已经不在的条目（例如还没实现的组件）不要继续留在 exports 里。
    if (current[key] !== undefined && sourceFileExists(rootDir, current[key]))
      exportsObject[key] = current[key]
  }

  const nextPublishConfig = publishConfigFor(json, exportsObject)
  const exportsChanged = !sameJson(exportsObject, current)
  const publishChanged = !sameJson(nextPublishConfig, json.publishConfig ?? {})
  if (!exportsChanged && !publishChanged)
    return { file, text, changed: false }

  let next = text
  if (exportsChanged)
    next = replaceJsonValue(next, 'exports', exportsObject)
  if (publishChanged)
    next = replaceOrInsertTopLevel(next, 'publishConfig', nextPublishConfig)

  return {
    file,
    text: next,
    changed: true,
  }
}
