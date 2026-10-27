import type { TemplateMeta } from './types.ts'

/** Hero and gallery pages. */
export const GALLERY_TEMPLATES: Record<string, TemplateMeta> = {
  'centered-hero': {
    description: {
      en: 'A centered hero with a heading, two buttons, and one wide image below.',
      zh: '居中主视觉：标题、两个按钮，下面一张大图。',
    },
    keywords: {
      en: ['hero', 'landing', 'marketing', 'header', 'centered', 'call to action', 'cta', 'home'],
      zh: ['主视觉', '落地页', '营销', '头图', '居中', '行动号召', '首页'],
    },
  },
  'classic-gallery': {
    description: {
      en: 'A classic photo gallery with category tabs, a hero link, and an image grid.',
      zh: '经典相册：分类标签页、主图入口和图片网格。',
    },
    keywords: {
      en: ['gallery', 'photos', 'grid', 'images', 'tabs', 'portfolio', 'album'],
      zh: ['画廊', '相册', '网格', '图片', '标签页', '作品集'],
    },
  },
  'gallery-hero': {
    description: {
      en: 'A hero section that leads straight into a grid of photos.',
      zh: '主视觉区下面直接接图片网格。',
    },
    keywords: {
      en: ['gallery', 'hero', 'photos', 'images', 'grid', 'portfolio'],
      zh: ['画廊', '主视觉', '图片', '网格', '作品集'],
    },
  },
  'mixed-gallery': {
    description: {
      en: 'A mixed gallery that alternates wide images and small cards.',
      zh: '混排画廊：大图和卡片交替排列。',
    },
    keywords: {
      en: ['gallery', 'mixed', 'masonry', 'images', 'cards', 'portfolio', 'editorial'],
      zh: ['画廊', '混合', '瀑布流', '图片', '卡片', '作品集'],
    },
  },
  'product-gallery': {
    description: {
      en: 'A product gallery that leads with one large image and lists the rest in a grid.',
      zh: '商品画廊：最上面一张大图，其余在网格里。',
    },
    keywords: {
      en: ['gallery', 'product', 'images', 'thumbnails', 'shop', 'ecommerce', 'photos'],
      zh: ['画廊', '商品', '图片', '缩略图', '购物', '电商'],
    },
  },
  'side-gallery': {
    description: {
      en: 'A gallery with a side column of captions next to a photo grid.',
      zh: '侧边一列文字说明，旁边是图片网格。',
    },
    keywords: {
      en: ['gallery', 'side', 'images', 'editorial', 'grid', 'story', 'captions'],
      zh: ['画廊', '侧边', '图片', '图文', '网格', '故事'],
    },
  },
}
