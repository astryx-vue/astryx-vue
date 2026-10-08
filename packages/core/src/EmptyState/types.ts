import type { VNodeChild } from 'vue'

/**
 * Heading level for the title. Controls only the rendered HTML tag (h1–h6) so
 * the title fits the document outline; the visual size stays fixed.
 */
export type EmptyStateHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface EmptyStateProps {
  /**
   * The primary message, rendered as the heading of the empty state.
   *
   * Name what is empty ("No projects yet") rather than writing a generic
   * message, and keep it short enough to read in one line.
   */
  title: string
  /**
   * Secondary text below the title that explains why the area is empty or what
   * the user can do next.
   */
  description?: string
  /**
   * Semantic heading level for the title. It only changes the rendered HTML tag
   * (h1–h6) so the title fits the document outline; the visual size of the
   * title is the same at every level.
   * @default 3
   */
  headingLevel?: EmptyStateHeadingLevel
  /**
   * Reduces the spacing and the text sizes for constrained areas such as cards
   * and sidebars, and stacks the actions vertically.
   * @default false
   */
  isCompact?: boolean
}

export interface EmptyStateSlots {
  /**
   * The icon or illustration shown above the title. The wrapper around it is
   * hidden from assistive technology, so the artwork never needs a label of
   * its own.
   */
  icon?: () => VNodeChild
  /**
   * Rich content for the title. Overrides the `title` prop.
   */
  title?: () => VNodeChild
  /**
   * Rich content for the description. Overrides the `description` prop.
   */
  description?: () => VNodeChild
  /**
   * The actions shown below the text: usually one or two buttons that give the
   * user a next step. They are laid out in a row, or in a column when
   * `isCompact` is set.
   */
  actions?: () => VNodeChild
}
