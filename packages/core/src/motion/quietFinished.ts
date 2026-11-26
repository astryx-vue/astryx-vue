/**
 * @file quietFinished.ts
 * @input An Animation that motion code starts
 * @output quietFinished: marks the animation's current `finished` promise as
 *   handled and returns the animation
 * @position Internal to motion: a cancel rejects `finished` with an
 *   AbortError. Browsers mark that rejection handled; DOM shims that create
 *   the promise eagerly (happy-dom) leave it unhandled, so a test runner
 *   reports every cancelled motion as an error. Call it right after the
 *   animation starts playing, since starting from idle makes a new promise.
 */

function ignore(): void {}

export function quietFinished<T extends Animation>(animation: T): T {
  // Adopting it also covers a stand-in whose `finished` is only a thenable.
  Promise.resolve(animation.finished).catch(ignore)
  return animation
}
