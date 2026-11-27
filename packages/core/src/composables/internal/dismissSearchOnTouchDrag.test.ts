import { afterEach, describe, expect, it } from 'vitest'
import { dismissSearchOnTouchDrag } from './dismissSearchOnTouchDrag.js'

afterEach(() => {
  document.body.innerHTML = ''
})

function touches(...ys: number[]): TouchEvent {
  return { touches: ys.map(clientY => ({ clientY })) } as unknown as TouchEvent
}

function setup(withTarget = true) {
  document.body.innerHTML = '<div tabindex="-1" class="panel"><input class="search"></div>'
  const input = document.querySelector<HTMLInputElement>('.search')!
  const panel = document.querySelector<HTMLElement>('.panel')!
  input.focus()
  const handlers = dismissSearchOnTouchDrag(() => [input], withTarget ? () => panel : undefined)
  return { input, panel, handlers }
}

describe('dismissSearchOnTouchDrag', () => {
  it('moves focus from the search field to the target after a drag past the threshold', () => {
    const { panel, handlers } = setup()
    handlers.onTouchstart(touches(100))
    handlers.onTouchmove(touches(104))
    expect(document.activeElement?.className).toBe('search')
    handlers.onTouchmove(touches(110))
    expect(document.activeElement).toBe(panel)
  })

  it('blurs the search field when there is no focus target', () => {
    const { input, handlers } = setup(false)
    handlers.onTouchstart(touches(100))
    handlers.onTouchmove(touches(80))
    expect(document.activeElement).not.toBe(input)
  })

  it('leaves focus alone for multi-touch gestures and after the touch ends', () => {
    const { input, handlers } = setup()
    handlers.onTouchstart(touches(100, 200))
    handlers.onTouchmove(touches(150, 250))
    expect(document.activeElement).toBe(input)
    handlers.onTouchstart(touches(100))
    handlers.onTouchend()
    handlers.onTouchmove(touches(150))
    expect(document.activeElement).toBe(input)
  })
})
