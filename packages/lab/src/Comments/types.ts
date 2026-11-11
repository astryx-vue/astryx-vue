import type { ChatComposerTrigger, MarkdownInlinePlugin, MarkdownPlugin } from '@astryx-vue/core'
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

/**
 * `interactive` enables every permitted action; `non-editable` keeps create,
 *  reply and react but removes edit and delete; `read-only` removes every
 *  control that changes data.
 */
export type CommentMode = 'interactive' | 'non-editable' | 'read-only'

/**
 * Where a comment is in being posted, in Chat's message-status vocabulary:
 * `sending` while the post is in flight, `sent` once it has posted, and
 * `error` when it couldn't be posted.
 */
export type CommentStatus = 'sending' | 'sent' | 'error'

/** A person or agent who writes comments, reacts, or acts on the item. */
export interface CommentUser {
  /** Stable host-owned id, used for equality ("is this my comment?"). */
  id: string
  /** Full display name. Never a viewer-relative label such as "You". */
  name: string
  /**
   * An agent shows its logo (`avatarUrl`), or square-cornered initials
   * without one, and an Agent badge beside its name.
   * @default 'person'
   */
  kind?: 'person' | 'agent'
  /** Where the author's name links, such as their profile. */
  href?: string
  /** Profile picture, or an agent's square logo. Initials without one. */
  avatarUrl?: string
}

/** A selectable reaction. */
export interface CommentReactionOption {
  /** Stable key the host stores, such as `like`. */
  key: string
  /** Emoji or compact glyph shown in the picker and on the reaction. */
  label: string
  /**
   * Human-readable name, such as "Like", for the reaction's accessible label
   * and tooltip. Optional for the keys in DEFAULT_COMMENT_REACTIONS, which
   * take their localized names.
   */
  description?: string
}

/** A reaction summary on a comment. */
export interface CommentReaction extends CommentReactionOption {
  count: number
  /** Whether the viewer is one of the people who reacted. */
  reactedByViewer?: boolean
  /** Who reacted, named in the reaction's tooltip. */
  actors?: readonly Pick<CommentUser, 'id' | 'name'>[]
}

/** One version of a comment in its edit history. */
export interface CommentVersion {
  id: string
  body: string
  editedAt: string | number
  author?: CommentUser
  isCurrent?: boolean
}

/**
 * What a comment's author, typically an agent, is doing while it still writes
 * the comment, and where to watch the work.
 */
export interface CommentProgress {
  /** What the author is doing, as a reader would say it: "Reading the file…". */
  label: string
  /** Where to watch the work, such as the agent's session. */
  link?: { label: string, href: string }
}

/** A comment: a thread's first comment or one of its replies. */
export interface CommentData {
  id: string
  author: CommentUser
  /** Markdown. */
  body: string
  createdAt: string | number
  updatedAt?: string | number
  /** Shows Edited beside the time; opens the edit history when there is one. */
  isEdited?: boolean
  /** Host-owned unread state. Shows a New badge that fades after five seconds. */
  isUnread?: boolean
  /** Earlier versions, newest first, when the host already has them. */
  previousVersions?: readonly CommentVersion[]
  /**
   * Host-controlled metadata for people who have seen this comment. Comments
   * does not render it by default; render callbacks receive it with the comment.
   */
  seenBy?: readonly CommentUser[]
  reactions?: readonly CommentReaction[]
  /** @default 'sent' */
  status?: CommentStatus
  /** Shown when `status` is `error`. */
  errorMessage?: string
  /**
   * Marks a comment its author is still writing. The label shows in place of
   * the body. The comment takes no reactions, replies, edits or deletions
   * until it is written.
   */
  progress?: CommentProgress
  /** Per-comment permission; the host stays authoritative. @default true */
  canReply?: boolean
  /** @default true */
  canReact?: boolean
  /** @default the viewer wrote it */
  canEdit?: boolean
  /** @default the viewer wrote it */
  canDelete?: boolean
}

/** A thread: its first comment, which carries the thread's replies. */
export interface CommentThreadData extends CommentData {
  /**
   * Other people currently composing in this thread. Controlled, transient
   * state: update it from your collaboration layer and expire stale entries
   * there. While this thread is open, the current viewer is not shown.
   */
  typingUsers?: readonly CommentUser[]
  /** One level of replies, oldest first. */
  replies?: readonly CommentData[]
  /** Makes this an inline comment: the passage its thread discusses. */
  anchor?: CommentAnchor
  /** A resolved thread: Resolved beside the time, muted text, and Reopen. */
  isResolved?: boolean
  /** Who resolved the thread, named in the Resolved label's tooltip. */
  resolvedBy?: CommentUser
  /**
   * Calls the thread out without selecting it, such as the comment a playing
   * video has reached: it takes the selected thread's muted fill, and nothing
   * expands, scrolls, or takes focus.
   */
  isHighlighted?: boolean
  /**
   * Whether the viewer may resolve or reopen this thread when the host
   * handles it. Its Resolved label shows either way.
   * @default true
   */
  canResolve?: boolean
}

/** A timeline row for a status change or other activity on the item. */
export interface CommentActivityEvent {
  id: string
  /** What happened, as a sentence: "Status changed to Ready for review". */
  label: string
  description?: string
  createdAt: string | number
  actor?: CommentUser
  /** Where the event's time links. */
  href?: string
}

/** Uploads images for a composer and returns where they were stored. */
export type CommentImageUploader = (
  files: readonly File[],
  context: CommentComposerContext,
) => readonly CommentUploadedImage[] | Promise<readonly CommentUploadedImage[]>

