import type { PowerSearchMessages } from '../locale/messages/power-search.js'

/** 筛选标签的文字：字段和运算符由一条文案拼成，语言可以调换顺序和标点。没有运算符文字时只显示字段。 */
export function formatTokenLabel(messages: PowerSearchMessages, fieldLabel: string, operatorLabel: string): string {
  return operatorLabel === '' ? fieldLabel : messages.token.fieldOperator(fieldLabel, operatorLabel)
}

/** 筛选标签的全文：「字段: 运算符」和值，由一条文案拼成。 */
export function formatTokenText(messages: PowerSearchMessages, label: string, value: string): string {
  return messages.token.labelValue(label, value)
}

// 文案不会用到的两个私用区字符，用来找出两部分各自落在哪里。
const LABEL_MARK = '\uE000'
const VALUE_MARK = '\uE001'

/**
 * 语言是不是把全文写成「标签、空格、值」。只有这样，标签才能把标签和加粗的值分成两段显示，
 * 读起来仍是给它命名的那句全文。
 */
export function tokenTextKeepsParts(messages: PowerSearchMessages): boolean {
  return new RegExp(`^${LABEL_MARK}\\s+${VALUE_MARK}$`).test(formatTokenText(messages, LABEL_MARK, VALUE_MARK))
}
