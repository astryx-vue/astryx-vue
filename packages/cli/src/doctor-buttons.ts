import type { DoctorCheck } from './commands/doctor.ts'
import type { SourceFile } from './project.ts'
import { findButtonsWithoutAction } from './button-actions.ts'
import { catalog, text } from './catalog.ts'

/** The most buttons the warning names before it counts the rest. */
const BUTTONS_NAMED = 8

/**
 * `button-actions`: the Core buttons in the app's own components that do
 * nothing when pressed. A warning, never a failure: the app still builds, but a
 * person who presses one gets nothing. `info` when the scan cannot judge any
 * button, because the read stopped at the file limit or a script listens for a
 * press through the DOM.
 */
export function buttonActionsCheck(files: readonly SourceFile[], truncated: boolean, locale: 'en' | 'zh'): DoctorCheck {
  const zh = locale === 'zh'
  const docsUrl = buttonDocsUrl(locale)
  if (truncated) {
    return {
      id: 'button-actions',
      status: 'info',
      detail: zh
        ? `没有检查按钮：项目的源码文件比 doctor 读的多（读了 ${files.length} 个），看不全每个组件在哪里渲染。`
        : `Buttons not checked: the project has more source files than doctor reads (${files.length} read), so it cannot tell where each component renders.`,
    }
  }
  const scan = findButtonsWithoutAction(files)
  if (scan.domListener) {
    return {
      id: 'button-actions',
      status: 'info',
      detail: zh
        ? `没有检查按钮：${scan.domListener} 可能通过 DOM 监听按下，脚本可能接管任何按钮。`
        : `Buttons not checked: ${scan.domListener} may listen for a press through the DOM, so a script may act on any button.`,
    }
  }
  const count = scan.found.length
  if (count === 0) {
    return {
      id: 'button-actions',
      status: 'ok',
      detail: zh
        ? `没有按下后什么都不做的 core 按钮（读了 ${scan.files} 个源码文件）。`
        : `No Core button does nothing when pressed (${scan.files} source files read).`,
    }
  }
  const named = scan.found.slice(0, BUTTONS_NAMED).map((button) => {
    const name = button.label === null ? button.component : `"${button.label}"`
    const note = button.note === null ? '' : zh ? `（${noteText(button.note, zh)}）` : ` (${button.note})`
    return `${button.file}:${button.line} ${name}${note}`
  })
  const rest = count - named.length
  return {
    id: 'button-actions',
    status: 'warn',
    detail: zh
      ? `${count} 个按钮按下后什么都不做：${named.join('，')}${rest > 0 ? `，还有 ${rest} 个` : ''}。`
      : `${count} button${count === 1 ? ' does' : 's do'} nothing when pressed: ${named.join(', ')}${rest > 0 ? `, and ${rest} more` : ''}.`,
    fix: zh
      ? '给每个按钮一个动作：`@click`（异步操作用 `click-action`）、真实的 `href` 代替占位链接，或在表单里写 `type="submit"`。还没有动作就用 `is-disabled` 禁用或先删掉：空的处理函数照样什么都不做。'
      : 'Give each one an action: `@click` (or `click-action` for async work), a real `href` in place of a placeholder, or `type="submit"` inside a form. If it has no action yet, disable it with `is-disabled` or remove it: an empty handler still does nothing.',
    ...(docsUrl ? { docsUrl } : {}),
  }
}

function noteText(note: string, zh: boolean): string {
  if (!zh)
    return note
  if (note === 'empty handler')
    return '处理函数是空的'
  if (note === 'empty link')
    return '链接是空的'
  return note.replace(/^link to /, '链接指向 ')
}

function buttonDocsUrl(locale: 'en' | 'zh'): string | undefined {
  const button = catalog.components.find(component => component.name === 'Button')
  return button ? text(button.docsUrl, locale) : undefined
}
