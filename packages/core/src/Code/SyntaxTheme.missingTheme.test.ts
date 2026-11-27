import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SyntaxTheme from './SyntaxTheme.vue'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('syntaxTheme without its required prop', () => {
  it('names the component, the prop and the fix in development', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => mount(SyntaxTheme, { slots: { default: 'code' } })).toThrow(
      'SyntaxTheme: `theme` is required: a theme from defineSyntaxTheme(), for example <SyntaxTheme :theme="myTheme">.',
    )
  })
})
