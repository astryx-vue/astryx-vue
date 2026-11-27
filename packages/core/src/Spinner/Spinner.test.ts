import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { resetLiveRegionsForTest } from '../composables/testing/resetLiveRegions.js'
import { provideAstryxLocale } from '../locale/index.js'
import { themeContextKey } from '../Theme/context.js'
import Spinner from './Spinner.vue'
import { spinnerOwnerKey } from './SpinnerOwnerContext.js'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

describe('spinner', () => {
  it('renders an unlabelled status with a default accessible name', () => {
    const wrapper = mount(Spinner, { attachTo: document.body })
    const status = wrapper.get('[role="progressbar"]')

    expect(status.classes()).toContain('astryx-spinner')
    expect(status.attributes('aria-label')).toBe('Loading')
    expect(status.attributes('aria-labelledby')).toBeUndefined()
    expect(status.attributes('data-size')).toBe('md')
    expect(status.attributes('data-shade')).toBe('default')
  })

  it('draws a still track and a turning arc, each inside a hidden svg', () => {
    const wrapper = mount(Spinner, { attachTo: document.body })
    const [trackSvg, arcSvg] = wrapper.findAll('svg')
    const arc = arcSvg.get('.astryx-spinner__arc')

    expect(trackSvg.attributes('aria-hidden')).toBe('true')
    expect(trackSvg.find('.astryx-spinner__track').exists()).toBe(true)
    expect(trackSvg.find('.astryx-spinner__arc').exists()).toBe(false)
    expect(arc.attributes('stroke-dasharray')).toMatch(/^\d/)
    // 弧在转子里转，转子是自己的 HTML 盒子，轨道不跟着转。
    const rotor = arcSvg.element.parentElement!
    expect(rotor.classList.contains('astryx-spinner__rotor')).toBe(true)
    expect(rotor.getAttribute('aria-hidden')).toBe('true')
    expect(trackSvg.element.closest('.astryx-spinner__rotor')).toBeNull()
    expect(wrapper.classes()).not.toContain('astryx-spinner-group')
  })

  it('uses the localized loading name when nothing else names the spinner', () => {
    const Host = defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(Spinner)
      },
    })
    expect(mount(Host).get('[role="progressbar"]').attributes('aria-label')).toBe('加载中')
  })

  it('uses the string label as the accessible name through aria-labelledby', () => {
    const wrapper = mount(Spinner, {
      attachTo: document.body,
      props: { label: 'Saving' },
    })
    const status = wrapper.get('[role="progressbar"]')
    const labelId = wrapper.get('.astryx-spinner-label').attributes('id')

    expect(labelId).toBeTruthy()
    expect(status.attributes('aria-labelledby')).toBe(labelId)
    expect(status.attributes('aria-label')).toBeUndefined()
    expect(wrapper.get('.astryx-spinner-label').text()).toBe('Saving')
  })

  it('prefers an explicit aria-label over the visible label', () => {
    const wrapper = mount(Spinner, {
      attachTo: document.body,
      props: { label: 'Saving' },
      attrs: { 'aria-label': 'Saving your changes' },
    })
    const status = wrapper.get('[role="progressbar"]')

    expect(status.attributes('aria-label')).toBe('Saving your changes')
    expect(status.attributes('aria-labelledby')).toBeUndefined()
  })

  it('keeps the default accessible name when the label is a slot', () => {
    const wrapper = mount(Spinner, {
      attachTo: document.body,
      slots: { label: '<strong>Fetching</strong>' },
    })

    expect(wrapper.get('[role="progressbar"]').attributes('aria-label')).toBe('Loading')
    expect(wrapper.get('.astryx-spinner-label strong').text()).toBe('Fetching')
  })

  it.each(['sm', 'md', 'lg', 'xl'] as const)('exposes size %s on the ring', (size) => {
    const wrapper = mount(Spinner, { attachTo: document.body, props: { size } })

    expect(wrapper.get('[role="progressbar"]').attributes('data-size')).toBe(size)
  })

  it.each(['default', 'subtle', 'onMedia', 'inherit'] as const)('exposes shade %s on the ring', (shade) => {
    const wrapper = mount(Spinner, { attachTo: document.body, props: { shade } })

    expect(wrapper.get('[role="progressbar"]').attributes('data-shade')).toBe(shade)
  })

  it('passes class and data attributes to the root element', () => {
    const wrapper = mount(Spinner, {
      attachTo: document.body,
      attrs: { 'class': 'custom', 'data-testid': 'spinner' },
    })

    expect(wrapper.get('[data-testid="spinner"]').classes()).toContain('custom')
  })

  it('moves class and data attributes to the group wrapper when labelled', () => {
    const wrapper = mount(Spinner, {
      attachTo: document.body,
      props: { label: 'Loading data' },
      attrs: { 'class': 'custom', 'data-testid': 'spinner' },
    })
    const group = wrapper.get('[data-testid="spinner"]')

    expect(group.classes()).toContain('astryx-spinner-group')
    expect(group.classes()).toContain('custom')
    expect(group.find('[role="progressbar"]').exists()).toBe(true)
  })
})

