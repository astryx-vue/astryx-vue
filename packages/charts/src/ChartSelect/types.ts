export interface ChartSelectProps {
  /** 当前选中的数据行下标，由调用方保存和更新。 */
  selected?: number[]
  /** 选中圆环的描边颜色。 */
  color?: string
  /** 选中圆环的半径（像素）。@default 6 */
  radius?: number
}

export interface ChartSelectEmits {
  select: [datum: Record<string, unknown>, index: number]
  selectionChange: [indices: number[]]
}
