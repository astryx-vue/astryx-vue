import type { AstryxLocale } from '../types.js'

export interface MarkdownMessages {
  /** 标题旁 `#` 锚点链接的无障碍名。 */
  headingLink: (title: string) => string
  /** 标题旁复制链接按钮的名字。 */
  headingLinkCopy: (heading: string) => string
  /** 复制成功后按钮短暂换成的名字，同时会播报一次。 */
  headingLinkCopied: string
  /** Markdown 里表格的无障碍名。 */
  table: string
  taskDone: string
  taskList: string
  taskPending: string
}

export const markdownMessages: Record<AstryxLocale, MarkdownMessages> = {
  'en': {
    headingLink: title => title === '' ? 'Link to this section' : `Link to ${title}`,
    headingLinkCopy: heading => `Copy link to ${heading}`,
    headingLinkCopied: 'Link copied',
    table: 'Table',
    taskDone: 'Completed',
    taskList: 'Task list',
    taskPending: 'Not completed',
  },
  'zh-CN': {
    headingLink: title => title === '' ? '本节链接' : `${title}的链接`,
    headingLinkCopy: heading => `复制“${heading}”的链接`,
    headingLinkCopied: '链接已复制',
    table: '表格',
    taskDone: '已完成',
    taskList: '任务列表',
    taskPending: '未完成',
  },
}
