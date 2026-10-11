import type { VNode } from 'vue'
import type { SpacingStep } from '../Stack/types.js'

/** Who sent a message row. `system` is centered and ignores avatar, name, and metadata. */
export type ChatMessageSender = 'user' | 'assistant' | 'system'

/** Spacing and width preset shared by the layout, the list, and each message. */
export type ChatDensity = 'compact' | 'balanced' | 'spacious'

export type ChatMessageBubbleVariant = 'filled' | 'ghost'
export type ChatMessageBubbleGroup = 'first' | 'middle' | 'last'
export type ChatMessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'error'
export type ChatSystemMessageVariant = 'default' | 'divider'
export type ChatToolCallStatus = 'pending' | 'running' | 'complete' | 'error'

/** One tool invocation. The shape matches what an LLM response already returns. */
export interface ChatToolCallItem {
  /** Tool or function name. */
  name: string
  /** Current execution status. @default 'complete' */
  status?: ChatToolCallStatus
  /** What the tool acted on, such as a file name or a query. */
  target?: string
  /** How long the call took, shown once it completes. For example `1.2s`. */
  duration?: string
  /** Sandbox or worker name, shown as a neutral badge. */
  node?: string
  /** Lines or characters added. Rendered as `+12`. */
  additions?: number
  /** Lines or characters removed. Rendered as `-3`. */
  deletions?: number
  /** Extra plain text after the label. */
  stats?: string
  /**
   * Error detail when `status` is `error`. Spoken to assistive tech and shown
   * as the status icon's tooltip.
   */
  errorMessage?: string
  /** Stable identity. Derived from the other fields when omitted. */
  key?: string
  /** Plain-text detail revealed when the row is expanded. */
  detail?: string
}

export interface ChatLayoutProps {
  /**
   * Spacing, bubble width, and the frosted dock.
   * @default 'balanced'
   */
  density?: ChatDensity
  /**
   * Element that should scroll instead of the layout root.
   * Leave it unset and the layout itself scrolls.
   */
  scrollRef?: HTMLElement | null
  /**
   * Renders the built-in scroll-to-bottom button.
   * Set this to `false` when the `scrollButton` slot should be the only control,
   * or when the button should be absent.
   * @default true
   */
  showScrollButton?: boolean
}

export interface ChatLayoutSlots {
  /** Transcript. Usually one `ChatMessageList`. */
  default?: () => VNode[]
  /** Pinned to the bottom of the layout, above the frosted scrim. */
  composer?: () => VNode[]
  /** Shown when the default slot is omitted. */
  empty?: () => VNode[]
  /**
   * Replaces the built-in scroll button.
   * Receives the current visibility, the new-message label, and a function
   * that dismisses that label and scrolls to the bottom.
   */
  scrollButton?: (props: ChatLayoutScrollSlotProps) => VNode[]
}

export interface ChatLayoutScrollSlotProps {
  isVisible: boolean
  label?: string
  scrollToBottom: () => void
}

export interface ChatLayoutScrollButtonProps {
  /** Whether the button is shown. A hidden button stays mounted so it can fade. */
  isVisible: boolean
  /** Expands the pill. Omit it for the icon-only down arrow. */
  label?: string
}

export interface ChatLayoutScrollButtonEmits {
  click: []
}

export interface ChatMessageListProps {
  /**
   * Visual density passed down to messages that do not set their own.
   * @default 'balanced'
   */
  density?: ChatDensity
  /**
   * Gap between top-level rows, on the spacing scale.
   * Overrides the density gap without changing padding.
   */
  gap?: SpacingStep
  /**
   * Loads older messages when the top of the list scrolls into view.
   * A spinner is shown at the top while the promise is pending.
   */
  scrollToTopAction?: () => Promise<void>
  /**
   * Marks the log busy while an assistant message is still streaming, so a
   * screen reader waits and announces the finished message once.
   * @default false
   */
  isStreaming?: boolean
  /** Accessible name of the log. Defaults to the localized "Messages". */
  label?: string
}

export interface ChatMessageListSlots {
  /** Message rows, system lines, and unread dividers. */
  default?: () => VNode[]
  /** Shown when the default slot is omitted. */
  empty?: () => VNode[]
}

export interface ChatMessageProps {
  sender: ChatMessageSender
  /**
   * Plain sender name above the body.
   * Prefer the `name` slot, or `ChatMessageBubble`'s `name`, when the first
   * child is a bubble — a bubble name lines up with the bubble padding.
   */
  name?: string
  /**
   * Density for this row. Falls back to the surrounding list, then `balanced`.
   */
  density?: ChatDensity
}

