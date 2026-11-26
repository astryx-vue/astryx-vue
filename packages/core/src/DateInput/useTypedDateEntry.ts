import type { ComputedRef } from 'vue'
import type { FieldStatusInput } from '../Field/types.js'
import type { EntryErrorBehavior } from '../FormLayout/context.js'
import type { DateInputMessages } from '../locale/messages/date-input.js'
import type { CalendarSystem } from '../utils/calendarSystem.js'
import type { DateBounds, DateEntryResult, DateInputEntryError } from './dateEntry.js'
import type { DateInputFormat } from './types.js'
import { computed, nextTick, ref, watch } from 'vue'
import { useEntryErrorReport } from '../Field/useEntryErrorReport.js'
import { dateEntryErrorKind, dateEntryMessage, isAcceptedEntry, parseDateEntry, toEntryError } from './dateEntry.js'
import { formatCommittedDate, toIsoDate } from './dateText.js'

export interface TypedDateEntryOptions {
  value: () => Date | null | undefined
  format: () => DateInputFormat | undefined
  locale: () => string
  /** 读写文字用的历法，不传时是公历。 */
  calendar?: () => CalendarSystem
  bounds: () => DateBounds
  /** 这一天能不能选（范围、`isDateDisabled`、`dateConstraints`）。 */
  isBlocked: (date: Date) => boolean
  /** 禁用或忙碌：不收打字、Enter 和失焦，藏起拒绝；文字和拒绝留着，能改时再亮出来。 */
  isLocked: () => boolean
  behavior: () => EntryErrorBehavior
  /** 调用方的状态。 */
  status: () => FieldStatusInput | undefined
  /** 调用方是否监听了 `entryErrorChange`。监听了，它的 error 状态（带说明）替字段措辞。 */
  hasEntryErrorListener: () => boolean
  messages: () => DateInputMessages
  /** 打字提交一个日子，或者 Enter / 失焦提交清空的文字。 */
  commitValue: (date: Date | null) => void
  reportEntryError: (error: DateInputEntryError | null) => void
}

export interface TypedDateEntry {
  /** 输入框显示的文字。 */
  displayValue: ComputedRef<string>
  /** 还有等着提交的文字。Enter 要先收下它，不能直接提交表单。 */
  isPending: ComputedRef<boolean>
  isInvalid: ComputedRef<boolean>
  /** 输入框聚焦着。 */
  isFocused: ComputedRef<boolean>
  /** 字段要显示的状态：亮着的拒绝，或者调用方的状态。 */
  fieldStatus: ComputedRef<FieldStatusInput | undefined>
  /** 调用方的 error 说明替字段措辞、但说明没变时，由字段自己的 alert 念一次。 */
  alertMessage: ComputedRef<string>
  onInput: (text: string) => void
  /** Enter 或失焦：提交打进来的文字。 */
  commit: () => void
  onFocus: () => void
  onBlur: () => void
  /** 用别的方式选了日子（日历、清除）后丢掉打的文字。 */
  reset: () => void
}

/**
 * 日期文本框的打字状态：显示的文字、拒绝和提交。
 *
 * 打字时只在日子打完整、再打也变不了时才提交；读不成日期的文字等 Enter 或失焦，
 * 那时文字留在框里，字段显示为什么不收，`aria-invalid`，并且只念一次。
 * 之后的编辑让文字仍然不对或没打完时，拒绝继续亮着；改成能收的日子或清空时立刻消失。
 */
