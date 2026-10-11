// 这个文件由 `pnpm sync` 生成，不要手改。

import type { CalendarMessages } from './messages/calendar.js'
import type { DateInputMessages } from './messages/date-input.js'
import type { MultiSelectorMessages } from './messages/multi-selector.js'
import type { NumberInputMessages } from './messages/number-input.js'
import type { PaginationMessages } from './messages/pagination.js'
import type { SelectorMessages } from './messages/selector.js'
import type { TokenMessages } from './messages/token.js'
import type { TokenizerMessages } from './messages/tokenizer.js'
import type { TypeaheadMessages } from './messages/typeahead.js'
import type { AstryxLocale } from './types.js'
import { calendarMessages } from './messages/calendar.js'
import { dateInputMessages } from './messages/date-input.js'
import { multiSelectorMessages } from './messages/multi-selector.js'
import { numberInputMessages } from './messages/number-input.js'
import { paginationMessages } from './messages/pagination.js'
import { selectorMessages } from './messages/selector.js'
import { tokenMessages } from './messages/token.js'
import { tokenizerMessages } from './messages/tokenizer.js'
import { typeaheadMessages } from './messages/typeahead.js'

export interface AstryxMessages {
  calendar: CalendarMessages
  dateInput: DateInputMessages
  multiSelector: MultiSelectorMessages
  numberInput: NumberInputMessages
  pagination: PaginationMessages
  selector: SelectorMessages
  token: TokenMessages
  tokenizer: TokenizerMessages
  typeahead: TypeaheadMessages
}

export const astryxMessages: Record<AstryxLocale, AstryxMessages> = {
  'en': {
    calendar: calendarMessages.en,
    dateInput: dateInputMessages.en,
    multiSelector: multiSelectorMessages.en,
    numberInput: numberInputMessages.en,
    pagination: paginationMessages.en,
    selector: selectorMessages.en,
    token: tokenMessages.en,
    tokenizer: tokenizerMessages.en,
    typeahead: typeaheadMessages.en,
  },
  'zh-CN': {
    calendar: calendarMessages['zh-CN'],
    dateInput: dateInputMessages['zh-CN'],
    multiSelector: multiSelectorMessages['zh-CN'],
    numberInput: numberInputMessages['zh-CN'],
    pagination: paginationMessages['zh-CN'],
    selector: selectorMessages['zh-CN'],
    token: tokenMessages['zh-CN'],
    tokenizer: tokenizerMessages['zh-CN'],
    typeahead: typeaheadMessages['zh-CN'],
  },
}
