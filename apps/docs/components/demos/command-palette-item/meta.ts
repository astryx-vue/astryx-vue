import type { DemoMeta } from '../../demo-infra/demoMeta'
import { commandPaletteItemOverview as demo } from './index'

export const meta = {
  slug: 'command-palette-item',
  group: 'Overlay',
  family: 'Command Palette',
  order: 11,
  en: 'Command Palette Item',
  zh: '命令面板项',
  demo,
} satisfies DemoMeta
