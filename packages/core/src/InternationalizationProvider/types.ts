import type { ProviderMessagesByLocale, ProviderOverrides } from './catalog.js'
import type { TextDirection } from './direction.js'

export interface InternationalizationProviderProps {
  /**
   * BCP 47 语言标签，例如 `en`、`pt-BR`、`zh-Hans`。
   * 带地区的标签先退回它的基础语言，最后退回内置英文文案。
   */
  locale: string
  /**
   * 语言标签到文案目录的映射，目录形状和原版 `locales/*.json` 一样。
   * 不传就用内置文案。
   */
  messages?: ProviderMessagesByLocale
  /**
   * 每个 locale 的稀疏覆盖，叠在该 locale 的底层文案上。
   * 只写要改的键，运行时切换 locale 会自动用上对应那一份。
   */
  overrides?: ProviderOverrides
  /**
   * 显式的书写方向。不传时按 `locale` 推导。
   * 它只决定 Astryx 组件读到的方向，不会去改 DOM 的 `dir` 属性。
   */
  dir?: TextDirection
}

export interface InternationalizationProviderSlots {
  /** 使用这份语言设置的子树。 */
  default?: () => unknown
}
