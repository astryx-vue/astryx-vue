import type { AstryxLocale } from '../types.js'

export interface SliderMessages {
  /** 范围滑块（两个滑块）较小那一端的名字，和滑块自己的标签一起读出。 */
  minimumThumb: string
  /** 范围滑块较大那一端的名字。 */
  maximumThumb: string
  /** 必填滑块加在描述里的读屏文字。 */
  required: string
}

export const sliderMessages: Record<AstryxLocale, SliderMessages> = {
  'en': {
    minimumThumb: 'Minimum value',
    maximumThumb: 'Maximum value',
    required: 'Required',
  },
  'zh-CN': {
    minimumThumb: '最小值',
    maximumThumb: '最大值',
    required: '必填',
  },
}
