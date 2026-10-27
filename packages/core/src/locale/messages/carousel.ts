import type { AstryxLocale } from '../types.js'
import { formatCount } from './shared.js'

export interface CarouselMessages {
  label: string
  scrollLeft: string
  scrollRight: string
  slide: (current: number, total: number) => string
}

export const carouselMessages: Record<AstryxLocale, CarouselMessages> = {
  'en': {
    label: 'Carousel',
    scrollLeft: 'Scroll left',
    scrollRight: 'Scroll right',
    slide: (current, total) => `Slide ${formatCount(current, 'en')} of ${formatCount(total, 'en')}`,
  },
  'zh-CN': {
    label: '轮播',
    scrollLeft: '向左滚动',
    scrollRight: '向右滚动',
    slide: (current, total) => `第 ${formatCount(current, 'zh-CN')} 张，共 ${formatCount(total, 'zh-CN')} 张`,
  },
}
