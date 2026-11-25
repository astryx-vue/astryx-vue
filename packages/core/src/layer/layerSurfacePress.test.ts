import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import ClickableCard from '../ClickableCard/ClickableCard.vue'
import HoverCard from '../HoverCard/HoverCard.vue'
import Item from '../List/Item.vue'
import Tooltip from '../Tooltip/Tooltip.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

/** 触发元素放在段落里，气泡就挂到段落外、仍在容器里面。 */
function tooltipInParagraph() {
  return h('p', [h(Tooltip, { content: 'Helpful text' }, { default: () => h('span', { tabindex: 0 }, '?') })])
}

describe('a press inside an open Tooltip or HoverCard surface', () => {
  it('does not activate a clickable card around the trigger, while page listeners still see it', async () => {
    const onClick = vi.fn()
    const onDocumentClick = vi.fn()
    document.addEventListener('click', onDocumentClick)
    const wrapper = mount(defineComponent({
      render: () => h(ClickableCard, { onClick }, { default: () => [tooltipInParagraph(), h('span', { class: 'surface' }, 'Body')] }),
    }), { attachTo: document.body })
    await flushPromises()

    const card = wrapper.get('.astryx-clickable-card').element
    const bubble = document.querySelector('.astryx-tooltip') as HTMLElement
    expect(card.contains(bubble)).toBe(true)

    bubble.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(onClick).not.toHaveBeenCalled()
    expect(onDocumentClick).toHaveBeenCalledTimes(1)

    wrapper.get('.surface').element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(onClick).toHaveBeenCalledTimes(1)
    document.removeEventListener('click', onDocumentClick)
    wrapper.unmount()
  })

  it('does not run an item row\'s click', async () => {
    const onClick = vi.fn()
    const wrapper = mount(defineComponent({
      render: () => h(Item, { label: 'Row', onClick }, {
        endContent: () => h('p', [h(HoverCard, { content: 'Details' }, { default: () => h('span', { tabindex: 0 }, 'more') })]),
      }),
    }), { attachTo: document.body })
    await flushPromises()

    const surface = document.querySelector('.astryx-hover-card') as HTMLElement
    expect(wrapper.element.contains(surface)).toBe(true)
    surface.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(onClick).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})
