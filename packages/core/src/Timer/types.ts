import type { TextColor, TextSize, TextType, TextWeight } from '../Text/types.js'

export type { TimerFormat } from './format.js'

/** Timer can inherit the surrounding type, which Text itself does not offer. */
export type TimerType = TextType | 'inherit'

export type TimerColor = TextColor | 'disabled'

export interface TimerProps {
  /**
   * Unix time in milliseconds when the measured operation began.
   * Omit it to start counting from this Timer's mount.
   */
  startTime?: number
  /**
   * Standard duration representation.
   * `elapsed` uses compact units and drops seconds after one hour.
   * `clock` stays second-precise (`m:ss` or `h:mm:ss`).
   * @default 'elapsed'
   */
  format?: 'elapsed' | 'clock'
  /**
   * Semantic text type. Matches Timestamp typography.
   * `inherit` takes the surrounding font instead of a text type.
   * @default 'supporting'
   */
  type?: TimerType
  /** Explicit font size. Overrides the size that comes from `type`. */
  size?: TextSize
  /**
   * Text color.
   * @default 'secondary'
   */
  color?: TimerColor
  /** Font weight override. */
  weight?: TextWeight
}