type MaybePromise = void | Promise<void>

/**
 * Behavior and rendering shared by Comments and a standalone CommentThread.
 * Inside a Comments panel, its threads take these from the Comments.
 */
export interface CommentThreadSharedProps {
  currentUser?: CommentUser
  /** @default 'interactive' */
  mode?: CommentMode
  /**
   * The parent surface. `section` renders each thread as an outlined Card;
   * `card` renders divider-bounded Sections so cards never nest.
   * @default 'section'
   */
  container?: 'section' | 'card'
  composerPlaceholder?: string
  /** @default 'yellow' */
  highlightColor?: CommentHighlightColor
  /** @default DEFAULT_COMMENT_REACTIONS */
  reactionOptions?: readonly CommentReactionOption[]
  agentCommands?: readonly CommentAgentCommand[]
  composerTriggers?: readonly ChatComposerTrigger[]
  markdownPlugins?: readonly MarkdownPlugin[]
  markdownInlinePlugins?: readonly MarkdownInlinePlugin[]
  getReplyMention?: (author: CommentUser) => string | undefined
  /** @default true */
  hasEmojiPicker?: boolean
  isSubmitting?: boolean
  onComposerDraftChange?: (value: string, context: CommentComposerContext) => void
  onSubmit?: (content: string, parentCommentId?: string) => MaybePromise
  onSaveEdit?: (commentId: string, content: string) => MaybePromise
  onDelete?: (commentId: string) => MaybePromise
  onReact?: (
    commentId: string,
    reactionKey: string,
    option?: CommentReactionOption,
  ) => MaybePromise
  onRetryComment?: (commentId: string) => MaybePromise
  onResolveThread?: (commentId: string) => MaybePromise
  onReopenThread?: (commentId: string) => MaybePromise
  loadVersions?: (commentId: string) => Promise<readonly CommentVersion[]>
  onUploadImages?: CommentImageUploader
  renderAnchor?: (comment: CommentThreadData, defaultAnchor: VNode) => VNode
  renderBody?: (comment: CommentData) => VNode
  renderVersionBody?: (version: CommentVersion) => VNode
  renderAdditionalActions?: (comment: CommentData) => VNode
  renderComposer?: (props: CommentComposerRenderProps) => VNode
}

export interface CommentThreadBindProps extends CommentThreadSharedProps {
  /** The thread: its first comment, which carries its replies. */
  comment: CommentThreadData
  /**
   * Whether the thread is open. Omit it to let the thread own selection.
   * Host selection does not move focus or open the reply composer.
   */
  isSelected?: boolean
}

export interface CommentThreadProps extends CommentThreadBindProps {
  /** Called when the viewer opens or closes the thread. Prefer `@selected-change`. */
  onSelectedChange?: (isSelected: boolean) => void
  /**
   * Hands the thread its anchored host's light dismissal. Prefer `@dismiss`.
   * Pair it with `hasLightDismiss={false}` and `hasEscapeDismiss={false}` on
   * the host Popover.
   */
  onDismiss?: () => void
}

export interface CommentThreadEmits {
  selectedChange: [isSelected: boolean]
  dismiss: []
}

export interface CommentThreadSlots {
  anchor?: (props: { comment: CommentThreadData, defaultAnchor: VNode }) => VNode[]
  body?: (props: { comment: CommentData }) => VNode[]
  versionBody?: (props: { version: CommentVersion }) => VNode[]
  additionalActions?: (props: { comment: CommentData }) => VNode[]
  composer?: (props: CommentComposerRenderProps) => VNode[]
}

/**
 * The reactions a thread offers when the host passes none: Like, Love, Haha,
 * Wow, Sad, and Celebrate, named in the viewer's language.
 */
export const DEFAULT_COMMENT_REACTIONS: readonly CommentReactionOption[] = Object.freeze([
  { key: 'like', label: '👍' },
  { key: 'love', label: '❤️' },
  { key: 'laugh', label: '😂' },
  { key: 'wow', label: '😮' },
  { key: 'sad', label: '😢' },
  { key: 'celebrate', label: '🎉' },
])

export type CommentsComposerPosition = 'top' | 'bottom' | 'none'
export type CommentsDensity = 'compact' | 'balanced'
export type CommentsLayout = 'pane' | 'embedded'

/** The comments on one item: threads, activity events, and a new-comment composer. */
export interface CommentsProps extends CommentThreadSharedProps {
  comments: readonly CommentThreadData[]
  events?: readonly CommentActivityEvent[]
  label?: string
  /** @default 'bottom' */
  composerPosition?: CommentsComposerPosition
  /** @default 'balanced' */
  density?: CommentsDensity
  /** @default 'pane' */
  layout?: CommentsLayout
  selectedThreadId?: string | null
  composerAnchor?: CommentAnchor
  onComposerAnchorDismiss?: () => void
  composerControls?: VNode
  isLoading?: boolean
  /** Description on the load-failure Banner. The title is the localized "Comments couldn't load". */
  loadError?: string
  onRetryLoad?: () => MaybePromise
  hasOlderComments?: boolean
  isLoadingOlder?: boolean
  onLoadOlder?: () => MaybePromise
  composerError?: string
  emptyState?: VNode
  renderEvent?: (event: CommentActivityEvent) => VNode
}

export interface CommentsEmits {
  selectedThreadChange: [threadId: string | null]
}

export interface CommentsSlots {
  emptyState?: () => VNode[]
  event?: (props: { event: CommentActivityEvent }) => VNode[]
  composer?: (props: CommentComposerRenderProps) => VNode[]
  composerControls?: () => VNode[]
}
