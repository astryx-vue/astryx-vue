import type { SVGIconDef } from './types.js'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { bellIcon, calendarIcon, homeIcon, starterIcons, xIcon } from './icons.js'
import SVGIcon from './SVGIcon.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

/** 顶层图形组，不含 <defs> 里的遮罩。 */
function shapeGroups(svg: Element): Element[] {
  return [...svg.children].filter(el => el.tagName === 'g')
}

function renderIcon(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  return mount(SVGIcon, { props: { icon: bellIcon, ...props }, attrs })
}

describe('sVGIcon', () => {
  it('defaults to decorative (aria-hidden) when no accessible name is given', () => {
    const svg = renderIcon().get('svg')
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('role')).toBeUndefined()
  })

  it('respects a consumer aria-label: role="img" and no aria-hidden', () => {
    const svg = renderIcon({}, { 'aria-label': 'Notifications' }).get('svg')
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-hidden')).toBeUndefined()
    expect(svg.attributes('aria-label')).toBe('Notifications')
  })

  it('respects a consumer aria-labelledby: role="img" and no aria-hidden', () => {
    document.body.innerHTML = '<span id="svg-icon-lbl">Alerts</span>'
    const svg = renderIcon({}, { 'aria-labelledby': 'svg-icon-lbl' }).get('svg')
    expect(svg.attributes('role')).toBe('img')
    expect(svg.attributes('aria-hidden')).toBeUndefined()
  })

  it('still lets an explicit aria-hidden from the consumer win', () => {
    const svg = renderIcon({}, { 'aria-label': 'Notifications', 'aria-hidden': 'true' }).get('svg')
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('role')).toBeUndefined()
  })

  it('renders each shape with its attributes inside the default 24x24 viewBox', () => {
    const svg = renderIcon({ icon: xIcon }).get('svg').element
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24')

    const lines = svg.querySelectorAll('line')
    expect(lines).toHaveLength(2)
    expect(lines[0].getAttribute('x1')).toBe('18')
    expect(lines[0].getAttribute('y1')).toBe('6')
    expect(lines[0].getAttribute('x2')).toBe('6')
    expect(lines[0].getAttribute('y2')).toBe('18')
    // 图形元素必须在 SVG 命名空间里，否则浏览器不画。
    expect(lines[0].namespaceURI).toBe('http://www.w3.org/2000/svg')
  })

  it('reflects variation, size, and color as data attributes with the stable class', async () => {
    const wrapper = renderIcon({ icon: xIcon })
    const svg = wrapper.get('svg')
    expect(svg.classes()).toContain('astryx-svg-icon')
    expect(svg.attributes('data-variation')).toBe('linear')
    expect(svg.attributes('data-size')).toBe('md')
    expect(svg.attributes('data-color')).toBe('primary')

    await wrapper.setProps({ variation: 'twotone', size: 'sm', color: 'accent' })
    expect(svg.attributes('data-variation')).toBe('twotone')
    expect(svg.attributes('data-size')).toBe('sm')
    expect(svg.attributes('data-color')).toBe('accent')
  })

  it('splits fill-role and stroke-role shapes into separate layer groups', () => {
    const svg = renderIcon({ icon: calendarIcon }).get('svg').element
    // 主层填充（外框矩形）、主层描边（两个挂环）、次层描边（分隔线）——
    // 次层没有填充形状，所以不画那一组。
    const groups = shapeGroups(svg)
    expect(groups).toHaveLength(3)
    expect(groups[0].querySelectorAll('rect')).toHaveLength(1)
    expect(groups[0].querySelector('rect')?.getAttribute('width')).toBe('18')
    expect(groups[1].querySelectorAll('line')).toHaveLength(2)
    expect(groups[2].querySelectorAll('line')).toHaveLength(1)
    expect(groups[2].querySelector('line')?.getAttribute('y1')).toBe('10')
  })

  it('knocks secondary shapes out of the primary layer with a mask in bold mode', () => {
    const svg = renderIcon({ icon: homeIcon, variation: 'bold' }).get('svg').element

    const mask = svg.querySelector('defs mask')
    expect(mask).not.toBeNull()

    // 遮罩 = 一整块白色底板 + 黑色的门形状挖洞。
    const plate = mask?.querySelector('rect')
    expect(plate?.getAttribute('width')).toBe('24')
    expect(plate?.getAttribute('height')).toBe('24')
    expect(plate?.getAttribute('fill')).toBe('white')
    const knockout = mask?.querySelector('path')
    expect(knockout?.getAttribute('fill')).toBe('black')
    expect(knockout?.getAttribute('stroke')).toBe('black')
    expect(knockout?.getAttribute('stroke-linecap')).toBe('round')
    // 填充角色的挖洞只需要间隙那道边，描边角色才要把可见描边整个盖住。
    expect(knockout?.getAttribute('stroke-width')).toBe('var(--astryx-icon-gap, 0.75)')

    // 主层填充组引用遮罩；次层整层不画，它只作为挖洞存在。
    const groups = shapeGroups(svg)
    expect(groups).toHaveLength(1)
    expect(groups[0].getAttribute('mask')).toBe(`url(#${mask?.id})`)
  })

  it('keeps the secondary layer visible without a mask outside bold mode', () => {
    const svg = renderIcon({ icon: homeIcon }).get('svg').element

    expect(svg.querySelector('mask')).toBeNull()
    const groups = shapeGroups(svg)
    expect(groups).toHaveLength(2)
    expect(groups[0].hasAttribute('mask')).toBe(false)
    // 门是真实的次层图形。
    expect(groups[1].querySelector('path')?.getAttribute('d')).toBe('M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8')
  })

  it('skips the mask in bold mode when there is nothing to knock out', () => {
    // xIcon 只有描边角色，没有填充形状，也没有次层。
    const svg = renderIcon({ icon: xIcon, variation: 'bold' }).get('svg').element

    expect(svg.querySelector('mask')).toBeNull()
    expect(svg.querySelectorAll('line')).toHaveLength(2)
    expect(shapeGroups(svg)).toHaveLength(1)
  })

  it('pins the stroke-width token inline when strokeWidth is set', () => {
    const svg = renderIcon({ icon: xIcon, strokeWidth: 3 }).get('svg').element as SVGSVGElement
    expect(svg.style.getPropertyValue('--astryx-icon-stroke-width')).toBe('3')

    // 不给覆盖时，描边宽度还是跟着尺寸预设走。
    const plain = renderIcon({ icon: xIcon }).get('svg').element as SVGSVGElement
    expect(plain.style.getPropertyValue('--astryx-icon-stroke-width')).toBe('')
  })

  it('honors a custom viewBox and passes extra svg props through', () => {
    const dotIcon: SVGIconDef = {
      name: 'Dot',
      viewBox: '0 0 32 32',
      primary: [{ type: 'circle', attrs: { cx: '16', cy: '16', r: '8' } }],
    }
    const svg = renderIcon({ icon: dotIcon }, { id: 'probe-icon' }).get('svg').element
    expect(svg.getAttribute('viewBox')).toBe('0 0 32 32')
    expect(svg.getAttribute('id')).toBe('probe-icon')
    // role 默认是 "fill"，圆落在填充组里。
    expect(svg.querySelector('g circle')?.getAttribute('r')).toBe('8')
  })

  it('ships the starter icon set', () => {
    expect(starterIcons).toHaveLength(15)
    expect(starterIcons.map(icon => icon.name)).toContain('Home')
    for (const icon of starterIcons) {
      expect(icon.primary.length).toBeGreaterThan(0)
      expect(renderIcon({ icon }).find('svg').exists()).toBe(true)
    }
  })

  it('renders on the server', async () => {
    const app = createSSRApp({ render: () => h(SVGIcon, { icon: homeIcon, variation: 'bold', size: 'lg', color: 'accent' }) })
    const html = await renderToString(app)
    expect(html).toContain('class="astryx-svg-icon')
    expect(html).toContain('data-variation="bold"')
    expect(html).toContain('<mask id="')
    expect(html).toContain('aria-hidden="true"')
  })
})
