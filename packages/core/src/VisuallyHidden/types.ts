import type { Component } from 'vue'

export type VisuallyHiddenElement = Component | string

export interface VisuallyHiddenProps {
  /** The element or component rendered at the root. @default 'span' */
  as?: VisuallyHiddenElement
}
