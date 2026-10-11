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
}