describe('spinner rotor', () => {
  const css = readFileSync(resolve(__dirname, '../../styles/spinner.css'), 'utf8')

  it('turns the rotor with a transform, 100 turns per iteration, not the arc dash', () => {
    expect(css).toMatch(/@keyframes astryx-spinner-rotate[\s\S]*?rotate\(36000deg\)/)
    expect(css).not.toMatch(/stroke-dashoffset:/)
    const rotor = css.match(/\.astryx-spinner__rotor \{([^}]*)\}/)![1]
    expect(rotor).toMatch(/animation-name:\s*astryx-spinner-rotate/)
    expect(rotor).toMatch(/animation-duration:\s*calc\([^;]*\* 100\)/)
    expect(rotor).toMatch(/will-change:\s*transform/)
    expect(css).toMatch(/animation-duration:\s*calc\(3s \* 100\)/)
  })

  it('pins the rotor animation to the timeline origin', async () => {
    // 先让前面挂载留下的待办帧跑完，下面的帧回调才是这次挂载排的。
    await new Promise(done => setTimeout(done, 50))
    const animation = { startTime: 500 as number | null }
    const original = HTMLElement.prototype.getAnimations
    HTMLElement.prototype.getAnimations = (() => [animation]) as unknown as typeof HTMLElement.prototype.getAnimations
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback))
    try {
      mount(Spinner, { attachTo: document.body })
      frames.forEach(callback => callback(0))
      expect(animation.startTime).toBe(0)
    }
    finally {
      HTMLElement.prototype.getAnimations = original
      vi.unstubAllGlobals()
    }
  })
})

describe('spinner announcement', () => {
  afterEach(() => {
    resetLiveRegionsForTest()
  })

  const frame = (): Promise<void> => new Promise(resolve => requestAnimationFrame(() => resolve()))
  const polite = (): string => document.querySelector('[data-astryx-live-region="polite"]')?.textContent ?? ''

  it('is a progressbar that announces its name once when it appears', async () => {
    const wrapper = mount(Spinner, { attachTo: document.body, props: { label: 'Saving' } })
    await frame()
    expect(wrapper.find('[role="progressbar"]').exists()).toBe(true)
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(polite()).toBe('Saving')
  })

  it('falls back to the localized loading name when nothing names it', async () => {
    mount(Spinner, { attachTo: document.body })
    await frame()
    expect(polite()).toBe('Loading')
  })

  it('stays silent when hidden, in an owner, or given another role', async () => {
    mount(Spinner, { attachTo: document.body, attrs: { 'aria-hidden': 'true' } })
    mount(Spinner, { attachTo: document.body, attrs: { 'role': 'img', 'aria-label': 'Busy' } })
    mount(Spinner, { attachTo: document.body, global: { provide: { [spinnerOwnerKey as symbol]: true } } })
    const host = document.createElement('div')
    host.setAttribute('aria-hidden', 'true')
    document.body.append(host)
    mount(Spinner, { attachTo: host })
    await frame()
    expect(polite()).toBe('')
  })
})

describe('spinner theme indicator', () => {
  it('draws the theme spinner indicator in place of the ring, with state busy', () => {
    const Themed = defineComponent({
      props: { state: { type: String, required: true } },
      setup: props => () => h('i', { 'class': 'themed-picture', 'data-state': props.state }),
    })
    const wrapper = mount(Spinner, {
      attachTo: document.body,
      global: { provide: { [themeContextKey as symbol]: ref({ theme: { indicators: { spinner: Themed } } }) } },
    })
    const picture = wrapper.get('.themed-picture')
    expect(picture.attributes('data-state')).toBe('busy')
    expect(picture.classes()).toContain('astryx-spinner__themed')
    expect(wrapper.find('.astryx-spinner__arc').exists()).toBe(false)
    expect(wrapper.attributes('role')).toBe('progressbar')
  })
})
