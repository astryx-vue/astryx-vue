import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { resetLiveRegionsForTest } from '../composables/testing/resetLiveRegions.js'
import ChatComposer from './ChatComposer.vue'

afterEach(() => {
  resetLiveRegionsForTest()
})

async function flushFrame(): Promise<void> {
  await new Promise(resolve => requestAnimationFrame(resolve))
}

describe('chatComposer 共享 live region', () => {
  it('把错误和警告写入已有的全局播报区域', async () => {
    const wrapper = mount(ChatComposer, {
      props: { status: { type: 'error', message: 'Send failed' } },
    })
    await flushFrame()
    expect(document.querySelector('[data-astryx-live-region="assertive"]')?.textContent).toBe('Send failed')

    await wrapper.setProps({ status: { type: 'warning', message: 'Offline' } })
    await flushFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('Offline')
  })
})
