import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import process from 'node:process'

// 组件库和主题里一律不用 `!important`。
// 优先级靠 CSS 层（@layer）的顺序和选择器解决。`!important` 会让使用者
// 没法在自己的样式表里覆盖组件和主题，这正是组件库最不该剥夺的能力。
//
// 检查范围是 git 跟踪的源码和样式；测试文件允许出现这个字符串，
// 因为测试可能要断言「输出里没有 !important」。
const SCANNED = /^packages\/(?:core|themes|cli)\/.*\.(?:css|vue|ts|mts|js|mjs)$/
const EXEMPT = /\.(?:test|spec)\.[^/]+$|\/generated\//
const PATTERN = /!\s*important/i

const files = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' })
  .split('\0')
  .filter(file => file && SCANNED.test(file) && !EXEMPT.test(file))

const hits = []
for (const file of files) {
  let text
  try {
    text = readFileSync(file, 'utf8')
  }
  catch {
    continue
  }
  text.split('\n').forEach((line, index) => {
    if (PATTERN.test(line))
      hits.push(`  ${file}:${index + 1}  ${line.trim()}`)
  })
}

if (hits.length > 0) {
  console.error('组件库里不允许出现 !important：')
  console.error(hits.join('\n'))
  console.error('请改用 CSS 层的顺序或选择器来解决优先级，让使用者能在自己的样式表里覆盖。')
  process.exit(1)
}
