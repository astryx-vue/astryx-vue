import { describe, expect, it } from 'vitest'
import {
  classifyFile,
  componentsFromFiles,
  componentsFromNames,
  MAX_COMPONENTS,
  repoFs,
  REPRESENTATIVE_COMPONENTS,
} from '../scripts/swarm/changed-components.mjs'

/** 假的仓库：只认这些有文档页的组件，目录里的 .vue 也写死。 */
const PAGES = new Set([
  'Button',
  'Badge',
  'Card',
  'DropdownMenu',
  'DropdownMenuItem',
  'DropdownMenuSubMenu',
  'CheckIndicator',
  'RadioIndicator',
  'TextInput',
  'Selector',
  'Dialog',
  'Table',
  'HStack',
  'Avatar',
  'Banner',
  'Divider',
  'Heading',
  'Kbd',
  'Link',
  'Spinner',
  'Switch',
  'Text',
])
const VUE_FILES: Record<string, string[]> = {
  'packages/core/src/Indicator': ['CheckIndicator', 'RadioIndicator'],
  'packages/core/src/Button': ['Button', 'ButtonSpinner', 'ButtonTooltip'],
}
const fakeFs = {
  hasPage: (name: string) => PAGES.has(name),
  vueFilesIn: (dir: string) => VUE_FILES[dir] ?? [],
}

function run(files: string[], limit?: number) {
  return componentsFromFiles(files, { fs: fakeFs, limit })
}

describe('单个文件怎么映射', () => {
  it.each([
    ['packages/core/src/Button/Button.vue', ['Button']],
    ['packages/core/src/Button/useButtonAction.ts', ['Button']],
    ['packages/core/src/Button/ButtonSpinner.vue', ['Button']],
    ['packages/core/src/DropdownMenu/DropdownMenuItem.vue', ['DropdownMenu', 'DropdownMenuItem']],
    ['packages/core/src/DropdownMenu/DropdownMenuSubMenu.vue', ['DropdownMenu', 'DropdownMenuSubMenu']],
    ['packages/core/src/Indicator/index.ts', ['CheckIndicator', 'RadioIndicator']],
    ['packages/core/styles/badge.css', ['Badge']],
    ['packages/core/styles/dropdown-menu.css', ['DropdownMenu']],
    ['packages/themes/neutral/button.css', ['Button']],
    ['packages/core/styles/h-stack.css', ['HStack']],
    ['apps/docs/components/demos/card/overview.vue', ['Card']],
    ['apps/docs/components/demos/dropdown-menu-submenu/meta.ts', ['DropdownMenuSubMenu']],
    ['./packages/core/src/Badge/Badge.vue', ['Badge']],
  ])('%s → %j', (file, names) => {
    expect(classifyFile(file, fakeFs)).toEqual({ kind: 'components', names })
  })

  it.each([
    'packages/themes/neutral.css',
    'packages/themes/fonts.css',
    'packages/core/reset.css',
    'packages/core/styles.css',
    'packages/core/src/composables/useClipboard.ts',
    'packages/core/src/composables/internal/pressFeedback.ts',
    'packages/core/src/Theme/Theme.vue',
    'packages/core/src/layer/position.ts',
    'packages/core/styles/pressable.css',
    'packages/core/styles/bordered-control.css',
    'packages/themes/neutral/input.css',
  ])('%s 是公共文件', (file) => {
    expect(classifyFile(file, fakeFs)).toEqual({ kind: 'broad' })
  })

  it.each([
    'packages/core/src/Button/Button.test.ts',
    'packages/core/src/ssr-smoke.fixtures.ts',
    'packages/core/src/index.ts',
    'packages/core/src/NoPage/NoPage.vue',
    'packages/core/package.json',
    'packages/core/CHANGELOG.md',
    'packages/themes/butter/button.css',
    'packages/themes/package.json',
    'apps/docs/components/demos/registry.ts',
    'apps/docs/components/demos/not-a-component/overview.vue',
    'apps/docs/docs/en/components/button/index.md',
    'README.md',
    'scripts/swarm/visual-compare.mjs',
  ])('%s 不触发', (file) => {
    expect(classifyFile(file, fakeFs)).toEqual({ kind: 'none' })
  })
})

