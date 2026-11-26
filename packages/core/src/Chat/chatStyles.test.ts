import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/chat.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

/** 选择器恰好是 `selector` 的所有规则，声明块拼在一起（同一个选择器可能分几处写）。 */
function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const matches = [...css.matchAll(new RegExp(`(?:^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`, 'gm'))]
  if (matches.length === 0)
    throw new Error(`rule not found: ${selector}`)
  return matches.map(match => match[1]).join('\n')
}

describe('chat.css 头像偏移', () => {
  it('不用「兄弟相对」的 :has(~ …)，也不让外层消息的名字影响嵌套消息', () => {
    expect(css).not.toMatch(/:has\(\s*~/)
    expect(rule('.astryx-chat-message')).toContain('--_chat-avatar-offset: 0px')
    expect(rule('.astryx-chat-message:has([data-chat-name])')).toContain('--_chat-avatar-offset: var(--astryx-spacing-5')
    expect(rule('.astryx-chat-message__avatar')).toContain('margin-block-start: var(--_chat-avatar-offset)')
    expect(css).not.toContain('.astryx-chat-message:has([data-chat-name]) .astryx-chat-message__avatar')
  })
})

describe('chat.css 输入区', () => {
  it('页脚里调用方的操作换行，发送操作不让出宽度', () => {
    const start = rule('.astryx-chat-composer__footer-start')
    expect(start).toContain('flex-wrap: wrap')
    expect(start).toContain('min-width: 0')
    expect(rule('.astryx-chat-composer__footer-end')).toContain('flex-shrink: 0')
  })

  it('粗指针下输入区的聚焦外观立刻显示，不淡入', () => {
    const coarse = /@media \(pointer: coarse\) \{\s*\.astryx-chat-composer__body \{([^}]*)\}/.exec(css)
    expect(coarse?.[1]).toContain('transition-duration: 0s')
  })

  it('编辑区自己有一行的下限', () => {
    expect(rule('.astryx-chat-composer-input__editable')).toContain('min-height: 22px')
  })

  it('抽屉的圆角和塞入量跟着输入区自己的圆角，单独使用时取聊天圆角', () => {
    const drawer = rule('.astryx-chat-drawer')
    expect(drawer).toContain('border-start-start-radius: var(--_chat-composer-radius, var(--astryx-radius-chat, 28px))')
    expect(drawer).toContain('margin-block-end: calc(-1 * var(--_chat-composer-radius, var(--astryx-radius-chat, 28px)))')
  })

  it('发送键自己声明按钮圆角，在输入区里保持圆形', () => {
    expect(rule('.astryx-chat-send')).toContain('--astryx-button-radius: var(--astryx-radius-full, 9999px)')
  })
})

describe('chat.css 消息列表', () => {
  it('键盘焦点环画在列表自己的盒子里面，用共享的焦点环令牌', () => {
    const ring = rule('.astryx-chat-message-list:focus-visible')
    expect(ring).toContain('var(--astryx-focus-outline-width, 2px)')
    expect(ring).toContain('outline-offset: calc(-1 * var(--astryx-focus-outline-width, 2px))')
  })

  it('跟随滚动不再靠隐藏滚动条的属性选择器', () => {
    expect(css).not.toContain('data-astryx-scrolling')
  })
})
