import type { DemoMeta } from '../../demo-infra/demoMeta'
import { fileInputOverview as demo } from './index'

export const meta = {
  slug: 'file-input',
  group: 'Form Controls',
  order: 9,
  en: 'File Input',
  zh: '文件输入框',
  demo,
} satisfies DemoMeta
