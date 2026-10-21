import { describe, expect, it } from 'vitest'
import { chainEventHandlers } from './chainEventHandlers.js'

interface PreventableEvent {
  defaultPrevented: boolean
  preventDefault: () => void
}

function fakeEvent(): PreventableEvent {
  const event: PreventableEvent = {
    defaultPrevented: false,
    preventDefault() {
      event.defaultPrevented = true
    },
  }
  return event
}

describe('chainEventHandlers', () => {
  it('按顺序调用每一个处理函数，跳过空位', () => {
    const calls: string[] = []
    chainEventHandlers(
      () => calls.push('a'),
      undefined,
      () => calls.push('b'),
    )(fakeEvent())
    expect(calls).toEqual(['a', 'b'])
  })

  it('前一个阻止了默认行为，后面的处理函数仍然执行', () => {
    const calls: string[] = []
    chainEventHandlers(
      (event: PreventableEvent) => {
        event.preventDefault()
        calls.push('component')
      },
      (event: PreventableEvent) => calls.push(`caller:${event.defaultPrevented}`),
    )(fakeEvent())
    expect(calls).toEqual(['component', 'caller:true'])
  })
})
