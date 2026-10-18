import type { DemoMeta } from '../../demo-infra/demoMeta'
import { commandPaletteInputOverview as demo } from './index'

export const meta = {
  slug: 'command-palette-input',
  group: 'Overlay',
  order: 15,
  en: 'Command Palette Input',
  zh: '命令面板输入框',
  demo,
} satisfies DemoMeta
