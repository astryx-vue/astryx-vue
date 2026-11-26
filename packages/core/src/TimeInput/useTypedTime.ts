import type { ComputedRef } from 'vue'
import type { HourFormat } from '../composables/useTimeValue.js'
import type { FieldStatusInput } from '../Field/types.js'
import type { EntryErrorBehavior } from '../FormLayout/context.js'
import type { TimeInputMessages } from '../locale/messages/time-input.js'
import { computed, nextTick, onScopeDispose, ref, shallowRef, watch } from 'vue'
import { isTimeInRange, parseDisplayTime } from '../composables/useTimeValue.js'
import { isLocaleTimeComplete } from '../utils/timeFormat.js'

/**
 * 字段为什么不收打进来的文字。通过 `entryErrorChange` 报给调用方，方便它自己措辞。
 *
 * - `unreadable`：读不成时间的文字
 * - `outOfRange`：早于 `min` 或晚于 `max`
 */
export interface TimeInputEntryError {
  kind: 'unreadable' | 'outOfRange'
  /** 打进来的文字。 */
  text: string
  /** 文字指向的 ISO 时间，只有 `outOfRange` 带。 */
  time?: string
}

/** 读一段文字的结果。`isComplete` 表示小时、分钟（和秒）都齐了，12 小时制还带着上下午。 */
type TimeEntryResult
  = | { kind: 'value', time: string, isComplete: boolean }
    | { kind: 'outOfRange', time: string, isComplete: boolean }
    | { kind: 'unreadable', isComplete: boolean }

export interface TypedTimeOptions {
  value: () => string | null | undefined
  locale: () => string
  hourFormat: () => HourFormat
  hasSeconds: () => boolean
  min: () => string | undefined
  max: () => string | undefined
  /** 禁用或忙碌：不收打字、Enter 和失焦，藏起拒绝；文字和拒绝留着，能改时再亮出来。 */
  isLocked: () => boolean
  behavior: () => EntryErrorBehavior
  /** 调用方的状态。 */
  status: () => FieldStatusInput | undefined
  messages: () => TimeInputMessages
  /** 打字提交一个时间，或者 Enter / 失焦提交清空的文字。 */
  commitValue: (time: string | null) => void
  /** 已提交的值按字段的写法显示的文字。 */
  formatCommitted: (time: string) => string
  reportEntryError: (error: TimeInputEntryError | null) => void
}

export interface TypedTime {
  /** 输入框显示的文字。 */
  displayValue: ComputedRef<string>
  /** 亮着的拒绝，或者调用方的状态。 */
  fieldStatus: ComputedRef<FieldStatusInput | undefined>
  /** 亮着的拒绝那句话，没有拒绝时是 `null`。 */
  message: ComputedRef<string | null>
  isInvalid: ComputedRef<boolean>
  /** 调用方的 error 说明替字段措辞、但说明没变时，由字段自己的 alert 念一次。 */
  alertMessage: ComputedRef<string>
  onInput: (text: string) => void
  /** Enter 或失焦：提交打进来的文字。 */
  commit: () => void
  onFocus: () => void
  onBlur: () => void
  /** 用别的方式换了值（预设列表、方向键、清除、滚轮）后丢掉打的文字。 */
  reset: () => void
  /** 系统时间控件拒绝了一次编辑（超出范围）。`null` 表示这次编辑被收下或清空。 */
  rejectNative: (rejection: { text: string, time: string } | null) => void
}

/**
 * 时间文本框的打字状态：显示的文字、拒绝和提交。
 *
 * 一段文字只有小时、分钟（带秒时还有秒）都齐了、12 小时制还写了上下午才算完整（0 点和 13 到 23 点不用写）。
 * 没打完的时候什么都不标、不念；完整却超出 `min` / `max` 的时间立刻亮出来（`complete` 下），
 * 读不成时间的文字等 Enter 或失焦。拒绝亮出来时文字留在框里，字段显示为什么不收，
 * `aria-invalid`，并且只念一次。之后的编辑让文字仍然不对或没打完时，拒绝继续亮着；
 * 改成能收的时间或清空时立刻消失。
 */
