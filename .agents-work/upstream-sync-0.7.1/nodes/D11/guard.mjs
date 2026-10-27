#!/usr/bin/env node
// 核对文档润色只改了行文：对每个改动过的 Markdown 文件，比较基准版本和当前版本的
// frontmatter、代码块、<script>/<style> 块、Vue 组件标签、行内代码、链接地址、标题锚点数量。
// 用法：node guard.mjs [基准提交，默认 swarm-tree]
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const base = process.argv[2] ?? 'swarm-tree'
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

const changed = git('diff', '--name-only', '--diff-filter=M', base, '--', 'apps/docs/docs')
  .split('\n')
  .filter(file => file.endsWith('.md'))

function extract(text) {
  const fences = []
  const prose = text.replace(/^(```+|~~~+)[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, (block) => {
    fences.push(block)
    return ''
  })
  const frontmatter = /^---\n[\s\S]*?\n---\n/.exec(text)?.[0] ?? ''
  const blocks = [...prose.matchAll(/<(script|style)\b[\s\S]*?<\/\1>/g)].map(m => m[0])
  const tags = [...prose.matchAll(/<\/?[A-Z][\w.-]*\b[^>]*>/g)].map(m => m[0])
  const inlineCode = [...prose.matchAll(/(?<!`)`([^`\n]+)`(?!`)/g)].map(m => m[1]).sort()
  const links = [...prose.matchAll(/\]\(([^)\s]+)[^)]*\)|<(https?:\/\/[^>]+)>/g)].map(m => m[1] ?? m[2]).sort()
  const containers = [...prose.matchAll(/^:::[ \t]*\w*/gm)].map(m => m[0].trim())
  const headings = (prose.match(/^#{1,6} /gm) ?? []).length
  return { frontmatter, fences, blocks, tags, inlineCode, links, containers, headings }
}

let failures = 0
for (const file of changed) {
  const before = extract(git('show', `${base}:${file}`))
  const after = extract(readFileSync(file, 'utf8'))
  const problems = []
  for (const key of Object.keys(before)) {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key]))
      problems.push(key)
  }
  if (problems.length > 0) {
    failures++
    console.log(`✗ ${file}: ${problems.join(', ')} 有变化`)
  }
}

console.log(`核对了 ${changed.length} 个改动过的文件，${failures} 个不通过。`)
process.exit(failures > 0 ? 1 : 0)
