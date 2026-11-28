/**
 * @file pageControlRequest.ts
 * @input 当前页的读取和向外报页的回调
 * @output createPageRequests：向 app 要一页，并记住刚要的是哪页、是什么要的
 * @position PageControl 内部：输入层要页，动效层读「是点按要的」来决定旧点淡出多快
 */

import type { ChangeKind } from './pageControlModel'

/** 刚要过的一页（从 0 数起）和要它的方式。 */
export interface PageRequest {
  page: number
  kind: ChangeKind
}

export interface PageRequests {
  /** 还没被 app 渲染出来的那次请求。 */
  pending: PageRequest | null
  /** 向 app 要第 `page` 页（从 0 数起）。已经是这页或刚要过这页时什么都不做。 */
  request: (page: number, kind: ChangeKind) => void
}

/**
 * app 不改自己的值时，这一页永远渲染不出来。等它在下一个任务里有过机会之后请求作废，
 * 再要同一页就会再报一次。
 */
export function createPageRequests(
  current: () => number,
  report: (page: number) => void,
  view: () => Window,
): PageRequests {
  const requests: PageRequests = {
    pending: null,
    request(page, kind) {
      if (page === current() || page === requests.pending?.page)
        return
      const mine = { page, kind }
      requests.pending = mine
      report(page + 1)
      view().setTimeout(() => {
        if (requests.pending === mine)
          requests.pending = null
      }, 0)
    },
  }
  return requests
}
