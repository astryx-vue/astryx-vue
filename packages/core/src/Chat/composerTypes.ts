import type { MaybeRefOrGetter, VNode } from 'vue'
import type { BadgeVariant } from '../Badge/types.js'
import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import type { ChatDensity } from './messageTypes.js'

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
   * Keep this query through spaces and punctuation.
   * It ends at a line break, after 64 characters, or when the same trigger
   * character starts again after a space, a tab, or a line break.
   * Another trigger character inside the query stays ordinary text.
   * @default false
   */
  hasMultiWordQuery?: boolean
  /**
   * Turn a serialized value back into a chip when a saved draft is loaded.
   * The input stores the value; callers use this when they rebuild chips.
   */
  deserialize?: (value: string) => ChatComposerToken | null
  /**
   * Shown when the query matches nothing.
   * A single-token query uses the localized default when this is `null` or omitted.
   * An empty string keeps the menu open and shows no message.
   * A multi-word query hides the menu when this is `null` or omitted.
   * Supply a string to keep that empty panel open.
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
