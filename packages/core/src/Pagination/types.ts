/** 上一页和下一页之间显示什么。 */
export type PaginationVariant = 'pages' | 'count' | 'compact' | 'dots' | 'input' | 'none'

/** 控件尺寸。 */
export type PaginationSize = 'sm' | 'md'

export interface PaginationProps {
  /** 当前页码（1-based） */
  page?: number
  /** 每页条目数 */
  pageSize?: number
  /** 总条目数。和 `totalPages` 同时存在时以总条目数为准。 */
  total?: number
  /**
   * 总页数。没有总条目数时使用，例如圆点轮播。
   */
  totalPages?: number
  /**
   * 中间区域的形态。
   * `pages` 是页码，`count` 是「起–止 / 总数」，`compact` 是「第几页 / 共几页」，
   * `dots` 是圆点，`input` 是可输入的页码，`none` 只留上一页和下一页。
   * @default 'pages'
   */
  variant?: PaginationVariant
  /**
   * `pages` 形态下，当前页两侧各留几个页码。不传时宽容器是 1，窄容器会再收一档。
   */
  siblingCount?: number
  /**
   * 上一页 / 下一页每次跳几页。越过边界时停在第一页或最后一页。
   * @default 1
   */
  step?: number
  /**
   * 总数还不知道时，后面是否还有内容。`total` 大于 0 时以总条目数为准，这个值不再生效。
   */
  hasMore?: boolean
  /**
   * `input` 形态里，输入框前面的名词。不传时用当前语言的「Page」或「页」。
   */
  pageLabel?: string
  /**
   * 是否在上一页 / 下一页外侧放跳到首尾的按钮。
   * 不传时只在 `input` 形态、并且总页数已知时显示。
   * `null` 和缺省是同一件事。布尔属性缺省会被当成 false，所以这里用 null 表示没指定。
   */
  hasFirstLast?: boolean | null
  /**
   * 页码已经提交之后再跑的动作。控件会在它结束前标成忙碌，失败也不会把页码改回去。
   */
  changeAction?: (page: number) => void | Promise<void>
  /**
   * 控件高度。
   * @default 'md'
   */
  size?: PaginationSize
  /** 是否显示页面大小选择器 */
  showSizeChanger?: boolean
  /** 页面大小选项 */
  pageSizeOptions?: number[]
  /** 是否显示总数 */
  showTotal?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 上一页按钮文本 */
  prevLabel?: string
  /** 下一页按钮文本 */
  nextLabel?: string
  /** 每页文本 */
  pageSizeLabel?: string
}

export interface PaginationEmits {
  (event: 'update:page', value: number): void
  (event: 'update:pageSize', value: number): void
  (event: 'change', page: number, pageSize: number): void
}

export interface PaginationSlots {
  /** 自定义总数显示 */
  total?: (props: { total: number, from: number, to: number }) => any
}
