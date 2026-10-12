// 这个文件由 `pnpm sync` 生成，不要手改。

import type { CalendarMessages } from './messages/calendar.js'
import type { ChatMessages } from './messages/chat.js'
import type { CitationMessages } from './messages/citation.js'
import type { DateInputMessages } from './messages/date-input.js'
import type { DateRangeInputMessages } from './messages/date-range-input.js'
import type { DateTimeInputMessages } from './messages/date-time-input.js'
import type { FileInputMessages } from './messages/file-input.js'
import type { MarkdownMessages } from './messages/markdown.js'
import type { MultiSelectorMessages } from './messages/multi-selector.js'
import type { NavMessages } from './messages/nav.js'
import type { NumberInputMessages } from './messages/number-input.js'
import type { PaginationMessages } from './messages/pagination.js'
import type { SelectorMessages } from './messages/selector.js'
import type { TimeInputMessages } from './messages/time-input.js'
import type { TokenMessages } from './messages/token.js'
import type { TokenizerMessages } from './messages/tokenizer.js'
import type { TypeaheadMessages } from './messages/typeahead.js'
import type { AstryxLocale } from './types.js'
import { calendarMessages } from './messages/calendar.js'
import { chatMessages } from './messages/chat.js'
import { citationMessages } from './messages/citation.js'
import { dateInputMessages } from './messages/date-input.js'
import { dateRangeInputMessages } from './messages/date-range-input.js'
import { dateTimeInputMessages } from './messages/date-time-input.js'
import { fileInputMessages } from './messages/file-input.js'
import { markdownMessages } from './messages/markdown.js'
import { multiSelectorMessages } from './messages/multi-selector.js'
import { navMessages } from './messages/nav.js'
import { numberInputMessages } from './messages/number-input.js'
import { paginationMessages } from './messages/pagination.js'
import { selectorMessages } from './messages/selector.js'
import { timeInputMessages } from './messages/time-input.js'
import { tokenMessages } from './messages/token.js'
import { tokenizerMessages } from './messages/tokenizer.js'
import { typeaheadMessages } from './messages/typeahead.js'

export interface AstryxMessages {
  calendar: CalendarMessages
  chat: ChatMessages
  citation: CitationMessages
  dateInput: DateInputMessages
  dateRangeInput: DateRangeInputMessages
  dateTimeInput: DateTimeInputMessages
  fileInput: FileInputMessages
  markdown: MarkdownMessages
  multiSelector: MultiSelectorMessages
  nav: NavMessages
  numberInput: NumberInputMessages
  pagination: PaginationMessages
  selector: SelectorMessages
  timeInput: TimeInputMessages
  token: TokenMessages
  tokenizer: TokenizerMessages
  typeahead: TypeaheadMessages
}

export const astryxMessages: Record<AstryxLocale, AstryxMessages> = {
  'en': {
    calendar: calendarMessages.en,
    chat: chatMessages.en,
    citation: citationMessages.en,
    dateInput: dateInputMessages.en,
    dateRangeInput: dateRangeInputMessages.en,
    dateTimeInput: dateTimeInputMessages.en,
    fileInput: fileInputMessages.en,
    markdown: markdownMessages.en,
    multiSelector: multiSelectorMessages.en,
    nav: navMessages.en,
    numberInput: numberInputMessages.en,
    pagination: paginationMessages.en,
    selector: selectorMessages.en,
    timeInput: timeInputMessages.en,
    token: tokenMessages.en,
    tokenizer: tokenizerMessages.en,
    typeahead: typeaheadMessages.en,
  },
  'zh-CN': {
    calendar: calendarMessages['zh-CN'],
    chat: chatMessages['zh-CN'],
    citation: citationMessages['zh-CN'],
    dateInput: dateInputMessages['zh-CN'],
    dateRangeInput: dateRangeInputMessages['zh-CN'],
    dateTimeInput: dateTimeInputMessages['zh-CN'],
    fileInput: fileInputMessages['zh-CN'],
    markdown: markdownMessages['zh-CN'],
    multiSelector: multiSelectorMessages['zh-CN'],
    nav: navMessages['zh-CN'],
    numberInput: numberInputMessages['zh-CN'],
    pagination: paginationMessages['zh-CN'],
    selector: selectorMessages['zh-CN'],
    timeInput: timeInputMessages['zh-CN'],
    token: tokenMessages['zh-CN'],
    tokenizer: tokenizerMessages['zh-CN'],
    typeahead: typeaheadMessages['zh-CN'],
  },
}
