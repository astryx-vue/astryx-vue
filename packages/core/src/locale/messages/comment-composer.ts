import type { AstryxLocale } from '../types.js'

/** 评论输入框。组件还没落地，键先接到文案树上。字段名对应 `@astryx.commentComposer.*` 的最后一段。 */
export interface CommentComposerMessages {
  addEmoji: string
  agents: string
  attachImages: string
  cancel: string
  chooseImages: string
  imageAlt: string
  imagesOnly: string
  noAgents: string
  placeholder: string
  removeQuote: string
  uploadFailed: string
}

export const commentComposerMessages: Record<AstryxLocale, CommentComposerMessages> = {
  'en': {
    addEmoji: 'Add emoji',
    agents: 'Agents',
    attachImages: 'Attach images',
    cancel: 'Cancel',
    chooseImages: 'Choose images',
    imageAlt: 'Image attachment',
    imagesOnly: 'Only image files can be added',
    noAgents: 'No agents',
    placeholder: 'Write a comment…',
    removeQuote: 'Remove quoted text',
    uploadFailed: 'Images couldn\'t be added',
  },
  'zh-CN': {
    addEmoji: '添加表情',
    agents: '智能体',
    attachImages: '添加图片',
    cancel: '取消',
    chooseImages: '选择图片',
    imageAlt: '图片附件',
    imagesOnly: '只能添加图片文件',
    noAgents: '没有智能体',
    placeholder: '写一条评论…',
    removeQuote: '移除引用文字',
    uploadFailed: '图片没能添加。',
  },
}
