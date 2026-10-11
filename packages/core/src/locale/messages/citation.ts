export interface CitationMessages {
  label: (number: number, title: string) => string
}

export const citationMessagesEn: CitationMessages = {
  label: (number, title) => `Citation ${number}: ${title}`,
}

export const citationMessagesZh: CitationMessages = {
  label: (number, title) => `引用 ${number}：${title}`,
}
