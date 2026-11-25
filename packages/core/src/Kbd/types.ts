/**
 * Key names that Kbd paints as a glyph or a fixed word rather than as the
 * uppercased key name.
 *
 * Modifiers are resolved per platform: `mod`, `ctrl`, `alt` and `shift` read
 * as Apple's symbols on Apple platforms and as `Ctrl`, `Alt` and `Shift` text
 * elsewhere and before hydration; `meta` reads as ⌘ on Apple platforms and as
 * `Win` elsewhere and before hydration.
 */
export type KbdSpecialKey
  = | 'mod'
    | 'meta'
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
   * Special keys: `mod` (⌘ on Apple platforms, `Ctrl` elsewhere), `ctrl`,
   * `alt` and `shift` (Apple symbols on Apple platforms, `Ctrl`, `Alt` and
   * `Shift` text elsewhere), `meta` (⌘ on Apple platforms, `Win` elsewhere),
   * `enter`, `backspace`, `escape`, `tab`, `up`, `down`, `left`, `right`, and
   * `plus`. Before hydration every modifier shows its text. Use `plus` for a literal `+` key, as
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
