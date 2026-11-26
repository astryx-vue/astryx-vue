import { vi } from 'vitest'

/** 「紧凑并且粗指针」在标准宽度点下的查询（Theme/compactDefinition.ts）。 */
export const COMPACT_TOUCH = '(width < 768px) and (pointer: coarse), (height < 500px) and (pointer: coarse)'

export interface FakeMatchMedia {
  /** 换一套匹配规则，并给结果变了的查询派发 change。 */
  set: (matches: (query: string) => boolean) => void
  /** 用过的查询，按调用顺序。 */
  queries: string[]
}

/**
 * 装一个能改结果的 `window.matchMedia`。测试结束后用 `vi.unstubAllGlobals()` 还原。
 */
export function installMatchMedia(initial: (query: string) => boolean): FakeMatchMedia {
  let rule = initial
  const lists: Array<{ query: string, matches: boolean, listeners: Set<(event: { matches: boolean }) => void> }> = []
  const queries: string[] = []

  vi.stubGlobal('matchMedia', (query: string) => {
    queries.push(query)
    const entry = { query, matches: rule(query), listeners: new Set<(event: { matches: boolean }) => void>() }
    lists.push(entry)
    return {
      get matches() {
        return entry.matches
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => entry.listeners.add(listener),
      removeEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => entry.listeners.delete(listener),
      addListener: (listener: (event: { matches: boolean }) => void) => entry.listeners.add(listener),
      removeListener: (listener: (event: { matches: boolean }) => void) => entry.listeners.delete(listener),
      dispatchEvent: () => false,
    }
  })

  return {
    queries,
    set(next) {
      rule = next
      for (const entry of lists) {
        const matches = rule(entry.query)
        if (matches === entry.matches)
          continue
        entry.matches = matches
        for (const listener of [...entry.listeners])
          listener({ matches })
      }
    },
  }
}
