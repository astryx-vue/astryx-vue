import type { VNode } from 'vue'

export type StepperOrientation = 'horizontal' | 'vertical'
export type StepperDensity = 'compact' | 'balanced' | 'spacious'
export type StepperIndicatorPosition = 'separated' | 'on-track'
export type StepStatus = 'accent' | 'success' | 'warning' | 'error'
export type StepProgress = 'completed' | 'in-progress' | 'not-started'
export type StepIndicator = 'auto' | 'number' | 'none'
export type StepperCollapsedVariant = 'withLabelAndControls' | 'withLabel' | 'hiddenLabel'

export interface StepperHorizontalOptions {
  /**
   * Collapse a horizontal stepper when its width is below this value times
   * the step count. The collapsed view keeps the track.
   * @default 112
   */
  minimumStepWidth?: number
  /**
   * What the collapsed row shows. Controls appear only for
   * `withLabelAndControls` when `onStepClick` is set.
   * @default 'withLabelAndControls'
   */
  collapsedVariant?: StepperCollapsedVariant
}

export interface StepperProps {
  /** Zero-based index of the current step. */
  activeStep: number
  /** @default 'horizontal' */
  orientation?: StepperOrientation
  /**
   * When set, steps render as buttons and call this with the zero-based index.
   * `@step-click` fills the same prop.
   */
  onStepClick?: (index: number) => void
  /** Accessible name of the list. */
  label?: string
  /** @default 'balanced' */
  density?: StepperDensity
  /** @default 'separated' */
  indicatorPosition?: StepperIndicatorPosition
  /**
   * In a narrow horizontal stepper, hide every label except the current one.
   * @default false
   */
  hasCollapsibleLabels?: boolean
  /**
   * Narrow-width behavior for a horizontal stepper. `minimumStepWidth` defaults
   * to 112: a horizontal stepper narrower than that times the step count
   * collapses to the current step. `collapsedVariant` chooses a label with
   * controls, the label alone, or the track with no compact row.
   */
  horizontalOptions?: StepperHorizontalOptions
}

export interface StepperSlots {
  default?: () => VNode[]
}

export interface StepProps {
  /** Zero-based index of this step. */
  step: number
  label: string
  description?: string
  /** Recolors the indicator only. The connector stays on the progress color. */
  status?: StepStatus
  /** @default false */
  isDisabled?: boolean
  /** @default false */
  isOptional?: boolean
  /**
   * `auto` shows a check, a ring, or a number. `number` always shows the
   * step number. `none` leaves the indicator empty.
   * @default 'auto'
   */
  indicator?: StepIndicator
  density?: StepperDensity
}

export interface StepSlots {
  /** Content under the label. In a vertical separated step it sits outside the button. */
  default?: () => VNode[]
  /** Replaces the built-in indicator artwork. */
  icon?: () => VNode[]
  /** Trailing content on the label row. */
  end?: () => VNode[]
}
