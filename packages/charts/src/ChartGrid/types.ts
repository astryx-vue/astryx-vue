export interface ChartGridProps {
  /** 画不画横向网格线 @default true */
  horizontal?: boolean
  /** 画不画纵向网格线 @default false */
  vertical?: boolean
  /**
   * 每条轴上大约画几条网格线。和 `<ChartAxis>` 的 `tickCount` 保持一致，
   * 网格线才会和刻度落在同一个值上。
   * @default 5
   */
  tickCount?: number
}
