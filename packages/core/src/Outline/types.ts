export interface OutlineItem {
  /** Matches the target heading element's id. */
  id: string
  label: string
  /** Heading level from 1 to 6. Indentation uses levels 1–4. */
  level: number
}

export type OutlineDensity = 'default' | 'compact'

export interface OutlineProps {
  /** Ordered heading items. */
  items: OutlineItem[]
  /**
   * Controlled active heading id. When set, built-in scroll-spy stays off.
   */
  activeId?: string
  /**
   * Accessible name of the nav landmark.
   * @default 'Table of contents' (localized)
   */
  label?: string
  /**
   * Item padding. `compact` is for dense sidebars.
   * @default 'default'
   */
  density?: OutlineDensity
  /**
   * Height in pixels of a fixed header covering the top of the scroll root.
   * Shifts both the activation line and the scroll landing by the same amount,
   * on top of each heading's own `scroll-margin-top`.
   * @default 0
   */
  offset?: number
  /**
   * Scroll container to track. Omit it to use the nearest scrollable ancestor,
   * or the viewport when there is none.
   */
  scrollContainer?: HTMLElement | null
  /**
   * Whether activating an item smooth-scrolls to it.
   * @default true
   */
  hasScrollOnClick?: boolean
}

export interface OutlineEmits {
  'navigateEnd': [id: string]
  'navigateStart': [id: string]
  'update:activeId': [id: string]
}
