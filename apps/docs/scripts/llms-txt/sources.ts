/**
 * 从磁盘读生成 llms 产物要用的素材：文档页列表、演示源码、组件目录，
 * 以及构建产物里页面对应的 HTML 位置。
 */
import type { CatalogEntry } from '../../components/demo-infra/demoMeta.ts'
import { access, readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { assembleCatalog, parseDemoMetaFields } from '../../components/demo-infra/demoMeta.ts'

/** `dir` 下全部 `.md` 文件，路径相对 `dir`，按字典序排好。 */
export async function listMarkdown(dir: string, prefix = ''): Promise<string[]> {
  const entries = await readdir(join(dir, prefix), { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`
    if (entry.isDirectory()) {
      files.push(...await listMarkdown(dir, relative))
      continue
    }
    if (entry.isFile() && entry.name.endsWith('.md'))
      files.push(relative)
  }
  return files.sort()
}

async function listFolders(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries.filter(entry => entry.isDirectory()).map(entry => entry.name).sort()
}

const DEMO_IMPORT = /import[ \t]+(\w+)[ \t]+from[ \t]+'(\.[^']*?)\.vue\?raw&highlighted'/g
const DEMO_EXPORT = /export\s+const\s+(\w+)\s*=\s*defineDemo\(\s*(\w+)\s*,\s*(\w+)/g

/**
 * 演示组件的导出名 → `.vue` 源码。
 * 页面里只写 `<DemoExample :demo="buttonFloating" />`，靠这张表找回源码。
 */
export async function loadDemoSources(demosDir: string): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  for (const folder of await listFolders(demosDir)) {
    addDemoExports(map, await readFile(join(demosDir, folder, 'index.ts'), 'utf8').catch(() => null), join(demosDir, folder))
  }
  return map
}

/**
 * 不属于某个组件的演示（比如扩展包的文档）直接放在 `dir/index.ts` 里，
 * 不进组件目录，但页面里照样用 `<DemoExample :demo="…" />`。
 */
export async function loadStandaloneDemoSources(dir: string): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  addDemoExports(map, await readFile(join(dir, 'index.ts'), 'utf8').catch(() => null), dir)
  return map
}

function addDemoExports(map: Map<string, string>, index: string | null, folder: string): void {
  if (index === null)
    return
  const imports = new Map(Array.from(index.matchAll(DEMO_IMPORT), match => [match[1], match[2]]))
  for (const match of index.matchAll(DEMO_EXPORT)) {
    const file = imports.get(match[3])
    if (file !== undefined)
      map.set(match[1], join(folder, `${file}.vue`))
  }
}

export async function loadDemoContents(sources: Map<string, string>): Promise<Map<string, string>> {
  const entries = await Promise.all(Array.from(sources, async ([name, path]) => {
    const source = await readFile(path, 'utf8').catch(() => null)
    return source === null ? null : [name, source] as const
  }))
  return new Map(entries.filter(entry => entry !== null))
}

export async function loadCatalog(demosDir: string): Promise<CatalogEntry[]> {
  const metas = await Promise.all((await listFolders(demosDir)).map(async (folder) => {
    const source = await readFile(join(demosDir, folder, 'meta.ts'), 'utf8').catch(() => null)
    return source === null ? null : parseDemoMetaFields(source)
  }))
  return assembleCatalog(metas.filter(meta => meta !== null))
}

async function exists(path: string): Promise<boolean> {
  return access(path).then(() => true, () => false)
}

/**
 * 页面在 `dist` 里的 HTML 位置。组件页的 `index.md` 被 rewrite 成同级 `.html`，
 * 所以两种写法都要试一下。
 */
export async function resolveHtmlPath(outDir: string, sitePath: string): Promise<string | null> {
  const withoutExt = sitePath.replace(/\.md$/, '')
  const candidates = withoutExt.endsWith('/index')
    ? [`${withoutExt.slice(0, -'/index'.length)}.html`, `${withoutExt}.html`]
    : [`${withoutExt}.html`, `${withoutExt}/index.html`]
  for (const candidate of candidates) {
    if (await exists(join(outDir, candidate)))
      return candidate
  }
  return null
}
