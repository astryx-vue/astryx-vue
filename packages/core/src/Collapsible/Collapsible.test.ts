import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import Collapsible from './Collapsible.vue'

const CHEVRON_DOWN = 'astryx-icon--chevron-down'
const CHEVRON_RIGHT = 'astryx-icon--chevron-right'

async function settle(): Promise<void> {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 20))
  await nextTick()
}

function triggerOf(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.astryx-collapsible-trigger')
}

/** The glyph classes of the trigger's chevron, which name the artwork drawn. */
function chevronGlyph(wrapper: ReturnType<typeof mount>): string[] {
  return wrapper.find('.astryx-collapsible-chevron .astryx-icon__glyph').classes()
}

function contentOf(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.astryx-collapsible-content')
}

function opacityOf(wrapper: ReturnType<typeof mount>): string {
  return (contentOf(wrapper).element as HTMLElement).style.display
}

describe('collapsible', () => {
  it('renders the trigger in a button and the body inside the controlled region', () => {
    const wrapper = mount(Collapsible, {
      props: { trigger: 'Account details' },
      slots: { default: '<p class="body">Body copy</p>' },
    })

    const root = wrapper.find('.astryx-collapsible')
    const button = triggerOf(wrapper)

    expect(root.exists()).toBe(true)
    expect(root.element.tagName).toBe('DIV')
    expect(button.element.tagName).toBe('BUTTON')
    expect(button.attributes('type')).toBe('button')
    expect(button.text()).toContain('Account details')

    const contentId = button.attributes('aria-controls')
    expect(contentId).toBeTruthy()

    const content = wrapper.find(`#${contentId}`)
    expect(content.exists()).toBe(true)
    expect(content.classes()).toContain('astryx-collapsible-content')
    expect(content.find('.body').exists()).toBe(true)
  })

  it('starts open and reports it through aria-expanded', () => {
    const wrapper = mount(Collapsible, {
      props: { trigger: 'Details' },
      slots: { default: '<p>Body</p>' },
    })

    expect(triggerOf(wrapper).attributes('aria-expanded')).toBe('true')
    expect(triggerOf(wrapper).attributes('data-open')).toBe('open')
    expect(opacityOf(wrapper)).not.toBe('none')
  })

  it('starts collapsed when defaultIsOpen is false', async () => {
    const wrapper = mount(Collapsible, {
      props: { trigger: 'Details', defaultIsOpen: false },
      slots: { default: '<p>Body</p>' },
    })

    expect(triggerOf(wrapper).attributes('aria-expanded')).toBe('false')
    expect(triggerOf(wrapper).attributes('data-open')).toBeUndefined()

    await settle()
    expect(opacityOf(wrapper)).toBe('none')
  })

  it('toggles its own state on click and announces the change', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(Collapsible, {
      props: { trigger: 'Details', defaultIsOpen: false, onOpenChange },
      slots: { default: '<p>Body</p>' },
    })

    await triggerOf(wrapper).trigger('click')
    await settle()

    expect(triggerOf(wrapper).attributes('aria-expanded')).toBe('true')
    expect(opacityOf(wrapper)).not.toBe('none')
    expect(wrapper.emitted('update:isOpen')).toEqual([[true]])
    expect(onOpenChange).toHaveBeenCalledWith(true)

    await triggerOf(wrapper).trigger('click')
    await settle()

    expect(triggerOf(wrapper).attributes('aria-expanded')).toBe('false')
    expect(opacityOf(wrapper)).toBe('none')
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it('runs the state through v-model:isOpen', async () => {
    const Host = defineComponent({
      components: { Collapsible },
      setup() {
        return { isOpen: ref(false) }
      },
      template: `
        <Collapsible v-model:isOpen="isOpen" trigger="Details">
          <p>Body</p>
        </Collapsible>
      `,
    })

    const wrapper = mount(Host)
    const button = triggerOf(wrapper)
    expect(button.attributes('aria-expanded')).toBe('false')

    await button.trigger('click')
    await settle()

    expect(wrapper.vm.isOpen).toBe(true)
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(opacityOf(wrapper)).not.toBe('none')

    wrapper.vm.isOpen = false
    await settle()

    expect(button.attributes('aria-expanded')).toBe('false')
    expect(opacityOf(wrapper)).toBe('none')
  })

  it('stays put while the parent ignores the request to change', async () => {
    const Host = defineComponent({
      components: { Collapsible },
      setup() {
        return { isOpen: ref(false) }
      },
      template: `
        <Collapsible :is-open="isOpen" trigger="Details" @update:is-open="() => {}">
          <p>Body</p>
        </Collapsible>
      `,
    })

    const wrapper = mount(Host)
    await triggerOf(wrapper).trigger('click')
    await settle()

    expect(triggerOf(wrapper).attributes('aria-expanded')).toBe('false')
    expect(opacityOf(wrapper)).toBe('none')
  })

  it('follows the controlled prop when the parent changes it', async () => {
    const wrapper = mount(Collapsible, {
      props: { trigger: 'Details', isOpen: false },
      slots: { default: '<p>Body</p>' },
    })

    expect(triggerOf(wrapper).attributes('aria-expanded')).toBe('false')

    await wrapper.setProps({ isOpen: true })
    await settle()

    expect(triggerOf(wrapper).attributes('aria-expanded')).toBe('true')
    expect(opacityOf(wrapper)).not.toBe('none')
  })

  it('blocks activation and leaves the tab order while disabled', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(Collapsible, {
      props: { trigger: 'Details', isDisabled: true, onOpenChange },
      slots: { default: '<p>Body</p>' },
    })

    const button = triggerOf(wrapper)
    expect(button.attributes('aria-disabled')).toBe('true')
    expect(button.attributes('tabindex')).toBe('-1')
    expect(button.attributes('disabled')).toBeUndefined()
    expect(button.attributes('data-disabled')).toBe('disabled')

    await button.trigger('click')
    await settle()

    expect(button.attributes('aria-expanded')).toBe('true')
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(wrapper.emitted('update:isOpen')).toBeUndefined()
  })

  it('keeps an open panel open when the trigger becomes disabled', async () => {
    const wrapper = mount(Collapsible, {
      props: { trigger: 'Details', isDisabled: true, defaultIsOpen: true },
      slots: { default: '<p>Body</p>' },
    })

    await triggerOf(wrapper).trigger('click')
    await settle()

    expect(triggerOf(wrapper).attributes('aria-expanded')).toBe('true')
    expect(opacityOf(wrapper)).not.toBe('none')
  })

  it('is operable and in the tab order by default', () => {
    const wrapper = mount(Collapsible, { props: { trigger: 'Details' } })

    expect(triggerOf(wrapper).attributes('aria-disabled')).toBeUndefined()
    expect(triggerOf(wrapper).attributes('tabindex')).toBeUndefined()
    expect(triggerOf(wrapper).attributes('data-disabled')).toBeUndefined()
  })

  it('follows the label with a down chevron by default', () => {
    const wrapper = mount(Collapsible, {
      props: { trigger: 'Details' },
      slots: { default: '<p>Body</p>' },
    })

    const children = triggerOf(wrapper).element.children
    const chevronIndex = [...children].findIndex(child => child.matches('.astryx-collapsible-chevron'))
    const labelIndex = [...children].findIndex(child => child.matches('.astryx-collapsible-trigger-label'))

    expect(triggerOf(wrapper).attributes('data-chevron-position')).toBe('end')
    expect(chevronIndex).toBeGreaterThan(labelIndex)
    expect(chevronGlyph(wrapper)).toContain(CHEVRON_DOWN)
  })

  it('leads the label with an inward chevron when position is start', () => {
    const wrapper = mount(Collapsible, {
      props: { trigger: 'Details', chevronPosition: 'start' },
      slots: { default: '<p>Body</p>' },
    })

    const children = triggerOf(wrapper).element.children
    const chevronIndex = [...children].findIndex(child => child.matches('.astryx-collapsible-chevron'))
    const labelIndex = [...children].findIndex(child => child.matches('.astryx-collapsible-trigger-label'))

    expect(triggerOf(wrapper).attributes('data-chevron-position')).toBe('start')
    expect(chevronIndex).toBeLessThan(labelIndex)
    expect(chevronGlyph(wrapper)).toContain(CHEVRON_RIGHT)
  })

  it('swaps the chevron when the position changes', async () => {
    const wrapper = mount(Collapsible, { props: { trigger: 'Details' } })

    await wrapper.setProps({ chevronPosition: 'start' })

    expect(chevronGlyph(wrapper)).toContain(CHEVRON_RIGHT)
    expect(triggerOf(wrapper).attributes('data-chevron-position')).toBe('start')
  })

  it('reveals the panel with an enter transition and folds it away on exit', async () => {
    const wrapper = mount(Collapsible, {
      props: { trigger: 'Details', defaultIsOpen: false },
      slots: { default: '<p>Body</p>' },
      global: { stubs: { transition: false } },
    })
    await settle()

    await triggerOf(wrapper).trigger('click')
    await nextTick()

    const content = contentOf(wrapper)
    expect(content.classes()).toContain('astryx-collapsible-reveal-enter-from')
    expect(content.classes()).toContain('astryx-collapsible-reveal-enter-active')
    expect(opacityOf(wrapper)).not.toBe('none')

    await settle()
    expect(content.classes()).not.toContain('astryx-collapsible-reveal-enter-active')

    await triggerOf(wrapper).trigger('click')
    await nextTick()

    expect(content.classes()).toContain('astryx-collapsible-reveal-leave-active')
    expect(opacityOf(wrapper)).not.toBe('none')

    await settle()
    expect(content.classes()).not.toContain('astryx-collapsible-reveal-leave-active')
    expect(opacityOf(wrapper)).toBe('none')
  })

  it('renders the trigger slot in place of the trigger prop', () => {
    const wrapper = mount(Collapsible, {
      props: { trigger: 'Ignored' },
      slots: {
        trigger: '<h3 class="heading">Advanced settings</h3>',
        default: '<p>Body</p>',
      },
    })

    const button = triggerOf(wrapper)
    expect(button.find('.heading').exists()).toBe(true)
    expect(button.text()).not.toContain('Ignored')
  })

  it('passes extra attributes to the root element', () => {
    const wrapper = mount(Collapsible, {
      props: { trigger: 'Details' },
      attrs: { 'class': 'my-row', 'data-custom': 'x' },
    })

    const root = wrapper.find('.astryx-collapsible')
    expect(root.classes()).toContain('my-row')
    expect(root.attributes('data-custom')).toBe('x')
  })

  it('exposes the root element', () => {
    const wrapper = mount(Collapsible, { props: { trigger: 'Details' } })

    expect(wrapper.vm.element?.className).toContain('astryx-collapsible')
  })
})
