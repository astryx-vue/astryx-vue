import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ChatDictationButton from './ChatDictationButton.vue'
import ChatToolCalls from './ChatToolCalls.vue'

afterEach(() => {
  vi.restoreAllMocks()
})

// 开发构建里，缺了必填 prop 的组件抛出点名的错误，告诉人该怎么传。
describe('chat 组件缺必填 prop 时说清楚缺了什么', () => {
  it.each<[string, Component, string]>([
    ['ChatToolCalls', ChatToolCalls, 'ChatToolCalls: `calls` must be an array of tool calls'],
    ['ChatDictationButton', ChatDictationButton, 'ChatDictationButton: `dictation` is required'],
  ])('%s', (_name, component, message) => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => mount(component)).toThrow(message)
  })
})
