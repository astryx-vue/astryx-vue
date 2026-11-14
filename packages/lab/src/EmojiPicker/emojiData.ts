import type { EmojiCategory, EmojiOption } from './types.js'
import { BUNDLED_GROUP_KEYS } from './constants.js'

/**
 * 内置表情数据来自 Meta Astryx v0.7.13 的 `packages/lab/src/EmojiPicker/emojiData.ts`，
 * 由 `packages/lab/scripts/generate-emoji-data.mjs` 根据 emojibase-data 17.0.0
 * （MIT，基于 Unicode CLDR）生成。不要手改 JSON。
 */

export type EmojiDatum = readonly [emoji: string, name: string, keywords: string]

export interface EmojiDatumGroup {
  readonly name: string
  readonly emojis: readonly EmojiDatum[]
}

const bundledLabelKeys = new WeakMap<EmojiCategory, string>()

let bundledCategories: Promise<readonly EmojiCategory[]> | null = null

function toOption([emoji, name, keywords]: EmojiDatum): EmojiOption {
  return {
    emoji,
    name,
    keywords: keywords === '' ? undefined : keywords.split(' '),
  }
}

function toCategories(groups: readonly EmojiDatumGroup[]): readonly EmojiCategory[] {
  return groups.map((group) => {
    const category: EmojiCategory = {
      name: group.name,
      emojis: group.emojis.map(toOption),
    }
    const labelKey = BUNDLED_GROUP_KEYS[group.name]
    if (labelKey != null)
      bundledLabelKeys.set(category, labelKey)
    return category
  })
}

export function bundledGroupLabelKey(group: EmojiCategory): string | undefined {
  return bundledLabelKeys.get(group)
}

async function importEmojiData(): Promise<readonly EmojiDatumGroup[]> {
  const module = await import('./emoji-data.json')
  return module.default as unknown as readonly EmojiDatumGroup[]
}

/** 第一次有选择器挂载时加载内置集，之后所有选择器共用同一份。 */
export function loadBundledCategories(): Promise<readonly EmojiCategory[]> {
  bundledCategories ??= importEmojiData().then(
    toCategories,
    (error) => {
      bundledCategories = null
      throw error
    },
  )
  return bundledCategories
}

/** 测试用：清掉缓存，好模拟加载失败或重新加载。 */
export function resetBundledCategories(): void {
  bundledCategories = null
}
