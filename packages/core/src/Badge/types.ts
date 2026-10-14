export interface BadgeVariantMap {
  blue: true
  cyan: true
  error: true
  green: true
  info: true
  neutral: true
  orange: true
  pink: true
  purple: true
  red: true
  success: true
  teal: true
  warning: true
  yellow: true
}

export type BadgeVariant = Extract<keyof BadgeVariantMap, string>

export interface BadgeProps {
  /**
   * The visual style of the badge.
   *
   * @default 'neutral'
   */
  variant?: BadgeVariant
  /**
   * Badge text. A string or number is also set as the title so a clipped
   * label stays reachable. The default slot overrides this when both are set.
   */
  label?: string | number
}
