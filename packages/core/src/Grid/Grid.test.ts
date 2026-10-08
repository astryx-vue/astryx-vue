import type { GridProps } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Grid from './Grid.vue'
import GridSpan from './GridSpan.vue'

function templateColumns(element: HTMLElement): string {
  return element.style.getPropertyValue('--astryx-grid-template-columns')
}

describe('grid', () => {
  it('renders one grid container with the fixed column template', () => {
    const wrapper = mount(Grid, {
      props: { columns: 3 },
      slots: { default: '<div>Item 1</div><div>Item 2</div><div>Item 3</div>' },
    })

    const grid = wrapper.find('.astryx-grid')
    expect(grid.exists()).toBe(true)
    expect(templateColumns(wrapper.element as HTMLElement)).toBe('repeat(3, 1fr)')
    expect(grid.findAll('div > div')).toHaveLength(3)
  })

  it('keeps the track template out of raw inline styles so overrides can win', () => {
    const wrapper = mount(Grid, { props: { columns: 3, rowHeight: 80 } })

    expect(wrapper.element.style.gridTemplateColumns).toBe('')
    expect(wrapper.element.style.gridAutoRows).toBe('')
    expect(templateColumns(wrapper.element as HTMLElement)).toBe('repeat(3, 1fr)')
    expect(wrapper.element.style.getPropertyValue('--astryx-grid-auto-rows')).toBe('80px')
  })

  it('builds responsive tracks from a minimum width, defaulting to fill', () => {
    const wrapper = mount(Grid, { props: { columns: { minWidth: 280 } } })

    expect(templateColumns(wrapper.element as HTMLElement)).toBe('repeat(auto-fill, minmax(280px, 1fr))')
  })

  it('uses auto-fit when repeat is fit', () => {
    const wrapper = mount(Grid, {
      props: { columns: { minWidth: 280, repeat: 'fit' } },
    })

    expect(templateColumns(wrapper.element as HTMLElement)).toBe('repeat(auto-fit, minmax(280px, 1fr))')
  })

  it('caps the column count on the track minimum so present columns still fill', () => {
    const wrapper = mount(Grid, {
      props: { columns: { minWidth: 250, max: 3 }, gap: 4 },
    })

    const template = templateColumns(wrapper.element as HTMLElement)
    expect(template).toBe(
      'repeat(auto-fill, minmax(min(100%, max(250px, calc((100% - 2 * var(--astryx-spacing-4, 16px)) / 3))), 1fr))',
    )
    expect(template).toMatch(/, 1fr\)\)$/)
    expect(wrapper.element.style.maxWidth).toBe('')
  })

  it('lets columnGap take precedence over gap in the capped track floor', () => {
    const wrapper = mount(Grid, {
      props: { columns: { minWidth: 200, max: 4 }, columnGap: 6 },
    })

    expect(templateColumns(wrapper.element as HTMLElement)).toBe(
      'repeat(auto-fill, minmax(min(100%, max(200px, calc((100% - 3 * var(--astryx-spacing-6, 24px)) / 4))), 1fr))',
    )
  })

  it('uses a plain fraction in the capped track floor when no gap is set', () => {
    const wrapper = mount(Grid, { props: { columns: { minWidth: 100, max: 3 } } })

    expect(templateColumns(wrapper.element as HTMLElement)).toBe(
      'repeat(auto-fill, minmax(min(100%, max(100px, calc(100% / 3))), 1fr))',
    )
  })

  it('falls back to a single column when columns is missing or not positive', () => {
    expect(templateColumns(mount(Grid).element as HTMLElement)).toBe('1fr')
    expect(templateColumns(mount(Grid, { props: { columns: 0 } }).element as HTMLElement)).toBe('1fr')
    expect(templateColumns(mount(Grid, { props: { columns: -1 } }).element as HTMLElement)).toBe('1fr')
  })

  it('marks the container with the column count, gaps, and alignment it was given', () => {
    const wrapper = mount(Grid, {
      props: { columns: 3, gap: 2, rowGap: 4, columnGap: 6, align: 'center', justify: 'start' },
    })

    const grid = wrapper.find('.astryx-grid')
    expect(grid.attributes('data-columns')).toBe('3')
    expect(grid.attributes('data-gap')).toBe('2')
    expect(grid.attributes('data-row-gap')).toBe('4')
    expect(grid.attributes('data-column-gap')).toBe('6')
    expect(grid.attributes('data-align')).toBe('center')
    expect(grid.attributes('data-justify')).toBe('start')
  })

  it('omits the column count for responsive tracks and defaults alignment to stretch', () => {
    const wrapper = mount(Grid, { props: { columns: { minWidth: 240 } } })

    const grid = wrapper.find('.astryx-grid')
    expect(grid.attributes('data-columns')).toBeUndefined()
    expect(grid.attributes('data-align')).toBe('stretch')
    expect(grid.attributes('data-justify')).toBe('stretch')
  })

  it('applies gap as spacing tokens and lets an axis override win', () => {
    const wrapper = mount(Grid, { props: { gap: 4, rowGap: 0, columnGap: 2 } })

    const style = wrapper.element.style
    expect(style.getPropertyValue('--astryx-grid-gap')).toBe('var(--astryx-spacing-4, 16px)')
    expect(style.getPropertyValue('--astryx-grid-row-gap')).toBe('var(--astryx-spacing-0, 0px)')
    expect(style.getPropertyValue('--astryx-grid-column-gap')).toBe('var(--astryx-spacing-2, 8px)')
  })

  it('leaves the gap variables unset when no spacing prop is given', () => {
    const wrapper = mount(Grid, { props: { columns: 2 } })

    expect(wrapper.element.style.getPropertyValue('--astryx-grid-gap')).toBe('')
    expect(wrapper.element.style.getPropertyValue('--astryx-grid-row-gap')).toBe('')
    expect(wrapper.element.style.getPropertyValue('--astryx-grid-column-gap')).toBe('')
  })

  it('formats numeric sizes as pixels and preserves string sizes', () => {
    const wrapper = mount(Grid, {
      props: { columns: 2, height: 400, maxWidth: '60rem', minHeight: 0, width: '100%' },
    })

    expect(wrapper.element.style.height).toBe('400px')
    expect(wrapper.element.style.maxWidth).toBe('60rem')
    expect(wrapper.element.style.minHeight).toBe('0px')
    expect(wrapper.element.style.width).toBe('100%')
  })

  it('merges consumer classes and styles, letting the size props win', () => {
    const wrapper = mount(Grid, {
      props: { columns: 2, width: 600 },
      attrs: { class: 'my-grid', style: 'width: 200px; color: red' },
    })

    expect(wrapper.classes()).toContain('astryx-grid')
    expect(wrapper.classes()).toContain('my-grid')
    expect(wrapper.element.style.width).toBe('600px')
    expect(wrapper.element.style.color).toBe('red')
  })

  it('forwards attributes and listeners to the container', async () => {
    const wrapper = mount(Grid, {
      props: { columns: 2 },
      attrs: { 'aria-label': 'Product grid', 'data-testid': 'grid', 'onClick': () => {} },
      slots: { default: '<div>Item</div>' },
    })

    const grid = wrapper.find('.astryx-grid')
    expect(grid.attributes('aria-label')).toBe('Product grid')
    expect(grid.attributes('data-testid')).toBe('grid')

    await grid.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders slot content inside the container', () => {
    const wrapper = mount(Grid, {
      props: { columns: 2 },
      slots: { default: '<span class="tile">Child content</span>' },
    })

    expect(wrapper.find('.astryx-grid > span.tile').text()).toBe('Child content')
  })

  it('exposes the container element', () => {
    const wrapper = mount(Grid)
    expect(wrapper.vm.element).toBe(wrapper.element)
  })

  it('follows reactive props instead of a snapshot taken at mount', async () => {
    const columns = ref<number | { minWidth: number }>(2)
    const gap = ref<GridProps['gap']>(2)

    const Owner = defineComponent({
      setup() {
        return () => h(Grid, { columns: columns.value, gap: gap.value })
      },
    })

    const wrapper = mount(Owner)
    expect(templateColumns(wrapper.element as HTMLElement)).toBe('repeat(2, 1fr)')

    columns.value = 5
    gap.value = 6
    await nextTick()

    expect(templateColumns(wrapper.element as HTMLElement)).toBe('repeat(5, 1fr)')
    expect(wrapper.element.style.getPropertyValue('--astryx-grid-gap')).toBe('var(--astryx-spacing-6, 24px)')

    columns.value = { minWidth: 120 }
    await nextTick()

    expect(templateColumns(wrapper.element as HTMLElement)).toBe('repeat(auto-fill, minmax(120px, 1fr))')
  })
})

