/**
 * @file createSwipe.test.ts
 * @input createSwipe 和读它的值的 swipeHostOf
 * @output 构造器：造出的值不透明、冻结，只有 createSwipe 能造；值里带着声明的操作和
 *   `swipeBehavior`（默认 `reveal`）；commit 的一侧多于一个操作时开发期警告；它按行交来的
 *   事实决定服务哪些行；另一份模块副本也认得它；类型里带着操作的 id
 * @position packages/core/src/Swipe/createSwipe.ts 的单元测试
 */

import type { Swipe } from './swipeHost'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSwipe } from './createSwipe'
import { swipeHostOf, swipeWithItemKey } from './swipeHost'

const archive = { id: 'archive', label: 'Archive', onActivate: () => {} }
const remove = { id: 'delete', label: 'Delete', onActivate: () => {}, hasRemoval: true }

describe('createSwipe', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('makes an opaque, frozen value: nothing in it for a caller to read', () => {
    const swipe = createSwipe({ trailing: [archive] })
    expect(Object.isFrozen(swipe)).toBe(true)
    expect(Object.keys(swipe)).toEqual([])
    expect(createSwipe({ trailing: [archive] })).not.toBe(swipe)
  })

  it('carries the entries per side and swipeBehavior, reveal by default', () => {
    const host = swipeHostOf(createSwipe({ leading: [archive], trailing: [archive, remove] }))
    expect(host?.leading).toEqual([archive])
    expect(host?.trailing).toEqual([archive, remove])
    expect(host?.behavior).toBe('reveal')
    expect(swipeHostOf(createSwipe({ trailing: [archive], swipeBehavior: 'commit' }))?.behavior).toBe('commit')
    expect(swipeHostOf(createSwipe({}))?.leading).toEqual([])
  })

  it('keeps the entries it was given, whatever the caller does with its arrays after', () => {
    const trailing = [archive]
    const host = swipeHostOf(createSwipe({ trailing }))
    trailing.push(remove)
    expect(host?.trailing).toEqual([archive])
  })

  it('is the only maker of a Swipe value', () => {
    // @ts-expect-error A Swipe value comes only from createSwipe.
    const typed: Swipe = { trailing: [archive] }
    expect(swipeHostOf(typed)).toBeNull()
    expect(swipeHostOf({})).toBeNull()
  })

  it('pairs a value with a row key without changing its entries or rules', () => {
    const swipe = createSwipe({ trailing: [archive] })
    const keyed = swipeWithItemKey(swipe, 'inbox-1')
    expect(swipeHostOf(keyed)?.itemKey).toBe('inbox-1')
    expect(swipeHostOf(keyed)?.trailing).toEqual([archive])
    expect(swipeHostOf(swipe)?.itemKey).toBeUndefined()
    expect(swipeWithItemKey(swipe, undefined)).toBe(swipe)
  })

  describe('the rows it serves', () => {
    const row = { role: undefined, isDisabled: false, isDelegate: false }

    it('serves a role-less row and a listitem, and not a row whose role forbids interactive descendants', () => {
      const host = swipeHostOf(createSwipe({ trailing: [archive] }))
      expect(host?.serves(row)).toBe(true)
      expect(host?.serves({ ...row, role: 'listitem' })).toBe(true)
      for (const role of ['option', 'menuitem', 'menuitemcheckbox', 'menuitemradio'])
        expect(host?.serves({ ...row, role })).toBe(false)
    })

    it('serves no disabled row and no row that is the enlarged target of a control inside it', () => {
      const host = swipeHostOf(createSwipe({ trailing: [archive] }))
      expect(host?.serves({ ...row, isDisabled: true })).toBe(false)
      expect(host?.serves({ ...row, isDelegate: true })).toBe(false)
    })

    it('serves no row when no side has an entry', () => {
      expect(swipeHostOf(createSwipe({}))?.serves(row)).toBe(false)
      expect(swipeHostOf(createSwipe({ leading: [], trailing: [] }))?.serves(row)).toBe(false)
    })
  })

  it('warns in development when a committing side has more than one entry', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    createSwipe({ trailing: [archive], swipeBehavior: 'commit' })
    createSwipe({ trailing: [archive, remove] })
    expect(warn).not.toHaveBeenCalled()
    createSwipe({ trailing: [archive, remove], swipeBehavior: 'commit' })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('swipeBehavior: \'commit\''))
  })
})

describe('a second copy of the swipe module', () => {
  it('finds the host of a Swipe value the package made, and the package finds its own', async () => {
    const swipe = createSwipe({ trailing: [archive] })
    vi.resetModules()
    const copy = await import('./swipeHost')
    expect(copy.swipeHostOf).not.toBe(swipeHostOf)
    expect(copy.swipeHostOf(swipe)).toBe(swipeHostOf(swipe))
    expect(copy.swipeHostOf(swipe)).not.toBeNull()
    expect(copy.swipeHostOf(Object.freeze({}))).toBeNull()
  })
})

describe('the ids a swipe carries in its type', () => {
  it('infers its actions’ ids as literals, and rejects an unknown id, a handler for fewer ids and an action with no id', () => {
    const noop = (): void => {}
    const mail = createSwipe({
      trailing: [
        { id: 'archive', label: 'Archive', onActivate: noop },
        { id: 'delete', label: 'Delete', onActivate: noop },
      ],
    })
    const typed: Swipe<'archive' | 'delete'> = mail
    // @ts-expect-error The swipe has no 'delte' action.
    const misspelt: Swipe<'archive' | 'delte'> = mail
    createSwipe({
      trailing: [
        {
          id: 'archive',
          label: 'Archive',
          onActivate: ({ id }) => {
            // @ts-expect-error An id the swipe does not have never matches.
            expect(id === 'achive').toBe(false)
          },
        },
      ],
    })
    const archiveOnly = (event: { id: 'archive', itemKey: string | number | undefined }): unknown => event
    createSwipe({
      trailing: [
        { id: 'archive', label: 'Archive', onActivate: noop },
        // @ts-expect-error This handler takes fewer ids than the swipe has.
        { id: 'delete', label: 'Delete', onActivate: archiveOnly },
      ],
    })
    // @ts-expect-error An action needs an id.
    createSwipe({ trailing: [{ label: 'Archive', onActivate: noop }] })
    expect([typed, misspelt]).toHaveLength(2)
  })
})