export function useTypedDateEntry(options: TypedDateEntryOptions): TypedDateEntry {
  /** 打进来的文字；`null` 表示框里显示已提交的值。 */
  const pending = ref<string | null>(null)
  /** Enter 或失焦留下了被拒的文字。 */
  const isRejectionCommitted = ref(false)
  /** 一次编辑让文字仍然被拒或没打完时，继续亮着的那段被拒文字。 */
  const keptText = ref<string | null>(null)
  const isFocused = ref(false)
  /** 这一轮打字已经报过的日子，同一个日子只报一次。 */
  let reported: string | null = null
  /** Enter 或失焦刚刚留下被拒的文字。这一刻传进来的新值不顶掉文字，调用方可以在这里恢复自己的值。 */
  let isRevealing = false

  const calendar = (): CalendarSystem => options.calendar?.() ?? 'gregory'

  function parse(text: string): DateEntryResult {
    return parseDateEntry(text, options.locale(), options.isBlocked, calendar(), options.format())
  }

  const committedText = computed(() => formatCommittedDate(options.value(), options.format(), options.locale(), calendar()))
  const displayValue = computed(() => pending.value ?? committedText.value)
  const typed = computed(() => pending.value !== null && pending.value.trim() ? parse(pending.value) : null)
  const ownError = computed(() => dateEntryErrorKind(typed.value, isRejectionCommitted.value, options.behavior()))
  const shown = computed<{ text: string, result: DateEntryResult } | null>(() => {
    if (options.isLocked())
      return null
    if (ownError.value != null && typed.value != null && pending.value !== null)
      return { text: pending.value, result: typed.value }
    if (keptText.value === null || typed.value == null || isAcceptedEntry(typed.value))
      return null
    const kept = parse(keptText.value)
    return dateEntryErrorKind(kept, true, options.behavior()) != null ? { text: keptText.value, result: kept } : null
  })
  const message = computed(() => shown.value
    ? dateEntryMessage(shown.value.result, options.bounds(), options.format(), options.locale(), options.messages(), calendar())
    : null)
  const entryError = computed(() => shown.value ? toEntryError(shown.value.result, shown.value.text, options.bounds()) : null)
  const { fieldStatus, alertMessage } = useEntryErrorReport<DateInputEntryError>({
    entryError: () => entryError.value,
    rejectionMessage: () => message.value,
    status: options.status,
    // 调用方监听了 `entryErrorChange`，它的 error 状态（带说明）才替字段措辞。
    callerErrorPrecedence: 'withCallback',
    hasListener: options.hasEntryErrorListener,
    report: options.reportEntryError,
  })

  function reset(): void {
    pending.value = null
    isRejectionCommitted.value = false
    keptText.value = null
  }

  function report(date: Date): void {
    const iso = toIsoDate(date)
    const value = options.value()
    if ((value && toIsoDate(value) === iso) || iso === reported)
      return
    reported = iso
    options.commitValue(date)
  }

  function onInput(text: string): void {
    if (options.isLocked())
      return
    const result = parse(text)
    const isEmpty = !text.trim()
    const isRejected = !isEmpty && dateEntryErrorKind(result, false, options.behavior()) != null
    const shownText = shown.value?.text ?? null
    keptText.value = isRejected || isEmpty || isAcceptedEntry(result) ? null : shownText
    pending.value = text
    isRejectionCommitted.value = false
    if (result.kind === 'value' && result.isComplete)
      report(result.date)
  }

  function commit(): void {
    if (pending.value === null || options.isLocked())
      return
    if (!pending.value.trim()) {
      if (options.value())
        options.commitValue(null)
      reset()
      return
    }
    const result = parse(pending.value)
    if (result.kind !== 'value') {
      // 文字留着，显示为什么不收；不替人补全或改动日子。
      isRejectionCommitted.value = true
      keptText.value = null
      isRevealing = true
      void nextTick(() => {
        isRevealing = false
      })
      return
    }
    report(result.date)
    reported = null
    reset()
  }

  // 外面传来的新值顶掉打的文字；打字自己报上去的那个值不算。
  watch(() => {
    const value = options.value()
    return value ? toIsoDate(value) : null
  }, (iso) => {
    if (iso !== null && iso === reported)
      return
    reported = null
    if (pending.value !== null && !isRevealing)
      reset()
  })

  // 能改了以后，打字已经报过的日子让位给字段的值；聚焦着就等 Enter 或失焦。
  watch(options.isLocked, (locked) => {
    const result = typed.value
    if (locked || isFocused.value || result?.kind !== 'value' || toIsoDate(result.date) !== reported)
      return
    reported = null
    reset()
  })

  return {
    displayValue,
    isPending: computed(() => pending.value !== null && !(isRejectionCommitted.value && typed.value?.kind === 'unreadable')),
    isInvalid: computed(() => shown.value != null),
    isFocused: computed(() => isFocused.value),
    fieldStatus,
    alertMessage,
    onInput,
    commit,
    onFocus: () => {
      isFocused.value = true
    },
    onBlur: () => {
      isFocused.value = false
      commit()
    },
    reset,
  }
}