describe('gridSpan', () => {
  it('spans the requested number of columns', () => {
    const wrapper = mount(GridSpan, { props: { columns: 2 } })

    expect(wrapper.find('.astryx-grid-span').exists()).toBe(true)
    expect(wrapper.element.style.gridColumn).toBe('span 2')
    expect(wrapper.element.style.gridRow).toBe('')
  })

  it('spans the whole row with columns full', () => {
    const wrapper = mount(GridSpan, { props: { columns: 'full' } })

    expect(wrapper.element.style.gridColumn).toBe('1 / -1')
  })

  it('spans the requested number of rows', () => {
    const wrapper = mount(GridSpan, { props: { rows: 3 } })

    expect(wrapper.element.style.gridRow).toBe('span 3')
    expect(wrapper.element.style.gridColumn).toBe('')
  })

  it('spans both axes at once', () => {
    const wrapper = mount(GridSpan, { props: { columns: 2, rows: 2 } })

    expect(wrapper.element.style.gridColumn).toBe('span 2')
    expect(wrapper.element.style.gridRow).toBe('span 2')
  })

  it('writes no span when neither prop is given', () => {
    const wrapper = mount(GridSpan)

    expect(wrapper.element.style.gridColumn).toBe('')
    expect(wrapper.element.style.gridRow).toBe('')
  })

  it('sits inside a grid and forwards attributes', () => {
    const wrapper = mount(Grid, {
      props: { columns: 4 },
      slots: { default: '<div class="astryx-grid-span" aria-label="Featured item">Wide</div>' },
    })

    const span = wrapper.find('.astryx-grid-span')
    expect(span.attributes('aria-label')).toBe('Featured item')
    expect(span.text()).toBe('Wide')
  })

  it('merges consumer classes and styles and lets the span win', () => {
    const wrapper = mount(GridSpan, {
      props: { columns: 2 },
      attrs: { class: 'my-span', style: 'grid-column: span 5; color: red' },
    })

    expect(wrapper.classes()).toContain('astryx-grid-span')
    expect(wrapper.classes()).toContain('my-span')
    expect(wrapper.element.style.gridColumn).toBe('span 2')
    expect(wrapper.element.style.color).toBe('red')
  })

  it('exposes the span element', () => {
    const wrapper = mount(GridSpan)
    expect(wrapper.vm.element).toBe(wrapper.element)
  })
})
