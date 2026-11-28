/**
 * @file reducedMotionCss.ts
 * @input None
 * @output reducedMotionFadeConsts (the Reduced Motion cross-fade's duration
 *   and easing) and reducedMotionKeys (its two media queries, as component
 *   CSS spells them)
 * @position The CSS side of the Reduced Motion policy (reducedMotion.ts).
 *   styles/motion.css declares the same fade as `--_astryx-reduced-motion-fade-*`
 *   for component CSS to read under the fade query
 *
 * Constants, not theme variables: no theme lengthens the fade. They equal
 * `timing.reducedMotionCrossFadeMs` and `timing.curves.move`, which
 * reducedMotion.test.ts checks; reducedMotionCss.test.ts holds motion.css and
 * every component stylesheet to them.
 */

export const reducedMotionFadeConsts = {
  /** The cross-fade under Reduce Motion on a coarse pointer. */
  duration: '200ms',
  /** Core Animation's easeInOut. */
  easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
} as const

/**
 * The two Reduce Motion media queries, spelled once: under Reduce Motion a
 * coarse primary pointer fades and any other completes at once. Component CSS
 * spells them literally; reducedMotionCss.test.ts holds every one in core to
 * these, exactly.
 */
export const reducedMotionKeys = {
  fade: '@media (prefers-reduced-motion: reduce) and (pointer: coarse)',
  instant: '@media (prefers-reduced-motion: reduce) and (not (pointer: coarse))',
} as const
