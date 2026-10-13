import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

const TS_BANNER = '// 这个文件由 `pnpm sync` 生成，不要手改。\n'
const CSS_BANNER = '/* 这个文件由 `pnpm sync` 生成，不要手改。 */\n'

// 各主题入口都引入同一份 fonts.css。以后新增主题时，生成的入口同样加上这行。
const THEME_FONT_IMPORTS = [
  '@import \'./fonts.css\';',
]

// 这些名字在改成自动生成之前就没有从包的总入口导出。
// 子路径仍然导出它们。新组件的导出会照常进入总入口。
const ROOT_NAME_OMISSIONS = new Set([
  'SkeletonProps',
  'SkeletonRadius',
  'SkeletonSizeValue',
  'formatCalendarMonth',
  'weekdayNames',
])

// 组件内部在用，但 composables/index.ts 原来没有收录。新文件会自动收录。
const COMPOSABLE_FILE_OMISSIONS = new Set([
  'useCalendar.ts',
  'usePagination.ts',
])

// 这些样式由组件单文件直接引入，styles.css 原来没有汇总。新的 css 会自动汇总。
const STYLE_FILE_OMISSIONS = new Set([
  'calendar.css',
  'date-input.css',
  'input-group.css',
  'number-input.css',
  'pagination.css',
  'selector.css',
  'visually-hidden-utility.css',
])

const STATIC_EXPORT_KEYS = new Set([
  './package.json',
  './reset.css',
  './styles.css',
])

function compareName(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
}

function compareDir(a, b) {
  return a.localeCompare(b, 'en', { sensitivity: 'base' }) || compareName(a, b)
}

function isInjectionKey(name) {
  return name.endsWith('_KEY') || /^[a-z].*Key$/.test(name)
}

function modifiersOf(node) {
  return ts.canHaveModifiers(node) ? ts.getModifiers(node) ?? [] : []
}

function hasModifier(node, kind) {
  return modifiersOf(node).some(modifier => modifier.kind === kind)
}

function resolveModule(fromFile, spec) {
  if (!spec.startsWith('.'))
    return null

  const raw = resolve(dirname(fromFile), spec)
  const candidates = []
  if (raw.endsWith('.js')) {
    const stripped = raw.slice(0, -3)
    candidates.push(`${stripped}.ts`, `${stripped}.tsx`, `${stripped}.d.ts`, join(stripped, 'index.ts'))
  }
  else {
    candidates.push(raw, `${raw}.ts`, `${raw}.tsx`, `${raw}.d.ts`, join(raw, 'index.ts'))
  }

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile())
      return candidate
  }
  return null
}

function emptyExports() {
  return { values: new Set(), types: new Set() }
}

function collectExports(file, seen = new Set()) {
  const resolved = resolve(file)
  if (seen.has(resolved))
    return emptyExports()
  seen.add(resolved)

  const text = readFileSync(resolved, 'utf8')
  const source = ts.createSourceFile(resolved, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const values = new Set()
  const types = new Set()

  function addLocal(node) {
    if (!hasModifier(node, ts.SyntaxKind.ExportKeyword) || hasModifier(node, ts.SyntaxKind.DefaultKeyword))
      return
    const name = node.name && ts.isIdentifier(node.name) ? node.name.text : undefined
    if (!name)
      return
    const typeOnly = ts.isInterfaceDeclaration(node)
      || ts.isTypeAliasDeclaration(node)
    if (typeOnly)
      types.add(name)
    else
      values.add(name)
  }

  for (const statement of source.statements) {
    if (ts.isExportDeclaration(statement)) {
      if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          const exported = element.name.text
          if (exported === 'default')
            continue
          if (statement.isTypeOnly || element.isTypeOnly)
            types.add(exported)
          else
            values.add(exported)
        }
        continue
      }

      if (statement.exportClause && ts.isNamespaceExport(statement.exportClause)) {
        values.add(statement.exportClause.name.text)
        continue
      }

      if (!statement.exportClause && statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
        const next = resolveModule(resolved, statement.moduleSpecifier.text)
        if (!next)
          continue
        const nested = collectExports(next, seen)
        if (statement.isTypeOnly) {
          for (const name of nested.types)
            types.add(name)
        }
        else {
          for (const name of nested.values)
            values.add(name)
          for (const name of nested.types)
            types.add(name)
        }
      }
      continue
    }

    if (ts.isVariableStatement(statement)) {
      if (!hasModifier(statement, ts.SyntaxKind.ExportKeyword))
        continue
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name))
          values.add(declaration.name.text)
      }
      continue
    }

    if (
      ts.isFunctionDeclaration(statement)
      || ts.isClassDeclaration(statement)
      || ts.isInterfaceDeclaration(statement)
      || ts.isTypeAliasDeclaration(statement)
      || ts.isEnumDeclaration(statement)
      || ts.isModuleDeclaration(statement)
    ) {
      addLocal(statement)
    }
  }

  return { values, types }
}

