// 这个文件由 `pnpm sync` 生成，不要手改。

import type { AlertDialogMessages } from './messages/alert-dialog.js'
import type { AvatarGroupMessages } from './messages/avatar-group.js'
import type { BannerMessages } from './messages/banner.js'
import type { BreadcrumbsMessages } from './messages/breadcrumbs.js'
import type { ButtonMessages } from './messages/button.js'
import type { CalendarMessages } from './messages/calendar.js'
import type { CarouselMessages } from './messages/carousel.js'
import type { ChatMessages } from './messages/chat.js'
import type { CheckboxListMessages } from './messages/checkbox-list.js'
import type { CitationMessages } from './messages/citation.js'
import type { CodeBlockMessages } from './messages/code-block.js'
import type { CommandPaletteMessages } from './messages/command-palette.js'
import type { ContextMenuMessages } from './messages/context-menu.js'
import type { DateInputMessages } from './messages/date-input.js'
import type { DateRangeInputMessages } from './messages/date-range-input.js'
import type { DateTimeInputMessages } from './messages/date-time-input.js'
import type { DialogMessages } from './messages/dialog.js'
import type { DropdownMenuMessages } from './messages/dropdown-menu.js'
import type { FieldMessages } from './messages/field.js'
import type { FileInputMessages } from './messages/file-input.js'
import type { InputMessages } from './messages/input.js'
import type { KeyboardHintMessages } from './messages/keyboard-hint.js'
import type { LayoutMessages } from './messages/layout.js'
import type { LightboxMessages } from './messages/lightbox.js'
import type { ListInputMessages } from './messages/list-input.js'
import type { MarkdownMessages } from './messages/markdown.js'
import type { MetadataListMessages } from './messages/metadata-list.js'
import type { MoreMenuMessages } from './messages/more-menu.js'
import type { MultiSelectorMessages } from './messages/multi-selector.js'
import type { NavMessages } from './messages/nav.js'
import type { NumberInputMessages } from './messages/number-input.js'
import type { OutlineMessages } from './messages/outline.js'
import type { PaginationMessages } from './messages/pagination.js'
import type { PopoverMessages } from './messages/popover.js'
import type { PowerSearchMessages } from './messages/power-search.js'
import type { RichTextEditorMessages } from './messages/rich-text-editor.js'
import type { SelectorMessages } from './messages/selector.js'
import type { SpinnerMessages } from './messages/spinner.js'
import type { StepperMessages } from './messages/stepper.js'
import type { SwitchMessages } from './messages/switch.js'
import type { TabListMessages } from './messages/tab-list.js'
import type { TableMessages } from './messages/table.js'
import type { TextAreaMessages } from './messages/text-area.js'
import type { TextInputMessages } from './messages/text-input.js'
import type { ThumbnailMessages } from './messages/thumbnail.js'
import type { TimeInputMessages } from './messages/time-input.js'
import type { TimestampMessages } from './messages/timestamp.js'
import type { ToastMessages } from './messages/toast.js'
import type { TokenMessages } from './messages/token.js'
import type { TokenizerMessages } from './messages/tokenizer.js'
import type { TransferListSelectorMessages } from './messages/transfer-list-selector.js'
import type { TransferListMessages } from './messages/transfer-list.js'
import type { TreeListMessages } from './messages/tree-list.js'
import type { TypeaheadMessages } from './messages/typeahead.js'
import type { AstryxLocale } from './types.js'
import { alertDialogMessages } from './messages/alert-dialog.js'
import { avatarGroupMessages } from './messages/avatar-group.js'
import { bannerMessages } from './messages/banner.js'
import { breadcrumbsMessages } from './messages/breadcrumbs.js'
import { buttonMessages } from './messages/button.js'
import { calendarMessages } from './messages/calendar.js'
import { carouselMessages } from './messages/carousel.js'
import { chatMessages } from './messages/chat.js'
import { checkboxListMessages } from './messages/checkbox-list.js'
import { citationMessages } from './messages/citation.js'
import { codeBlockMessages } from './messages/code-block.js'
import { commandPaletteMessages } from './messages/command-palette.js'
import { contextMenuMessages } from './messages/context-menu.js'
import { dateInputMessages } from './messages/date-input.js'
import { dateRangeInputMessages } from './messages/date-range-input.js'
import { dateTimeInputMessages } from './messages/date-time-input.js'
import { dialogMessages } from './messages/dialog.js'
import { dropdownMenuMessages } from './messages/dropdown-menu.js'
import { fieldMessages } from './messages/field.js'
import { fileInputMessages } from './messages/file-input.js'
import { inputMessages } from './messages/input.js'
import { keyboardHintMessages } from './messages/keyboard-hint.js'
import { layoutMessages } from './messages/layout.js'
import { lightboxMessages } from './messages/lightbox.js'
import { listInputMessages } from './messages/list-input.js'
import { markdownMessages } from './messages/markdown.js'
import { metadataListMessages } from './messages/metadata-list.js'
import { moreMenuMessages } from './messages/more-menu.js'
import { multiSelectorMessages } from './messages/multi-selector.js'
import { navMessages } from './messages/nav.js'
import { numberInputMessages } from './messages/number-input.js'
import { outlineMessages } from './messages/outline.js'
import { paginationMessages } from './messages/pagination.js'
import { popoverMessages } from './messages/popover.js'
import { powerSearchMessages } from './messages/power-search.js'
import { richTextEditorMessages } from './messages/rich-text-editor.js'
import { selectorMessages } from './messages/selector.js'
import { spinnerMessages } from './messages/spinner.js'
import { stepperMessages } from './messages/stepper.js'
import { switchMessages } from './messages/switch.js'
import { tabListMessages } from './messages/tab-list.js'
import { tableMessages } from './messages/table.js'
import { textAreaMessages } from './messages/text-area.js'
import { textInputMessages } from './messages/text-input.js'
import { thumbnailMessages } from './messages/thumbnail.js'
import { timeInputMessages } from './messages/time-input.js'
import { timestampMessages } from './messages/timestamp.js'
import { toastMessages } from './messages/toast.js'
import { tokenMessages } from './messages/token.js'
import { tokenizerMessages } from './messages/tokenizer.js'
import { transferListSelectorMessages } from './messages/transfer-list-selector.js'
import { transferListMessages } from './messages/transfer-list.js'
import { treeListMessages } from './messages/tree-list.js'
import { typeaheadMessages } from './messages/typeahead.js'

