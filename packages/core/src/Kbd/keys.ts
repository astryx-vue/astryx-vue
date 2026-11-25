const KEY_ALIASES = new Map<string, string>([
  ['esc', 'escape'],
  ['return', 'enter'],
])

/**
 * Glyphs painted in a key badge on every platform. A `Map` keeps an unknown
 * key such as `constructor` from resolving to an object prototype member.
 */
const KEY_DISPLAY = new Map<string, string>([
  ['enter', '\u21B5'],
  ['backspace', '\u232B'],
  ['escape', 'Esc'],
  ['tab', '\u21E5'],
  ['up', '\u2191'],
  ['down', '\u2193'],
  ['left', '\u2190'],
  ['right', '\u2192'],
  ['plus', '+'],
])

/** Modifier symbols on Apple platforms; `meta` is the Command key there. */
const APPLE_MODIFIER_DISPLAY = new Map<string, string>([
  ['mod', '\u2318'],
  ['meta', '\u2318'],
  ['ctrl', '\u2303'],
  ['alt', '\u2325'],
  ['shift', '\u21E7'],
])

/**
 * Modifier text elsewhere, and before the platform is known (server render
 * and the first client render), so the keycap reads as the user's keyboard.
 */
const MODIFIER_TEXT = new Map<string, string>([
  ['mod', 'Ctrl'],
  ['ctrl', 'Ctrl'],
  ['alt', 'Alt'],
  ['shift', 'Shift'],
  ['meta', 'Win'],
])

/**
 * Spoken words for the accessible name. Assistive technology cannot announce
 * the glyphs above meaningfully, so the shortcut names the keys instead.
 */
const KEY_LABEL = new Map<string, string>([
  ['ctrl', 'Control'],
  ['alt', 'Alt'],
  ['shift', 'Shift'],
  ['enter', 'Enter'],
  ['backspace', 'Backspace'],
  ['escape', 'Escape'],
  ['tab', 'Tab'],
  ['up', 'Up arrow'],
  ['down', 'Down arrow'],
  ['left', 'Left arrow'],
  ['right', 'Right arrow'],
  ['plus', 'Plus'],
])

export interface KbdKey {
  /** The canonical key name, after alias resolution. */
  name: string
  /** What the badge paints. */
  display: string
  /** What the shortcut is called out loud. */
  label: string
}

function keyDisplay(name: string, isApple: boolean): string {
  const modifier = (isApple ? APPLE_MODIFIER_DISPLAY : MODIFIER_TEXT).get(name)
  return modifier ?? KEY_DISPLAY.get(name) ?? name.toUpperCase()
}

function keyLabel(name: string, isApple: boolean): string {
  if (name === 'mod')
    return isApple ? 'Command' : 'Control'

  return KEY_LABEL.get(name) ?? name.toUpperCase()
}

export function parseShortcut(keys: string, isApple: boolean): KbdKey[] {
  return keys.split('+').map((segment) => {
    const source = segment.trim().toLowerCase()
    const name = KEY_ALIASES.get(source) ?? source

    return {
      name,
      display: keyDisplay(name, isApple),
      label: keyLabel(name, isApple),
    }
  })
}
