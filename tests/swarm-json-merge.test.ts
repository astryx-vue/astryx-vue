import { describe, expect, it } from 'vitest'
import { formatJsonPath, mergeJson } from '../scripts/swarm/worktree/json-merge.mjs'

const owned = (path: string[]) => path[0] === 'exports'

describe('mergeJson', () => {
  it('只有一边改的字段取改的那边，两边改法相同也不算冲突', () => {
    const base = { a: 1, b: 1, c: 1 }
    const { value, conflicts } = mergeJson({ base, ours: { a: 2, b: 1, c: 3 }, theirs: { a: 1, b: 5, c: 3 } })
    expect(value).toEqual({ a: 2, b: 5, c: 3 })
    expect(conflicts).toEqual([])
  })

  it('两边各加、各删不同的键，嵌套对象逐键合并', () => {
    const base = { deps: { a: '1', b: '1' }, x: 1 }
    const ours = { deps: { a: '1', c: '1' }, x: 1 }
    const theirs = { deps: { a: '2', b: '1', d: '1' } }
    const { value, conflicts } = mergeJson({ base, ours, theirs })
    expect(value).toEqual({ deps: { a: '2', c: '1', d: '1' } })
    expect(conflicts).toEqual([])
  })

  it('两边把同一个值改成不同的样子就记下路径；数组整体比较', () => {
    const { conflicts } = mergeJson({
      base: { files: ['a'], meta: { name: 'x' } },
      ours: { files: ['a', 'b'], meta: { name: 'y' } },
      theirs: { files: ['a', 'c'], meta: { name: 'z' } },
    })
    expect(conflicts).toEqual([['files'], ['meta', 'name']])
  })

  it('一边删掉、另一边改了也是冲突', () => {
    const { conflicts } = mergeJson({ base: { a: 1 }, ours: {}, theirs: { a: 2 } })
    expect(conflicts).toEqual([['a']])
  })

  it('归 sync 管的位置不比较，只取 ours', () => {
    const { value, conflicts } = mergeJson({
      base: { exports: { x: 1 } },
      ours: { exports: { x: 2 } },
      theirs: { exports: { x: 3, y: 1 } },
      isOwned: owned,
    })
    expect(value).toEqual({ exports: { x: 2 } })
    expect(conflicts).toEqual([])
  })

  it('theirs 新增的键插在它在 theirs 里的前一个键后面', () => {
    const { value } = mergeJson({ base: { a: 1, c: 1 }, ours: { a: 1, c: 1, z: 1 }, theirs: { a: 1, b: 1, c: 1 } })
    expect(Object.keys(value as object)).toEqual(['a', 'b', 'c', 'z'])
  })

  it('formatJsonPath 写成便于阅读的形式', () => {
    expect(formatJsonPath(['publishConfig', 'access'])).toBe('publishConfig.access')
    expect(formatJsonPath(['exports', './locale'])).toBe('exports["./locale"]')
    expect(formatJsonPath([])).toBe('（整个文件）')
  })
})