export interface AstryxMessages {
  alertDialog: AlertDialogMessages
  avatarGroup: AvatarGroupMessages
  banner: BannerMessages
  breadcrumbs: BreadcrumbsMessages
  button: ButtonMessages
  calendar: CalendarMessages
  carousel: CarouselMessages
  chat: ChatMessages
  checkboxList: CheckboxListMessages
  citation: CitationMessages
  codeBlock: CodeBlockMessages
  commandPalette: CommandPaletteMessages
  contextMenu: ContextMenuMessages
  dateInput: DateInputMessages
  dateRangeInput: DateRangeInputMessages
  dateTimeInput: DateTimeInputMessages
  dialog: DialogMessages
  dropdownMenu: DropdownMenuMessages
  field: FieldMessages
  fileInput: FileInputMessages
  input: InputMessages
  keyboardHint: KeyboardHintMessages
  layout: LayoutMessages
  lightbox: LightboxMessages
  listInput: ListInputMessages
  markdown: MarkdownMessages
  metadataList: MetadataListMessages
  moreMenu: MoreMenuMessages
  multiSelector: MultiSelectorMessages
  nav: NavMessages
  numberInput: NumberInputMessages
  outline: OutlineMessages
  pagination: PaginationMessages
  popover: PopoverMessages
  powerSearch: PowerSearchMessages
  richTextEditor: RichTextEditorMessages
  selector: SelectorMessages
  spinner: SpinnerMessages
  stepper: StepperMessages
  switch: SwitchMessages
  tabList: TabListMessages
  table: TableMessages
  textArea: TextAreaMessages
  textInput: TextInputMessages
  thumbnail: ThumbnailMessages
  timeInput: TimeInputMessages
  timestamp: TimestampMessages
  toast: ToastMessages
  token: TokenMessages
  tokenizer: TokenizerMessages
  transferListSelector: TransferListSelectorMessages
  transferList: TransferListMessages
  treeList: TreeListMessages
  typeahead: TypeaheadMessages
}

