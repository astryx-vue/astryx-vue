/**
 * @file List.animatedLayout.test.ts
 * @input vitest (happy-dom)、替换掉的布局动效模块、真实的 List 和 ListItem
 * @output 传了 `animatedLayout` 的列表逐行报告插入、移除、移动：移除的行放回原处播退场，
 *   新行入场，交叉的行从上方滑过；离开的行保持离开那一刻的样子；包里的 List 和自己拷的 ListItem 共用同一份记录
 */
import type { AnimatedLayout } from '../motion/layout/index.js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, reactive } from 'vue'
import * as layout from '../motion/layout/index.js'
import { realmValue, sharedKey } from '../utils/sharedRealm.js'
import List from './List.vue'
import ListItem from './ListItem.vue'
import { isReportedRow } from './listPresentation.js'

const measuredRows = vi.hoisted(() => ({ before: [] as string[][] }))

vi.mock('../motion/layout/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../motion/layout/index.js')>()
  return {
    ...actual,
    holdLayoutExit: vi.fn(() => false),
    playLayoutChange: vi.fn(() => null),
    reportLayoutChange: vi.fn((_handle: unknown, target: () => Element) => ({
      measureBefore: () => {
        const list = target().parentElement
        measuredRows.before.push([...(list?.children ?? [])].map(row => row.textContent?.trim() ?? ''))
      },
      animate: vi.fn(() => true),
    })),
  }
})

const ROW_PX = 40
const handle = layout.createAnimatedLayout(() => null)

/** happy-dom 不排版：每行的盒子按它在列表里的位置给出，一行 40px。 */
function stubRowBoxes(): void {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const index = this.parentElement == null ? 0 : [...this.parentElement.children].indexOf(this)
    const top = this.tagName === 'LI' ? index * ROW_PX : 0
    return { top, bottom: top + ROW_PX, left: 0, right: 300, width: 300, height: ROW_PX, x: 0, y: top, toJSON: () => ({}) } as DOMRect
  })
}

interface Row { id: string, label: string }

function mountList(rows: Row[], options: { animatedLayout?: AnimatedLayout | undefined, keyed?: boolean } = {}) {
  const state = reactive({ rows })
  const Host = defineComponent({
    setup() {
      return () => h(List, { animatedLayout: 'animatedLayout' in options ? options.animatedLayout : handle }, () =>
        state.rows.map(row => h(ListItem, {
          key: row.id,
          itemKey: options.keyed === false ? undefined : row.id,
          label: row.label,
        })))
    },
  })
  const wrapper = mount(Host, { attachTo: document.body })
  const labels = (): string[] => [...wrapper.get('ul').element.children].map(row => row.textContent?.trim() ?? '')
  const rowNamed = (label: string): HTMLElement =>
    [...wrapper.get('ul').element.children].find(row => row.textContent?.trim() === label) as HTMLElement
  return { wrapper, state, labels, rowNamed }
}

const ABC: Row[] = [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }, { id: 'c', label: 'Gamma' }]

beforeEach(() => {
  measuredRows.before = []
  stubRowBoxes()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
  document.body.innerHTML = ''
})