function sortedNames(names) {
  return [...names].sort(compareName)
}

function formatNamedExport(kind, names, from) {
  const keyword = kind === 'type' ? 'export type' : 'export'
  const oneLine = `${keyword} { ${names.join(', ')} } from '${from}'`
  if (oneLine.length <= 120)
    return oneLine
  return `${keyword} {\n${names.map(name => `  ${name},`).join('\n')}\n} from '${from}'`
}

function listDirectories(dir) {
  if (!existsSync(dir))
    return []
  return readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
}

function componentDirs(rootDir) {
  return listDirectories(join(rootDir, 'packages/core/src'))
    .filter(name => existsSync(join(rootDir, 'packages/core/src', name, 'index.ts')))
    .filter(name => name !== 'composables')
    .sort(compareDir)
}

function publicExports(file) {
  const collected = collectExports(file)
  const values = new Set([...collected.values].filter(name => !isInjectionKey(name) && !ROOT_NAME_OMISSIONS.has(name)))
  const types = new Set([...collected.types].filter(name => !isInjectionKey(name) && !ROOT_NAME_OMISSIONS.has(name)))
  return { values, types }
}

function renderIndex(rootDir) {
  const lines = [TS_BANNER.trimEnd(), '']
  const entries = [
    ...componentDirs(rootDir).map(name => ({ kind: 'component', name })),
    { kind: 'composables', name: 'composables' },
  ].sort((a, b) => compareDir(a.name, b.name))

  const seen = new Map()
  function claim(name, owner) {
    const previous = seen.get(name)
    if (previous)
      throw new Error(`导出名字 ${name} 同时来自 ${previous} 和 ${owner}`)
    seen.set(name, owner)
  }

  for (const entry of entries) {
    if (entry.kind === 'composables') {
      const composableFile = join(rootDir, 'packages/core/src/composables/index.ts')
      if (!existsSync(dirname(composableFile)))
        continue
      lines.push('export * from \'./composables/index.js\'')
      const barrel = renderComposables(rootDir)
      for (const name of barrel.names)
        claim(name, 'composables')
      continue
    }

    const file = join(rootDir, 'packages/core/src', entry.name, 'index.ts')
    const exported = publicExports(file)
    for (const name of [...exported.values, ...exported.types])
      claim(name, entry.name)
    const values = sortedNames(exported.values)
    const types = sortedNames(exported.types)
    if (values.length === 0 && types.length === 0)
      throw new Error(`${entry.name}/index.ts 没有可以放进总入口的具名导出`)
    if (values.length > 0)
      lines.push(formatNamedExport('value', values, `./${entry.name}/index.js`))
    if (types.length > 0)
      lines.push(formatNamedExport('type', types, `./${entry.name}/index.js`))
  }

  return `${lines.join('\n')}\n`
}

function composableSources(rootDir) {
  const dir = join(rootDir, 'packages/core/src/composables')
  if (!existsSync(dir))
    return []
  return readdirSync(dir)
    .filter(name => name.endsWith('.ts'))
    .filter(name => name !== 'index.ts' && !name.endsWith('.test.ts'))
    .filter(name => !COMPOSABLE_FILE_OMISSIONS.has(name))
    .sort(compareName)
}

function renderComposables(rootDir) {
  const lines = [TS_BANNER.trimEnd(), '']
  const names = []
  for (const fileName of composableSources(rootDir)) {
    const exported = collectExports(join(rootDir, 'packages/core/src/composables', fileName))
    const values = sortedNames(exported.values)
    const types = sortedNames(exported.types)
    if (values.length === 0 && types.length === 0)
      throw new Error(`composables/${fileName} 没有具名导出`)
    const from = `./${fileName.replace(/\.ts$/, '.js')}`
    if (values.length > 0)
      lines.push(formatNamedExport('value', values, from))
    if (types.length > 0)
      lines.push(formatNamedExport('type', types, from))
    lines.push('')
    names.push(...values, ...types)
  }
  return { text: `${lines.join('\n').replace(/\n+$/, '\n')}`, names }
}

