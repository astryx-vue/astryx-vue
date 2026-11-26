export type MobileNavSide = 'start' | 'end' | 'auto'

export interface MobileNavProps {
  /** 受控打开状态，配合 `v-model:isOpen`。不传时由组件自己管。 */
  isOpen?: boolean
  /** 抽屉标题。也可以用 `header` 插槽。 */
  header?: string
  /** 抽屉宽度，单位像素。最宽不超过视口宽度的 85%。 @default 320 */
  width?: number
  /**
   * 从哪一侧滑入。`auto` 按打开它的元素（有焦点的元素，否则是 `aria-controls` 指向抽屉的元素）
   * 所在的一侧、随文字方向决定：落在行内起始半边就从起始边，否则从结束边；找不到打开者也从结束边。
   * @default 'auto'
   */
  side?: MobileNavSide
  /** 对话框和它里面导航地标的无障碍名称。默认用标题，再退回当前语言的「导航」；调用方的 `aria-labelledby` 优先。 */
  label?: string
  /** 对话框 id。不传时自己生成，方便外壳的开关用 aria-controls 指过来。 */
  id?: string
}

export interface MobileNavEmits {
  'update:isOpen': [isOpen: boolean]
  'openChange': [isOpen: boolean]
}

export interface MobileNavSlots {
  default?: () => unknown
  header?: () => unknown
}

export interface MobileNavToggleProps {
  /** 按钮的无障碍名称。默认是「打开菜单」。 */
  label?: string
  /** 受控状态。和 MobileNav 绑同一个 `v-model:isOpen`。 */
  isOpen?: boolean
  /** 对应抽屉的 id，写到 aria-controls。 */
  controls?: string
}

export interface MobileNavToggleEmits {
  'update:isOpen': [isOpen: boolean]
}
