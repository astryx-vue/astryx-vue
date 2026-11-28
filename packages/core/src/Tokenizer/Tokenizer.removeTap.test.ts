import type { SearchableItem } from '../composables/useAsyncSource.js'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { resetInteractionModalityForTest } from '../composables/internal/interactionModality.js'
import { createStaticSource } from '../composables/useAsyncSource.js'
import Tokenizer from './Tokenizer.vue'

const people: SearchableItem[] = [
  { id: 'ada', label: 'Ada' },
  { id: 'grace', label: 'Grace' },
]

afterEach(() => {
  document.body.innerHTML = ''
  resetInteractionModalityForTest()
})

function mountTokenizer() {
  const wrapper = mount(Tokenizer, {
    attachTo: document.body,
    props: {
      'label': 'People',
      'searchSource': createStaticSource(people),
      'modelValue': people,
      'onUpdate:modelValue': (next: SearchableItem[]) => wrapper.setProps({ modelValue: next }),
    },
  })
  return wrapper
}

/** 一次点按：pointerdown、浏览器补发的 mousedown、click。返回 mousedown 有没有被取消。 */
function tap(target: Element, pointerType: string): boolean {
  target.dispatchEvent(new PointerEvent('pointerdown', { pointerType, bubbles: true, cancelable: true }))
  const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
  target.dispatchEvent(mousedown)
  target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  return mousedown.defaultPrevented
}

describe('tokenizer remove tap', () => {
  it('keeps the touch keyboard down when a finger removes a token while the input is unfocused', async () => {
    const wrapper = mountTokenizer()
    const input = wrapper.get('input').element
    const remove = wrapper.get('.astryx-token-remove').element

    expect(tap(remove, 'touch')).toBe(true)
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([people[1]])
    expect(document.activeElement).not.toBe(input)
    wrapper.unmount()
  })

  it.each(['mouse', 'pen'])('moves focus to the input when a %s removes a token', async (pointerType) => {
    const wrapper = mountTokenizer()
    const input = wrapper.get('input').element

    expect(tap(wrapper.get('.astryx-token-remove').element, pointerType)).toBe(false)
    await flushPromises()

    expect(document.activeElement).toBe(input)
    wrapper.unmount()
  })

  it('moves focus to the input when a finger removes a token while typing', async () => {
    const wrapper = mountTokenizer()
    const input = wrapper.get('input').element
    input.focus()

    expect(tap(wrapper.get('.astryx-token-remove').element, 'touch')).toBe(false)
    await flushPromises()

    expect(document.activeElement).toBe(input)
    wrapper.unmount()
  })

  it('moves focus to the input when the removed token held focus', async () => {
    const wrapper = mountTokenizer()
    const input = wrapper.get('input').element
    const remove = wrapper.get('.astryx-token-remove').element as HTMLElement
    remove.focus()

    tap(remove, 'touch')
    await flushPromises()

    expect(document.activeElement).toBe(input)
    wrapper.unmount()
  })
})
