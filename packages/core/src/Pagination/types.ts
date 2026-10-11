export interface PaginationProps {
  /** 当前页码（1-based） */
  page?: number
  /** 每页条目数 */
  pageSize?: number
  /** 总条目数 */
  total?: number
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
