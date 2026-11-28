import type { TreeListItemData } from './types.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import * as layout from '../motion/layout/index.js'
import TreeList from './TreeList.vue'

vi.mock('../motion/layout/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../motion/layout/index.js')>()
  return {
    ...actual,
    applyLayoutChangeTransition: vi.fn(),
    holdLayoutExit: vi.fn(() => false),
    playLayoutChange: vi.fn(() => null),
    releaseLayoutExit: vi.fn(),
    reportLayoutChange: vi.fn(() => ({ measureBefore: vi.fn(), animate: vi.fn(() => true) })),
  }
})

const handle = layout.createAnimatedLayout(() => null)

const items: TreeListItemData[] = [
  {
    id: 'src',
    label: 'src',
    isExpanded: true,
    children: [
      { id: 'lib', label: 'lib', isExpanded: true, children: [{ id: 'a', label: 'a.ts' }] },
      { id: 'b', label: 'b.ts' },
    ],
  },
  { id: 'readme', label: 'README.md' },
]

function mountTree(animatedLayout = handle) {
  return mount(TreeList, {
    props: { items, label: 'Files', animatedLayout },
    attachTo: document.body,
  })
}

function rowOf(wrapper: ReturnType<typeof mountTree>, id: string): HTMLElement {
  return wrapper.find(`[data-tree-id="${id}"]`).element as HTMLElement
}

async function toggle(wrapper: ReturnType<typeof mountTree>, id: string): Promise<void> {
  await wrapper.find(`[data-tree-id="${id}"] [data-tree-toggle]`).trigger('click')
  await nextTick()
}

afterEach(() => {
  vi.clearAllMocks()
  document.body.innerHTML = ''
})

describe('treeList with an animatedLayout handle', () => {
  it('measures the toggled row before the change and turns its chevron', async () => {
    const wrapper = mountTree()
    const row = rowOf(wrapper, 'src')
    await toggle(wrapper, 'src')

    expect(layout.reportLayoutChange).toHaveBeenCalledTimes(1)
    const [, target] = vi.mocked(layout.reportLayoutChange).mock.calls[0]!
    expect((target as () => Element)()).toBe(row)
    expect(layout.applyLayoutChangeTransition).toHaveBeenCalledWith(handle, row.querySelector('[data-tree-toggle] > .astryx-icon'))
    wrapper.unmount()
  })

  it('keeps a collapsing group and its nested rows until the exit ends', async () => {
    let endExit: (() => void) | undefined
    vi.mocked(layout.holdLayoutExit).mockImplementationOnce((_handle, _element, done) => {
      endExit = done
      return true
    })
    const wrapper = mountTree()
    await toggle(wrapper, 'src')

    const row = rowOf(wrapper, 'src')
    expect(row.getAttribute('aria-expanded')).toBe('false')
    expect(rowOf(wrapper, 'lib').hasAttribute('data-tree-exiting')).toBe(true)
    expect(rowOf(wrapper, 'a').hasAttribute('data-tree-exiting')).toBe(true)
    expect(wrapper.find('[data-tree-id="a"]').exists()).toBe(true)
    expect(layout.holdLayoutExit).toHaveBeenCalledWith(handle, row.querySelector(':scope > [role="group"]'), expect.any(Function))

    endExit?.()
    await nextTick()
    expect(wrapper.find('[data-tree-id="lib"]').exists()).toBe(false)
    expect(wrapper.find('[data-tree-id="a"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('removes the group at once when the exit is not held', async () => {
    const wrapper = mountTree()
    await toggle(wrapper, 'lib')
    await nextTick()

    expect(wrapper.find('[data-tree-id="a"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('plays the entrance of a group that expands', async () => {
    const wrapper = mountTree()
    await toggle(wrapper, 'lib')
    await nextTick()
    await toggle(wrapper, 'lib')

    const group = rowOf(wrapper, 'lib').querySelector(':scope > [role="group"]')
    expect(layout.releaseLayoutExit).toHaveBeenCalledWith(group)
    expect(layout.playLayoutChange).toHaveBeenCalledWith(handle, group)
    wrapper.unmount()
  })

  it('skips the rows of an exiting group in keyboard navigation', async () => {
    vi.mocked(layout.holdLayoutExit).mockImplementationOnce(() => true)
    const wrapper = mountTree()
    await toggle(wrapper, 'src')

    const src = rowOf(wrapper, 'src')
    src.focus()
    await wrapper.find('[role="tree"]').trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(rowOf(wrapper, 'readme'))
    wrapper.unmount()
  })
})

describe('treeList without a handle', () => {
  it('measures nothing and clears every chevron to its own transition', async () => {
    const wrapper = mount(TreeList, { props: { items, label: 'Files' }, attachTo: document.body })
    const chevrons = wrapper.findAll('[data-tree-toggle] > .astryx-icon')
    expect(chevrons.length).toBeGreaterThan(0)
    for (const chevron of chevrons)
      expect(layout.applyLayoutChangeTransition).toHaveBeenCalledWith(null, chevron.element)

    await toggle(wrapper, 'src')
    expect(layout.reportLayoutChange).not.toHaveBeenCalled()
    expect(wrapper.find('[data-tree-id="lib"]').exists()).toBe(false)
    wrapper.unmount()
  })
})

describe('treeList under a finger with no handle', () => {
  function stubPointer(isCoarse: boolean): void {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: isCoarse && query.includes('pointer: coarse'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  }

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('animates inside itself under a coarse pointer', async () => {
    stubPointer(true)
    const wrapper = mount(TreeList, { props: { items, label: 'Files' }, attachTo: document.body })
    await nextTick()
    await toggle(wrapper as never, 'src')
    expect(layout.reportLayoutChange).toHaveBeenCalled()
  })

  it('changes at once under a fine pointer', async () => {
    stubPointer(false)
    const wrapper = mount(TreeList, { props: { items, label: 'Files' }, attachTo: document.body })
    await nextTick()
    await toggle(wrapper as never, 'src')
    expect(layout.reportLayoutChange).not.toHaveBeenCalled()
  })
})
