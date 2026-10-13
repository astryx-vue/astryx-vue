import type { AstryxLocale } from '../types.js'

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
    slide: (current, total) => `Slide ${current} of ${total}`,
  },
  'zh-CN': {
    label: '轮播',
    scrollLeft: '向左滚动',
    scrollRight: '向右滚动',
    slide: (current, total) => `第 ${current} 张幻灯片，共 ${total} 张`,
  },
}
