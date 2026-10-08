import type { VNodeChild } from 'vue'
import type { SpacingStep } from '../Stack/types.js'

/**
 * Alignment of grid items on one axis.
 *
 * `start`, `center`, `end`, and `stretch` map straight onto `align-items`
 * (vertical) and `justify-items` (horizontal).
 */
export type GridAlignment = 'start' | 'center' | 'end' | 'stretch'

/**
 * How responsive tracks treat the space they cannot fill.
 *
 * `fill` keeps the empty tracks so every column keeps the same width. `fit`
 * collapses them so the columns that are present stretch across the row.
 */
export type GridRepeat = 'fill' | 'fit'

/**
 * A container size. Numbers are interpreted as pixels, strings are used as-is
 * (for example `'100%'` or `'40rem'`).
 */
export type GridSizeValue = number | string

/**
 * Responsive column configuration based on a minimum child width.
 *
 * The grid reflows as the available width changes: as many tracks as fit are
 * created, each at least `minWidth` wide.
 */
export interface GridResponsiveColumns {
  /** Minimum width of every column track, in pixels. */
  minWidth: number
  /**
   * Caps the number of columns.
   *
   * The cap lives on the track's minimum size, so the grid can never fit more
   * than this many columns, while the columns that are present still stretch to
   * the full width of the container.
   */
  max?: number
  /**
   * Track behavior when the last row is not full.
   *
   * @default 'fill'
   */
  repeat?: GridRepeat
}

/**
 * Column configuration for `Grid`.
 *
 * A number creates that many equal-width columns. An object creates responsive
 * columns from a minimum child width.
 */
export type GridColumns = number | GridResponsiveColumns

/** How many columns a `GridSpan` occupies. */
export type GridSpanColumns = number | 'full'

export interface GridProps {
  /**
   * Column configuration.
   *
   * A number creates fixed equal-width columns (`:columns="3"`); an object
   * creates responsive columns (`:columns="{ minWidth: 280 }"`). Anything
   * missing, zero, or negative falls back to a single column.
   */
  columns?: GridColumns
  /**
   * Width of the grid container. Numbers are interpreted as pixels, strings are
   * used as-is.
   */
  width?: GridSizeValue
  /**
   * Height of the grid container. Numbers are interpreted as pixels, strings
   * are used as-is.
   */
  height?: GridSizeValue
  /**
   * Maximum width of the grid container. Numbers are interpreted as pixels,
   * strings are used as-is.
   */
  maxWidth?: GridSizeValue
  /**
   * Minimum height of the grid container. Numbers are interpreted as pixels,
   * strings are used as-is.
   */
  minHeight?: GridSizeValue
  /**
   * Spacing between every item, on both axes, using the Astryx spacing scale.
   */
  gap?: SpacingStep
  /**
   * Spacing between rows using the Astryx spacing scale. Overrides `gap` on the
   * row axis.
   */
  rowGap?: SpacingStep
  /**
   * Spacing between columns using the Astryx spacing scale. Overrides `gap` on
   * the column axis.
   */
  columnGap?: SpacingStep
  /**
   * Height in pixels of every implicit row track.
   *
   * Sets `grid-auto-rows`. Combine it with `GridSpan rows` to build layouts
   * whose items span a different number of rows.
   */
  rowHeight?: number
  /**
   * Vertical alignment of items (`align-items`).
   *
   * @default 'stretch'
   */
  align?: GridAlignment
  /**
   * Horizontal alignment of items (`justify-items`).
   *
   * @default 'stretch'
   */
  justify?: GridAlignment
}

export interface GridSlots {
  /** The items to lay out. */
  default?: () => VNodeChild
}

export interface GridSpanProps {
  /**
   * Number of columns the item spans, or `'full'` to span the whole row.
   *
   * `'full'` renders `grid-column: 1 / -1`, which works for any column count.
   */
  columns?: GridSpanColumns
  /**
   * Number of rows the item spans (`grid-row: span N`).
   */
  rows?: number
}

export interface GridSpanSlots {
  /** The content of the spanning item. */
  default?: () => VNodeChild
}
