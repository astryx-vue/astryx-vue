import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { byText, queryByText } from '../../test-support/a11y.js'
import { mountRadial, pieData, spiderAxes } from '../../test-support/radial.js'
import RadialSlice from './RadialSlice.vue'

function mountSlices(colors = ['#111111', '#222222', '#333333'], props: Record<string, unknown> = {}, chartProps: Record<string, unknown> = {}) {
  return mountRadial(
    { data: pieData, valueKey: 'revenue', labelKey: 'region', ...chartProps },
    () => h(RadialSlice, { colors, ...props }),
  )
}

describe('radialSlice', () => {
  it('renders one path per positive datum and cycles colors', () => {
    const wrapper = mountSlices()
    const paths = wrapper.findAll('path')
    expect(paths).toHaveLength(3)
    expect(paths.map(path => path.attributes('fill'))).toEqual(['#111111', '#222222', '#333333'])
    wrapper.unmount()

    const cycling = mountSlices(['#111111', '#222222'])
    expect(cycling.findAll('path')[2].attributes('fill')).toBe('#111111')
    cycling.unmount()
  })

  it('draws pie and donut sectors with the shared center transform', () => {
    const pie = mountSlices()
    expect(pie.get('path').attributes('transform')).toBe('translate(300 200)')
    expect(pie.get('path').attributes('d')!.split('A').length - 1).toBe(1)
    pie.unmount()

    const donut = mountSlices(undefined, {}, { innerRadius: 0.6 })
    expect(donut.get('path').attributes('d')!.split('A').length - 1).toBe(2)
    donut.unmount()
  })

  it('applies real corner geometry and removes the separator stroke when rounded', () => {
    const plain = mountSlices()
    const rounded = mountSlices(undefined, { cornerRadius: 8 })
    expect(rounded.get('path').attributes('d')).not.toBe(plain.get('path').attributes('d'))
    expect(rounded.findAll('path').every(path => path.attributes('stroke-width') === '0')).toBe(true)
    expect(plain.findAll('path').every(path => path.attributes('stroke-width') === '1')).toBe(true)
    plain.unmount()
    rounded.unmount()
  })

  it('labels rounded percentages and hides values below the threshold', () => {
    const wrapper = mountSlices()
    expect(byText(wrapper.element, '50%')).not.toBeNull()
    expect(byText(wrapper.element, '30%')).not.toBeNull()
    expect(byText(wrapper.element, '20%')).not.toBeNull()
    wrapper.unmount()

    const threshold = mountRadial(
      { data: [{ region: 'big', revenue: 97 }, { region: 'tiny', revenue: 3 }], valueKey: 'revenue', labelKey: 'region' },
      () => h(RadialSlice, { colors: ['#111111'] }),
    )
    expect(byText(threshold.element, '97%')).not.toBeNull()
    expect(queryByText(threshold.element, '3%')).toBeNull()
    threshold.unmount()
  })

  it('renders no paths for non-positive totals or spider mode', () => {
    const zero = mountRadial(
      { data: [{ region: 'a', revenue: 0 }, { region: 'b', revenue: -2 }], valueKey: 'revenue', labelKey: 'region' },
      () => h(RadialSlice, { colors: ['#111111'] }),
    )
    expect(zero.find('path').exists()).toBe(false)
    zero.unmount()

    const spider = mountRadial({ data: pieData, axes: spiderAxes }, () => h(RadialSlice, { colors: ['#111111'] }))
    expect(spider.find('path').exists()).toBe(false)
    spider.unmount()
  })

  it('uses the accent fallback if the color array is empty', () => {
    const wrapper = mountSlices([])
    expect(wrapper.get('path').attributes('fill')).toBe('var(--astryx-color-accent)')
    wrapper.unmount()
  })
})
