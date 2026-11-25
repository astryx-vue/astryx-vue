import type { KbdMessages } from '../locale/messages/kbd.js'

const KEY_ALIASES = new Map<string, string>([
  ['esc', 'escape'],
  ['return', 'enter'],
  ['ctrl', 'control'],
])

/**
 * Glyphs painted in a key badge. A `Map` keeps an unknown key such as
 * `constructor` from resolving to an object prototype member.
 * Keys painted as words (Esc, Ctrl) come from the messages instead.
 */
const KEY_GLYPH = new Map<string, string>([
  ['control', '\u2303'],
  ['alt', '\u2325'],
  ['shift', '\u21E7'],
  ['enter', '\u21B5'],
  ['backspace', '\u232B'],
  ['tab', '\u21E5'],
  ['up', '\u2191'],
  ['down', '\u2193'],
  ['left', '\u2190'],
  ['right', '\u2192'],
  ['plus', '+'],
])

/**
 * Keys whose spoken name comes from the messages. Assistive technology cannot
 * announce the glyphs meaningfully, so the shortcut names the keys instead.
 */
type SpokenKey = 'alt' | 'backspace' | 'control' | 'down' | 'enter' | 'escape' | 'left' | 'plus' | 'right' | 'shift' | 'tab' | 'up'

const SPOKEN_KEYS = new Set<string>(['alt', 'backspace', 'control', 'down', 'enter', 'escape', 'left', 'plus', 'right', 'shift', 'tab', 'up'])

export interface KbdKey {
  /** The canonical key name, after alias resolution. */
  name: string
  /** What the badge paints. */
  display: string
  /** What the shortcut is called out loud. */
  label: string
}

function keyDisplay(name: string, isApple: boolean, messages: KbdMessages): string {
  if (name === 'mod')
    return isApple ? '\u2318' : messages.controlShort
  if (name === 'escape')
    return messages.escapeShort
  return KEY_GLYPH.get(name) ?? name.toUpperCase()
}

function keyLabel(name: string, isApple: boolean, messages: KbdMessages): string {
  if (name === 'mod')
    return isApple ? messages.command : messages.control
  return SPOKEN_KEYS.has(name) ? messages[name as SpokenKey] : name.toUpperCase()
}

export function parseShortcut(keys: string, isApple: boolean, messages: KbdMessages): KbdKey[] {
  return keys.split('+').map((segment) => {
    const source = segment.trim().toLowerCase()
    const name = KEY_ALIASES.get(source) ?? source

    return {
      name,
      display: keyDisplay(name, isApple, messages),
      label: keyLabel(name, isApple, messages),
    }
  })
}

/** The shortcut's accessible name: each key's spoken name, joined by the messages' separator. */
export function shortcutLabel(keys: readonly KbdKey[], messages: KbdMessages): string {
  return keys.map(key => key.label).reduce((shortcut, label) => messages.shortcut(shortcut, label))
}
