import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import ChatPastedTextToken from './ChatPastedTextToken.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

function press(wrapper: ReturnType<typeof mount>, pointerType: string): MouseEvent {
  const badge = wrapper.get('.astryx-badge').element
  badge.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType }))
  const mouseDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  badge.dispatchEvent(mouseDown)
  return mouseDown
}

describe('chatPastedTextToken 的轻点', () => {
  const mountToken = () => mount(ChatPastedTextToken, { attachTo: document.body, props: { text: 'x'.repeat(300) } })

  it.each(['touch', 'pen'])('%s 轻点取消合成的鼠标按下，输入框拿不到焦点', (pointerType) => {
    const wrapper = mountToken()
    expect(press(wrapper, pointerType).defaultPrevented).toBe(true)
  })

  it('鼠标按下照旧，可以在令牌旁放置光标', () => {
    const wrapper = mountToken()
    expect(press(wrapper, 'mouse').defaultPrevented).toBe(false)
  })
})
