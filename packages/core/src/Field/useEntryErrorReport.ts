import type { ComputedRef } from 'vue'
import type { FieldStatusInput } from './types.js'
import { computed, onScopeDispose, shallowRef, watch } from 'vue'

/** 字段对打进来的文字的拒绝，向调用方汇报时的形状。 */
export interface EntryError {
  kind: string
  text: string
}

/** 两个拒绝的每个字段都相同。 */
export function isSameEntryError<E extends EntryError>(a: E | null, b: E | null): boolean {
  if (a === b)
    return true
  if (a == null || b == null)
    return false
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const key of keys) {
    if (!Object.is(a[key as keyof E], b[key as keyof E]))
      return false
  }
  return true
}

export interface EntryErrorReportOptions<E extends EntryError> {
  /** 字段留着并汇报的拒绝，没有时是 `null`。 */
  entryError: () => E | null
  /** 字段为这个拒绝亮出的说明，没有亮着的拒绝时是 `null`。 */
  rejectionMessage: () => string | null
  /** 调用方的状态。 */
  status: () => FieldStatusInput | undefined
  /**
   * 调用方的 error 状态（带说明）什么时候替字段的说明：`'always'` 总是，
   * `'withCallback'` 只有调用方监听了 `entryErrorChange` 才会。`warning` 和 `success` 从不替。
   */
  callerErrorPrecedence: 'always' | 'withCallback'
  /** 调用方是否监听了 `entryErrorChange`。 */
  hasListener: () => boolean
  /** 每次拒绝变了就调用一次，拒绝结束或字段卸载时带 `null`。 */
  report: (error: E | null) => void
}

export interface EntryErrorReport {
  /** 字段要显示的状态：亮着的拒绝，或者调用方的状态。 */
  fieldStatus: ComputedRef<FieldStatusInput | undefined>
  /** 调用方的 error 说明替字段措辞、但说明没变时，由字段自己的 alert 念一次。 */
  alertMessage: ComputedRef<string>
}

/**
 * 会拒绝打进来的文字的字段（DateInput、TimeInput、NumberInput）共用的状态、alert 和汇报。
 * 每个成员自己决定什么时候拒绝、说明怎么写；这里管亮着的拒绝如何顶替调用方状态、
 * 怎么只念一次，以及把每次变化报给调用方。
 */
export function useEntryErrorReport<E extends EntryError>(options: EntryErrorReportOptions<E>): EntryErrorReport {
  const callerError = computed(() => {
    const status = options.status()
    const wins = options.callerErrorPrecedence === 'always' || options.hasListener()
    return wins && status?.type === 'error' && status.message ? status.message : null
  })

  const fieldStatus = computed<FieldStatusInput | undefined>(() => {
    const message = options.rejectionMessage()
    return message != null && callerError.value == null
      ? { type: 'error', message }
      : options.status()
  })

  // 拒绝开始时调用方的 error 说明没变，状态就不会变，也就没人念；字段的 alert 念一次。
  // 拒绝期间调用方换了说明，Field 会念新的，这里不再重复。
  const repeat = shallowRef<string | null>(null)
  watch(() => options.rejectionMessage() != null, (rejected) => {
    repeat.value = rejected ? callerError.value : null
  })
  watch(callerError, (next) => {
    if (repeat.value !== null && repeat.value !== next)
      repeat.value = null
  })
  const alertMessage = computed(() =>
    options.rejectionMessage() != null && repeat.value != null && repeat.value === callerError.value ? repeat.value : '')

  let lastReport: E | null = null
  watch(options.entryError, (next) => {
    if (isSameEntryError(next, lastReport))
      return
    lastReport = next
    options.report(next)
  })
  onScopeDispose(() => {
    if (lastReport != null)
      options.report(null)
  })

  return { fieldStatus, alertMessage }
}
