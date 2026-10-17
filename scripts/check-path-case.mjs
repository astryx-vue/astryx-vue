import { execFileSync } from 'node:child_process'
import process from 'node:process'

// macOS 默认的文件系统不区分大小写，Linux 区分。仓库里同时存在
// `src/Layout/` 和 `src/layout/` 时，macOS 上 checkout 只会落一份文件，
// TypeScript 报 TS1261；Linux 和 CI 上却完全看不出问题。
//
// 这里不依赖文件系统，直接读 git 索引：把每个文件的各级父目录摊开，
// 按小写归组，同一组里出现不同拼写就说明存在冲突。
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)

const groups = new Map()

for (const file of files) {
  const segments = file.split('/')
  for (let end = 1; end <= segments.length; end++) {
    const path = segments.slice(0, end).join('/')
    const key = path.toLowerCase()
    const spellings = groups.get(key) ?? new Set()
    spellings.add(path)
    groups.set(key, spellings)
  }
}

const conflicts = [...groups.values()].filter(spellings => spellings.size > 1)

if (conflicts.length > 0) {
  console.error('以下路径只在大小写上不同，macOS 上会互相覆盖并触发 TS1261：')
  for (const spellings of conflicts)
    console.error(`  ${[...spellings].join('  ≠  ')}`)
  console.error('请统一成同一种拼写，并把引用一起改掉。')
  process.exit(1)
}
