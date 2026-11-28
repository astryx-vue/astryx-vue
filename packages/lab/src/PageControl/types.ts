/**
 * @file types.ts
 * @input 无
 * @output PageControl 的属性和事件类型
 * @position lab PageControl 的公开类型，由 index.ts 导出
 */

export interface PageControlProps {
  /** 页数。 */
  totalPages: number
  /** 当前页，从 1 数起。配合 `v-model:page` 使用。 */
  page: number
  /** 控件的无障碍名称。默认按读屏语言叫「页码指示」。 */
  label?: string
  /** 只有一页时什么都不渲染。 */
  hidesForSinglePage?: boolean
}

export interface PageControlEmits {
  /** 点按、拖动、按键或辅助技术要翻到的页，从 1 数起。 */
  (event: 'update:page', page: number): void
  /** 和 `update:page` 同时触发。 */
  (event: 'change', page: number): void
}
