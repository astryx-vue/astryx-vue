import type { VueWrapper } from '@vue/test-utils'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import Stat from './Stat.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

function renderStat(props: Record<string, unknown> = {}, slot = {}, attrs: Record<string, unknown> = {}): VueWrapper {
  return mount(Stat, {
    attachTo: document.body,
    props: { label: 'Total requests', value: '2.4M', ...props },
    slots: slot,
    attrs,
  })
}

/** 元素自己的文字（不含子元素里的文字），和上游 getByText 的口径一致。 */
function ownText(el: Element): string {
  return [...el.childNodes]
    .filter(node => node.nodeType === 3)
    .map(node => node.textContent)
    .join('')
    .trim()
}

describe('stat', () => {
  it('renders label and value', () => {
    const wrapper = renderStat()
    expect(wrapper.get('.astryx-stat__label').text()).toBe('Total requests')
    expect(wrapper.get('.astryx-stat__value').text()).toBe('2.4M')
  })

  it('renders the stable class and default size data attribute', () => {
    const root = renderStat({}, {}, { 'data-testid': 'stat' }).get('[data-testid="stat"]')
    expect(root.classes()).toContain('astryx-stat')
    expect(root.attributes('data-size')).toBe('md')
  })

  it('reflects the size prop as a data attribute', () => {
    expect(renderStat({ size: 'lg' }, {}, { 'data-testid': 'stat' }).get('[data-testid="stat"]').attributes('data-size')).toBe('lg')
  })

  it('renders delta text with screen-reader direction', () => {
    const wrapper = renderStat({ delta: { value: '+12.4%', direction: 'up' } })
    const delta = wrapper.get('.astryx-stat__delta')
    expect(ownText(delta.element)).toBe('+12.4%')
    expect(wrapper.get('.astryx-stat__sr-only').text()).toBe('(trending up)')
  })

  it('maps direction to default sentiment', () => {
    const wrapper = renderStat({ label: 'P95 latency', value: '284 ms', delta: { value: '+18 ms', direction: 'up' } })
    expect(ownText(wrapper.get('.astryx-stat__delta').element)).toBe('+18 ms')
    expect(wrapper.get('.astryx-stat__delta').attributes('data-sentiment')).toBe('positive')
  })

  it('maps down direction to negative sentiment by default', () => {
    const wrapper = renderStat({ label: 'Signups', value: '1,204', delta: { value: '-4.1%', direction: 'down' } })
    expect(wrapper.get('.astryx-stat__delta').attributes('data-sentiment')).toBe('negative')
  })

  it('maps flat direction to neutral sentiment by default', () => {
    const wrapper = renderStat({ label: 'Active users', value: '18,204', delta: { value: '0.0%', direction: 'flat' } })
    expect(wrapper.get('.astryx-stat__delta').attributes('data-sentiment')).toBe('neutral')
    expect(wrapper.get('.astryx-stat__sr-only').text()).toBe('(flat)')
  })

  it('lets sentiment override the direction mapping for inverted metrics', () => {
    const wrapper = renderStat({
      label: 'Error rate',
      value: '0.42%',
      delta: { value: '-0.08%', direction: 'down', sentiment: 'positive' },
    })
    expect(wrapper.get('.astryx-stat__delta').attributes('data-sentiment')).toBe('positive')
    expect(wrapper.get('.astryx-stat__sr-only').text()).toBe('(trending down)')
  })

  it('renders the description when provided', () => {
    const wrapper = renderStat({ description: 'vs. previous 30 days' })
    expect(wrapper.get('.astryx-stat__description').text()).toBe('vs. previous 30 days')
  })

  it('renders media content when provided', () => {
    const wrapper = renderStat({}, { media: '<svg data-testid="sparkline" />' })
    expect(wrapper.find('[data-testid="sparkline"]').exists()).toBe(true)
    expect(wrapper.get('.astryx-stat__media').element.contains(wrapper.get('[data-testid="sparkline"]').element)).toBe(true)
  })

  it('does not render a delta glyph without a delta', () => {
    expect(renderStat().find('svg').exists()).toBe(false)
    expect(renderStat().find('.astryx-stat__delta').exists()).toBe(false)
  })

  it('forwards attrs to the root element', () => {
    const wrapper = renderStat({}, {}, { 'id': 'stat-root', 'data-testid': 'stat' })
    expect(wrapper.get('[data-testid="stat"]').attributes('id')).toBe('stat-root')
  })

  it('accepts rich markup as the value instead of a plain string', () => {
    const wrapper = renderStat({ label: 'Uptime', value: undefined }, { default: '<span>99.98<small>%</small></span>' })
    expect(wrapper.get('.astryx-stat__value span').text()).toBe('99.98%')
    expect(wrapper.get('.astryx-stat__value small').text()).toBe('%')
  })

  it('renders on the server', async () => {
    const app = createSSRApp({
      render: () => h(Stat, { label: 'Total requests', delta: { value: '+12.4%', direction: 'up' } }, () => '2.4M'),
    })
    const html = await renderToString(app)
    expect(html).toContain('class="astryx-stat"')
    expect(html).toContain('data-size="md"')
    expect(html).toContain('data-sentiment="positive"')
    expect(html).toContain('(trending up)')
  })
})