export const astryxMessages: Record<AstryxLocale, AstryxMessages> = {
  'en': {
    alertDialog: alertDialogMessages.en,
    avatarGroup: avatarGroupMessages.en,
    banner: bannerMessages.en,
    breadcrumbs: breadcrumbsMessages.en,
    button: buttonMessages.en,
    calendar: calendarMessages.en,
    carousel: carouselMessages.en,
    chat: chatMessages.en,
    checkboxList: checkboxListMessages.en,
    citation: citationMessages.en,
    codeBlock: codeBlockMessages.en,
    commandPalette: commandPaletteMessages.en,
    contextMenu: contextMenuMessages.en,
    dateInput: dateInputMessages.en,
    dateRangeInput: dateRangeInputMessages.en,
    dateTimeInput: dateTimeInputMessages.en,
    dialog: dialogMessages.en,
    dropdownMenu: dropdownMenuMessages.en,
    field: fieldMessages.en,
    fileInput: fileInputMessages.en,
    input: inputMessages.en,
    keyboardHint: keyboardHintMessages.en,
    layout: layoutMessages.en,
    lightbox: lightboxMessages.en,
    listInput: listInputMessages.en,
    markdown: markdownMessages.en,
    metadataList: metadataListMessages.en,
    moreMenu: moreMenuMessages.en,
    multiSelector: multiSelectorMessages.en,
    nav: navMessages.en,
    numberInput: numberInputMessages.en,
    outline: outlineMessages.en,
    pagination: paginationMessages.en,
    popover: popoverMessages.en,
    powerSearch: powerSearchMessages.en,
    richTextEditor: richTextEditorMessages.en,
    selector: selectorMessages.en,
    spinner: spinnerMessages.en,
    stepper: stepperMessages.en,
    switch: switchMessages.en,
    tabList: tabListMessages.en,
    table: tableMessages.en,
    textArea: textAreaMessages.en,
    textInput: textInputMessages.en,
    thumbnail: thumbnailMessages.en,
    timeInput: timeInputMessages.en,
    timestamp: timestampMessages.en,
    toast: toastMessages.en,
    token: tokenMessages.en,
    tokenizer: tokenizerMessages.en,
    transferListSelector: transferListSelectorMessages.en,
    transferList: transferListMessages.en,
    treeList: treeListMessages.en,
    typeahead: typeaheadMessages.en,
  },
  'zh-CN': {
    alertDialog: alertDialogMessages['zh-CN'],
    avatarGroup: avatarGroupMessages['zh-CN'],
    banner: bannerMessages['zh-CN'],
    breadcrumbs: breadcrumbsMessages['zh-CN'],
    button: buttonMessages['zh-CN'],
    calendar: calendarMessages['zh-CN'],
    carousel: carouselMessages['zh-CN'],
    chat: chatMessages['zh-CN'],
    checkboxList: checkboxListMessages['zh-CN'],
    citation: citationMessages['zh-CN'],
    codeBlock: codeBlockMessages['zh-CN'],
    commandPalette: commandPaletteMessages['zh-CN'],
    contextMenu: contextMenuMessages['zh-CN'],
    dateInput: dateInputMessages['zh-CN'],
    dateRangeInput: dateRangeInputMessages['zh-CN'],
    dateTimeInput: dateTimeInputMessages['zh-CN'],
    dialog: dialogMessages['zh-CN'],
    dropdownMenu: dropdownMenuMessages['zh-CN'],
    field: fieldMessages['zh-CN'],
    fileInput: fileInputMessages['zh-CN'],
    input: inputMessages['zh-CN'],
    keyboardHint: keyboardHintMessages['zh-CN'],
    layout: layoutMessages['zh-CN'],
    lightbox: lightboxMessages['zh-CN'],
    listInput: listInputMessages['zh-CN'],
    markdown: markdownMessages['zh-CN'],
    metadataList: metadataListMessages['zh-CN'],
    moreMenu: moreMenuMessages['zh-CN'],
    multiSelector: multiSelectorMessages['zh-CN'],
    nav: navMessages['zh-CN'],
    numberInput: numberInputMessages['zh-CN'],
    outline: outlineMessages['zh-CN'],
    pagination: paginationMessages['zh-CN'],
    popover: popoverMessages['zh-CN'],
    powerSearch: powerSearchMessages['zh-CN'],
    richTextEditor: richTextEditorMessages['zh-CN'],
    selector: selectorMessages['zh-CN'],
    spinner: spinnerMessages['zh-CN'],
    stepper: stepperMessages['zh-CN'],
    switch: switchMessages['zh-CN'],
    tabList: tabListMessages['zh-CN'],
    table: tableMessages['zh-CN'],
    textArea: textAreaMessages['zh-CN'],
    textInput: textInputMessages['zh-CN'],
    thumbnail: thumbnailMessages['zh-CN'],
    timeInput: timeInputMessages['zh-CN'],
    timestamp: timestampMessages['zh-CN'],
    toast: toastMessages['zh-CN'],
    token: tokenMessages['zh-CN'],
    tokenizer: tokenizerMessages['zh-CN'],
    transferListSelector: transferListSelectorMessages['zh-CN'],
    transferList: transferListMessages['zh-CN'],
    treeList: treeListMessages['zh-CN'],
    typeahead: typeaheadMessages['zh-CN'],
  },
}
