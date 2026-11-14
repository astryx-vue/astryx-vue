import type { ChatComposerTrigger } from '@astryx-vue/core'
import type { VNode } from 'vue'

/**
 * The passage an inline comment discusses. The host owns anchoring; the
 * composer quotes the selected text above the input.
 */
export interface CommentAnchor {
  /** The selected text, quoted above the comment. */
  quote: string
  /**
   * `orphaned` when edits removed the passage. Standalone CommentComposer
   * still quotes it; threads will show an Outdated badge later.
   * @default 'anchored'
   */
  status?: 'anchored' | 'orphaned'
}

/**
 * A color of the Astryx palette, as a host highlights inline comments'
 * passages in it. Quotes draw their rule in `--astryx-color-border-<color>`.
 */
export type CommentHighlightColor
  = | 'blue'
    | 'cyan'
    | 'gray'
    | 'green'
    | 'orange'
    | 'pink'
    | 'purple'
    | 'red'
    | 'teal'
    | 'yellow'

/** An image the host's upload flow stored. */
export interface CommentUploadedImage {
  /** URL of the stored image. */
  url: string
  /** Description used as the image's alt text. */
  alt: string
}

/** Which composer a callback came from. */
export type CommentComposerContext
  = | {
    kind: 'comment'
    /** The passage a new inline comment will attach to, when there is one. */
    anchor?: CommentAnchor
  }
  | { kind: 'edit', commentId: string }
  | { kind: 'reply', parentCommentId: string, repliedToCommentId: string }

/** What a `renderComposer` replacement receives. */
export interface CommentComposerRenderProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  placeholder: string
  isSubmitting: boolean
  error?: string
  contextLabel?: string
  context: CommentComposerContext
  onCancel?: () => void
}

/**
 * An agent a comment can address with a slash command: typing `/` in a
 * composer offers it, and a posted comment shows the command as its chip.
 */
export interface CommentAgentCommand {
  /** The command after the slash: `ask` for `/ask`. Letters, digits, `-` and `_`. */
  command: string
  /** The agent's name, on its chip. */
  name: string
  /** What asking it does, in the `/` menu. */
  description: string
  /** Square agent logo; initials without one. */
  logoUrl?: string
}

/** Failure shown in the composer's error Banner. */
export interface ErrorBannerContent {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  isActionDisabled?: boolean
  /** Its own retry is running: say nothing until the outcome. */
  isRetrying?: boolean
  /** The failure was already announced elsewhere; this Banner stays silent. */
  isAnnounced?: boolean
}

export interface CommentComposerBaseProps {
  value: string
  placeholder: string
  label?: string
  isSubmitting?: boolean
  error?: string
  contextLabel?: string
  context: CommentComposerContext
  anchor?: CommentAnchor
  highlightColor?: CommentHighlightColor
  triggers?: readonly ChatComposerTrigger[]
  agentCommands?: readonly CommentAgentCommand[]
  hasEmojiPicker?: boolean
  /** Focuses the input whenever it changes, e.g. when Reply opens it. */
  focusKey?: string
  /** Shows Retry on the error Banner. */
  hasRetry?: boolean
  /** Shows Cancel beside an edit context label. */
  hasCancel?: boolean
  /** Adds Remove quoted text to the quoted passage. */
  hasAnchorDismiss?: boolean
  /**
   * Uploads images attached, pasted, or dropped in the input, and appends the
   * stored images to the draft as Markdown. Adds the attach button.
   */
  onUploadImages?: (
    files: readonly File[],
  ) => readonly CommentUploadedImage[] | Promise<readonly CommentUploadedImage[]>
  renderComposer?: (props: CommentComposerRenderProps) => VNode
}

export interface CommentComposerBaseEmits {
  change: [value: string]
  submit: [value: string]
  retry: []
  cancel: []
  anchorDismiss: []
  actionPendingChange: [isPending: boolean]
}

export interface CommentComposerProps {
  /** The draft, controlled. Bind with `value` / `@change` or `v-model`. */
  value?: string
  modelValue?: string
  /** Placeholder of the input. Defaults to the localized "Write a comment…". */
  placeholder?: string
  /** Accessible name of the input. Defaults to the placeholder. */
  label?: string
  /** Holds Post and the attach and emoji buttons while a post is in flight. */
  isSubmitting?: boolean
  /** Shows an error Banner above the composer. */
  error?: string
  /** The passage a new inline comment attaches to, quoted above the input. */
  anchor?: CommentAnchor
  /** The palette color the host highlights passages in. @default 'yellow' */
  highlightColor?: CommentHighlightColor
  /** Typeahead triggers, such as an `@` people search. */
  triggers?: readonly ChatComposerTrigger[]
  /** Agents the comment can address: typing `/` lists them. */
  agentCommands?: readonly CommentAgentCommand[]
  /** Whether the emoji picker button shows. @default true */
  hasEmojiPicker?: boolean
  /**
   * Uploads images attached, pasted, or dropped in the input, and appends the
   * stored images to the draft as Markdown. Adds the attach button.
   */
  onUploadImages?: (
    files: readonly File[],
  ) => readonly CommentUploadedImage[] | Promise<readonly CommentUploadedImage[]>
}

export interface CommentComposerEmits {
  'change': [value: string]
  'update:modelValue': [value: string]
  /** Posts the draft: Enter, or the Post button. Empty drafts never post. */
  'submit': [value: string]
  /** Retry on the error Banner. */
  'retry': []
  /** Remove quoted text on the quoted passage. */
  'anchorDismiss': []
}

export interface CommentComposerSlots {
  /** Product-owned controls after the attach and emoji buttons. Keep it to one short control. */
  controls?: () => VNode[]
  /** Replaces the default composer while keeping its state and context. */
  composer?: (props: CommentComposerRenderProps) => VNode[]
}

export interface CommentComposerBaseSlots extends CommentComposerSlots {}
