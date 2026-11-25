import type { CodeBlockProps } from './types.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import CodeBlock from './CodeBlock.vue'

afterEach(() => {
  vi.restoreAllMocks()
})

/** 绕过类型检查，模拟调用方漏传 code、把代码写进默认插槽。 */
function mountWithoutCode(): void {
  const props = { language: 'ts' } as unknown as CodeBlockProps
  mount(CodeBlock, { props, slots: { default: () => h('span', 'const a = 1;') } })
}

describe('codeBlock without code', () => {
  it('names the code prop and the fix in development', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(mountWithoutCode).toThrowError(/^CodeBlock: `code` must be a string, for example <CodeBlock code=/)
  })
})
