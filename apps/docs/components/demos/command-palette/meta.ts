import type { DemoMeta } from '../../demo-infra/demoMeta'
import { commandPaletteOverview as demo } from './index'

export const meta = {
  slug: 'command-palette',
  group: 'Overlay',
  family: 'Command Palette',
  order: 10,
  en: 'Command Palette',
  zh: '命令面板',
  demo,
} satisfies DemoMeta
