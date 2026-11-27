/** 坐标轴画在绘图区的哪一条边上。 */
export type ChartAxisPosition = 'top' | 'right' | 'bottom' | 'left'

export interface ChartAxisProps {
  /** 画在哪条边上 */
  position: ChartAxisPosition
  /** 想要几个刻度（近似值，d3 决定最终数量）@default 5 */
  tickCount?: number
  /**
   * 最多显示几个刻度文字，超出的按等间隔抽稀，首尾文字保留。
   * 不设时按轴的宽度自动抽稀；设了就压过这个自动值，窄图上文字可能挤在一起。
   */
  maxTicks?: number
  /** 自定义刻度文字。返回 `null` 或 `undefined` 时显示默认刻度文字 */
  tickFormat?: (value: unknown) => string | null | undefined
  /** 把刻度文字截断到这么多个字（末尾补省略号） */
  truncate?: number
  /** 刻度滑动时要不要过渡动画，流式更新时更好看 @default true */
  animated?: boolean
  /**
   * 画不画轴线。默认只有 `position="bottom"` 画。
   * 开了 `showTicks` 会强制画上，不然刻度线没有着落。
   */
  showAxisLine?: boolean
  /** 每个刻度处画不画一小段垂直的短刻度线 @default false */
  showTicks?: boolean
}
