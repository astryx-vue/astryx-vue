import type { DemoMeta } from '../../demo-infra/demoMeta'
import { commandPaletteListOverview as demo } from './index'

export const meta = {
  slug: 'command-palette-list',
  group: 'Overlay',
  family: 'Command Palette',
  order: 12,
  en: 'Command Palette List',
  zh: '命令面板列表',
  demo,
} satisfies DemoMeta
