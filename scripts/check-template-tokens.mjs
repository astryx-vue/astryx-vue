#!/usr/bin/env node
// 演练场页面模板（apps/docs/components/playground/pages/*.vue）会被 CLI 原样复制到用户项目，
// 所以模板里的设计变量必须写成 `var(--astryx-…)`。少一个前缀浏览器不会报错，只会让
// 内边距、间距、圆角、颜色静默失效——这类问题最难发现。
//
// 判定规则：
// 1. 命名空间从 packages/themes 里实际声明的 `--astryx-…` 变量推导，不手抄清单：
//    只要 `--<第一段>` 是主题发布过的命名空间（spacing、color、radius、font…），
//    就必须带 `--astryx-` 前缀。
// 2. 模板自己在同一个文件里定义的变量不算设计变量，跳过。
//    定义形式：CSS 里的 `--foo: …`，或内联样式对象里的 `'--foo': …` / `"--foo": …`。
//    例如 ai-chat 的 `--artifact-panel-width` 是运行时算出来的宽度，属于模板自己的变量。
//
// 用法：node ./scripts/check-template-tokens.mjs

import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const TEMPLATE_DIR = 'apps/docs/components/playground/pages'
const THEME_DIR = join(repoRoot, 'packages/themes')
const TOKEN_PREFIX = '--astryx-'

/** 主题发布的命名空间集合，例如 spacing、color、radius。 */
function readNamespaces() {
  const namespaces = new Set()
  const collect = (text) => {
    for (const match of text.matchAll(/(?:^|[\s{;])(--astryx-[a-z0-9-]+)\s*:/gm))
      namespaces.add(match[1].slice(TOKEN_PREFIX.length).split('-')[0])
  }
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === 'dist')
        continue
      const full = join(dir, entry.name)
      if (entry.isDirectory())
        walk(full)
      else if (entry.name.endsWith('.css'))
        collect(readFileSync(full, 'utf8'))
    }
  }
  walk(THEME_DIR)
  return namespaces
}

const namespaces = readNamespaces()
if (namespaces.size === 0) {
  console.error(`没从 ${THEME_DIR} 读到任何 ${TOKEN_PREFIX} 变量，主题包是不是被改坏了？`)
  process.exit(1)
}

const templateFiles = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', TEMPLATE_DIR], { cwd: repoRoot, encoding: 'utf8' })
  .split('\0')
  .filter(file => file.endsWith('.vue'))

/** 同一个文件里声明过的局部变量。 */
function localVariables(text) {
  const local = new Set()
  for (const match of text.matchAll(/['"]?(--[a-z0-9-]+)['"]?\s*:/g))
    local.add(match[1])
  return local
}

const hits = []
for (const file of templateFiles) {
  const text = readFileSync(join(repoRoot, file), 'utf8')
  const local = localVariables(text)
  text.split('\n').forEach((line, index) => {
    for (const match of line.matchAll(/var\((--[a-z0-9-]+)/g)) {
      const name = match[1]
      if (name.startsWith(TOKEN_PREFIX))
        continue
      if (local.has(name))
        continue
      if (!namespaces.has(name.slice(2).split('-')[0]))
        continue
      hits.push(`  ${file}:${index + 1}  ${name}  →  ${TOKEN_PREFIX}${name.slice(2)}`)
    }
  })
}

// `<Icon icon="前缀:名字">` 会被当成 CSS 类名渲染，Iconify 图标要走 `name`。
const iconHits = []
const ICON_PROP = /<Icon\b[^>]*?\s:?icon=(["'])\s*(?:'|\\")?[a-z0-9-]+:[a-z0-9-]+/g
for (const file of templateFiles) {
  const text = readFileSync(join(repoRoot, file), 'utf8')
  for (const match of text.matchAll(ICON_PROP)) {
    const line = text.slice(0, match.index).split('\n').length
    iconHits.push(`  ${file}:${line}  ${match[0].replace(/\s+/g, ' ').slice(0, 80)}`)
  }
}

if (iconHits.length > 0) {
  console.error('<Icon> 的 icon 属性不认 Iconify 名字（前缀:名字），请改用 name 属性：')
  console.error(iconHits.join('\n'))
  process.exit(1)
}

if (hits.length > 0) {
  console.error('模板里的设计变量必须带 --astryx- 前缀：')
  console.error(hits.join('\n'))
  console.error('少一个前缀浏览器不会报错，但内边距、间距、圆角、颜色会整体失效。')
  process.exit(1)
}

process.stdout.write(`\u001B[32m✓ ${templateFiles.length} 个模板的设计变量都带 ${TOKEN_PREFIX} 前缀\u001B[0m\n`)
