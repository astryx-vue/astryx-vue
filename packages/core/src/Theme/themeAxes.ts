import type { ThemeGenerativeAxes } from './adaptationTypes.js'
import type { TypographyRole } from './types.js'

function mergeRole(base: TypographyRole | undefined, own: TypographyRole | undefined): TypographyRole | undefined {
  if (!base || !own)
    return own ?? base
  return { ...base, ...own, weights: base.weights || own.weights ? { ...base.weights, ...own.weights } : undefined }
}

/**
 * Resolve one font role through `extends`.
 *
 * A child that names a family replaces the inherited family and fallbacks.
 * A fallback without a family has no effect, matching how font tokens are
 * built. A child heading follows the child's own body family when the child
 * sets a body family and no heading family.
 */
function resolveFamily(
  base: TypographyRole | undefined,
  own: TypographyRole | undefined,
  followsOwnBody = false,
): TypographyRole | undefined {
  const merged = mergeRole(base, own)
  if (!merged)
    return undefined
  if (own?.family)
    return { ...merged, family: own.family, fallbacks: own.fallbacks }
  if (followsOwnBody)
    return { ...merged, family: undefined, fallbacks: undefined }
  return { ...merged, family: base?.family, fallbacks: base?.fallbacks }
}

/**
 * The generator configs a theme effectively uses, after `extends`.
 *
 * Adaptation rules write partial values, such as only a new type-scale base,
 * and are completed from these. A child's own color config replaces the
 * base's, because a color config regenerates every neutral. Radius and
 * motion merge field by field. Weights belong to the most recent config that
 * declares a type scale, since weights only reach tokens through a scale.
 */
export function resolveGenerativeAxes(
  inherited: ThemeGenerativeAxes | undefined,
  own: ThemeGenerativeAxes,
): ThemeGenerativeAxes {
  const base = inherited?.typography
  const mine = own.typography
  let typography = base || mine
    ? {
        ...base,
        ...mine,
        scale: mine?.scale ?? base?.scale,
        body: resolveFamily(base?.body, mine?.body),
        heading: resolveFamily(base?.heading, mine?.heading, Boolean(mine?.body?.family && !mine?.heading?.family)),
        code: resolveFamily(base?.code, mine?.code),
      }
    : undefined
  if (typography) {
    const owner = mine?.scale ? mine : base?.scale ? base : undefined
    const withWeights = (role: TypographyRole | undefined, from: TypographyRole | undefined): TypographyRole | undefined =>
      role ? { ...role, weight: from?.weight, weights: from?.weights } : undefined
    typography = {
      ...typography,
      body: withWeights(typography.body, owner?.body),
      heading: withWeights(typography.heading, owner?.heading),
      code: withWeights(typography.code, owner?.code),
    }
  }
  const color = own.color ?? inherited?.color
  const radius = own.radius ? { ...inherited?.radius, ...own.radius } : inherited?.radius
  const motion = own.motion ? { ...inherited?.motion, ...own.motion } : inherited?.motion
  return {
    ...(typography ? { typography } : {}),
    ...(color ? { color } : {}),
    ...(radius ? { radius } : {}),
    ...(motion ? { motion } : {}),
  }
}
