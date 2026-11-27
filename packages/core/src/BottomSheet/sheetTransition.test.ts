import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { waitForTransition } from './sheetTransition.js'

function transitioningElement(): HTMLElement {
  const element = document.createElement('div')
  element.style.transitionProperty = 'transform'
  element.style.transitionDuration = '400ms'
  document.body.append(element)
  return element
}

function fire(element: HTMLElement, type: 'transitionend' | 'transitioncancel'): void {
  const event = new Event(type, { bubbles: true }) as Event & { propertyName: string }
  event.propertyName = 'transform'
  element.dispatchEvent(event)
}

function runningTransitions(element: HTMLElement, running: boolean): void {
  const animations = running ? [{ transitionProperty: 'transform', playState: 'running' }] : []
  ;(element as unknown as { getAnimations: () => unknown[] }).getAnimations = () => animations
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  document.body.replaceChildren()
})

describe('waitForTransition', () => {
  it('completes on transitionend', () => {
    const element = transitioningElement()
    const complete = vi.fn()
    waitForTransition(element, 'transform', complete)
    fire(element, 'transitionend')
    expect(complete).toHaveBeenCalledTimes(1)
  })

  it('completes on a cancel nothing replaced', () => {
    const element = transitioningElement()
    runningTransitions(element, false)
    const complete = vi.fn()
    waitForTransition(element, 'transform', complete)
    fire(element, 'transitioncancel')
    expect(complete).toHaveBeenCalledTimes(1)
  })

  it('keeps waiting when the engine retargets the transition and a replacement keeps running', () => {
    const element = transitioningElement()
    runningTransitions(element, true)
    const complete = vi.fn()
    waitForTransition(element, 'transform', complete)
    fire(element, 'transitioncancel')
    expect(complete).not.toHaveBeenCalled()

    fire(element, 'transitionend')
    expect(complete).toHaveBeenCalledTimes(1)
  })

  it('still ends on the timer backstop if the replacement never reports', () => {
    const element = transitioningElement()
    runningTransitions(element, true)
    const complete = vi.fn()
    waitForTransition(element, 'transform', complete)
    vi.advanceTimersByTime(300)
    fire(element, 'transitioncancel')
    vi.advanceTimersByTime(449)
    expect(complete).not.toHaveBeenCalled()
    vi.advanceTimersByTime(2)
    expect(complete).toHaveBeenCalledTimes(1)
  })
})
