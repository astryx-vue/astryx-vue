import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import FieldIcon from '../Field/FieldIcon.vue'
import FieldInfoTip from '../Field/FieldInfoTip.vue'
import { useInputStatusIcon } from './useInputStatusIcon.js'

function mountStatus(options: Parameters<typeof useInputStatusIcon>[0]) {
  let api!: ReturnType<typeof useInputStatusIcon>
  const wrapper = mount(defineComponent({
    name: 'StatusIconHost',
    setup() {
      api = useInputStatusIcon(options)
      return () => h('div')
    },
  }))
  return { api, wrapper }
}

describe('useInputStatusIcon', () => {
  it('renders nothing without a status', () => {
    const { api } = mountStatus({})
    expect(api.statusIcon.value).toBeNull()
    expect(api.statusIconProps.value).toEqual({})
  })

  it('renders a plain icon for the attached variant', () => {
    const { api } = mountStatus({ status: { type: 'success', message: 'Saved' } })
    expect(api.statusIcon.value).toBe(FieldIcon)
    expect(api.statusIconProps.value).toEqual({ type: 'success' })
  })

  it('leaves the icon to the message box for the detached variant', () => {
    const { api } = mountStatus({ status: { type: 'error', message: 'Wrong' }, statusVariant: 'detached' })
    expect(api.statusIcon.value).toBeNull()
  })

  it('renders a focusable info tip for the tooltip variant', () => {
    const { api } = mountStatus({ status: { type: 'warning', message: 'Check this' }, statusVariant: 'tooltip' })
    expect(api.statusIcon.value).toBe(FieldInfoTip)
    expect(api.statusIconProps.value).toEqual({ text: 'Check this', type: 'warning' })
  })

  it('falls back to the plain icon when the tooltip has no message', () => {
    const { api } = mountStatus({ status: { type: 'warning' }, statusVariant: 'tooltip' })
    expect(api.statusIcon.value).toBe(FieldIcon)
    expect(api.statusIconProps.value).toEqual({ type: 'warning' })
  })

  it('renders nothing inside an InputGroup, which owns its own status', () => {
    const { api } = mountStatus({ status: { type: 'error', message: 'Wrong' }, isInGroup: true })
    expect(api.statusIcon.value).toBeNull()
  })

  it('follows reactive inputs', async () => {
    const status = ref<{ type: 'error', message?: string } | undefined>({ type: 'error', message: 'Wrong' })
    const statusVariant = ref<'attached' | 'detached' | 'tooltip'>('attached')
    const { api, wrapper } = mountStatus({ status, statusVariant })

    expect(api.statusIcon.value).toBe(FieldIcon)
    statusVariant.value = 'tooltip'
    await wrapper.vm.$nextTick()
    expect(api.statusIcon.value).toBe(FieldInfoTip)

    status.value = undefined
    await wrapper.vm.$nextTick()
    expect(api.statusIcon.value).toBeNull()
  })
})
