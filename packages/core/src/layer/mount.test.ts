import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { useLayerMountTarget, useLayerTeleportTarget } from '../composables/useLayerMountTarget.js'
import { provideLayerMountTarget, resolveLayerMountTarget } from './mount.js'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  document.body.innerHTML = ''
})

function build(html: string, selector: string): HTMLElement {
  const host = document.createElement('div')
  host.innerHTML = html
  document.body.append(host)
  const element = host.querySelector<HTMLElement>(selector)
  if (element == null)
    throw new Error('测试结构里找不到目标元素')
  return element
}

describe('resolveLayerMountTarget', () => {
  it('keeps a layer where it is when the ancestors are safe', () => {
    const target = build('<div><section><div id="here"></div></section></div>', '#here')

    expect(resolveLayerMountTarget(target)).toBeNull()
  })

  it('moves a layer out of an interactive ancestor', () => {
    const target = build('<div id="safe"><a href="#"><span id="here"></span></a></div>', '#here')

    expect(resolveLayerMountTarget(target)).toBe(document.getElementById('safe'))
  })

  it('walks past every unsafe ancestor up to the last one', () => {
    const target = build('<div id="safe"><a href="#"><em><span id="here"></span></em></a></div>', '#here')
    const safe = document.getElementById('safe')

    expect(resolveLayerMountTarget(target)).toBe(safe)
  })

  it('stops at the nearest dialog so the layer stays in the modal top layer', () => {
    const target = build('<div id="outside"><dialog id="modal"><a href="#"><span id="here"></span></a></dialog></div>', '#here')

    expect(resolveLayerMountTarget(target)).toBe(document.getElementById('modal'))
  })

  it('returns null for a missing element', () => {
    expect(resolveLayerMountTarget(null)).toBeNull()
  })
})

describe('useLayerMountTarget', () => {
  it('falls back to body when nothing provides a mount point', () => {
    const Probe = defineComponent({
      setup() {
        const mountTarget = useLayerMountTarget()
        const teleportTarget = useLayerTeleportTarget()
        return () => h('div', {
          'data-mount': mountTarget.value == null ? 'null' : mountTarget.value.tagName,
          'data-teleport': typeof teleportTarget.value === 'string' ? teleportTarget.value : 'element',
        })
      },
    })

    const wrapper = mount(Probe)

    expect(wrapper.attributes('data-mount')).toBe('null')
    expect(wrapper.attributes('data-teleport')).toBe('body')
    wrapper.unmount()
  })

  it('hands the provided mount point to teleport', () => {
    const host = document.createElement('div')
    document.body.append(host)

    const Child = defineComponent({
      setup() {
        const teleportTarget = useLayerTeleportTarget()
        return () => h('span', {
          'data-teleport': typeof teleportTarget.value === 'string' ? teleportTarget.value : teleportTarget.value.tagName,
        })
      },
    })

    const Parent = defineComponent({
      setup() {
        provideLayerMountTarget(ref(host))
        return () => h(Child)
      },
    })

    const wrapper = mount(Parent)

    expect(wrapper.get('[data-teleport]').attributes('data-teleport')).toBe('DIV')
    wrapper.unmount()
    host.remove()
  })
})