describe('a list with an animatedLayout handle', () => {
  it('measures the rows in view before the change and enters an inserted row', async () => {
    const { state, rowNamed } = mountList(ABC)
    state.rows = [ABC[0]!, { id: 'n', label: 'New' }, ...ABC.slice(1)]
    await nextTick()

    expect(layout.reportLayoutChange).toHaveBeenCalledTimes(3)
    expect(measuredRows.before[0]).toEqual(['Alpha', 'Beta', 'Gamma'])
    const animates = vi.mocked(layout.reportLayoutChange).mock.results.map(result => result.value.animate)
    animates.forEach(animate => expect(animate).toHaveBeenCalledTimes(1))
    expect(layout.playLayoutChange).toHaveBeenCalledTimes(1)
    expect(layout.playLayoutChange).toHaveBeenCalledWith(handle, rowNamed('New'))
  })

  it('puts a removed row back in its place for its exit, and removes it when the exit ends', async () => {
    let endExit: (() => void) | undefined
    vi.mocked(layout.holdLayoutExit).mockImplementationOnce((_handle, _element, done) => {
      endExit = done
      return true
    })
    const { state, labels, rowNamed } = mountList(ABC)
    state.rows = [ABC[0]!, ABC[2]!]
    await nextTick()

    expect(labels()).toEqual(['Alpha', 'Beta', 'Gamma'])
    const leaving = rowNamed('Beta')
    expect(leaving.hasAttribute('data-astryx-leaving')).toBe(true)
    expect(leaving.getAttribute('aria-hidden')).toBe('true')
    expect(layout.holdLayoutExit).toHaveBeenCalledWith(handle, leaving, expect.any(Function))

    endExit?.()
    expect(labels()).toEqual(['Alpha', 'Gamma'])
  })

  it('removes a row at once when the module holds no exit', async () => {
    const { state, labels } = mountList(ABC)
    state.rows = [ABC[0]!, ABC[2]!]
    await nextTick()
    expect(labels()).toEqual(['Alpha', 'Gamma'])
  })

  it('keeps a leaving row after as many staying rows as came before it when the others move', async () => {
    vi.mocked(layout.holdLayoutExit).mockImplementation(() => true)
    const { state, labels } = mountList(ABC)
    state.rows = [ABC[0]!, ABC[2]!]
    await nextTick()
    state.rows = [ABC[2]!, ABC[0]!]
    await nextTick()
    expect(labels()).toEqual(['Gamma', 'Beta', 'Alpha'])
  })

  it('raises the row that crosses farther above the rows it passes, for the length of its glide', async () => {
    let finish: () => void = () => {}
    const finished = new Promise<void>((resolve) => {
      finish = resolve
    })
    const { state, rowNamed } = mountList(ABC)
    const gamma = rowNamed('Gamma')
    Object.defineProperty(gamma, 'getAnimations', { value: () => [{ finished }] })
    Object.defineProperty(rowNamed('Alpha'), 'getAnimations', { value: () => [{ finished }] })
    state.rows = [ABC[2]!, ABC[0]!, ABC[1]!]
    await nextTick()
    await Promise.resolve()

    // Gamma 从第三行滑到第一行，走得最远，从 Alpha 和 Beta 上方经过。
    expect(gamma.hasAttribute('data-astryx-travelling')).toBe(true)
    expect(rowNamed('Alpha').hasAttribute('data-astryx-travelling')).toBe(false)
    finish()
    await finished
    await Promise.resolve()
    expect(gamma.hasAttribute('data-astryx-travelling')).toBe(false)
  })

  it('changes rows without an itemKey at once', async () => {
    vi.mocked(layout.holdLayoutExit).mockImplementation(() => true)
    const { state, labels } = mountList(ABC, { keyed: false })
    state.rows = [ABC[0]!, ABC[2]!]
    await nextTick()
    expect(labels()).toEqual(['Alpha', 'Gamma'])
    expect(layout.holdLayoutExit).not.toHaveBeenCalled()
    expect(layout.playLayoutChange).not.toHaveBeenCalled()
  })

  it('reports nothing without a handle', async () => {
    const { state, labels } = mountList(ABC, { animatedLayout: undefined })
    state.rows = [ABC[0]!, ABC[2]!]
    await nextTick()
    expect(layout.reportLayoutChange).not.toHaveBeenCalled()
    expect(labels()).toEqual(['Alpha', 'Gamma'])
  })
})

describe('a leaving row shows what it showed as it left', () => {
  it('records what its animations presented while still in the document and writes it back for the exit', async () => {
    vi.mocked(layout.holdLayoutExit).mockImplementation(() => true)
    const { state, rowNamed } = mountList(ABC)
    const beta = rowNamed('Beta')
    const surface = beta.firstElementChild as HTMLElement
    const travel = {
      commitStyles: () => surface.style.setProperty('translate', '-72px 0px'),
      cancel: vi.fn(),
    }
    Object.defineProperty(beta, 'getAnimations', { value: () => [travel] })
    state.rows = [ABC[0]!, ABC[2]!]
    await nextTick()

    expect(beta.isConnected).toBe(true)
    expect(surface.style.getPropertyValue('translate')).toBe('-72px 0px')
    expect(travel.cancel).toHaveBeenCalled()
  })

  it('shares the reported rows with every copy of the package', async () => {
    const { state, rowNamed, wrapper } = mountList(ABC)
    const list = wrapper.get('ul').element
    const beta = rowNamed('Beta')
    let seen: boolean | undefined
    // 另一份拷贝通过同一个全局键读到这次更新报告过的行。
    const shared = realmValue(sharedKey('list/list-layout-updates/reported-rows', 1), () => new WeakMap<Element, ReadonlySet<Element>>())
    Object.defineProperty(beta, 'getAnimations', {
      value: () => {
        // 第一次是行卸载前记录样子时读的；退场放回后还会再读一次。
        seen ??= shared.get(list)?.has(beta)
        return []
      },
    })
    state.rows = [ABC[0]!, ABC[2]!]
    await nextTick()
    expect(seen).toBe(true)
    expect(isReportedRow(beta)).toBe(false)
  })
})

describe('the travelling row\'s styles', () => {
  it('rides above with the surface behind it, and a selected row keeps its own fill', () => {
    const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/list.css'), 'utf8')
    expect(css).toMatch(/\.astryx-list > \.astryx-list-item\[data-astryx-travelling\] \{\s*z-index: 2;/)
    expect(css).toMatch(/\.astryx-list > \.astryx-list-item\[data-astryx-travelling\]:not\(\[data-selected='true'\]\) \{\s*box-shadow: inset 0 0 0 100vmax var\(--astryx-color-background-surface/)
  })
})
