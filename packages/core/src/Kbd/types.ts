/**
 * Key names that Kbd paints as a glyph or a fixed word rather than as the
 * uppercased key name.
 *
 * `mod` is resolved per platform: it reads as ⌘ on Apple platforms and as
 * `Ctrl` everywhere else.
 */
export type KbdSpecialKey
  = | 'mod'
    | 'ctrl'
    | 'alt'
    | 'shift'
    | 'enter'
    | 'backspace'
    | 'escape'
    | 'tab'
    | 'up'
    | 'down'
    | 'left'
    | 'right'
    | 'plus'

/**
 * Alternate spellings accepted in the `keys` string.
 *
 * An alias renders and announces exactly like the key it names.
 */
export type KbdKeyAlias = 'esc' | 'return'

/**
 * One key inside a shortcut string: a special key, an alias, or any other key
 * name, which Kbd uppercases.
 */
export type KbdKeyName = KbdSpecialKey | KbdKeyAlias | (string & {})

export interface KbdProps {
  /**
   * The keyboard shortcut to present. Separate keys with `+`.
   *
   * Special keys: `mod` (Command on Apple platforms, Control elsewhere),
   * `ctrl`, `alt`, `shift`, `enter`, `backspace`, `escape`, `tab`, `up`,
   * `down`, `left`, `right`, and `plus`. Use `plus` for a literal `+` key, as
   * in `"shift+plus"`. `esc` is an alias for `escape`, and `return` is an
   * alias for `enter`.
   *
   * Any other segment is uppercased (`"f1"` renders as `F1`), and whitespace
   * around a key is ignored, so `"mod + k"` and `"mod+k"` are the same
   * shortcut.
   *
   * @example
   * ```
   * "mod+k"
   * "mod+shift+p"
   * "shift+plus"
   * "enter"
   * ```
   */
  keys: string
}
