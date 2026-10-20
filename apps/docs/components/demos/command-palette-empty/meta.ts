import type { DemoMeta } from '../../demo-infra/demoMeta'
import { commandPaletteEmptyOverview as demo } from './index'

export const meta = {
  slug: 'command-palette-empty',
  group: 'Overlay',
  family: 'Command Palette',
  order: 13,
  en: 'Command Palette Empty',
  zh: '命令面板空状态',
  demo,
} satisfies DemoMeta
