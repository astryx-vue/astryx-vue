import type { KbdMessages } from '../locale/messages/kbd.js'

const KEY_ALIASES = new Map<string, string>([
  ['esc', 'escape'],
  ['return', 'enter'],
])

/**
 * Glyphs painted in a key badge on every platform. A `Map` keeps an unknown
 * key such as `constructor` from resolving to an object prototype member.
 * Keys painted as words (Esc, Ctrl) come from the messages instead.
 */
const KEY_DISPLAY = new Map<string, string>([
  ['enter', '↵'],
  ['backspace', '⌫'],
  ['tab', '⇥'],
  ['up', '↑'],
  ['down', '↓'],
  ['left', '←'],
  ['right', '→'],
  ['plus', '+'],
])

/** Modifier symbols on Apple platforms; `meta` is the Command key there. */
const APPLE_MODIFIER_DISPLAY = new Map<string, string>([
  ['mod', '⌘'],
  ['meta', '⌘'],
  ['ctrl', '⌃'],
  ['alt', '⌥'],
  ['shift', '⇧'],
])

/**
 * Modifier text elsewhere, and before the platform is known (server render
 * and the first client render), so the keycap reads as the user's keyboard.
 * `mod` and `ctrl` read as the messages' short Control label.
 */
const MODIFIER_TEXT = new Map<string, string>([
  ['alt', 'Alt'],
  ['shift', 'Shift'],
  ['meta', 'Win'],
])

/**
 * Message fields for the spoken name of each key. Assistive technology cannot
 * announce the glyphs above meaningfully, so the shortcut names the keys instead.
 */
type SpokenKey = 'alt' | 'backspace' | 'control' | 'down' | 'enter' | 'escape' | 'left' | 'plus' | 'right' | 'shift' | 'tab' | 'up'

const KEY_LABEL = new Map<string, SpokenKey>([
  ['ctrl', 'control'],
  ['alt', 'alt'],
  ['shift', 'shift'],
  ['enter', 'enter'],
  ['backspace', 'backspace'],
  ['escape', 'escape'],
  ['tab', 'tab'],
  ['up', 'up'],
  ['down', 'down'],
  ['left', 'left'],
  ['right', 'right'],
  ['plus', 'plus'],
])

export interface KbdKey {
  /** The canonical key name, after alias resolution. */
  name: string
  /** What the badge paints. */
  display: string
  /** What the shortcut is called out loud. */
  label: string
}

function keyDisplay(name: string, isApple: boolean, messages: KbdMessages): string {
  if (isApple) {
    const symbol = APPLE_MODIFIER_DISPLAY.get(name)
    if (symbol != null)
      return symbol
  }
  else if (name === 'mod' || name === 'ctrl') {
    return messages.controlShort
  }
  else {
    const text = MODIFIER_TEXT.get(name)
    if (text != null)
      return text
  }
  if (name === 'escape')
    return messages.escapeShort
  return KEY_DISPLAY.get(name) ?? name.toUpperCase()
}

function keyLabel(name: string, isApple: boolean, messages: KbdMessages): string {
  if (name === 'mod')
    return isApple ? messages.command : messages.control
  const field = KEY_LABEL.get(name)
  return field == null ? name.toUpperCase() : messages[field]
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
