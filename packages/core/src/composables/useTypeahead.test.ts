import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountComposable } from './mountComposable.js'
import { useTypeahead } from './useTypeahead.js'

function key(name: string, extra: KeyboardEventInit = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true, ...extra })
}

describe('useTypeahead', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('按字母跳到下一个以前缀匹配的项，同一个字母会循环', () => {
    vi.useFakeTimers()
    const labels = ['Apple', 'Date', 'Durian', 'Banana']
    let current = 0
    const matches: number[] = []
    const { result } = mountComposable(() => useTypeahead({
      getCurrentIndex: () => current,
      getItemLabels: () => labels,
      onMatch: (index) => {
        matches.push(index)
        current = index
      },
      resetMs: 750,
    }))

    expect(result.onKeyDown(key('d'))).toBe(true)
    expect(matches).toEqual([1])
    expect(result.onKeyDown(key('d'))).toBe(true)
    expect(matches).toEqual([1, 2])
    expect(result.onKeyDown(key('d'))).toBe(true)
    expect(matches).toEqual([1, 2, 1])
  })

  it('连续不同字符会收窄查询，并把当前项算进去', () => {
    const labels = ['Date', 'Durian']
    const matches: number[] = []
    const { result } = mountComposable(() => useTypeahead({
      getCurrentIndex: () => 0,
      getItemLabels: () => labels,
      onMatch: index => matches.push(index),
    }))

    result.onKeyDown(key('d'))
    result.onKeyDown(key('u'))
    expect(matches).toEqual([1, 1])
  })

  it('单独的空格、修饰键和输入法组合都不算查询', () => {
    const onMatch = vi.fn()
    const { result } = mountComposable(() => useTypeahead({
      getItemLabels: () => ['Save'],
      onMatch,
    }))

    expect(result.onKeyDown(key(' '))).toBe(false)
    expect(result.onKeyDown(key('s', { ctrlKey: true }))).toBe(false)
    expect(result.onKeyDown(key('s', { metaKey: true }))).toBe(false)
    expect(result.onKeyDown(key('s', { isComposing: true }))).toBe(false)
    expect(result.onKeyDown(key('ArrowDown'))).toBe(false)
    expect(onMatch).not.toHaveBeenCalled()
  })

  it('缓冲已经有字时，空格会加进查询', () => {
    let current = -1
    const matches: number[] = []
    const { result } = mountComposable(() => useTypeahead({
      getCurrentIndex: () => current,
      getItemLabels: () => ['N file', 'N folder'],
      onMatch: (index) => {
        current = index
        matches.push(index)
      },
    }))

    result.onKeyDown(key('n'))
    result.onKeyDown(key(' '))
    result.onKeyDown(key('f'))
    result.onKeyDown(key('o'))
    expect(matches).toEqual([0, 0, 0, 1])
  })

  it('跳过禁用项；没有标签时不消耗按键', () => {
    const onMatch = vi.fn()
    const { result } = mountComposable(() => useTypeahead({
      getItemLabels: () => ['Alpha', 'Alpine'],
      isDisabled: index => index === 0,
      onMatch,
    }))

    expect(result.onKeyDown(key('a'))).toBe(true)
    expect(onMatch).toHaveBeenCalledExactlyOnceWith(1)

    const empty = mountComposable(() => useTypeahead({
      getItemLabels: () => [],
      onMatch,
    }))
    expect(empty.result.onKeyDown(key('a'))).toBe(false)
  })

  it('超时和 reset 都会清空缓冲', () => {
    vi.useFakeTimers()
    const labels = ['Date', 'Durian']
    let current = -1
    const matches: number[] = []
    const { result } = mountComposable(() => useTypeahead({
      getCurrentIndex: () => current,
      getItemLabels: () => labels,
      onMatch: (index) => {
        current = index
        matches.push(index)
      },
      resetMs: 750,
    }))

    result.onKeyDown(key('d'))
    result.reset()
    result.onKeyDown(key('u'))
    expect(matches).toEqual([0])

    result.onKeyDown(key('d'))
    vi.advanceTimersByTime(750)
    result.onKeyDown(key('d'))
    expect(matches).toEqual([0, 1])
  })

  it('没有匹配项时仍然算处理过这个字符', () => {
    const { result } = mountComposable(() => useTypeahead({
      getItemLabels: () => ['Apple'],
      onMatch: () => {},
    }))
    expect(result.onKeyDown(key('z'))).toBe(true)
  })

  it('旧名字 useMenuTypeahead 指向同一个函数', async () => {
    const moved = await import('../DropdownMenu/useMenuTypeahead.js')
    expect(moved.useMenuTypeahead).toBe(useTypeahead)
  })
})
