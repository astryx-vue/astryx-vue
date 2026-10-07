export type SkeletonRadius = 'none' | 0 | 1 | 2 | 3 | 4 | 'rounded'
export type SkeletonSizeValue = number | string

export interface SkeletonProps {
  /** Height of the skeleton. Numbers are interpreted as pixels. @default '100%' */
  height?: SkeletonSizeValue
  /** Index used to stagger animation timing by 100ms. @default 0 */
  index?: number
  /** Border radius using the Astryx radius scale. @default 3 */
  radius?: SkeletonRadius
  /** Width of the skeleton. Numbers are interpreted as pixels. @default '100%' */
  width?: SkeletonSizeValue
}