export interface ChatMessageSlots {
  /** Body. Bubbles, reasoning, tool calls, or plain text. */
  default?: () => VNode[]
  /** Avatar. Ignored when `sender` is `system`. */
  avatar?: () => VNode[]
  /** Sender name. Replaces the `name` prop. */
  name?: () => VNode[]
  /** Metadata under the body when the last child is not a bubble. */
  metadata?: () => VNode[]
}

export interface ChatMessageBubbleProps {
  /**
   * `filled` paints the sender surface. `ghost` keeps the padding and drops
   * the background, so mixed content still lines up. A bubble whose only
   * child is a code block, or an element with class `astryx-chat-card`,
   * drops that padding and background so the card lines up with the bubble.
   * @default 'filled'
   */
  variant?: ChatMessageBubbleVariant
  /** Sender name aligned to the bubble's inline padding. */
  name?: string
  /**
   * Which corner tightens when several bubbles are stacked.
   * Leave it unset for a standalone bubble.
   */
  group?: ChatMessageBubbleGroup
  /**
   * Overrides the default cap (`max(80%, 280px)`).
   * Pass `100%` when in-bubble content should span the message column.
   */
  width?: string
}

export interface ChatMessageBubbleSlots {
  /** Bubble body. Plain text in this suite; markdown belongs to the caller. */
  default?: () => VNode[]
  /** Replaces the `name` prop. */
  name?: () => VNode[]
  /** Metadata aligned to the bubble padding. Usually `ChatMessageMetadata`. */
  metadata?: () => VNode[]
}

export interface ChatMessageMetadataProps {
  /** Time or other short text. */
  timestamp?: string
  /** Secondary text, such as a model name. */
  footer?: string
  /** Delivery state. Renders nothing when timestamp, footer, and status are all absent. */
  status?: ChatMessageStatus
}

export interface ChatMessageMetadataSlots {
  /** Replaces the `timestamp` prop. */
  timestamp?: () => VNode[]
  /** Replaces the `footer` prop. */
  footer?: () => VNode[]
}

export interface ChatSystemMessageProps {
  /**
   * `default` is a centered line. `divider` draws a rule on each side.
   * @default 'default'
   */
  variant?: ChatSystemMessageVariant
}

export interface ChatSystemMessageSlots {
  default?: () => VNode[]
  /** Icon before the text. Ignored for the divider variant. */
  icon?: () => VNode[]
}

export interface ChatToolCallsProps {
  /** Tool calls from one assistant turn. An empty array renders nothing. */
  calls: ChatToolCallItem[]
  /** Summary shown while a group is expanded. Defaults to a localized count. */
  label?: string
  /** Controlled expanded state, bound with `v-model:is-expanded`. */
  isExpanded?: boolean
  /**
   * Expanded state used while `isExpanded` is unbound.
   * @default false
   */
  defaultIsExpanded?: boolean
}

export interface ChatToolCallsEmits {
  /** The expanded state the header is asking for. */
  expandedChange: [isExpanded: boolean]
}

export interface ChatToolCallsSlots {
  /** Rich detail for one call. Falls back to `call.detail` when omitted. */
  detail?: (props: { call: ChatToolCallItem }) => VNode[]
}

export interface ChatReasoningProps {
  /** Header label. Defaults to the localized "Thinking". */
  label?: string
  /** Duration shown after the label once streaming has finished, such as `12s`. */
  duration?: string
  /** Paints a shimmer on the label and hides the one-line preview. @default false */
  isStreaming?: boolean
  /** Controlled expanded state, bound with `v-model:is-expanded`. */
  isExpanded?: boolean
  /** Expanded state used while `isExpanded` is unbound. @default false */
  defaultIsExpanded?: boolean
}

export interface ChatReasoningEmits {
  expandedChange: [isExpanded: boolean]
}

export interface ChatReasoningSlots {
  /** Full reasoning. A plain string is also reused as the collapsed preview. */
  default?: () => VNode[]
}

export interface ChatTypingIndicatorProps {
  /**
   * People currently typing.
   * One name, two names, and three or more each get their own sentence.
   * An empty list renders the dots only.
   */
  names?: string[]
}

export interface ChatUnreadDividerProps {
  /** Short label at the end of the rule. Defaults to the localized "New". */
  label?: string
}
