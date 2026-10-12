// 这个文件由 `pnpm sync` 生成，不要手改。

import type { CalendarMessages } from './messages/calendar.js'
import type { ChatMessages } from './messages/chat.js'
import type { CitationMessages } from './messages/citation.js'
import type { DateInputMessages } from './messages/date-input.js'
import type { MarkdownMessages } from './messages/markdown.js'
import type { MetadataListMessages } from './messages/metadata-list.js'
import type { MultiSelectorMessages } from './messages/multi-selector.js'
import type { NavMessages } from './messages/nav.js'
import type { NumberInputMessages } from './messages/number-input.js'
import type { PaginationMessages } from './messages/pagination.js'
import type { SelectorMessages } from './messages/selector.js'
import type { TableMessages } from './messages/table.js'
import type { ThumbnailMessages } from './messages/thumbnail.js'
import type { TimestampMessages } from './messages/timestamp.js'
import type { TokenMessages } from './messages/token.js'
import type { TokenizerMessages } from './messages/tokenizer.js'
import type { TreeListMessages } from './messages/tree-list.js'
import type { TypeaheadMessages } from './messages/typeahead.js'
import type { AstryxLocale } from './types.js'
import { calendarMessages } from './messages/calendar.js'
import { chatMessages } from './messages/chat.js'
import { citationMessages } from './messages/citation.js'
import { dateInputMessages } from './messages/date-input.js'
import { markdownMessages } from './messages/markdown.js'
import { metadataListMessages } from './messages/metadata-list.js'
import { multiSelectorMessages } from './messages/multi-selector.js'
import { navMessages } from './messages/nav.js'
import { numberInputMessages } from './messages/number-input.js'
import { paginationMessages } from './messages/pagination.js'
import { selectorMessages } from './messages/selector.js'
import { tableMessages } from './messages/table.js'
import { thumbnailMessages } from './messages/thumbnail.js'
import { timestampMessages } from './messages/timestamp.js'
import { tokenMessages } from './messages/token.js'
import { tokenizerMessages } from './messages/tokenizer.js'
import { treeListMessages } from './messages/tree-list.js'
import { typeaheadMessages } from './messages/typeahead.js'

export interface AstryxMessages {
  calendar: CalendarMessages
  chat: ChatMessages
  citation: CitationMessages
  dateInput: DateInputMessages
  markdown: MarkdownMessages
  metadataList: MetadataListMessages
  multiSelector: MultiSelectorMessages
  nav: NavMessages
  numberInput: NumberInputMessages
  pagination: PaginationMessages
  selector: SelectorMessages
  table: TableMessages
  thumbnail: ThumbnailMessages
  timestamp: TimestampMessages
  token: TokenMessages
  tokenizer: TokenizerMessages
  treeList: TreeListMessages
  typeahead: TypeaheadMessages
}

export const astryxMessages: Record<AstryxLocale, AstryxMessages> = {
  'en': {
    calendar: calendarMessages.en,
    chat: chatMessages.en,
    citation: citationMessages.en,
    dateInput: dateInputMessages.en,
    markdown: markdownMessages.en,
    metadataList: metadataListMessages.en,
    multiSelector: multiSelectorMessages.en,
    nav: navMessages.en,
    numberInput: numberInputMessages.en,
    pagination: paginationMessages.en,
    selector: selectorMessages.en,
    table: tableMessages.en,
    thumbnail: thumbnailMessages.en,
    timestamp: timestampMessages.en,
    token: tokenMessages.en,
    tokenizer: tokenizerMessages.en,
    treeList: treeListMessages.en,
    typeahead: typeaheadMessages.en,
  },
  'zh-CN': {
    calendar: calendarMessages['zh-CN'],
    chat: chatMessages['zh-CN'],
    citation: citationMessages['zh-CN'],
    dateInput: dateInputMessages['zh-CN'],
    markdown: markdownMessages['zh-CN'],
    metadataList: metadataListMessages['zh-CN'],
    multiSelector: multiSelectorMessages['zh-CN'],
    nav: navMessages['zh-CN'],
    numberInput: numberInputMessages['zh-CN'],
    pagination: paginationMessages['zh-CN'],
    selector: selectorMessages['zh-CN'],
    table: tableMessages['zh-CN'],
    thumbnail: thumbnailMessages['zh-CN'],
    timestamp: timestampMessages['zh-CN'],
    token: tokenMessages['zh-CN'],
    tokenizer: tokenizerMessages['zh-CN'],
    treeList: treeListMessages['zh-CN'],
    typeahead: typeaheadMessages['zh-CN'],
  },
}
