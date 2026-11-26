import type { InjectionKey } from 'vue'
import { inject, provide } from 'vue'

/** 手写行列的表格告诉它的行：表格有没有开斑马纹。 */
export const TABLE_STRIPED_KEY: InjectionKey<() => boolean> = Symbol('AstryxTableStriped')

/** 行所在的区块。表头行不参与斑马纹。 */
export type TableSection = 'header' | 'body' | 'footer'
export const TABLE_SECTION_KEY: InjectionKey<TableSection | null> = Symbol('AstryxTableSection')

/** `TableHeader`、`TableBody`、`TableFooter` 用它告诉里面的行自己在哪个区块。 */
export function provideTableSection(section: TableSection): void {
  provide(TABLE_SECTION_KEY, section)
}

/**
 * 手写行列的行是否带 `table-row` 主题目标的 `striped` 状态：表格开了斑马纹，且这一行不是表头行。
 * 行的先后由调用方决定，Core 数不准，所以这里不给 `parity`。
 */
export function useTableRowStriped(isHeaderRow: () => boolean): () => boolean {
  const isStriped = inject(TABLE_STRIPED_KEY, () => false)
  const section = inject(TABLE_SECTION_KEY, null)
  return () => isStriped() && section != null && section !== 'header' && !isHeaderRow()
}
