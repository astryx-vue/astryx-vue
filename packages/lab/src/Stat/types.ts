/** Trend direction of a delta; picks the glyph (up/down arrow, flat dash). */
export type StatDeltaDirection = 'up' | 'down' | 'flat'

/** Color tone of a delta; overrides the default direction mapping. */
export type StatDeltaSentiment = 'positive' | 'negative' | 'neutral'

/** Size variant controlling the value's font size. */
export type StatSize = 'sm' | 'md' | 'lg'

/** Change indicator rendered next to the value: a direction glyph plus colored text. */
export interface StatDelta {
  /** Pre-formatted change text, e.g. `"+12.4%"` or `"-8 ms"`. */
  value: string
  /** Trend direction. Picks the glyph and the default sentiment. */
  direction: StatDeltaDirection
  /** Overrides the direction-to-color mapping, for metrics where down is good. */
  sentiment?: StatDeltaSentiment
}

export interface StatProps {
  /** Metric name shown above the value, e.g. "Total requests". */
  label: string
  /**
   * 预先格式化好的核心数值，如 `"1.2M"`。
   * 要放富内容（带单位的小字、图标）时改用默认插槽，插槽优先。
   */
  value?: string
  /** Change indicator rendered next to the value. */
  delta?: StatDelta
  /** Muted supporting line under the value, e.g. "vs. previous 30 days". */
  description?: string
  /**
   * Size variant controlling the value's font size.
   * @default 'md'
   */
  size?: StatSize
}

/** Default direction-to-sentiment mapping (up=good, down=bad). */
export const DIRECTION_SENTIMENT: Record<StatDeltaDirection, StatDeltaSentiment> = {
  up: 'positive',
  down: 'negative',
  flat: 'neutral',
}

/** Screen-reader text announced after the delta value. */
export const DIRECTION_TEXT: Record<StatDeltaDirection, string> = {
  up: 'trending up',
  down: 'trending down',
  flat: 'flat',
}

/** Inline glyph paths (12x12 viewBox): up-right arrow, down-right arrow, dash. */
export const DELTA_GLYPH_PATHS: Record<StatDeltaDirection, string> = {
  up: 'M3.5 8.5L8.5 3.5M8.5 3.5H4.75M8.5 3.5V7.25',
  down: 'M3.5 3.5L8.5 8.5M8.5 8.5H4.75M8.5 8.5V4.75',
  flat: 'M2.5 6H9.5',
}
