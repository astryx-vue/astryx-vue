/**
 * Identity data for one representative shown inside a CommentPin.
 */
export interface CommentPinParticipant {
  /** Stable identity used to remove duplicate representatives. */
  id: string
  /** Display name used by Avatar for image fallback initials. */
  name: string
  /** Optional image source passed to Avatar. */
  avatarSrc?: string
}

/** Pin heights on the shared element-size scale: 28, 32, or 36px. */
export type CommentPinSize = 'sm' | 'md' | 'lg'

export interface CommentPinProps {
  /**
   * Accessible action name and visual hover/focus tooltip.
   * Include grouped, unread, or resolved context when it changes the action's
   * meaning.
   */
  label: string
  /**
   * Ordered participants, lead first. A single marker shows the first. A
   * grouped marker shows distinct IDs as an AvatarGroup of at most three
   * circles: every participant when three or fewer are distinct, otherwise the
   * first two plus an ellipsis overflow circle. Pass every distinct
   * participant so the overflow appears only when more than three people
   * participate.
   */
  participants: readonly [CommentPinParticipant, ...CommentPinParticipant[]]
  /**
   * Pin height on the element-size scale: `sm` 28px, `md` 32px, `lg` 36px,
   * with 22px, 24px, and 28px participant circles.
   * @default 'sm'
   */
  size?: CommentPinSize
  /**
   * Total number of threads represented by this marker. Values above one use
   * the grouped presentation and show the exact total.
   * @default 1
   */
  threadCount?: number
  /**
   * Number of represented threads with unread activity. When above zero, an
   * accent status dot appears at the end of the pin: after the thread total,
   * or after the participant on a single pin. Values above `threadCount` are
   * capped.
   * @default 0
   */
  unreadCount?: number
  /** Whether this pin is the currently selected annotation target. */
  isSelected?: boolean
  /**
   * Whether another pin is selected in the host. Dims this pin without
   * disabling it, so it remains available to switch selection.
   */
  isDimmed?: boolean
  /**
   * Whether every thread represented by this pin is resolved. A resolved pin
   * renders nothing unless it is selected, so resolved discussion leaves the
   * content while a thread the reader opened keeps its anchor.
   */
  isResolved?: boolean
  /** Whether activation is unavailable. */
  isDisabled?: boolean
}

export interface CommentPinEmits {
  click: [event: MouseEvent]
}
