import type { DemoMeta } from '../../demo-infra/demoMeta'
import { commandPaletteGroupOverview as demo } from './index'

export const meta = {
  slug: 'command-palette-group',
  group: 'Overlay',
  order: 14,
  en: 'Command Palette Group',
  zh: '命令面板分组',
  demo,
} satisfies DemoMeta
