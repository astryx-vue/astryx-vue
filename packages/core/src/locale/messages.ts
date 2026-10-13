// 这个文件由 `pnpm sync` 生成，不要手改。

import type { CalendarMessages } from './messages/calendar.js'
import type { CarouselMessages } from './messages/carousel.js'
import type { ChatMessages } from './messages/chat.js'
import type { CitationMessages } from './messages/citation.js'
import type { DateInputMessages } from './messages/date-input.js'
import type { DateRangeInputMessages } from './messages/date-range-input.js'
import type { DateTimeInputMessages } from './messages/date-time-input.js'
import type { FileInputMessages } from './messages/file-input.js'
import type { LightboxMessages } from './messages/lightbox.js'
import type { MarkdownMessages } from './messages/markdown.js'
import type { MetadataListMessages } from './messages/metadata-list.js'
import type { MultiSelectorMessages } from './messages/multi-selector.js'
import type { NavMessages } from './messages/nav.js'
import type { NumberInputMessages } from './messages/number-input.js'
import type { OutlineMessages } from './messages/outline.js'
import type { PaginationMessages } from './messages/pagination.js'
import type { SelectorMessages } from './messages/selector.js'
import type { TableMessages } from './messages/table.js'
import type { ThumbnailMessages } from './messages/thumbnail.js'
import type { TimeInputMessages } from './messages/time-input.js'
import type { TimestampMessages } from './messages/timestamp.js'
import type { TokenMessages } from './messages/token.js'
import type { TokenizerMessages } from './messages/tokenizer.js'
import type { TreeListMessages } from './messages/tree-list.js'
import type { TypeaheadMessages } from './messages/typeahead.js'
import type { AstryxLocale } from './types.js'
import { calendarMessages } from './messages/calendar.js'
import { carouselMessages } from './messages/carousel.js'
import { chatMessages } from './messages/chat.js'
import { citationMessages } from './messages/citation.js'
import { dateInputMessages } from './messages/date-input.js'
import { dateRangeInputMessages } from './messages/date-range-input.js'
import { dateTimeInputMessages } from './messages/date-time-input.js'
import { fileInputMessages } from './messages/file-input.js'
import { lightboxMessages } from './messages/lightbox.js'
import { markdownMessages } from './messages/markdown.js'
import { metadataListMessages } from './messages/metadata-list.js'
import { multiSelectorMessages } from './messages/multi-selector.js'
import { navMessages } from './messages/nav.js'
import { numberInputMessages } from './messages/number-input.js'
import { outlineMessages } from './messages/outline.js'
import { paginationMessages } from './messages/pagination.js'
import { selectorMessages } from './messages/selector.js'
import { tableMessages } from './messages/table.js'
import { thumbnailMessages } from './messages/thumbnail.js'
import { timeInputMessages } from './messages/time-input.js'
import { timestampMessages } from './messages/timestamp.js'
import { tokenMessages } from './messages/token.js'
import { tokenizerMessages } from './messages/tokenizer.js'
import { treeListMessages } from './messages/tree-list.js'
import { typeaheadMessages } from './messages/typeahead.js'

export interface AstryxMessages {
  calendar: CalendarMessages
  carousel: CarouselMessages
  chat: ChatMessages
  citation: CitationMessages
  dateInput: DateInputMessages
  dateRangeInput: DateRangeInputMessages
  dateTimeInput: DateTimeInputMessages
  fileInput: FileInputMessages
  lightbox: LightboxMessages
  markdown: MarkdownMessages
  metadataList: MetadataListMessages
  multiSelector: MultiSelectorMessages
  nav: NavMessages
  numberInput: NumberInputMessages
  outline: OutlineMessages
  pagination: PaginationMessages
  selector: SelectorMessages
  table: TableMessages
  thumbnail: ThumbnailMessages
  timeInput: TimeInputMessages
  timestamp: TimestampMessages
  token: TokenMessages
  tokenizer: TokenizerMessages
  treeList: TreeListMessages
  typeahead: TypeaheadMessages
}

export const astryxMessages: Record<AstryxLocale, AstryxMessages> = {
  'en': {
    calendar: calendarMessages.en,
    carousel: carouselMessages.en,
    chat: chatMessages.en,
    citation: citationMessages.en,
    dateInput: dateInputMessages.en,
    dateRangeInput: dateRangeInputMessages.en,
    dateTimeInput: dateTimeInputMessages.en,
    fileInput: fileInputMessages.en,
    lightbox: lightboxMessages.en,
    markdown: markdownMessages.en,
    metadataList: metadataListMessages.en,
    multiSelector: multiSelectorMessages.en,
    nav: navMessages.en,
    numberInput: numberInputMessages.en,
    outline: outlineMessages.en,
    pagination: paginationMessages.en,
    selector: selectorMessages.en,
    table: tableMessages.en,
    thumbnail: thumbnailMessages.en,
    timeInput: timeInputMessages.en,
    timestamp: timestampMessages.en,
    token: tokenMessages.en,
    tokenizer: tokenizerMessages.en,
    treeList: treeListMessages.en,
    typeahead: typeaheadMessages.en,
  },
  'zh-CN': {
    calendar: calendarMessages['zh-CN'],
    carousel: carouselMessages['zh-CN'],
    chat: chatMessages['zh-CN'],
    citation: citationMessages['zh-CN'],
    dateInput: dateInputMessages['zh-CN'],
    dateRangeInput: dateRangeInputMessages['zh-CN'],
    dateTimeInput: dateTimeInputMessages['zh-CN'],
    fileInput: fileInputMessages['zh-CN'],
    lightbox: lightboxMessages['zh-CN'],
    markdown: markdownMessages['zh-CN'],
    metadataList: metadataListMessages['zh-CN'],
    multiSelector: multiSelectorMessages['zh-CN'],
    nav: navMessages['zh-CN'],
    numberInput: numberInputMessages['zh-CN'],
    outline: outlineMessages['zh-CN'],
    pagination: paginationMessages['zh-CN'],
    selector: selectorMessages['zh-CN'],
    table: tableMessages['zh-CN'],
    thumbnail: thumbnailMessages['zh-CN'],
    timeInput: timeInputMessages['zh-CN'],
    timestamp: timestampMessages['zh-CN'],
    token: tokenMessages['zh-CN'],
    tokenizer: tokenizerMessages['zh-CN'],
    treeList: treeListMessages['zh-CN'],
    typeahead: typeaheadMessages['zh-CN'],
  },
}
