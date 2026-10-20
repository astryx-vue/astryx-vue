/**
 * 要扫的组件页清单。从 `apps/docs/components/demos/<slug>/meta.ts` 读，不手写。
 *
 * 只读 slug 字段，不执行 meta.ts：它会顺带 import 示例组件，Node 里跑不起来。
 * 同一个 slug 出现两次，或者 meta.ts 里找不到 slug，直接抛错，免得悄悄少扫一页。
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export const DEMOS_DIR = 'apps/docs/components/demos'

/** 从 meta.ts 源码里读出 slug。 */
export function readSlug(source) {
  const match = source.match(/\bslug:\s*'((?:\\'|[^'])*)'/)
  if (!match)
    throw new Error('meta.ts 里找不到 slug')
  return match[1].replace(/\\'/g, '\'')
}

/**
 * 把 `[{ dir, source }]` 变成排好序的 slug 列表。
 * @param {{ dir: string, source: string }[]} metas 每个示例目录名和它的 meta.ts 源码
 * @returns {string[]} 按字母排好的 slug
 */
export function slugsFromMetas(metas) {
  const seen = new Map()
  for (const { dir, source } of metas) {
    let slug
    try {
      slug = readSlug(source)
    }
    catch (error) {
      throw new Error(`${dir}/meta.ts：${error.message}`)
    }
    if (seen.has(slug))
      throw new Error(`slug ${slug} 重复：${seen.get(slug)} 和 ${dir}`)
    seen.set(slug, dir)
  }
  return [...seen.keys()].sort()
}

/** 读仓库里全部示例目录的 meta.ts。 */
export function readDemoMetas(root) {
  const dir = join(root, DEMOS_DIR)
  return readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(join(dir, entry.name, 'meta.ts')))
    .map(entry => ({ dir: entry.name, source: readFileSync(join(dir, entry.name, 'meta.ts'), 'utf8') }))
}

/** 组件页地址：`/en/components/<slug>/`。 */
export function pageUrl(origin, slug) {
  return `${origin.replace(/\/$/, '')}/en/components/${slug}/`
}

/**
 * 按 `--only` 过滤。给的名字必须都存在，打错字时报出来，而不是扫个空。
 * @param {string[]} slugs 全部 slug
 * @param {string[] | undefined} only 只扫这些
 * @returns {string[]} 过滤后的 slug
 */
export function selectSlugs(slugs, only) {
  if (only == null || only.length === 0)
    return slugs
  const unknown = only.filter(slug => !slugs.includes(slug))
  if (unknown.length > 0)
    throw new Error(`没有这些组件页：${unknown.join(', ')}`)
  return slugs.filter(slug => only.includes(slug))
}