export function useTypedTime(options: TypedTimeOptions): TypedTime {
  /** 打进来的文字；`null` 表示框里显示已提交的值。 */
  const pending = ref<string | null>(null)
  /** Enter 或失焦留下了被拒的文字。 */
  const isRejectionCommitted = ref(false)
  /** 一次编辑让文字仍然被拒或没打完时，继续亮着的那段被拒文字。 */
  const keptText = ref<string | null>(null)
  const isFocused = ref(false)
  /** 系统时间控件被拒的那次编辑。 */
  const native = shallowRef<{ text: string, time: string } | null>(null)
  /** 这一轮打字已经报过的时间，同一个时间只报一次。 */
  let reported: string | null = null
  /** Enter 或失焦刚刚留下被拒的文字。这一刻传进来的新值不顶掉文字，调用方可以在这里恢复自己的值。 */
  let isRevealing = false

  function parse(text: string): TimeEntryResult {
    const locale = options.locale()
    const hasSeconds = options.hasSeconds()
    const isComplete = isLocaleTimeComplete(text, locale, options.hourFormat(), hasSeconds)
    const time = parseDisplayTime(text, hasSeconds, locale)
    if (time == null)
      return { kind: 'unreadable', isComplete }
    return { kind: isTimeInRange(time, options.min(), options.max()) ? 'value' : 'outOfRange', time, isComplete }
  }

  /** 这个结果此刻亮出来的拒绝：Enter 或失焦提交过的文字的错，或者 `complete` 下一个已经完整的时间的错。 */
  function errorKind(result: TimeEntryResult | null, isCommitted: boolean): TimeInputEntryError['kind'] | null {
    if (result == null)
      return null
    if (result.kind === 'unreadable')
      return isCommitted ? 'unreadable' : null
    if (result.kind === 'outOfRange' && (isCommitted || (result.isComplete && options.behavior() === 'complete')))
      return 'outOfRange'
    return null
  }

  function isAccepted(result: TimeEntryResult): boolean {
    return result.kind === 'value' && result.isComplete
  }

  const committedText = computed(() => {
    const value = options.value()
    return value ? options.formatCommitted(value) : ''
  })
  const displayValue = computed(() => pending.value ?? committedText.value)
  const typed = computed(() => pending.value !== null && pending.value.trim() ? parse(pending.value) : null)
  const ownError = computed(() => errorKind(typed.value, isRejectionCommitted.value))
  const shown = computed<{ text: string, result: TimeEntryResult } | null>(() => {
    if (options.isLocked())
      return null
    if (ownError.value != null && typed.value != null && pending.value !== null)
      return { text: pending.value, result: typed.value }
    if (keptText.value === null || typed.value == null || isAccepted(typed.value))
      return null
    const kept = parse(keptText.value)
    return errorKind(kept, true) != null ? { text: keptText.value, result: kept } : null
  })
  const nativeShown = computed(() => options.isLocked() ? null : native.value)

  const entryError = computed<TimeInputEntryError | null>(() => {
    if (shown.value) {
      const { result, text } = shown.value
      return result.kind === 'unreadable'
        ? { kind: 'unreadable', text }
        : { kind: 'outOfRange', text, time: (result as { time: string }).time }
    }
    return nativeShown.value ? { kind: 'outOfRange', text: nativeShown.value.text, time: nativeShown.value.time } : null
  })
  const message = computed(() => {
    if (entryError.value == null)
      return null
    const messages = options.messages()
    return entryError.value.kind === 'unreadable' ? messages.invalidTime : messages.outOfRange
  })
  const callerError = computed(() => {
    const status = options.status()
    return status?.type === 'error' && status.message ? status.message : null
  })

  const fieldStatus = computed<FieldStatusInput | undefined>(() => message.value != null && callerError.value == null
    ? { type: 'error', message: message.value }
    : options.status())

  // 拒绝开始时调用方的 error 说明没变，状态就不会变，也就没人念；字段的 alert 念一次。
  // 拒绝期间调用方换了说明，Field 会念新的，这里不再重复。
  const repeat = shallowRef<string | null>(null)
  watch(() => message.value != null, (rejected) => {
    repeat.value = rejected ? callerError.value : null
  })
  watch(callerError, (next) => {
    if (repeat.value !== null && repeat.value !== next)
      repeat.value = null
  })
  const alertMessage = computed(() => message.value != null && repeat.value != null && repeat.value === callerError.value ? repeat.value : '')

  function sameError(a: TimeInputEntryError | null, b: TimeInputEntryError | null): boolean {
    return a === b || (a != null && b != null && a.kind === b.kind && a.text === b.text && a.time === b.time)
  }

  let lastReport: TimeInputEntryError | null = null
  watch(entryError, (next) => {
    if (sameError(next, lastReport))
      return
    lastReport = next
    options.reportEntryError(next)
  })
  onScopeDispose(() => {
    if (lastReport != null)
      options.reportEntryError(null)
  })

  function reset(): void {
    pending.value = null
    isRejectionCommitted.value = false
    keptText.value = null
    native.value = null
    reported = null
  }

  function report(time: string): void {
    if (time === options.value() || time === reported)
      return
    reported = time
    options.commitValue(time)
  }

  function onInput(text: string): void {
    if (options.isLocked())
      return
    const result = parse(text)
    const isEmpty = !text.trim()
    const isRejected = !isEmpty && errorKind(result, false) != null
    const shownText = shown.value?.text ?? null
    keptText.value = isRejected || isEmpty || isAccepted(result) ? null : shownText
    pending.value = text
    isRejectionCommitted.value = false
    native.value = null
    if (result.kind === 'value' && result.isComplete)
      report(result.time)
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
      // 文字留着，显示为什么不收；不替人补全或改动时间。
      isRejectionCommitted.value = true
      keptText.value = null
      isRevealing = true
      void nextTick(() => {
        isRevealing = false
      })
      return
    }
    report(result.time)
    reported = null
    reset()
  }

  // 外面传来的新值顶掉打的文字；打字自己报上去的那个值不算。
  watch(() => options.value() ?? null, (time) => {
    if (time !== null && time === reported)
      return
    reported = null
    native.value = null
    if (pending.value !== null && !isRevealing)
      reset()
  })

  // 能改了以后，打字已经报过的时间让位给字段的值；聚焦着就等 Enter 或失焦。
  watch(options.isLocked, (locked) => {
    const result = typed.value
    if (locked || isFocused.value || result?.kind !== 'value' || result.time !== reported)
      return
    reset()
  })

  return {
    displayValue,
    fieldStatus,
    message,
    isInvalid: computed(() => entryError.value != null),
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
    rejectNative: (rejection) => {
      native.value = rejection
    },
  }
}
