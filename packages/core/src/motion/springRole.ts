/**
 * @file springRole.ts
 * @output `springRole`: registers a spring row as the role `springs.<name>`
 * @position Motion foundation; the spring tables (uikit/springs.ts,
 *   uikit/menuSprings.ts) build their role rows with it
 */

import type { SpringDescription } from './spring'
import { registerSpringRole } from './roles'

/**
 * Registers the row as the role `springs.<name>` and returns it. A page that
 * plays no spring ships no springs registry. Each spring role registers
 * itself when the module that plays it loads (one idempotent in-memory write,
 * no DOM). Write each call with the pure annotation, so a bundle that does
 * not use the row drops the call.
 */
export function springRole<T extends SpringDescription>(name: string, spring: T): T {
  return registerSpringRole(`springs.${name}`, spring)
}
