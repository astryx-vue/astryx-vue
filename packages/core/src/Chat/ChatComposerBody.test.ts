import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { createStaticSource } from '../composables/useAsyncSource.js'
import { registerLayerSurface } from '../layer/layerSurfacePress.js'
import ChatComposer from './ChatComposer.vue'
import ChatComposerInput from './ChatComposerInput.vue'

const mounted: Array<{ unmount: () => void }> = []

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
})

describe('chatComposer 正文点击', () => {
  it('点在打开着的气泡里不抢走焦点，点在空白处才把焦点交给输入框', async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      slots: {
        headerContext: () => h('div', { class: 'surface' }, [h('span', { class: 'inner' }, 'tip')]),
      },
    })
    mounted.push(wrapper)
    registerLayerSurface(wrapper.get('.surface').element)
    const editable = wrapper.get('.astryx-chat-composer-input__editable').element as HTMLElement

    await wrapper.get('.inner').trigger('click')
    expect(document.activeElement).not.toBe(editable)

    await wrapper.get('.astryx-chat-composer__header').trigger('click')
    expect(document.activeElement).toBe(editable)
  })
})

describe('chatComposer 键盘焦点环', () => {
  it('禁用的触发菜单输入框（combobox）拿到焦点时也画环', async () => {
    const wrapper = mount(ChatComposer, {
      attachTo: document.body,
      slots: {
        input: () => h(ChatComposerInput, {
          isDisabled: true,
          triggers: [{
            character: '@',
            searchSource: createStaticSource([{ id: 'ada', label: 'Ada' }]),
            onSelect: item => `@${item.id}`,
          }],
        }),
      },
    })
    mounted.push(wrapper)
    const editable = wrapper.get('.astryx-chat-composer-input__editable').element as HTMLElement
    expect(editable.getAttribute('role')).toBe('combobox')

    editable.focus()
    await nextTick()
    expect(wrapper.get('.astryx-chat-composer__body').attributes('data-keyboard-focus')).toBeDefined()
  })
})
