import type { UpstreamMapPart } from './upstream/types.js'
import { chatUpstreamMap } from './upstream/chat.js'
import { dataUpstreamMap } from './upstream/data.js'
import { datesUpstreamMap } from './upstream/dates.js'
import { formsUpstreamMap } from './upstream/forms.js'
import { labUpstreamMap } from './upstream/lab.js'
import { navigationUpstreamMap } from './upstream/navigation.js'
import { overlaysUpstreamMap } from './upstream/overlays.js'
import { searchUpstreamMap } from './upstream/search.js'

export type { UpstreamMapPart, UpstreamTarget } from './upstream/types.js'

const parts: readonly UpstreamMapPart[] = [
  formsUpstreamMap,
  datesUpstreamMap,
  navigationUpstreamMap,
  overlaysUpstreamMap,
  dataUpstreamMap,
  searchUpstreamMap,
  chatUpstreamMap,
  labUpstreamMap,
]

function mergeParts(list: readonly UpstreamMapPart[]): UpstreamMapPart {
  const merged: UpstreamMapPart = {}
  for (const part of list) {
    for (const [key, targets] of Object.entries(part)) {
      if (Object.hasOwn(merged, key))
        throw new Error(`原版键 ${key} 在 upstream/ 下写了两次`)
      merged[key] = targets
    }
  }
  return merged
}

/**
 * 原版 `@astryx.*` 键到 `AstryxMessages` 字段的对照，按组件家族拆在 `upstream/` 下。
 * 一个键可以填多个字段。占位符对不上的键不会写入，由加载器列出来。
 *
 * 没写进这里的原版键有两类：一类属于还没移植的包（richtext、lab、charts 等），
 * 另一类在 `scripts/i18n-catalog/coverage.mjs` 里逐条写了理由。
 */
export const upstreamMessageMap: UpstreamMapPart = mergeParts(parts)
