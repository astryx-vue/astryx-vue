import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { assembleCatalog, parseDemoMetaFields } from '../apps/docs/components/demo-infra/demoMeta'
import { syncExports } from '../scripts/sync-exports.mjs'

const repoRoot = process.cwd()

const expectedCatalog = [
  { slug: 'button', group: 'Action', en: 'Button', zh: '按钮' },
  { slug: 'button-group', group: 'Action', en: 'Button Group', zh: '按钮组' },
  { slug: 'context-menu', group: 'Action', en: 'Context Menu', zh: '上下文菜单' },
  { slug: 'dropdown-menu', group: 'Action', en: 'Dropdown Menu', zh: '下拉菜单' },
  { slug: 'icon-button', group: 'Action', en: 'Icon Button', zh: '纯图标按钮' },
  { slug: 'link', group: 'Action', en: 'Link', zh: '链接' },
  { slug: 'more-menu', group: 'Action', en: 'More Menu', zh: '更多菜单' },
  { slug: 'segmented-control', group: 'Action', en: 'Segmented Control', zh: '分段控件' },
  { slug: 'toggle-button', group: 'Action', en: 'Toggle Button', zh: '切换按钮' },
  { slug: 'toolbar', group: 'Action', en: 'Toolbar', zh: '工具栏' },
  { slug: 'toggle-button-group', group: 'Action', en: 'Toggle Button Group', zh: '切换按钮组' },
  { slug: 'chat', group: 'Chat', en: 'Chat', zh: '对话' },
  { slug: 'card', group: 'Container', en: 'Card', zh: '卡片' },
  { slug: 'collapsible', group: 'Container', en: 'Collapsible', zh: '折叠面板' },
  { slug: 'clickable-card', group: 'Container', en: 'Clickable Card', zh: '可点击卡片' },
  { slug: 'selectable-card', group: 'Container', en: 'Selectable Card', zh: '可选卡片' },
  { slug: 'collapsible-group', group: 'Container', en: 'Collapsible Group', zh: '折叠组' },
  { slug: 'carousel', group: 'Container', en: 'Carousel', zh: '轮播' },
  { slug: 'avatar', group: 'Content', en: 'Avatar', zh: '头像' },
  { slug: 'avatar-group', group: 'Content', en: 'Avatar Group', zh: '头像组' },
  { slug: 'blockquote', group: 'Content', en: 'Blockquote', zh: '引用' },
  { slug: 'citation', group: 'Content', en: 'Citation', zh: '引文' },
  { slug: 'code', group: 'Content', en: 'Code', zh: '代码' },
  { slug: 'empty-state', group: 'Content', en: 'Empty State', zh: '空状态' },
  { slug: 'heading', group: 'Content', en: 'Heading', zh: '标题' },
  { slug: 'kbd', group: 'Content', en: 'Kbd', zh: '快捷键' },
  { slug: 'markdown', group: 'Content', en: 'Markdown', zh: 'Markdown' },
  { slug: 'text', group: 'Content', en: 'Text', zh: '文本' },
  { slug: 'thumbnail', group: 'Content', en: 'Thumbnail', zh: '缩略图' },
  { slug: 'timestamp', group: 'Content', en: 'Timestamp', zh: '时间戳' },
  { slug: 'token', group: 'Content', en: 'Token', zh: '标签' },
  { slug: 'code-block', group: 'Content', en: 'Code Block', zh: '代码块' },
  { slug: 'timer', group: 'Content', en: 'Timer', zh: '计时' },
  { slug: 'icon', group: 'Content', en: 'Icon', zh: '图标' },
  { slug: 'badge', group: 'Feedback & Status', en: 'Badge', zh: '徽标' },
  { slug: 'banner', group: 'Feedback & Status', en: 'Banner', zh: '提示条' },
  { slug: 'progress-bar', group: 'Feedback & Status', en: 'Progress Bar', zh: '进度条' },
  { slug: 'skeleton', group: 'Feedback & Status', en: 'Skeleton', zh: '骨架屏' },
  { slug: 'spinner', group: 'Feedback & Status', en: 'Spinner', zh: '加载态' },
  { slug: 'status-dot', group: 'Feedback & Status', en: 'Status Dot', zh: '状态点' },
  { slug: 'calendar', group: 'Form Controls', en: 'Calendar', zh: '日历' },
  { slug: 'checkbox-indicator', group: 'Form Controls', en: 'Checkbox Indicator', zh: '复选指示器' },
  { slug: 'checkbox-input', group: 'Form Controls', en: 'Checkbox Input', zh: '复选框' },
  { slug: 'checkbox-list', group: 'Form Controls', en: 'Checkbox List', zh: '复选列表' },
  { slug: 'date-input', group: 'Form Controls', en: 'Date Input', zh: '日期输入框' },
  { slug: 'date-range-input', group: 'Form Controls', en: 'Date Range Input', zh: '日期区间输入框' },
  { slug: 'date-time-input', group: 'Form Controls', en: 'Date Time Input', zh: '日期时间输入框' },
  { slug: 'field', group: 'Form Controls', en: 'Field', zh: '表单字段' },
  { slug: 'field-status', group: 'Form Controls', en: 'Field Status', zh: '字段状态' },
  { slug: 'file-input', group: 'Form Controls', en: 'File Input', zh: '文件输入框' },
  { slug: 'input-group', group: 'Form Controls', en: 'Input Group', zh: '输入框组' },
  { slug: 'multi-selector', group: 'Form Controls', en: 'Multi Selector', zh: '多选器' },
  { slug: 'number-input', group: 'Form Controls', en: 'Number Input', zh: '数字输入框' },
  { slug: 'radio', group: 'Form Controls', en: 'Radio', zh: '单选按钮' },
  { slug: 'radio-group', group: 'Form Controls', en: 'Radio Group', zh: '单选组' },
  { slug: 'radio-list', group: 'Form Controls', en: 'Radio List', zh: '单选列表' },
  { slug: 'selector', group: 'Form Controls', en: 'Selector', zh: '选择器' },
  { slug: 'slider', group: 'Form Controls', en: 'Slider', zh: '滑块' },
  { slug: 'switch', group: 'Form Controls', en: 'Switch', zh: '开关' },
  { slug: 'text-area', group: 'Form Controls', en: 'Text Area', zh: '文本域' },
  { slug: 'text-input', group: 'Form Controls', en: 'Text Input', zh: '文本输入框' },
  { slug: 'time-input', group: 'Form Controls', en: 'Time Input', zh: '时间输入框' },
  { slug: 'tokenizer', group: 'Form Controls', en: 'Tokenizer', zh: '标签输入框' },
  { slug: 'typeahead', group: 'Form Controls', en: 'Typeahead', zh: '自动补全' },
  { slug: 'complex-selector', group: 'Form Controls', en: 'Complex Selector', zh: '复合选择器' },
  { slug: 'power-search', group: 'Form Controls', en: 'Power Search', zh: '结构化搜索' },
  { slug: 'center', group: 'Layout', en: 'Center', zh: '居中容器' },
  { slug: 'divider', group: 'Layout', en: 'Divider', zh: '分隔线' },
  { slug: 'grid', group: 'Layout', en: 'Grid', zh: '网格布局' },
  { slug: 'stack', group: 'Layout', en: 'Stack', zh: '堆叠布局' },
  { slug: 'app-shell', group: 'Layout', en: 'App Shell', zh: '应用外壳' },
  { slug: 'aspect-ratio', group: 'Layout', en: 'Aspect Ratio', zh: '宽高比' },
  { slug: 'form-layout', group: 'Layout', en: 'Form Layout', zh: '表单布局' },
  { slug: 'layout', group: 'Layout', en: 'Layout', zh: '布局' },
  { slug: 'resize-handle', group: 'Layout', en: 'Resize Handle', zh: '拖拽分隔条' },
  { slug: 'scrollable-area', group: 'Layout', en: 'Scrollable Area', zh: '可滚动区域' },
  { slug: 'section', group: 'Layout', en: 'Section', zh: '区块' },
  { slug: 'breadcrumbs', group: 'Navigation', en: 'Breadcrumbs', zh: '面包屑' },
  { slug: 'mobile-nav', group: 'Navigation', en: 'Mobile Nav', zh: '移动端导航' },
  { slug: 'nav-item', group: 'Navigation', en: 'Nav Item', zh: '导航项' },
  { slug: 'nav-menu', group: 'Navigation', en: 'Nav Menu', zh: '导航菜单' },
  { slug: 'pagination', group: 'Navigation', en: 'Pagination', zh: '分页' },
  { slug: 'side-nav', group: 'Navigation', en: 'Side Nav', zh: '侧边导航' },
  { slug: 'tab-list', group: 'Navigation', en: 'Tab List', zh: '标签列表' },
  { slug: 'top-nav', group: 'Navigation', en: 'Top Nav', zh: '顶部导航' },
  { slug: 'stepper', group: 'Navigation', en: 'Stepper', zh: '步骤条' },
  { slug: 'tab-menu', group: 'Navigation', en: 'Tab Menu', zh: '标签菜单' },
  { slug: 'outline', group: 'Navigation', en: 'Outline', zh: '大纲' },
  { slug: 'alert-dialog', group: 'Overlay', en: 'Alert Dialog', zh: '警告对话框' },
  { slug: 'bottom-sheet', group: 'Overlay', en: 'Bottom Sheet', zh: '底部弹窗' },
  { slug: 'dialog', group: 'Overlay', en: 'Dialog', zh: '对话框' },
  { slug: 'hover-card', group: 'Overlay', en: 'Hover Card', zh: '悬浮卡片' },
  { slug: 'overlay', group: 'Overlay', en: 'Overlay', zh: '覆盖层' },
  { slug: 'popover', group: 'Overlay', en: 'Popover', zh: '弹出层' },
  { slug: 'toast', group: 'Overlay', en: 'Toast', zh: '轻提示' },
  { slug: 'tooltip', group: 'Overlay', en: 'Tooltip', zh: '提示框' },
  { slug: 'command-palette', group: 'Overlay', en: 'Command Palette', zh: '命令面板' },
  { slug: 'lightbox', group: 'Overlay', en: 'Lightbox', zh: '灯箱' },
  { slug: 'list', group: 'Table & List', en: 'List', zh: '列表' },
  { slug: 'metadata-list', group: 'Table & List', en: 'Metadata List', zh: '元数据列表' },
  { slug: 'overflow-list', group: 'Table & List', en: 'Overflow List', zh: '溢出列表' },
  { slug: 'table', group: 'Table & List', en: 'Table', zh: '表格' },
  { slug: 'tree-list', group: 'Table & List', en: 'Tree List', zh: '树形列表' },
  { slug: 'visually-hidden', group: 'Utility', en: 'Visually Hidden', zh: '视觉隐藏' },
  { slug: 'media-theme', group: 'Utility', en: 'Media Theme', zh: '媒体主题' },
  { slug: 'syntax-theme', group: 'Utility', en: 'Syntax Theme', zh: '语法主题' },
  { slug: 'theme', group: 'Utility', en: 'Theme', zh: '主题' },
]

