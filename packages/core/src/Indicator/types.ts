import type { Component } from 'vue'

/**
 * Each family owns its own states.
 *
 * A radio is only chosen or not. A checkbox can also be partial. Keeping the
 * families apart means a radio graphic is never asked to draw a mixed state.
 */
export interface IndicatorFamilyMap {
  singleSelection: 'unchecked' | 'checked'
  multiSelection: 'unchecked' | 'checked' | 'indeterminate'
}

export type IndicatorFamily = keyof IndicatorFamilyMap & string

export type IndicatorState<F extends IndicatorFamily = IndicatorFamily> = IndicatorFamilyMap[F]

/** Matches the control sizes of the inputs that draw these graphics. */
export type IndicatorSize = 'sm' | 'md'

/**
 * Which edge of a row the mark sits on.
 *
 * Logical, not physical: start is the left edge in left-to-right text.
 * The row decides this. The graphic itself has no position.
 */
export type IndicatorPosition = 'start' | 'end'

/**
 * Props every indicator accepts.
 *
 * The graphic is decorative. The control that draws it keeps the input, the
 * role, the accessible name, and the keyboard. Hover and focus reach the
 * graphic through the `astryx-indicator-scope` class on that control, not
 * through a prop.
 */
export interface IndicatorProps<F extends IndicatorFamily = IndicatorFamily> {
  /** Which state to draw. The family decides which states exist. */
  state: IndicatorState<F>
  /**
   * Control size. `sm` is 20px and `md` is 24px.
   * @default 'md'
   */
  size?: IndicatorSize
  /**
   * Whether the owning control is disabled. Visual only.
   * @default false
   */
  isDisabled?: boolean
}

/** A component that can stand in for one indicator name. */
export type IndicatorComponent<F extends IndicatorFamily = IndicatorFamily> = Component<IndicatorProps<F>>

/**
 * Names a theme can replace.
 *
 * Packages can add names by augmenting this interface. Core has no default
 * for a name it does not know, so `getIndicator` returns undefined for those
 * and the caller supplies the fallback.
 */
export interface IndicatorMap {
  /** The mark on a chosen option. A check by default, and nothing when unchosen. */
  check: 'singleSelection'
  /** The circle of a radio. */
  radio: 'singleSelection'
  /** The box of a checkbox, including the partial state. */
  checkbox: 'multiSelection'
}

export type IndicatorName = keyof IndicatorMap & string

export type CoreIndicatorName = 'check' | 'checkbox' | 'radio'

/**
 * Theme overrides, keyed by indicator name.
 *
 * One entry replaces that graphic everywhere it is drawn. Mapping `check` to
 * the radio graphic turns every single-selection mark into a radio.
 */
export interface IndicatorRegistry {
  check?: IndicatorComponent<'singleSelection'>
  radio?: IndicatorComponent<'singleSelection'>
  checkbox?: IndicatorComponent<'multiSelection'>
  [name: string]: Component | undefined
}
