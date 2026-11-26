import type { AstryxLocale } from '../types.js'

export interface KbdMessages {
  /** 读出来的按键名，拼进快捷键的无障碍名。 */
  alt: string
  /** 非 Apple 平台 Alt 键帽上显示的缩写。 */
  altShort: string
  backspace: string
  /** Apple 平台的 Command 键。 */
  command: string
  /** Control 键，非 Apple 平台的 mod 也读这个。 */
  control: string
  /** 非 Apple 平台 mod 键帽上显示的缩写。 */
  controlShort: string
  down: string
  enter: string
  escape: string
  /** Escape 键帽上显示的缩写。 */
  escapeShort: string
  left: string
  /** 加号这个键本身，和键与键之间的连接不是一回事。 */
  plus: string
  right: string
  shift: string
  /** 非 Apple 平台 Shift 键帽上显示的文字。 */
  shiftShort: string
  tab: string
  up: string
  /** 非 Apple 平台 meta（Windows 徽标键）键帽上显示的缩写。 */
  windowsShort: string
  /** 把前面已经拼好的按键和下一个键的名字连起来。 */
  shortcut: (shortcut: string, key: string) => string
}

export const kbdMessages: Record<AstryxLocale, KbdMessages> = {
  'en': {
    alt: 'Alt',
    altShort: 'Alt',
    backspace: 'Backspace',
    command: 'Command',
    control: 'Control',
    controlShort: 'Ctrl',
    down: 'Down arrow',
    enter: 'Enter',
    escape: 'Escape',
    escapeShort: 'Esc',
    left: 'Left arrow',
    plus: 'Plus',
    right: 'Right arrow',
    shift: 'Shift',
    shiftShort: 'Shift',
    tab: 'Tab',
    up: 'Up arrow',
    windowsShort: 'Win',
    shortcut: (shortcut, key) => `${shortcut} + ${key}`,
  },
  'zh-CN': {
    alt: 'Alt',
    altShort: 'Alt',
    backspace: '退格',
    command: 'Command',
    control: 'Control',
    controlShort: 'Ctrl',
    down: '下方向键',
    enter: '回车',
    escape: 'Esc',
    escapeShort: 'Esc',
    left: '左方向键',
    plus: '加号',
    right: '右方向键',
    shift: 'Shift',
    shiftShort: 'Shift',
    tab: 'Tab',
    up: '上方向键',
    windowsShort: 'Win',
    shortcut: (shortcut, key) => `${shortcut} + ${key}`,
  },
}
