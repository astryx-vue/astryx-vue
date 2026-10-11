export type AstryxLocale = 'en' | 'zh-CN'

export interface AstryxMessages {
  calendar: {
    label: string
    previousMonth: string
    nextMonth: string
  }
  dateInput: {
    placeholder: string
    dialogLabel: string
    openCalendar: string
    closeCalendar: string
    clear: (label?: string) => string
  }
  selector: {
    placeholder: string
    search: string
    clear: string
    empty: string
  }
  numberInput: {
    increment: (label?: string) => string
    decrement: (label?: string) => string
  }
  pagination: {
    nav: string
    previous: string
    next: string
    page: (page: number) => string
    more: string
    perPage: string
    pageSize: (count: number) => string
    total: (total: number, from: number, to: number) => string
  }
  typeahead: {
    placeholder: string
    empty: string
    loading: string
    error: string
    clear: string
    results: string
  }
  multiSelector: {
    placeholder: string
    search: string
    clear: string
    empty: string
    selectAll: string
    selected: (count: number) => string
    more: (count: number) => string
  }
  token: {
    remove: (label: string) => string
  }
  tokenizer: {
    placeholder: string
    empty: string
    loading: string
    error: string
    clear: string
    results: string
    more: (count: number) => string
    added: (label: string) => string
    removed: (label: string) => string
    create: (query: string) => string
  }
}
