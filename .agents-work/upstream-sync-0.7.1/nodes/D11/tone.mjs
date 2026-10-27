#!/usr/bin/env node
// 文风核对：数一数润色前后的正文里，公文腔、翻译腔的词各出现了多少次。
// 只看代码块以外的正文。润色后这些词只能变少，不能变多。
// 用法：node tone.mjs [基准提交，默认 swarm-tree]
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const base = process.argv[2] ?? 'swarm-tree'
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

const STIFF_WORDS = ['若', '将', '均', '该', '其', '即可', '业务', '无需', '进行', '置于', '亦', '旨在', '予以', '针对', '基于', '为了确保', '从而', '相关', '对应的', '显式', '规范化', '捕获', '逃逸']

const files = git('diff', '--name-only', '--diff-filter=M', base, '--', 'apps/docs/docs')
  .split('\n')
  .filter(file => file.endsWith('.md'))

function prose(text) {
  return text
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/^(```+|~~~+)[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, '')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '')
    .replace(/`[^`\n]+`/g, '')
}

function count(text) {
  const result = {}
  for (const word of STIFF_WORDS)
    result[word] = text.split(word).length - 1
  return result
}

const before = Object.fromEntries(STIFF_WORDS.map(word => [word, 0]))
const after = Object.fromEntries(STIFF_WORDS.map(word => [word, 0]))
const worse = []
for (const file of files) {
  const a = count(prose(git('show', `${base}:${file}`)))
  const b = count(prose(readFileSync(file, 'utf8')))
  let fileBefore = 0
  let fileAfter = 0
  for (const word of STIFF_WORDS) {
    before[word] += a[word]
    after[word] += b[word]
    fileBefore += a[word]
    fileAfter += b[word]
  }
  if (fileAfter > fileBefore)
    worse.push(`${file}: ${fileBefore} → ${fileAfter}`)
}

console.log('词 | 润色前 | 润色后')
for (const word of STIFF_WORDS) {
  if (before[word] + after[word] > 0)
    console.log(`${word} | ${before[word]} | ${after[word]}${after[word] > before[word] ? '  ← 变多' : ''}`)
}
const totalBefore = Object.values(before).reduce((a, b) => a + b, 0)
const totalAfter = Object.values(after).reduce((a, b) => a + b, 0)
console.log(`合计 ${totalBefore} → ${totalAfter}`)
if (worse.length > 0)
  console.log(`\n变得更书面的文件（${worse.length} 个）：\n${worse.join('\n')}`)
process.exit(totalAfter > totalBefore || worse.length > 0 ? 1 : 0)
