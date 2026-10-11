import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useMediaQuery } from './useMediaQuery.js'

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reads the current match and updates when the query changes', async () => {
    const query = ref('(max-width: 600px)')
    vi.stubGlobal('matchMedia', (value: string) => ({
      addEventListener: () => {},
      matches: value.includes('600'),
      removeEventListener: () => {},
    }))

    const Host = defineComponent({
      setup() {
        const matches = useMediaQuery(query)
        return () => h('span', matches.value ? 'compact' : 'wide')
      },
    })
    const wrapper = mount(Host)
    expect(wrapper.text()).toBe('compact')

    query.value = '(min-width: 1000px)'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('wide')
  })

  it('falls back when matchMedia is missing', () => {
    vi.stubGlobal('matchMedia', undefined)
    const Host = defineComponent({
      setup() {
        const matches = useMediaQuery('(max-width: 600px)', true)
        return () => h('span', String(matches.value))
      },
    })
    expect(mount(Host).text()).toBe('true')
  })
})
