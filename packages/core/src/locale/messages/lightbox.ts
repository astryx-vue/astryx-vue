import type { AstryxLocale } from '../types.js'
import { formatCount } from './shared.js'

export interface LightboxMessages {
  close: string
  previous: string
  next: string
  mediaViewer: string
  zoom: string
  zoomedIn: string
  zoomedOut: string
  imagePosition: (index: number, total: number) => string
  mediaPosition: (alt: string, index: number, total: number) => string
}

export const lightboxMessages: Record<AstryxLocale, LightboxMessages> = {
  'en': {
    close: 'Close',
    previous: 'Previous',
    next: 'Next',
    mediaViewer: 'Media viewer',
    zoom: 'Zoom',
    zoomedIn: 'Zoomed in, use arrow keys to pan',
    zoomedOut: 'Zoomed out',
    imagePosition: (index, total) => `Image ${formatCount(index, 'en')} of ${formatCount(total, 'en')}`,
    mediaPosition: (alt, index, total) => `${alt}, ${formatCount(index, 'en')} of ${formatCount(total, 'en')}`,
  },
  'zh-CN': {
    close: '关闭',
    previous: '上一个',
    next: '下一个',
    mediaViewer: '媒体查看器',
    zoom: '缩放',
    zoomedIn: '已放大，使用箭头键平移',
    zoomedOut: '已缩小',
    imagePosition: (index, total) => `第 ${formatCount(index, 'zh-CN')} 张图片，共 ${formatCount(total, 'zh-CN')} 张`,
    mediaPosition: (alt, index, total) => `${alt}，第 ${formatCount(index, 'zh-CN')} 项，共 ${formatCount(total, 'zh-CN')} 项`,
  },
}
