import type { AstryxLocale, AstryxMessages } from './types.js'
import { chatMessagesEn, chatMessagesZh } from './messages/chat.js'
import { citationMessagesEn, citationMessagesZh } from './messages/citation.js'

function clearLabel(label: string | undefined, fallback: string, prefix: string): string {
  return label != null && label !== '' ? `${prefix}${label}` : fallback
}

const en: AstryxMessages = {
  calendar: {
    label: 'Calendar',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
  },
  dateInput: {
    placeholder: 'Select a date',
    dialogLabel: 'Choose date',
    openCalendar: 'Open calendar',
    closeCalendar: 'Close calendar',
    clear: label => clearLabel(label, 'Clear', 'Clear '),
  },
  selector: {
    placeholder: 'Select…',
    search: 'Search…',
    clear: 'Clear',
    empty: 'No matches',
  },
  numberInput: {
    increment: label => clearLabel(label, 'Increment', 'Increment '),
    decrement: label => clearLabel(label, 'Decrement', 'Decrement '),
  },
  pagination: {
    nav: 'Pagination',
    previous: 'Previous',
    next: 'Next',
    page: page => `Page ${page}`,
    more: 'More pages',
    perPage: 'Per page',
    pageSize: count => `${count} / page`,
    total: (total, from, to) => `${from}–${to} of ${total}`,
  },
  chat: chatMessagesEn,
  citation: citationMessagesEn,
}

const zhCN: AstryxMessages = {
  calendar: {
    label: '日历',
    previousMonth: '上一月',
    nextMonth: '下一月',
  },
  dateInput: {
    placeholder: '选择日期',
    dialogLabel: '选择日期',
    openCalendar: '打开日历',
    closeCalendar: '关闭日历',
    clear: label => clearLabel(label, '清除', '清除'),
  },
  selector: {
    placeholder: '请选择',
    search: '搜索…',
    clear: '清除',
    empty: '无匹配项',
  },
  numberInput: {
    increment: label => clearLabel(label, '增加', '增加'),
    decrement: label => clearLabel(label, '减少', '减少'),
  },
  pagination: {
    nav: '分页导航',
    previous: '上一页',
    next: '下一页',
    page: page => `第 ${page} 页`,
    more: '更多页码',
    perPage: '每页',
    pageSize: count => `${count} 条/页`,
    total: (total, from, to) => `共 ${total} 条，显示 ${from}-${to}`,
  },
  chat: chatMessagesZh,
  citation: citationMessagesZh,
}

export const astryxMessages: Record<AstryxLocale, AstryxMessages> = {
  'en': en,
  'zh-CN': zhCN,
}
