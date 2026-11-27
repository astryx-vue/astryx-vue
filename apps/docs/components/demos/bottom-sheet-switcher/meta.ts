import type { DemoMeta } from '../../demo-infra/demoMeta'
import { bottomSheetSwitcherOverview as demo } from './index'

export const meta = {
  slug: 'bottom-sheet-switcher',
  group: 'Overlay',
  family: 'Bottom Sheet',
  order: 2,
  en: 'Bottom Sheet Switcher',
  zh: '底部弹窗切换器',
  demo,
  deprecated: {
    replacement: 'bottom-sheet',
    description: {
      en: 'Write each step as its own BottomSheet with isOpen, controlled by one state value that names the open step; moving on from inside the open step replaces it in place (see BottomSheet, Replacing a sheet). BottomSheetSwitcher keeps working until a future minor release removes it.',
      zh: '把每一步写成一张独立的 BottomSheet，用 isOpen 控制，由一个说明哪一步开着的状态值统一管理；在开着的那步里点「下一步」时，新的一步会原地替换它（见 BottomSheet 的「替换」一节）。BottomSheetSwitcher 照常能用，到以后某个小版本才会移除。',
    },
  },
} satisfies DemoMeta
