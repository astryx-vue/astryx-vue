// 这个文件由 `pnpm sync` 生成，不要手改。

import type { CalendarMessages } from './messages/calendar.js'
import type { ChatMessages } from './messages/chat.js'
import type { CitationMessages } from './messages/citation.js'
import type { DateInputMessages } from './messages/date-input.js'
import type { NumberInputMessages } from './messages/number-input.js'
import type { PaginationMessages } from './messages/pagination.js'
import type { SelectorMessages } from './messages/selector.js'
import type { AstryxLocale } from './types.js'
import { calendarMessages } from './messages/calendar.js'
import { chatMessages } from './messages/chat.js'
import { citationMessages } from './messages/citation.js'
import { dateInputMessages } from './messages/date-input.js'
import { numberInputMessages } from './messages/number-input.js'
import { paginationMessages } from './messages/pagination.js'
import { selectorMessages } from './messages/selector.js'

export interface AstryxMessages {
  calendar: CalendarMessages
  chat: ChatMessages
  citation: CitationMessages
  dateInput: DateInputMessages
  numberInput: NumberInputMessages
  pagination: PaginationMessages
  selector: SelectorMessages
}

export const astryxMessages: Record<AstryxLocale, AstryxMessages> = {
  'en': {
    calendar: calendarMessages.en,
    chat: chatMessages.en,
    citation: citationMessages.en,
    dateInput: dateInputMessages.en,
    numberInput: numberInputMessages.en,
    pagination: paginationMessages.en,
    selector: selectorMessages.en,
  },
  'zh-CN': {
    calendar: calendarMessages['zh-CN'],
    chat: chatMessages['zh-CN'],
    citation: citationMessages['zh-CN'],
    dateInput: dateInputMessages['zh-CN'],
    numberInput: numberInputMessages['zh-CN'],
    pagination: paginationMessages['zh-CN'],
    selector: selectorMessages['zh-CN'],
  },
}
