/** 上一页和下一页之间显示什么。 */
export type PaginationVariant = 'pages' | 'count' | 'compact' | 'dots' | 'none'

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
   * `dots` 是圆点，`none` 只留上一页和下一页。
   * @default 'pages'
   */
  variant?: PaginationVariant
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
