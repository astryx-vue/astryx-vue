import type { LexicalEditor } from 'lexical'
import {
  BLUR_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_DOWN_COMMAND,
  KEY_ESCAPE_COMMAND,
  KEY_TAB_COMMAND,
  mergeRegister,
} from 'lexical'

/**
 * 按下这些键不算「离开 Escape 状态」：Escape（重新进入）、Tab（正是要离开的那一下），
 * 以及单独的修饰键——Shift+Tab 之前会先收到一次 Shift 的按下，不能因此取消。
 */
const KEEP_ARMED_KEYS = new Set(['Escape', 'Tab', 'Shift', 'Control', 'Alt', 'Meta'])

/**
 * 让键盘用户能离开编辑器（WCAG 2.1.2，不能困住键盘）。
 *
 * 编辑器里 Tab 用来缩进，不处理的话焦点会被困住。这里的做法：按过 Escape 之后，
 * 下一次 Tab（或 Shift+Tab）交给浏览器去移动焦点，不再缩进；按任何别的键、
 * 或者离开编辑器，就恢复成缩进。
 *
 * Lexical 按优先级从高到低依次问命令处理器，谁先返回 true 谁说了算。缩进处理器
 * 优先级最低，所以这里用 `COMMAND_PRIORITY_LOW` 抢在它前面：已经按过 Escape 时
 * 返回 true 但不调用 `preventDefault()`，缩进处理器收不到事件，浏览器照常移动焦点。
 */
export function registerTabFocusEscape(editor: LexicalEditor): () => void {
  let armed = false
  return mergeRegister(
    editor.registerCommand<KeyboardEvent>(
      KEY_ESCAPE_COMMAND,
      () => {
        armed = true
        // 返回 true 会盖过 @lexical/rich-text 默认的 Escape 处理（它会让编辑器失焦、
        // 焦点掉到 body 上），那样用户反而找不到自己在哪。
        return true
      },
      COMMAND_PRIORITY_LOW,
    ),
    editor.registerCommand<KeyboardEvent>(
      KEY_TAB_COMMAND,
      () => {
        if (!armed)
          return false
        armed = false
        return true
      },
      COMMAND_PRIORITY_LOW,
    ),
    editor.registerCommand<KeyboardEvent>(
      KEY_DOWN_COMMAND,
      (event) => {
        if (armed && !KEEP_ARMED_KEYS.has(event.key))
          armed = false
        return false
      },
      COMMAND_PRIORITY_LOW,
    ),
    editor.registerCommand(
      BLUR_COMMAND,
      () => {
        armed = false
        return false
      },
      COMMAND_PRIORITY_LOW,
    ),
  )
}
