/**
 * @file layout/index.ts
 * @input The DOM (layout rectangles, computed style) and Web Animations. The
 *   theme's move curve and duration (themeTiming.ts), the Reduce Motion
 *   cross-fade clock (uikit/timing.ts) and the block measure (frameBlock.ts)
 * @output Exports `createAnimatedLayout`, the opaque `AnimatedLayout` handle,
 *   `reportLayoutChange`, `playLayoutChange` and `layoutStartFor`. It also
 *   exports the exit hold (`holdLayoutExit`, `releaseLayoutExit`), the
 *   in-place swap (`holdLayoutSwap`, `playLayoutSwap`), the edge reveal's
 *   two-state form (`holdLayoutEdge`, `playLayoutEdge`), `playLayoutFrames`
 *   and `applyLayoutChangeTransition`. It exports `glideOf` and the glide
 *   landings (`landLayoutGlide`, `landLayoutGlideSideways`) too. It is the one
 *   module that produces the size-change glide and the edge reveal
 *   `spec:AST-105` defines (`architecture:react-component-runtime` INV12)
 * @position Motion foundation, internal to core. A handle comes from the
 *   public `useAnimatedLayout` hook; a component that takes it reports its
 *   size changes through this module.
 *
 * How it works:
 * - `measureBefore()` runs before the change commits: from the changed
 *   element it walks up to the handle's container and, at each level,
 *   records the rectangles of the element siblings after it and before it (a
 *   centered, end-aligned or space-between row, or `order`, moves those too),
 *   through `parentElement`, `nextElementSibling` and
 *   `previousElementSibling`, descending only into an element with
 *   `display: contents` (it has no box). Each level's walk stops at the first
 *   sibling outside the band a change can move content into view from: the
 *   area's visible part plus one viewport, or the changed element's size if
 *   larger, above and below. So its cost grows with depth plus the siblings
 *   near the visible part, never with a list's length.
 * - `animate()` runs after the commit (a layout effect). Every change in the
 *   same area reported in one frame is measured together after the commit,
 *   once, in a microtask, so each element moves once, by its total change.
 * - An element moves only when its rectangle changed and it is in the area's
 *   visible part, before or after. Absolute, fixed, top-layer, hidden and
 *   zero-size elements are skipped (an absolute child rides with its moving
 *   parent); a stuck sticky element does not change rectangle, so it stays.
 * - The move is a compositor-only `translate` (replace composition) from the
 *   old place to the new one. Its linear keyframes sample the theme's move
 *   curve, corrected for a scaled ancestor. An element already gliding
 *   keeps that motion and adds the new move: the rest of its curve and the
 *   new move are summed into one new glide, velocity included. Its place
 *   before the change is read on the clock of every glide that carries it,
 *   its own and its gliding ancestors' in the area (the box with each applied
 *   `translate` taken out, plus each glide's offset at its current time), and
 *   so is its place after the change, where only the glides the change leaves
 *   running remain: the new glide starts where the old one is drawn, and a
 *   glide the change leaves running cancels out of the move. Nothing
 *   animates height, and nothing scrolls the area.
 * - A measurement no commit claims by the next frame is dropped.
 * - The changed element plays its own entrance on the same curve, started in
 *   the same frame (`playLayoutChange`). Or it exits, kept where it is while
 *   it gives up its space and conceals (`holdLayoutExit`). Both are FR9's
 *   edge reveal: from its block-end edge by default, or from the block-start
 *   or an inline edge it is given. Once the content on that edge's side
 *   glides, the edge rides that glide, frame by frame, so the two never part;
 *   a reversal (a close while it opens) starts from what the element shows.
 *   A disclosure's indicator turns on the same motion
 *   (`applyLayoutChangeTransition`).
 * - A swap holds old content as one transient copy, inert and hidden from
 *   assistive technology, while new content enters in its place, on the same
 *   motion, and removes it when the swap ends (`holdLayoutSwap`,
 *   `playLayoutSwap`; `spec:AST-105` FR8). The caller shapes the frames over
 *   the swap's progress and, riding a gliding element, how far it has moved,
 *   so every part keeps to that glide; under Reduce Motion with a coarse
 *   pointer only opacity changes.
 * - FR9's two-state form holds an element's old state as the swap's copy
 *   while its edge rides a gliding element, such as a rail beside its
 *   content (`holdLayoutEdge`, `playLayoutEdge`): the larger state is
 *   clipped on that edge, from the extent the element shows, and the caller
 *   adds only its own fades.
 * - Frames on elements the page renders can play on the same motion with no
 *   copy (`playLayoutFrames`), such as a surface reaching over a gap a glide
 *   opens, and are released when the motion ends.
 * - Every pointer (`spec:AST-105` FR5). Under Reduce Motion nothing travels
 *   (`design:reduced-motion` DR1–DR3): a cross-fade under a coarse primary
 *   pointer, an immediate change otherwise.
 * - Without a handle nothing happens: the component keeps its jump
 *   (`spec:AST-105` FR2).
 */
export type { LayoutEdge } from './edge'
export { holdLayoutEdge, playLayoutEdge } from './edgeHold'
export type { LayoutEdgeHold, LayoutEdgeMotion, LayoutEdgeParts } from './edgeHold'
export { reportLayoutEdge } from './edgeReport'
export type { LayoutEdgeReport } from './edgeReport'
export { holdLayoutExit, releaseLayoutExit } from './exit'
export { glideOf } from './glides'
export { createAnimatedLayout } from './handle'
export type { AnimatedLayout } from './handle'
export { applyLayoutChangeTransition, landLayoutGlide, landLayoutGlideSideways, layoutMotionFor } from './landing'
export { layoutStartFor } from './play'
export { playLayoutChange } from './playChange'
export { reportLayoutChange } from './reportChange'
export type { LayoutChange } from './reportChange'
export { holdLayoutSwap, playLayoutFrames, playLayoutSwap } from './swap'
export type { LayoutRide, LayoutSwap, LayoutSwapMotion } from './swap'
export { glideNextChange, springGlide } from './timing'
export type { GlideProgress } from './timing'
