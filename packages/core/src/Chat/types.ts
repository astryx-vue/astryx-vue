import type { MaybeRefOrGetter, VNode } from 'vue'
import type { BadgeVariant } from '../Badge/types.js'
import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import type { SpacingStep } from '../Stack/types.js'

/** Who sent a message row. `system` is centered and ignores avatar, name, and metadata. */
export type ChatMessageSender = 'user' | 'assistant' | 'system'

/** Spacing and width preset shared by the layout, the list, and each message. */
export type ChatDensity = 'compact' | 'balanced' | 'spacious'

export type ChatMessageListAlign = 'top' | 'bottom'
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
  /**
   * Inline detail revealed when the row is expanded, such as a diff or command
   * output. For rich content use the `detail` slot instead.
   */
  resultDetail?: string
  /** Alias of `resultDetail`. `resultDetail` wins when both are set. */
  detail?: string
  /** Arbitrary caller data kept on the item. Never rendered. */
  data?: unknown
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
  /**
   * Vertical alignment when the list is shorter than its container.
   * `'bottom'` adds a spacer so a short conversation sits above the composer;
   * `'top'` leaves the spacer out so messages start at the top. A list that
   * already overflows scrolls the same way in both modes.
   * @default 'bottom'
   */
  align?: ChatMessageListAlign
}

