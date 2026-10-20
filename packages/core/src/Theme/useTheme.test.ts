import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref, watch } from 'vue'
import { DATA_TOKEN_DEFAULTS } from './dataTokens.js'
import { defineTheme } from './defineTheme.js'
import Theme from './Theme.vue'
import { useTheme } from './useTheme.js'

describe('useTheme', () => {
  it('keeps its refs and token function stable, and re-runs nothing on an unrelated render', async () => {
    const theme = defineTheme({ name: 'stable', tokens: { '--color-accent': ['#111111', '#eeeeee'] } })
    const tick = ref(0)
    let first: ReturnType<typeof useTheme> | undefined
    let tokenRuns = 0
    const Probe = defineComponent({
      setup() {
        const result = useTheme()
        first ??= result
        watch(result.tokens, () => {
          tokenRuns += 1
        })
        return () => h('span', `${tick.value}:${result.token('--color-accent')}`)
      },
    })
    const wrapper = mount(Theme, { props: { theme, mode: 'light' }, slots: { default: () => h(Probe) } })
    const before = first
    tick.value += 1
    await nextTick()
    expect(wrapper.text()).toBe('1:#111111')
    expect(first).toBe(before)
    expect(tokenRuns).toBe(0)
    await wrapper.setProps({ mode: 'dark' })
    expect(wrapper.text()).toBe('1:#eeeeee')
    expect(tokenRuns).toBe(1)
    wrapper.unmount()
  })

  it('reads theme-local tokens by exact name', () => {
    const theme = defineTheme({ name: 'local-read', localTokens: { '--brand-ink': ['#101010', '#fafafa'] } })
    let read = ''
    const Probe = defineComponent({
      setup() {
        read = useTheme().token('--brand-ink')
        return () => null
      },
    })
    const wrapper = mount(Theme, { props: { theme, mode: 'dark' }, slots: { default: () => h(Probe) } })
    expect(read).toBe('#fafafa')
    wrapper.unmount()
  })

  it('falls back to the data color defaults when nothing in the page sets them', () => {
    let read = ''
    const Probe = defineComponent({
      setup() {
        read = useTheme().token('--color-data-categorical-blue')
        return () => null
      },
    })
    const wrapper = mount(Probe)
    expect(DATA_TOKEN_DEFAULTS['--color-data-categorical-blue']).toBe('light-dark(#0171E3, #0171E3)')
    expect(read).toBe('#0171E3')
    wrapper.unmount()
  })

  it('reads root values, not adapted ones', () => {
    const theme = defineTheme({
      name: 'adapted-read',
      tokens: { '--spacing-4': '16px' },
      adaptations: { rules: [{ when: { pointer: 'coarse' }, value: { tokens: { '--spacing-4': '12px' } } }] },
    })
    let read = ''
    const Probe = defineComponent({
      setup() {
        read = useTheme().token('--spacing-4')
        return () => null
      },
    })
    const wrapper = mount(Theme, { props: { theme }, slots: { default: () => h(Probe) } })
    expect(read).toBe('16px')
    wrapper.unmount()
  })
})
