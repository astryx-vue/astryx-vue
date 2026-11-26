// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const STYLES = resolve(dirname(fileURLToPath(import.meta.url)), '../../styles')
const read = (name: string) => readFileSync(resolve(STYLES, name), 'utf8')

/** 选择器（原样出现、紧挨着 `{`）所有规则的声明块拼在一起。 */
function rule(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return [...css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 'g'))].map(match => match[1]).join('\n')
}

describe('top-nav 抽屉分组', () => {
  const css = read('top-nav.css')

  it('只在收起动画期间裁剪，展开完成后放开，焦点环不被切', () => {
    const open = rule(css, '.astryx-top-nav-drawer-section')
    expect(open).toContain('overflow: visible')
    expect(open).toContain('overflow 0s var(--astryx-duration-medium-max) allow-discrete')
    const collapsed = rule(css, '.astryx-top-nav-drawer-section--collapsed')
    expect(collapsed).toContain('grid-template-rows: 0fr')
    expect(collapsed).toContain('overflow: hidden')
    expect(rule(css, '.astryx-top-nav-drawer-section__inner')).not.toContain('overflow')
  })
})

describe('top-nav 整条栏的布局', () => {
  const css = read('top-nav.css')

  it('栏会换行，区域放不进一行时结束区移到下一行', () => {
    expect(rule(css, '.astryx-top-nav')).toContain('flex-wrap: wrap')
    expect(css).not.toMatch(/\.astryx-top-nav--centered\s*\{[^}]*display: grid/)
    const start = rule(css, '.astryx-top-nav__start')
    expect(start).toContain('flex: 1 1 0%')
    expect(start).toContain('min-width: fit-content')
  })

  it('居中区先按内容最小宽度占位，再优先长到内容宽度', () => {
    const center = rule(css, '.astryx-top-nav__center')
    expect(center).toContain('flex: 1000 1 min-content')
    expect(center).toContain('max-width: max-content')
    expect(rule(css, '.astryx-top-nav--centered > .astryx-top-nav__end')).toContain('flex: 1 1 0%')
  })

  it('标题可以收缩，手机条里结束区不比整条栏宽', () => {
    expect(rule(css, '.astryx-top-nav__heading')).toContain('flex-shrink: 1')
    const end = rule(css, '.astryx-top-nav__end')
    expect(end).toContain('flex-shrink: 0')
    expect(end).toContain('max-width: 100%')
    expect(rule(css, '.astryx-top-nav--compact')).toContain('flex-wrap: nowrap')
    expect(rule(css, '.astryx-top-nav__heading-text')).toContain('text-overflow: ellipsis')
  })

  it('标题是标志列加文字列，文字列先收缩', () => {
    const heading = rule(css, '.astryx-top-nav-heading')
    expect(heading).toContain('display: inline-grid')
    expect(heading).toContain('grid-template-columns: minmax(0, 1fr)')
    expect(css).toContain('grid-template-columns: auto minmax(0, 1fr)')
    expect(css).toContain('grid-template-columns: minmax(min-content, 1fr)')
  })

  it('减少动态效果时精选面板在触屏上淡入，鼠标上立刻出现', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) and \(pointer: coarse\)\s*\{\s*\.astryx-nav-disclosure__panel\.astryx-top-nav-mega__panel\s*\{\s*animation: astryx-top-nav-mega-fade-in/)
  })

  it('箭头在从右到左的文字里镜像', () => {
    expect(rule(css, '[dir=\'rtl\'] .astryx-top-nav-mega-card__link-arrow')).toContain('scaleX(-1)')
  })

  it('精选面板不超出视口底部', () => {
    expect(rule(css, '.astryx-top-nav-mega__panel')).toContain('max-height: calc(100dvh - var(--astryx-nav-panel-top')
  })
})

describe('导航部件的尺寸和文字选择', () => {
  it('导航行、标签和分页单元格用最小高度，随更大的文字尺寸长高', () => {
    const navItem = read('nav-item.css')
    for (const size of ['sm', 'md', 'lg'])
      expect(rule(navItem, `.astryx-nav-item--${size}`)).toContain('min-height')
    // 只有图标的行仍是固定方块。
    expect(rule(navItem, '.astryx-nav-item--icon-only')).toContain('height: var(--astryx-size-element-md')

    const tab = read('tab-list.css')
    for (const size of ['sm', 'md', 'lg'])
      expect(rule(tab, `.astryx-tab--size-${size}`)).toContain('min-height')

    const pagination = read('pagination.css')
    expect(rule(pagination, '.astryx-pagination-button,\n  .astryx-pagination-page')).toContain('min-height: var(--astryx-size-element-md)')
  })

  it('换行的标签和选中字重的副本在同一格里居中', () => {
    const tab = read('tab-list.css')
    expect(rule(tab, '.astryx-tab__label')).toContain('text-align: center')
    expect(rule(tab, '.astryx-tab__label-text,\n  .astryx-tab__label-sizer')).toContain('align-self: center')
  })

  it('按住滑过菜单各行时不选中行里的文字', () => {
    expect(rule(read('nav-menu.css'), '.astryx-nav-menu-item')).toContain('user-select: none')
    expect(rule(read('tab-menu.css'), '.astryx-tab-menu-dropdown')).toContain('user-select: none')
  })

  it('选中下划线是元素，不再靠伪元素', () => {
    const tab = read('tab-list.css')
    expect(tab).not.toContain('::after')
    expect(rule(tab, '.astryx-tab__indicator')).toContain('inset-inline: var(--astryx-spacing-3')
  })
})

describe('外壳读到窗口之前', () => {
  it('标准断点下手机宽度先把顶栏的起始和中间内容藏起来', () => {
    const css = read('app-shell.css')
    for (const [name, px] of [['sm', 640], ['md', 768], ['lg', 1024], ['xl', 1280], ['2xl', 1536]] as const) {
      expect(css).toContain(`@media (width < ${px}px)`)
      expect(css).toContain(`.astryx-app-shell[data-mobile-unread='${name}'] .astryx-top-nav__items`)
    }
  })
})
