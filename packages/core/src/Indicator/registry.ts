import type { ThemeDefinition } from '../Theme/types.js'
import type { CoreIndicatorName, IndicatorComponent, IndicatorName, IndicatorRegistry } from './types.js'
import CheckboxIndicator from '../CheckboxIndicator/CheckboxIndicator.vue'
import CheckIndicator from './CheckIndicator.vue'
import RadioIndicator from './RadioIndicator.vue'

/**
 * The graphics this package ships.
 *
 * A theme's `indicators` entries replace these by name. The set is closed:
 * a name added by augmentation is not in here.
 */
export const defaultIndicators: {
  [N in CoreIndicatorName]: IndicatorComponent
} = {
  check: CheckIndicator,
  checkbox: CheckboxIndicator,
  radio: RadioIndicator,
}

export function isCoreIndicatorName(name: string): name is CoreIndicatorName {
  return name === 'check' || name === 'checkbox' || name === 'radio'
}

function themeIndicators(theme: ThemeDefinition | null | undefined): IndicatorRegistry | undefined {
  return theme?.indicators
}

/**
 * Resolve one graphic by name.
 *
 * A core name always resolves. A name this package does not know resolves
 * only when the theme supplies it.
 */
export function getIndicator<N extends CoreIndicatorName>(
  name: N,
  theme?: ThemeDefinition | null,
): IndicatorComponent
export function getIndicator(
  name: IndicatorName | (string & {}),
  theme?: ThemeDefinition | null,
): IndicatorComponent | undefined
export function getIndicator(
  name: string,
  theme?: ThemeDefinition | null,
): IndicatorComponent | undefined {
  const override = themeIndicators(theme)?.[name]
  if (override)
    return override
  if (isCoreIndicatorName(name))
    return defaultIndicators[name]
  return undefined
}
