import type { Component } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import ChatPastedTextToken from '../Chat/ChatPastedTextToken.vue'
import { pastedTextLabel } from '../Chat/useChatPasteAsToken.js'
import { formatFileSize } from '../composables/useFileSelection.js'
import FileInput from '../FileInput/FileInput.vue'
import InternationalizationProvider from '../InternationalizationProvider/InternationalizationProvider.vue'
import Kbd from '../Kbd/Kbd.vue'

enableAutoUnmount(afterEach)

const originalPlatform = navigator.platform

afterEach(() => {
  Object.defineProperty(navigator, 'platform', { value: originalPlatform, configurable: true })
})

function inLocale(locale: string | undefined, component: Component, props: Record<string, unknown>) {
  if (locale == null)
    return mount(component, { props, attachTo: document.body })
  return mount(InternationalizationProvider, {
    props: { locale },
    slots: { default: () => h(component, props) },
    attachTo: document.body,
  })
}

describe('组件自带的辅助文字跟着语言走', () => {
  it('kbd 的键帽缩写和读出来的快捷键名', async () => {
    Object.defineProperty(navigator, 'platform', { value: 'Linux', configurable: true })
    const english = inLocale(undefined, Kbd, { keys: 'mod+backspace+esc' })
    await nextTick()
    expect(english.get('[role="img"]').attributes('aria-label')).toBe('Control + Backspace + Escape')
    expect(english.findAll('kbd').map(key => key.text())).toEqual(['Ctrl', '⌫', 'Esc'])

    const chinese = inLocale('zh-CN', Kbd, { keys: 'mod+backspace+left' })
    await nextTick()
    expect(chinese.get('[role="img"]').attributes('aria-label')).toBe('Control + 退格 + 左方向键')
  })

  it('kbd 的别名 ctrl、esc、return 读的是同一个键名', () => {
    const wrapper = inLocale('zh-CN', Kbd, { keys: 'ctrl+esc+return' })
    expect(wrapper.get('[role="img"]').attributes('aria-label')).toBe('Control + Esc + 回车')
  })

  it('fileInput 校验提示里的大小上限', async () => {
    for (const [locale, expected] of [[undefined, '"big.txt" exceeds 512 B limit'], ['zh-CN', '“big.txt”超过了 512 字节 的大小限制']] as const) {
      const wrapper = inLocale(locale, FileInput, { 'label': 'Upload', 'modelValue': null, 'maxSize': 512, 'onUpdate:modelValue': () => {} })
      const input = wrapper.get('input[type="file"]')
      const transfer = new DataTransfer()
      transfer.items.add(new File([new Uint8Array(513)], 'big.txt', { type: 'text/plain' }))
      Object.defineProperty(input.element, 'files', { value: transfer.files })
      await input.trigger('change')
      expect(wrapper.text()).toContain(expected)
    }
  })

  it('formatFileSize 不传单位时用英文：字节不分组，KB、MB 保留一位小数', () => {
    expect(formatFileSize(1023)).toBe('1023 B')
    expect(formatFileSize(2048)).toBe('2.0 KB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB')
    expect(formatFileSize(2000 * 1024 * 1024)).toBe('2000.0 MB')
  })

  it('chat 粘贴文本小块上的计数', () => {
    expect(pastedTextLabel('hello')).toBe('5 chars')
    expect(pastedTextLabel('a\nb')).toBe('2 lines, 3 chars')
    expect(pastedTextLabel(`${'a'.repeat(1499)}\n`)).toBe('2 lines, 1500 chars')
    const wrapper = inLocale('zh-CN', ChatPastedTextToken, { text: 'a\nb' })
    expect(wrapper.text()).toContain('2 行，3 个字符')
  })
})