describe('component catalog meta', () => {
  it('keeps the sidebar order and names, and reads them through glob', async () => {
    const demosDir = join(repoRoot, 'apps/docs/components/demos')
    const entries = await readdir(demosDir, { withFileTypes: true })
    const metas = []
    for (const entry of entries) {
      if (!entry.isDirectory())
        continue
      const source = await readFile(join(demosDir, entry.name, 'meta.ts'), 'utf8')
      metas.push(parseDemoMetaFields(source))
    }

    expect(assembleCatalog(metas)).toEqual(expectedCatalog)

    const catalogSource = await readFile(join(repoRoot, 'apps/docs/components/demo-infra/componentCatalog.ts'), 'utf8')
    const registrySource = await readFile(join(repoRoot, 'apps/docs/components/demos/registry.ts'), 'utf8')
    expect(catalogSource).toContain('import.meta.glob')
    expect(registrySource).toContain('import.meta.glob')
  })
})

describe('sync exports', () => {
  it('picks up a new component and leaves the historical omissions out', async () => {
    const rootDir = await mkdtemp(join(tmpdir(), 'astryx-sync-'))
    try {
      await mkdir(join(rootDir, 'packages/core/src/ZzProbe'), { recursive: true })
      await mkdir(join(rootDir, 'packages/core/src/composables'), { recursive: true })
      await mkdir(join(rootDir, 'packages/core/src/locale/messages'), { recursive: true })
      await mkdir(join(rootDir, 'packages/core/styles'), { recursive: true })
      await mkdir(join(rootDir, 'packages/themes/neutral'), { recursive: true })
      await mkdir(join(rootDir, 'packages/themes/butter'), { recursive: true })

      await writeFile(join(rootDir, 'packages/core/package.json'), `${JSON.stringify({
        name: '@astryx-vue/core',
        type: 'module',
        exports: {
          '.': {
            source: './src/index.ts',
            types: './dist/index.d.ts',
            import: './dist/index.js',
          },
          './FileInput': {
            source: './src/FileInput/index.ts',
            types: './dist/FileInput/index.d.ts',
            import: './dist/FileInput/index.js',
          },
          './package.json': './package.json',
        },
      }, null, 2)}\n`)
      await writeFile(join(rootDir, 'packages/core/src/ZzProbe/index.ts'), `export const ZzProbe = 'zz-probe'
export interface ZzProbeProps { label: string }
`)
      await writeFile(join(rootDir, 'packages/core/src/composables/useZzProbe.ts'), `export function useZzProbe(): string { return 'zz-probe' }
export interface UseZzProbeOptions { id: string }
`)
      await writeFile(join(rootDir, 'packages/core/src/composables/useCalendar.ts'), `export function useCalendar(): string { return 'calendar' }
`)
      await writeFile(join(rootDir, 'packages/core/styles/zz-probe.css'), '.zz-probe {}\n')
      await writeFile(join(rootDir, 'packages/core/styles/calendar.css'), '.calendar {}\n')
      await writeFile(join(rootDir, 'packages/themes/neutral/zz-probe.css'), '.zz-probe {}\n')
      await writeFile(join(rootDir, 'packages/themes/butter/zz-probe.css'), '.zz-probe {}\n')
      await writeFile(join(rootDir, 'packages/core/src/locale/messages/zz-probe.ts'), `export interface ZzProbeMessages { label: string }
export const zzProbeMessages = { en: { label: 'Probe' }, 'zh-CN': { label: '探针' } }
`)

      const result = await syncExports({ rootDir, eslint: false })
      expect(result.ok).toBe(true)

      const index = await readFile(join(rootDir, 'packages/core/src/index.ts'), 'utf8')
      const composables = await readFile(join(rootDir, 'packages/core/src/composables/index.ts'), 'utf8')
      const styles = await readFile(join(rootDir, 'packages/core/styles.css'), 'utf8')
      const neutral = await readFile(join(rootDir, 'packages/themes/neutral.css'), 'utf8')
      const messages = await readFile(join(rootDir, 'packages/core/src/locale/messages.ts'), 'utf8')
      const packageJson = JSON.parse(await readFile(join(rootDir, 'packages/core/package.json'), 'utf8'))

      expect(index).toContain('ZzProbe')
      expect(index).toContain('ZzProbeProps')
      expect(composables).toContain('useZzProbe')
      expect(composables).toContain('UseZzProbeOptions')
      expect(composables).not.toContain('useCalendar')
      expect(styles).toContain('./styles/zz-probe.css')
      expect(styles).not.toContain('calendar.css')
      const butter = await readFile(join(rootDir, 'packages/themes/butter.css'), 'utf8')
      expect(neutral).toContain('./neutral/zz-probe.css')
      expect(neutral).toContain('@import \'./fonts.css\';')
      expect(neutral).not.toContain('@fontsource/jetbrains-mono')
      expect(butter).toContain('./butter/zz-probe.css')
      expect(butter).toContain('@import \'./fonts.css\';')
      expect(butter).not.toContain('@fontsource/jetbrains-mono')
      expect(messages).toContain('zzProbeMessages')
      expect(packageJson.exports['./ZzProbe']).toEqual({
        source: './src/ZzProbe/index.ts',
        types: './dist/ZzProbe/index.d.ts',
        import: './dist/ZzProbe/index.js',
      })
      expect(packageJson.publishConfig.exports['./ZzProbe']).toEqual({
        types: './dist/ZzProbe/index.d.ts',
        import: './dist/ZzProbe/index.js',
      })
      expect(packageJson.publishConfig.exports['.']).not.toHaveProperty('source')
      expect(JSON.stringify(packageJson.publishConfig.exports)).not.toContain('"source"')
      expect(packageJson.exports['./FileInput']).toBeUndefined()
      expect(packageJson.publishConfig.exports['./FileInput']).toBeUndefined()

      const probeMeta = parseDemoMetaFields(`export const meta = {
  slug: 'zz-probe',
  group: 'Utility',
  order: 1000,
  en: 'ZZ Probe',
  zh: '探针',
  demo,
}
`)
      const catalog = assembleCatalog([...expectedCatalog.map((entry, order) => ({ ...entry, order })), probeMeta])
      expect(catalog.at(-1)).toEqual({ slug: 'zz-probe', group: 'Utility', en: 'ZZ Probe', zh: '探针' })
      expect(catalog.slice(0, -1).map(entry => entry.slug)).toEqual(expectedCatalog.map(entry => entry.slug))
    }
    finally {
      await rm(rootDir, { recursive: true, force: true })
    }
  })
})
