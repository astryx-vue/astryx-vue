import type { CommentActivityEvent, CommentsLayout, CommentThreadData } from './types.js'
import type { ThreadDivider } from './utils.js'
import { THREAD_DIVIDERS, timelineTime } from './utils.js'

export type CommentsTimelineEntry
  = | { kind: 'comment', value: CommentThreadData }
    | { kind: 'event', value: CommentActivityEvent }

/** Interleaves threads and events by time. Newest-first only when the thread list itself runs that way. */
export function commentsTimeline(
  comments: readonly CommentThreadData[],
  events: readonly CommentActivityEvent[] = [],
): CommentsTimelineEntry[] {
  const first = comments[0]
  const last = comments[comments.length - 1]
  const direction
    = first != null && last != null && comments.length > 1 && timelineTime(first.createdAt) > timelineTime(last.createdAt)
      ? -1
      : 1
  return [
    ...comments.map(value => ({ kind: 'comment' as const, value })),
    ...events.map(value => ({ kind: 'event' as const, value })),
  ].sort((left, right) =>
    direction * (timelineTime(left.value.createdAt) - timelineTime(right.value.createdAt)),
  )
}

/** Inside a host Card, the first and last threads drop their outer rules. */
export function commentsDividersAt(
  index: number,
  length: number,
  hasOlderComments: boolean,
  layout: CommentsLayout,
  container: 'section' | 'card',
): readonly ThreadDivider[] {
  if (layout !== 'embedded' || container !== 'card')
    return THREAD_DIVIDERS
  return THREAD_DIVIDERS.filter(divider =>
    !(divider === 'top' && index === 0 && !hasOlderComments)
    && !(divider === 'bottom' && index === length - 1),
  )
}
