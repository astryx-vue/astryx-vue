import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { mountComposable } from './testing/mountComposable.js'
import { useInteractiveRole } from './useInteractiveRole.js'

describe('useInteractiveRole', () => {
  it('is a link when there is an address', () => {
    const { result } = mountComposable(() => useInteractiveRole({ href: '/ada' }))
    expect(result.role.value).toBe('link')
  })

  it('is a link even when a click handler is also present', () => {
    const { result } = mountComposable(() => useInteractiveRole({ href: '/ada', hasOnClick: true }))
    expect(result.role.value).toBe('link')
  })

  it('is a button without an address', () => {
    const { result } = mountComposable(() => useInteractiveRole({ hasOnClick: true }))
    expect(result.role.value).toBe('button')
  })

  it('is inert with neither', () => {
    const { result } = mountComposable(() => useInteractiveRole({}))
    expect(result.role.value).toBe('inert')
  })

  it('treats an empty address as no address', () => {
    const { result } = mountComposable(() => useInteractiveRole({ href: '' }))
    expect(result.role.value).toBe('inert')
  })

  it('ignores the address while disabled and takes the click handler instead', () => {
    const { result } = mountComposable(() => useInteractiveRole({ href: '/ada', isDisabled: true }))
    expect(result.role.value).toBe('inert')

    const withClick = mountComposable(() => useInteractiveRole({ href: '/ada', hasOnClick: true, isDisabled: true }))
    expect(withClick.result.role.value).toBe('button')
  })

  it('follows reactive inputs', () => {
    const href = ref<string | undefined>('/ada')
    const isDisabled = ref(false)
    const { result } = mountComposable(() => useInteractiveRole({ href, isDisabled }))

    expect(result.role.value).toBe('link')
    isDisabled.value = true
    expect(result.role.value).toBe('inert')
    isDisabled.value = false
    href.value = undefined
    expect(result.role.value).toBe('inert')
  })
})