describe('一组改动 → 要跑的组件', () => {
  it('按出现顺序去重，并记下每个组件是哪些文件触发的', () => {
    const plan = run([
      'packages/core/src/Button/Button.vue',
      'packages/core/src/Badge/Badge.vue',
      'packages/core/styles/button.css',
    ])
    expect(plan.components).toEqual(['Button', 'Badge'])
    expect(plan.skipped).toEqual([])
    expect(plan.broadFiles).toEqual([])
    expect(plan.reasons.Button).toEqual(['packages/core/src/Button/Button.vue', 'packages/core/styles/button.css'])
  })

  it('公共文件触发代表组件', () => {
    const plan = run(['packages/themes/neutral.css'])
    expect(plan.components).toEqual([...REPRESENTATIVE_COMPONENTS])
    expect(plan.broadFiles).toEqual(['packages/themes/neutral.css'])
  })

  it('直接改到的组件排在代表组件前面，重复的只算一次', () => {
    const plan = run(['packages/core/src/composables/useLocale.ts', 'packages/core/src/Badge/Badge.vue', 'packages/core/src/Button/Button.vue'])
    expect(plan.components).toEqual(['Badge', 'Button', 'TextInput', 'Selector', 'Dialog', 'DropdownMenu', 'Table'])
  })

  it('超过上限时截断，多出来的进 skipped，不悄悄丢掉', () => {
    const files = ['Avatar', 'Badge', 'Banner', 'Button', 'Card', 'Divider', 'Heading', 'Kbd', 'Link', 'Spinner']
      .map(n => `packages/core/src/${n}/${n}.vue`)
    const plan = run(files)
    expect(MAX_COMPONENTS).toBe(8)
    expect(plan.components).toEqual(['Avatar', 'Badge', 'Banner', 'Button', 'Card', 'Divider', 'Heading', 'Kbd'])
    expect(plan.skipped).toEqual(['Link', 'Spinner'])
  })

  it('代表组件被截断时也进 skipped', () => {
    const files = ['Avatar', 'Badge', 'Banner', 'Card', 'Divider', 'Heading'].map(n => `packages/core/src/${n}/${n}.vue`)
    const plan = run([...files, 'packages/core/reset.css'])
    expect(plan.components).toHaveLength(8)
    expect(plan.components.slice(6)).toEqual(['Button', 'TextInput'])
    expect(plan.skipped).toEqual(['Selector', 'Dialog', 'DropdownMenu', 'Table'])
  })

  it('只改了无关文件时一个都不跑', () => {
    const plan = run(['README.md', 'packages/core/src/Button/Button.test.ts', 'apps/docs/components/demos/registry.ts'])
    expect(plan).toMatchObject({ components: [], skipped: [], broadFiles: [] })
  })
})

describe('手动指定组件', () => {
  it('接受上游名和 slug，统一成上游名并去重', () => {
    const plan = componentsFromNames('Button, dropdown-menu  DropdownMenu,use-clipboard')
    expect(plan).toMatchObject({ source: 'manual', components: ['Button', 'DropdownMenu', 'useClipboard'], skipped: [] })
  })

  it('也遵守上限', () => {
    const plan = componentsFromNames('A,B,C,D,E,F,G,H,I', { limit: 8 })
    expect(plan.components).toHaveLength(8)
    expect(plan.skipped).toEqual(['I'])
  })

  it('空输入不跑', () => {
    expect(componentsFromNames('').components).toEqual([])
  })
})

describe('真实仓库', () => {
  it('代表组件都有文档页', () => {
    const fs = repoFs()
    for (const name of REPRESENTATIVE_COMPONENTS)
      expect(fs.hasPage(name), name).toBe(true)
  })

  it('演练用的改动映射到 Button 和 Badge', () => {
    const plan = componentsFromFiles(['packages/core/src/Button/Button.vue', 'packages/core/src/Badge/Badge.vue'])
    expect(plan.components).toEqual(['Button', 'Badge'])
  })

  it('下拉菜单目录里的子组件也能找到页面', () => {
    const plan = componentsFromFiles(['packages/core/src/DropdownMenu/DropdownMenuItem.vue'])
    expect(plan.components).toEqual(['DropdownMenu', 'DropdownMenuItem'])
  })
})