export interface ChatMessageListSlots {
  /** Message rows, system lines, and unread dividers. */
  default?: () => VNode[]
  /** Shown when the default slot is omitted. */
  emptyState?: () => VNode[]
  /** Alias of `emptyState`. */
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
  /** Rich detail for one call. Falls back to `call.resultDetail` when omitted. */
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

/** Visual density of the composer shell. `spacious` uses the same spacing as `balanced`. */
export type ChatComposerDensity = ChatDensity

/** Resting elevation of the composer body. */
export type ChatComposerElevation = 'none' | 'low'

export interface ChatComposerStatus {
  type: 'error' | 'warning'
  message?: string
}

export interface ChatComposerProps {
  /**
   * Controlled draft. Omit it and the composer keeps the draft itself.
   * Bind with `v-model`.
   */
  modelValue?: string
  /** Placeholder shown while the draft is empty. */
  placeholder?: string
  /** Disables editing and sending. A visible stop button stays reachable. @default false */
  isDisabled?: boolean
  /** Spacing inside the body. @default 'balanced' */
  density?: ChatComposerDensity
  /**
   * `low` is raised and deepens on hover and focus.
   * `none` is flat, with a border. Keyboard focus in the editor adds the
   * shared focus ring either way; pointer focus does not.
   * @default 'low'
   */
  elevation?: ChatComposerElevation
  /** Shows the stop action instead of send. @default false */
  isStopShown?: boolean
  /** Error or warning rendered above or below the body. */
  status?: ChatComposerStatus
  /** Which side of the body the status sits on. @default 'bottom' */
  statusPosition?: 'top' | 'bottom'
}

export interface ChatComposerEmits {
  /** A trimmed, non-empty draft was submitted. The draft is then cleared. */
  'submit': [value: string]
  /** The stop action was activated. */
  'stop': []
  /** The draft changed, including the clear after a successful submit. */
  'change': [value: string]
  'update:modelValue': [value: string]
}

export interface ChatComposerSlots {
  /** Collapsible content above the body. Usually `ChatComposerDrawer`. */
  drawer?: () => VNode[]
  /** Start side of the header. Icon buttons at the small size line up with the row. */
  headerActions?: () => VNode[]
  /** End side of the header. Context such as a usage meter. */
  headerContext?: () => VNode[]
  /** Replaces the default token input. Read the draft from `useChatComposerContext`. */
  input?: () => VNode[]
  /** Start side of the footer. Medium buttons match the send button. */
  footerActions?: () => VNode[]
  /** Sits just before the send button. */
  sendActions?: () => VNode[]
  /** Replaces the default send and stop button. */
  sendButton?: () => VNode[]
}

/** What the composer can ask its input to do, without knowing the editor's markup. */
export interface ChatComposerInputControl {
  /** Move the caret to the end of the draft. Used when the body padding is clicked. */
  focus: () => void
}

export interface ChatComposerInputHandle {
  /** Insert a chip at the caret. Returns the chip id. */
  insertToken: (token: ChatComposerToken) => string | undefined
  /** Replace a chip with the text it serializes to. */
  expandToken: (id: string) => void
  /** Insert plain text at the caret. */
  insertText: (text: string) => void
  /** Focus the editor and keep a caret the user already had inside it. */
  focus: () => void
  /** Serialized draft, including chip values. */
  getValue: () => string
}

/** A chip drawn as a badge. `value` is what the submitted string contains. */
export interface ChatComposerTokenBadge {
  value: string
  /** Visible label. Falls back to `value`. */
  label?: string | number
  variant?: BadgeVariant
  /**
   * Artwork in the badge. A built-in glyph such as `check`, or an Iconify
   * name such as `carbon:user`.
   */
  icon?: string
}

/** A chip with its own markup. `value` is still what the submitted string contains. */
export interface ChatComposerTokenCustom {
  value: string
  render: () => VNode
}

export type ChatComposerToken = ChatComposerTokenBadge | ChatComposerTokenCustom

export interface ChatComposerTokenElementProps {
  token: ChatComposerToken
}

export type ChatComposerTriggerItem = SearchableItem

export interface ChatComposerTrigger {
  /** Character that opens the menu, such as `@` or `/`. */
  character: string
  /** Same search source a typeahead uses. `createStaticSource` covers a fixed list. */
  searchSource: SearchSource
  /** Row contents. The default is the item label. */
  renderItem?: (item: SearchableItem) => VNode
  /** Plain text is inserted as-is. A token becomes a chip. */
  onSelect: (item: SearchableItem) => string | ChatComposerToken
  /**
   * Turn a serialized value back into a chip when a saved draft is loaded.
   * The input stores the value; callers use this when they rebuild chips.
   */
  deserialize?: (value: string) => ChatComposerToken | null
  /**
   * Shown when the query matches nothing.
   * `null` and omission use the localized default. An empty string shows nothing.
   */
  emptySearchText?: string | VNode | null
  /** Shown while an async search is in flight. */
  loadingText?: string
  /** Accessible name of the list. */
  menuLabel?: string
}

export interface ChatComposerInputProps {
  /** Controlled draft. Inside `ChatComposer`, the shell's draft is used when this is omitted. */
  modelValue?: string
  placeholder?: string
  /** Lines before the editor scrolls. @default 8 */
  maxRows?: number
  /** Trigger characters that open a suggestion list. */
  triggers?: ChatComposerTrigger[]
  /**
   * Delay before an async trigger search. Sync sources are not delayed.
   * @default 150
   */
  debounceMs?: number
  /** Arrow keys at the ends of the draft recall earlier submissions. @default true */
  hasHistory?: boolean
  /** Accessible name of the editor. */
  label?: string
  /** Disables editing. Falls back to the surrounding composer. */
  isDisabled?: boolean
  /**
   * Long pastes become chips. Pass a `useChatPasteAsToken` result to change
   * the threshold, or `false` to insert the text as-is.
   */
  pasteAsToken?: { onPaste: (text: string) => boolean } | false
  /**
   * First chance at a plain-text paste. Return true to keep the input from
   * inserting the text itself.
   */
  pasteAction?: (event: ClipboardEvent, text: string) => boolean | void
}

export interface ChatComposerInputEmits {
  'change': [value: string]
  'update:modelValue': [value: string]
  /** Enter without Shift. Shift+Enter inserts a newline. */
  'submit': [value: string]
  /** Files from a paste or a drop. A file drop does not navigate away. */
  'files': [files: File[]]
  /**
   * Keydown after an open trigger menu has declined the event.
   * `preventDefault()` skips Enter-to-send and history recall.
   */
  'keydown': [event: KeyboardEvent]
}

export interface ChatSendButtonProps {
  /** Stop instead of send. Falls back to the surrounding composer. */
  isStopShown?: boolean
  /** Disables send. Does not disable stop. Falls back to the inverse of whether the draft can be sent. */
  isDisabled?: boolean
  /** @default 'md' */
  size?: 'sm' | 'md'
}

export interface ChatSendButtonEmits {
  /** Send was activated. Inside a composer this also submits the current draft. */
  send: []
  /** Stop was activated. */
  stop: []
  /** Follows the send or stop action. */
  click: [event: MouseEvent]
}

export interface ChatSendButtonSlots {
  /** Replaces the up arrow. */
  sendIcon?: () => VNode[]
  /** Replaces the stop square. */
  stopIcon?: () => VNode[]
}

export interface ChatComposerDrawerProps {
  /** Enables collapse and is shown in the default summary. Omit it and the drawer stays open. */
  count?: number
  /** Name used in the summary and in the expand and collapse labels. */
  label?: string
  /** Controlled collapsed state. Bind with `v-model:is-collapsed`. */
  isCollapsed?: boolean
  /** Initial collapsed state while `isCollapsed` is unbound. @default false */
  defaultIsCollapsed?: boolean
}

export interface ChatComposerDrawerEmits {
  collapsedChange: [isCollapsed: boolean]
}

export interface ChatComposerDrawerSlots {
  default?: () => VNode[]
  /** Replaces the count badge and label. The button still owns the disclosure name. */
  collapsedSummary?: () => VNode[]
}

export interface ChatDictationButtonProps {
  /**
   * Return value of `useChatDictation` or `useSpeechRecognition`.
   * Plain booleans work too, so a demo can drive the button without a microphone.
   */
  dictation: {
    isSupported: MaybeRefOrGetter<boolean>
    isListening: MaybeRefOrGetter<boolean>
    bands: MaybeRefOrGetter<readonly number[]>
    volume: MaybeRefOrGetter<number>
    toggle: () => void
  }
  /** @default 'md' */
  size?: 'sm' | 'md'
  /**
   * Hide the control when speech recognition is missing.
   * When false, the control stays visible and disabled.
   * @default true
   */
  isHiddenWhenUnsupported?: boolean
  /** Accessible name. Defaults to the localized start or stop dictation label. */
  label?: string
}

export interface ChatTokenizedTextProps {
  /**
   * Message text that may contain serialized token values.
   * The default slot is the usual place for it; this prop does the same and
   * wins when both are set.
   */
  text?: string
  /**
   * Chips to substitute. Each non-empty `value` is matched literally.
   * The same objects a trigger's `onSelect` returns can be reused here.
   */
  tokens?: ChatComposerToken[]
}

export interface ChatTokenizedTextSlots {
  /** The message text. Plain text only: tokens come from the `tokens` prop. */
  default?: () => VNode[]
}