function compareCssFile(a, b) {
  const aStem = a.replace(/\.css$/, '')
  const bStem = b.replace(/\.css$/, '')
  return compareName(aStem, bStem) || compareName(a, b)
}

function cssImports(dir, specifierPrefix, omissions) {
  if (!existsSync(dir))
    return []
  return readdirSync(dir)
    .filter(name => name.endsWith('.css'))
    .filter(name => !omissions.has(name))
    .sort(compareCssFile)
    .map(name => `@import '${specifierPrefix}${name}';`)
}

function renderCss(dir, specifierPrefix, omissions, prelude = []) {
  const imports = [...prelude, ...cssImports(dir, specifierPrefix, omissions)]
  return `${CSS_BANNER}${imports.join('\n')}\n`
}

function kebabToCamel(name) {
  return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function messageSources(rootDir) {
  const dir = join(rootDir, 'packages/core/src/locale/messages')
  if (!existsSync(dir))
    return []
  return readdirSync(dir)
    .filter(name => name.endsWith('.ts'))
    .filter(name => name !== 'shared.ts' && name !== 'index.ts' && !name.endsWith('.test.ts'))
    .sort(compareName)
}

function renderMessages(rootDir) {
  const files = messageSources(rootDir)
  const parts = []
  for (const fileName of files) {
    const base = fileName.replace(/\.ts$/, '')
    const camel = kebabToCamel(base)
    const pascal = camel.charAt(0).toUpperCase() + camel.slice(1)
    const text = readFileSync(join(rootDir, 'packages/core/src/locale/messages', fileName), 'utf8')
    if (!text.includes(`export const ${camel}Messages`))
      throw new Error(`locale/messages/${fileName} 需要导出 ${camel}Messages`)
    if (!text.includes(`export interface ${pascal}Messages`))
      throw new Error(`locale/messages/${fileName} 需要导出 ${pascal}Messages`)
    parts.push({ base, camel, pascal })
  }

  const typeImports = parts
    .map(part => `import type { ${part.pascal}Messages } from './messages/${part.base}.js'`)
  const valueImports = parts
    .map(part => `import { ${part.camel}Messages } from './messages/${part.base}.js'`)
  const fields = parts.map(part => `  ${part.camel}: ${part.pascal}Messages`).join('\n')
  const enFields = parts.map(part => `    ${part.camel}: ${part.camel}Messages.en,`).join('\n')
  const zhFields = parts.map(part => `    ${part.camel}: ${part.camel}Messages['zh-CN'],`).join('\n')

  return `${TS_BANNER}
import type { AstryxLocale } from './types.js'
${typeImports.join('\n')}
${valueImports.join('\n')}

export interface AstryxMessages {
${fields}
}

export const astryxMessages: Record<AstryxLocale, AstryxMessages> = {
  'en': {
${enFields}
  },
  'zh-CN': {
${zhFields}
  },
}
`
}

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

function serializeJsonValue(value) {
  const lines = JSON.stringify(value, null, 2).split('\n')
  return lines.map((line, index) => index === 0 ? line : `  ${line}`).join('\n')
}

function replaceOrInsertTopLevel(text, key, value) {
  const serialized = serializeJsonValue(value)
  if (text.includes(`"${key}":`)) {
    const location = findJsonValue(text, key)
    return `${text.slice(0, location.start)}${serialized}${text.slice(location.end)}`
  }
  const trimmed = text.replace(/\s*$/, '')
  if (!trimmed.endsWith('}'))
    throw new Error('package.json 没有以 } 结束')
  const body = trimmed.slice(0, -1).trimEnd()
  const comma = body.endsWith(',') ? '' : ','
  return `${body}${comma}\n  "${key}": ${serialized}\n}\n`
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function renderPackageExports(rootDir) {
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
  if (exportsChanged) {
    const location = findJsonValue(next, 'exports')
    next = `${next.slice(0, location.start)}${serializeJsonValue(exportsObject)}${next.slice(location.end)}`
  }
  if (publishChanged)
    next = replaceOrInsertTopLevel(next, 'publishConfig', nextPublishConfig)

  return {
    file,
    text: next,
    changed: true,
  }
}

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

function themeStylesheetDirs(rootDir) {
  const themesDir = join(rootDir, 'packages/themes')
  if (!existsSync(themesDir))
    return []
  return readdirSync(themesDir)
    .filter(name => statSync(join(themesDir, name)).isDirectory())
    .filter(name => readdirSync(join(themesDir, name)).some(entry => entry.endsWith('.css')))
    .sort(compareName)
}

function generatedFiles(rootDir) {
  const composables = renderComposables(rootDir)
  const files = new Map([
    [join(rootDir, 'packages/core/src/index.ts'), renderIndex(rootDir)],
    [join(rootDir, 'packages/core/src/composables/index.ts'), composables.text],
    [join(rootDir, 'packages/core/styles.css'), renderCss(join(rootDir, 'packages/core/styles'), './styles/', STYLE_FILE_OMISSIONS)],
    [join(rootDir, 'packages/core/src/locale/messages.ts'), renderMessages(rootDir)],
  ])
  for (const name of themeStylesheetDirs(rootDir)) {
    files.set(
      join(rootDir, 'packages/themes', `${name}.css`),
      renderCss(join(rootDir, 'packages/themes', name), `./${name}/`, new Set(), THEME_FONT_IMPORTS),
    )
  }
  const packageExports = renderPackageExports(rootDir)
  if (packageExports.changed)
    files.set(packageExports.file, packageExports.text)
  return files
}

function readOptional(file) {
  return existsSync(file) ? readFileSync(file, 'utf8') : null
}

function writeFiles(files) {
  for (const [file, contents] of files) {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, contents)
  }
}

function restoreFiles(originals) {
  for (const [file, contents] of originals) {
    if (contents == null)
      continue
    writeFileSync(file, contents)
  }
}

function eslintFix(rootDir, files) {
  if (files.length === 0)
    return
  const result = spawnSync('pnpm', ['exec', 'eslint', '--fix', ...files], {
    cwd: rootDir,
    stdio: 'inherit',
  })
  if (result.status !== 0)
    throw new Error('eslint --fix 失败')
}

function diffSummary(before, after) {
  const beforeLines = (before ?? '').split('\n')
  const afterLines = after.split('\n')
  const lines = []
  const max = Math.max(beforeLines.length, afterLines.length)
  for (let index = 0; index < max && lines.length < 40; index += 1) {
    if (beforeLines[index] !== afterLines[index]) {
      lines.push(`- ${beforeLines[index] ?? ''}`)
      lines.push(`+ ${afterLines[index] ?? ''}`)
    }
  }
  return lines.join('\n')
}

export async function syncExports({ rootDir, check = false, eslint = true }) {
  const files = generatedFiles(rootDir)
  const originals = new Map([...files.keys()].map(file => [file, readOptional(file)]))
  writeFiles(files)
  const tsFiles = [...files.keys()].filter(file => file.endsWith('.ts'))
  try {
    if (eslint)
      eslintFix(rootDir, tsFiles)
  }
  catch (error) {
    if (check)
      restoreFiles(originals)
    throw error
  }

  const mismatches = []
  for (const file of files.keys()) {
    const next = readFileSync(file, 'utf8')
    if (next !== originals.get(file))
      mismatches.push(file)
  }

  if (check && mismatches.length > 0) {
    const details = mismatches.map((file) => {
      const relativePath = relative(rootDir, file)
      return `${relativePath}\n${diffSummary(originals.get(file), readFileSync(file, 'utf8'))}`
    }).join('\n\n')
    restoreFiles(originals)
    return {
      ok: false,
      message: `生成结果和已提交文件不一致，请运行 pnpm sync：\n${details}`,
    }
  }

  return {
    ok: true,
    message: check ? '生成结果和已提交文件一致。' : '已写好生成文件。',
    files: [...files.keys()],
  }
}

const isDirect = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (isDirect) {
  const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
  const result = await syncExports({
    rootDir,
    check: process.argv.includes('--check'),
  })
  console.log(result.message)
  if (!result.ok)
    process.exitCode = 1
}
