import type { AnimatedLayout } from '../../composables/useAnimatedLayout.js'
import type { TableColumn } from '../types.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import * as layout from '../../motion/layout/index.js'
import { pixel } from '../columnUtils.js'
import { GLIDING_ATTRIBUTE } from '../glidingDivider.js'
import Table from '../Table.vue'
import { useTableRowExpansion } from './rowExpansion.js'

vi.mock('../../motion/layout/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../motion/layout/index.js')>()
  return {
    ...actual,
    applyLayoutChangeTransition: vi.fn(),
    glideOf: vi.fn(() => null),
    playLayoutChange: vi.fn(() => null),
    reportLayoutChange: vi.fn(() => ({ measureBefore: vi.fn(), animate: vi.fn(() => true) })),
  }
})

interface Person extends Record<string, unknown> {
  id: string
  name: string
}

const people: Person[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Carol' },
]
const columns: TableColumn<Person>[] = [{ key: 'name', header: 'Name', width: pixel(160) }]
const handle = layout.createAnimatedLayout(() => null)

function mountTable(options: { animatedLayout?: AnimatedLayout | null, expanded?: string[] } = {}) {
  const expanded = ref(new Set<string>(options.expanded ?? []))
  const animatedLayout = ref(options.animatedLayout === undefined ? handle : options.animatedLayout)
  const wrapper = mount({
    components: { Table },
    setup() {
      const expansion = useTableRowExpansion<Person>(() => ({
        expandedKeys: expanded.value,
        onToggle(key) {
          const next = new Set(expanded.value)
          if (next.has(key))
            next.delete(key)
          else
            next.add(key)
          expanded.value = next
        },
        getRowKey: person => person.id,
        renderExpanded: person => h('p', `Detail ${person.name}`),
        animatedLayout: animatedLayout.value,
      }))
      return { people, columns, expansion }
    },
    template: '<Table :data="people" :columns="columns" id-key="id" :plugins="{ expansion }" />',
  }, { attachTo: document.body })
  return { wrapper, animatedLayout }
}

function rowOf(wrapper: ReturnType<typeof mountTable>['wrapper'], key: string): HTMLTableRowElement {
  return wrapper.get(`tbody tr[data-expansion-key="${key}"]`).element as HTMLTableRowElement
}

async function toggle(wrapper: ReturnType<typeof mountTable>['wrapper'], key: string): Promise<void> {
  await wrapper.get(`tbody tr[data-expansion-key="${key}"] button`).trigger('click')
  await nextTick()
}

/** 一个能从外面结束的滑动替身。 */
function controllableGlide(): { animation: Animation, finish: () => void } {
  let finish = (): void => {}
  const animation = {} as { finished: Promise<Animation> }
  animation.finished = new Promise<Animation>((resolve) => {
    finish = () => resolve(animation as Animation)
  })
  return { animation: animation as Animation, finish }
}

afterEach(() => {
  vi.clearAllMocks()
  document.body.innerHTML = ''
})

describe('table row expansion with an animatedLayout handle', () => {
  it('measures the toggled row before the change, turns its chevron and plays the panel entrance', async () => {
    const animate = vi.fn((beforeMove?: (candidates: ReadonlyArray<Element>) => void) => {
      beforeMove?.([])
      return true
    })
    vi.mocked(layout.reportLayoutChange).mockImplementationOnce(() => ({ measureBefore: vi.fn(), animate }))
    const { wrapper } = mountTable()
    const row = rowOf(wrapper, '1')
    await toggle(wrapper, '1')

    expect(layout.reportLayoutChange).toHaveBeenCalledTimes(1)
    const [, target] = vi.mocked(layout.reportLayoutChange).mock.calls[0]!
    expect((target as () => Element)()).toBe(row)
    expect(layout.applyLayoutChangeTransition).toHaveBeenCalledWith(handle, row.querySelector('.astryx-table__chevron-icon'))
    expect(animate).toHaveBeenCalledTimes(1)
    const panel = row.nextElementSibling
    expect(panel?.hasAttribute('data-expansion-panel')).toBe(true)
    expect(layout.playLayoutChange).toHaveBeenCalledWith(handle, panel)
    wrapper.unmount()
  })

  it('holds the scroll container height and marks the gliding rows until the glide ends', async () => {
    const { wrapper } = mountTable({ expanded: ['1'] })
    const row = rowOf(wrapper, '1')
    const panel = row.nextElementSibling as HTMLElement
    panel.getBoundingClientRect = () => ({ height: 80 } as DOMRect)
    const below = rowOf(wrapper, '2')
    vi.mocked(layout.reportLayoutChange).mockImplementationOnce(() => ({
      measureBefore: vi.fn(),
      animate: (beforeMove) => {
        beforeMove?.([below])
        return true
      },
    }))
    const glide = controllableGlide()
    vi.mocked(layout.glideOf).mockImplementation(element => element === below ? glide.animation : null)
    const scroller = wrapper.get('.astryx-table-scroll').element as HTMLElement

    await toggle(wrapper, '1')
    await Promise.resolve()

    expect(wrapper.find('[data-expansion-panel]').exists()).toBe(false)
    expect(below.hasAttribute(GLIDING_ATTRIBUTE)).toBe(true)
    expect(scroller.style.getPropertyValue('padding-block-end')).toBe('80px')
    expect(scroller.style.getPropertyValue('margin-block-end')).toBe('-80px')

    glide.finish()
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(below.hasAttribute(GLIDING_ATTRIBUTE)).toBe(false)
    expect(scroller.style.getPropertyValue('padding-block-end')).toBe('')
    expect(scroller.style.getPropertyValue('margin-block-end')).toBe('')
    vi.mocked(layout.glideOf).mockReset()
    wrapper.unmount()
  })

  it('measures nothing without a handle and leaves the chevrons to the theme', async () => {
    const { wrapper } = mountTable({ animatedLayout: null })
    const glyph = rowOf(wrapper, '1').querySelector('.astryx-table__chevron-icon')
    expect(layout.applyLayoutChangeTransition).toHaveBeenCalledWith(null, glyph)

    await toggle(wrapper, '1')
    expect(layout.reportLayoutChange).not.toHaveBeenCalled()
    expect(wrapper.get('[data-expansion-panel]').text()).toContain('Detail Alice')
    wrapper.unmount()
  })

  it('tags every expandable row with its key', () => {
    const { wrapper } = mountTable({ animatedLayout: null })
    const keys = wrapper.findAll('tbody tr').map(row => row.attributes('data-expansion-key'))
    expect(keys).toEqual(['1', '2', '3'])
    wrapper.unmount()
  })
})
