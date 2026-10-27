/** Severity of one log entry. */
export type LogStreamLevel = 'info' | 'warn' | 'error' | 'debug'

/** One row in the stream; all strings are pre-formatted by the caller. */
export interface LogEntry {
  /** Stable unique key, e.g. `"req-1042"`. */
  id: string
  /** Pre-formatted timestamp, e.g. `"14:02:11.482"`. Deterministic. */
  timestamp: string
  level: LogStreamLevel
  message: string
  /** Emitting service/component, e.g. `"api-gateway"`. */
  source?: string
  /**
   * When set, the row becomes a disclosure button that opens this detail.
   *
   * 纯文字用这个字段；要放富内容时同时给 `detail` 插槽（`#detail="{ entry }"`），
   * 插槽内容优先，而这一行是否可展开仍然只看这个字段有没有值。
   */
  detail?: string
}

export interface LogStreamProps {
  /** Log rows, oldest first (live tails append at the end). */
  entries: LogEntry[]
  /**
   * Visual treatment. `'terminal'` renders dark chrome regardless of the active
   * color scheme: terminal output is a brand surface, like a real shell.
   * @default 'default'
   */
  variant?: 'default' | 'terminal'
  /**
   * Pin scroll to the newest entry as entries append. Unpins when the user
   * scrolls up. Bind it with `v-model:isFollowing` for controlled usage; leave
   * it unbound and the component owns the state (initially unpinned).
   */
  isFollowing?: boolean
  /** Max height of the scroll area before it scrolls. */
  maxHeight?: number | string
  /**
   * Show the timestamp column.
   * @default true
   */
  hasTimestamps?: boolean
  /**
   * Accessible label for the log region.
   * @default 'Log stream'
   */
  label?: string
}

export interface LogStreamEmits {
  /** Emitted with the follow state the user asks for (scroll-up, "Jump to latest"). */
  followChange: [following: boolean]
}
