/**
 * @file AlertDialogTouchMotion.test.ts
 * @input vitest (happy-dom)、一个记录动画的 `Element.animate` 替身、假的 matchMedia
 * @output 手指下 AlertDialog 从 1.2 倍缩到原大并和遮罩一起淡入，主题的 CSS 进场让位；
 *   关闭时先淡出、内容 inert，淡出播完才真正关闭；淡出途中重新打开从当前样子折返；
 *   鼠标下保留 CSS 进场，关闭是立即的。
 */
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { installMatchMedia } from '../composables/testing/fakeMatchMedia.js'
import { ensureDialogModalApi } from '../Dialog/testUtils.js'
import AlertDialog from './AlertDialog.vue'

enableAutoUnmount(afterEach)

beforeAll(ensureDialogModalApi)

interface Recorded {
  target: Element
  keyframes: Keyframe[]
  options: KeyframeAnimationOptions
  cancelled: boolean
}

let recorded: Recorded[] = []

beforeEach(() => {
  recorded = []
  HTMLElement.prototype.animate = function (this: HTMLElement, keyframes, options) {
    const animation = {
      target: this,
      keyframes: keyframes as Keyframe[],
      options: options as KeyframeAnimationOptions,
      cancelled: false,
      startTime: performance.now() as number | null,
      finished: new Promise(() => {}),
      addEventListener() {},
      cancel() {
        this.cancelled = true
      },
    }
    recorded.push(animation)
    return animation as unknown as Animation
  }
})

afterEach(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'animate')
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

const props = {
  title: 'Delete item?',
  description: 'This cannot be undone.',
  actionLabel: 'Delete',
}

async function render(isOpen: boolean) {
  const wrapper = mount(AlertDialog, { attachTo: document.body, props: { ...props, isOpen } })
  await flushPromises()
  await nextTick()
  const dialog = document.querySelector('dialog.astryx-alert-dialog') as HTMLDialogElement
  return { wrapper, dialog }
}

async function settle(): Promise<void> {
  await flushPromises()
  await nextTick()
  await flushPromises()
}

function live(target: Element, property: string, pseudoElement?: string): Recorded[] {
  return recorded.filter(animation =>
    !animation.cancelled
    && animation.target === target
    && (animation.options.pseudoElement ?? undefined) === pseudoElement
    && animation.keyframes.some(frame => property in frame))
}

const first = (animation: Recorded, property: string): string => String(animation.keyframes[0][property])
const last = (animation: Recorded, property: string): string => String(animation.keyframes.at(-1)![property])

describe('alert dialog touch motion', () => {
  it('scales down from 1.2 and fades in with its backdrop under a finger', async () => {
    installMatchMedia(query => query.includes('pointer: coarse'))
    const { wrapper, dialog } = await render(false)
    await wrapper.setProps({ isOpen: true })
    await settle()

    expect(dialog.open).toBe(true)
    expect(dialog.hasAttribute('data-touch-motion')).toBe(true)
    const [scale] = live(dialog, 'scale')
    expect(scale).toBeDefined()
    expect(Number(first(scale, 'scale').split(' ')[0])).toBeCloseTo(1.2, 3)
    expect(Number(last(scale, 'scale').split(' ')[0])).toBe(1)
    const [fade] = live(dialog, 'opacity')
    expect(Number(first(fade, 'opacity'))).toBeLessThan(0.01)
    expect(Number(last(fade, 'opacity'))).toBe(1)
    const [backdrop] = live(dialog, 'opacity', '::backdrop')
    expect(backdrop).toBeDefined()
    expect(Number(last(backdrop, 'opacity'))).toBe(1)
  })

  it('fades out with its content inert before it closes, and closes once the fade ends', async () => {
    installMatchMedia(query => query.includes('pointer: coarse'))
    const { wrapper, dialog } = await render(true)
    const cancel = dialog.querySelector<HTMLButtonElement>('.astryx-alert-dialog__action--cancel')!
    await wrapper.setProps({ isOpen: false })
    await settle()

    expect(dialog.open).toBe(true)
    expect(cancel.closest('[inert]')).not.toBeNull()
    const fades = live(dialog, 'opacity')
    expect(Number(last(fades.at(-1)!, 'opacity'))).toBe(0)
    await vi.waitFor(() => expect(dialog.open).toBe(false))
    expect(cancel.closest('[inert]')).toBeNull()
  })

  it('turns back from where it is when reopened during the fade', async () => {
    installMatchMedia(query => query.includes('pointer: coarse'))
    const { wrapper, dialog } = await render(true)
    const cancel = dialog.querySelector<HTMLButtonElement>('.astryx-alert-dialog__action--cancel')!
    await wrapper.setProps({ isOpen: false })
    await settle()
    await wrapper.setProps({ isOpen: true })
    await settle()

    expect(cancel.closest('[inert]')).toBeNull()
    expect(Number(last(live(dialog, 'opacity').at(-1)!, 'opacity'))).toBe(1)
    await new Promise(resolve => setTimeout(resolve, 300))
    expect(dialog.open).toBe(true)
  })

  it('keeps the CSS entrance and closes at once under a mouse', async () => {
    installMatchMedia(() => false)
    const { wrapper, dialog } = await render(false)
    await wrapper.setProps({ isOpen: true })
    await settle()
    expect(dialog.open).toBe(true)
    expect(dialog.hasAttribute('data-touch-motion')).toBe(false)
    expect(live(dialog, 'scale')).toHaveLength(0)

    await wrapper.setProps({ isOpen: false })
    await settle()
    expect(dialog.open).toBe(false)
  })
})
