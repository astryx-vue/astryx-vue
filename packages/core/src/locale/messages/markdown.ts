import type { AstryxLocale } from '../types.js'

export interface MarkdownMessages {
  headingLink: (title: string) => string
  taskDone: string
  taskList: string
  taskPending: string
}

export const markdownMessages: Record<AstryxLocale, MarkdownMessages> = {
  'en': {
    headingLink: title => title === '' ? 'Link to this section' : `Link to ${title}`,
    taskDone: 'Completed',
    taskList: 'Task list',
    taskPending: 'Not completed',
  },
  'zh-CN': {
    headingLink: title => title === '' ? '本节链接' : `${title}的链接`,
    taskDone: '已完成',
    taskList: '任务列表',
    taskPending: '未完成',
  },
}
