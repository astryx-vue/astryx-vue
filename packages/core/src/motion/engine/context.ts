/**
 * @file context.ts
 * `MotionEngine`: everything one animator's closure holds. engine/state.ts
 * sets its values, and the install modules set its functions and the
 * animator's members.
 * @position Internal to motion/engine; split from upstream motion/animator.ts,
 *   where all of it lived in createMotionEngine's closure
 */

import type { PresentedSource } from '../presentation'
import type { ReducedMotionView } from '../reducedMotionPlan'
import type { SpringDescription } from '../spring'
import type { AnimateOptions, Animator, AnimatorOptions, MotionCurve, MotionHandle, MotionProperty } from '../types'
import type { Channel, HandleState, Landing, ReducedPlan, RestWait, Segment, Shown, StartGroup } from './engineTypes'

export interface MotionEngine {
  element: HTMLElement | null
  options: AnimatorOptions
  now: () => number
  frameSource: ((callback: (frame?: number) => void) => void) | null
  requestFrame: ((callback: (frame?: number) => void) => void) | null
  pseudoElement: string | undefined
  customProperty: { name: string, syntax: '<length>' | '<number>', companion?: { name: string, syntax: '<length>' | '<number>', map: (x: number) => number } } | undefined
  companion: { name: string, syntax: '<length>' | '<number>', map: (x: number) => number } | undefined
  companionText: (x: number) => string
  isCustom: (channel: Channel) => boolean
  cssName: (channel: Channel) => string
  customUnit: string
  textOf: (channel: Channel, value: (property: MotionProperty) => number) => string
  frameOf: (channel: Channel, value: (property: MotionProperty) => number) => Record<string, string>
  identityOf: (channel: Channel) => string
  prefersReducedMotion: () => boolean
  isCoarsePointer: () => boolean
  resting: Record<MotionProperty, number>
  base: Partial<Record<MotionProperty, number>>
  segments: Map<MotionProperty, Segment>
  running: Map<Channel, Animation>
  retireTimers: Map<Channel, ReturnType<typeof setTimeout>>
  retireFrames: Set<Animation>
  retireLooks: Map<Channel, ReturnType<typeof setTimeout>>
  touched: Set<Channel>
  borrowedOpacity: number | null
  target: HTMLElement | null
  pendingGroups: Set<StartGroup>
  restWaits: Set<RestWait>
  unmountQueued: boolean
  lastDetached: HTMLElement | null
  onLastDetached: (write: () => void) => void
  callGroup: StartGroup | null
  presented: Element | null
  hitTested: { x: number, y: number }
  unpresent: (() => void) | null
  promoted: Set<Channel>
  ownWillChange: string | null
  sheetWillChange: string
  sheetWillChangeRead: boolean
  sheetReadTimer: ReturnType<typeof setTimeout> | null
  sheetReadQueuedFor: HTMLElement | null
  demoteTimer: ReturnType<typeof setTimeout> | null
  promotionProperty: string | null
  heldIdentity: Set<Channel>
  segmentAt: (property: MotionProperty, time: number) => Segment | null
  isHeld: (segment: Segment) => boolean
  curveAt: (property: MotionProperty, time: number) => number
  datedFromLatest: (segment: Segment, latest: number | undefined) => { latest: number, start: number } | null
  shownSince: (property: MotionProperty, segment: Segment) => number | undefined
  endOf: (property: MotionProperty, segment: Segment) => number
  leaveWaitingCall: (segment: Segment, channel: Channel, latest: number) => void
  valueAt: (property: MotionProperty, time: number) => number
  showsAtRest: (property: MotionProperty, segment: Segment, time: number) => boolean
  velocityAt: (property: MotionProperty, time: number) => number
  valueBefore: (property: MotionProperty, time: number) => number
  finalValue: (property: MotionProperty) => number
  drawnTranslate: (property: MotionProperty, time: number) => number
  presentedSource: PresentedSource
  present: (isMoving: boolean) => void
  writeInline: (channel: Channel, value: (property: MotionProperty) => number, release?: boolean) => void
  taskBakeKey: (channel: Channel, moving: MotionProperty[], from: number, end: number, devicePixel: number) => unknown[] | null
  sharedSampleTimes: (property: MotionProperty, from: number, end: number, tolerance: number) => number[]
  sampleTimes: (property: MotionProperty, from: number, to: number, tolerance: number) => number[]
  atBase: (channel: Channel) => boolean
  baseChecked: boolean
  checkBase: (channel: Channel) => void
  hold: (channel: Channel, time: number) => void
  replaceIn: (group: StartGroup, segment: Segment, next: Segment) => void
  stale: Set<Channel>
  healQueued: boolean
  markStale: (channel: Channel) => void
  healStale: () => void
  rebuild: (channel: Channel, time: number) => void
  scheduleRetire: (channel: Channel, animation: Animation, end: number) => void
  ownOpacity: () => number
  writesOwnOpacity: () => boolean
  releaseOwnOpacity: () => void
  landPending: (finished: boolean) => void
  handBackBorrow: () => void
  releaseIdentity: (channel: Channel) => void
  releasing: Set<Channel>
  releaseQueued: boolean
  flushReleases: () => void
  remainingCurve: (animation: Animation) => number | null
  writePromotion: (element: HTMLElement) => void
  readSheetWillChange: (element: HTMLElement) => void
  queueSheetReadFor: (element: HTMLElement) => void
  readSheetWillChangeLater: () => void
  cancelSheetWillChangeRead: () => void
  promote: (channel: Channel) => void
  scheduleDemote: () => void
  demote: () => void
  beginGroup: (time: number, properties: Iterable<MotionProperty>, at: number | undefined, start?: AnimateOptions['start']) => StartGroup | null
  commitCall: (group: StartGroup | null, owner: HandleState, changed: MotionProperty[], time: number, presented?: boolean, waitsForFrame?: boolean) => void
  deferredCalls: { group: StartGroup, changed: MotionProperty[] }[]
  startDeferred: (calls: { group: StartGroup, changed: MotionProperty[] }[]) => void
  flushDeferred: () => void
  flushDeferredThrough: (call: {
    group: StartGroup
    changed: MotionProperty[]
  }) => void
  startCall: (group: StartGroup | null, changed: MotionProperty[], time: number) => void
  settleCancelled: (group: StartGroup) => void
  awaitStart: (group: StartGroup) => boolean
  syncGroup: (group: StartGroup) => void
  syncPending: () => void
  syncFinished: () => void
  startAfterBlock: (group: StartGroup, start: number) => number
  resolveGroup: (group: StartGroup, start: number) => void
  lastSpring: WeakMap<HandleState, SpringDescription>
  interrupt: (property: MotionProperty, time: number) => void
  settle: (owner: HandleState, finished: boolean) => void
  settleAtEnd: (owner: HandleState) => void
  makeHandle: (owner: HandleState, properties: MotionProperty[], finished: Promise<boolean>, time: number, group?: StartGroup | null, settlesWithLanding?: boolean) => MotionHandle
  newOwner: () => { owner: HandleState, finished: Promise<boolean> }
  springSegment: (owner: HandleState, property: MotionProperty, start: number, to: number, spring: SpringDescription, velocity: number) => Segment | null
  springFrom: (owner: HandleState, property: MotionProperty, start: number, from: number, velocity: number, to: number, resolved: SpringDescription) => Segment | null
  additiveSegment: (owner: HandleState, property: MotionProperty, start: number, to: number, spring: SpringDescription, old: Segment) => Segment
  additiveCurveSegment: (owner: HandleState, start: number, curve: MotionCurve, old: Segment) => Segment
  fadeSegment: (owner: HandleState, start: number, stops: ReadonlyArray<{ at: number, value: number }>, jumps?: ReadonlyArray<number>) => Segment
  shown: Map<MotionProperty, Shown>
  heldForFrame: Map<Channel, number>
  isShownLookQueued: boolean
  stopWatchingHidden: (() => void) | null
  framePage: Document | null
  isPageHidden: () => boolean
  forgetShown: () => void
  waitKey: object
  syncWaiting: () => void
  rebuildOnCallClocks: (channels: [Channel, number][]) => void
  flushWaiting: () => void
  watchHidden: () => void
  deferRebuild: (changed: MotionProperty[], time: number) => void
  commitWaitingNow: (channel: Channel) => void
  rebuildShown: (channel: Channel, time: number) => void
  noteShown: (properties: Iterable<MotionProperty>, time: number, group: StartGroup | null, at: number | undefined) => boolean
  shownAt: (entry: Shown, time: number) => { value: number, velocity: number }
  shifted: (segment: Segment, offset: number) => Segment
  lookAtShown: (frame?: number) => void
  commit: (changed: Iterable<MotionProperty>, time: number) => void
  landings: Set<Landing>
  carriedOwners: Set<HandleState>
  cancelLanding: (property: MotionProperty) => void
  landNow: (landing: Landing) => void
  adoptLandings: (plan: NonNullable<ReducedPlan['landing']>, properties: ReadonlyArray<MotionProperty>) => { carried: HandleState[], owners: Map<MotionProperty, HandleState> }
  joinWaitingDip: (owner: HandleState) => void
  opacityHeading: () => number
  endLanding: (landing: Landing) => void
  fadeHeldFor: (landing: Landing) => number
  landWhenFaded: (landing: Landing) => void
  scheduleLanding: (owner: HandleState, started: Promise<number>, plan: NonNullable<ReducedPlan['landing']>, adopted: ReturnType<MotionEngine['adoptLandings']> | null) => void
  land: (landing: Landing) => void
  takeOverLandings: (properties: ReadonlyArray<MotionProperty>, namesOpacity: boolean) => void
  namedOpacity: WeakSet<HandleState>
  headingBeforeTakeOver: number | null
  planView: ReducedMotionView
  reducedMotion: (owner: HandleState, time: number, targets: Partial<Record<MotionProperty, number>>, properties: MotionProperty[], fade: boolean, role?: 'entrance' | 'exit') => ReducedPlan
  animator: Animator
}
