import type { ComputedRef, ShallowRef } from 'vue'
import type { FieldStatusInput } from '../Field/types.js'
import type { NumberInputRejection } from './numberInputCommit.js'
import { computed, nextTick, shallowRef, watch } from 'vue'
import { useEntryErrorReport } from '../Field/useEntryErrorReport.js'
import { getNumberInputRejection, resolveNumberInputCommit } from './numberInputCommit.js'

/**
 * 字段为什么不收打进来的文字。通过 `entryErrorChange` 报给调用方，方便它自己措辞。
 *
 * - `unreadable`：读不成数字的文字
 * - `fractional`：`isIntegerOnly` 字段里带小数的数
 * - `outOfRange`：`min` 大于 `max`，没有任何数能放进去
 */
export interface NumberInputEntryError {
  kind: 'unreadable' | 'fractional' | 'outOfRange'
  /** 打进来的文字。 */
  text: string
  /** 文字指向的数，`fractional` 和 `outOfRange` 带。 */
  value?: number
}

export interface TypedNumberRules {
  min?: number | null
  max?: number | null
  isIntegerOnly: boolean
  locale: string
}

export interface TypedNumberOptions {
  value: () => number | null | undefined
  rules: () => TypedNumberRules
  hasClear: () => boolean
  /** 禁用时丢掉草稿和拒绝，也不收打字。 */
  isDisabled: () => boolean
  /** 按住步进按钮时显示的是格子上的数，不亮拒绝。 */
  isHeld: () => boolean
  /** 调用方的状态。 */
  status: () => FieldStatusInput | undefined
  /** 调用方是否监听了 `entryErrorChange`。 */
  hasListener: () => boolean
  /** 拒绝亮出来的那句话。 */
  message: () => string
  /** 草稿提交出一个数，或者提交清空。 */
  commitValue: (value: number | null) => void
  reportEntryError: (error: NumberInputEntryError | null) => void
}

export interface TypedNumber {
  /** 正在编辑的原始文字；`null` 表示没有未提交的输入。 */
  draft: ShallowRef<string | null>
  /** 失焦时留下了被拒的草稿。表单这时提交已提交的数，输入框自己不带 name。 */
  isKeptAtBlur: ShallowRef<boolean>
  /** 亮着的拒绝，没有时是 `null`。 */
  entryError: ComputedRef<NumberInputEntryError | null>
  fieldStatus: ComputedRef<FieldStatusInput | undefined>
  alertMessage: ComputedRef<string>
  onInput: (text: string) => void
  /** Enter 或失焦：提交草稿，或者留下被拒的草稿。 */
  commit: (trigger: 'blur' | 'enter') => void
  /** 用别的方式换了值（步进、清除）后丢掉草稿和拒绝。 */
  reset: () => void
}

function toEntryError(text: string, rejection: NumberInputRejection | null): NumberInputEntryError | null {
  if (rejection == null)
    return null
  return rejection.kind === 'unreadable'
    ? { kind: 'unreadable', text }
    : { kind: rejection.kind, text, value: rejection.value }
}

/**
 * 数字输入框的打字状态：草稿、拒绝和提交。
 *
 * 一个数没有固定长度，只有 Enter 或失焦才算打完。打字时什么都不标、不显示、不念，不管草稿是什么。
 * Enter 或失焦时，读不成数字的文字、整数字段里的小数、`min` 大于 `max` 时的任何数，
 * 都留在框里，字段把 `message` 当 error 状态显示，`aria-invalid`，并且只念一次。
 * 之后的编辑让草稿仍然不对时，拒绝继续亮着；改成能收的数或清空时立刻消失。
 * 新的值、禁用都会丢掉草稿；超出普通范围的数仍然夹到边界提交。
 */
export function useTypedNumber(options: TypedNumberOptions): TypedNumber {
  const draft = shallowRef<string | null>(null)
  const shown = shallowRef<NumberInputEntryError | null>(null)
  const isKeptAtBlur = shallowRef(false)
  /** Enter 或失焦刚刚亮出拒绝。这一刻传进来的新值不顶掉草稿，调用方可以在这里恢复自己的值。 */
  let isRevealing = false

  const entryError = computed(() => options.isDisabled() ? null : shown.value)
  const { fieldStatus, alertMessage } = useEntryErrorReport<NumberInputEntryError>({
    entryError: () => entryError.value,
    rejectionMessage: () => entryError.value != null && !options.isHeld() ? options.message() : null,
    status: options.status,
    callerErrorPrecedence: 'always',
    hasListener: options.hasListener,
    report: options.reportEntryError,
  })

  function reset(): void {
    draft.value = null
    shown.value = null
    isKeptAtBlur.value = false
  }

  function judge(text: string): NumberInputEntryError | null {
    return toEntryError(text, getNumberInputRejection(text, options.rules()))
  }

  function onInput(text: string): void {
    draft.value = text
    isKeptAtBlur.value = false
    // 亮着的拒绝在草稿仍然不对时留着，草稿能收或为空时结束。
    if (shown.value !== null && getNumberInputRejection(text, options.rules()) === null)
      shown.value = null
  }

  function commit(trigger: 'blur' | 'enter'): void {
    if (draft.value === null)
      return
    if (options.isDisabled()) {
      // 编辑到一半被禁用的字段什么都不提交，草稿丢掉。
      reset()
      return
    }
    // 提交不了的草稿连同拒绝一起留在框里。
    const rejection = judge(draft.value)
    if (rejection != null) {
      shown.value = rejection
      isKeptAtBlur.value = trigger === 'blur'
      isRevealing = true
      void nextTick(() => {
        isRevealing = false
      })
      return
    }
    shown.value = null
    isKeptAtBlur.value = false
    const decision = resolveNumberInputCommit(draft.value, { ...options.rules(), hasClear: options.hasClear() })
    if (trigger === 'blur' || (decision.type === 'commit' && decision.didClamp))
      draft.value = null
    if (decision.type === 'clear') {
      if (options.hasClear() && options.value() != null)
        options.commitValue(null)
    }
    else if (decision.type === 'commit' && decision.value !== options.value()) {
      options.commitValue(decision.value)
    }
  }

  // 新的值、新的规则和禁用：一个回调里按顺序判，规则只判没被新值顶掉的草稿。
  watch(
    () => {
      const { min, max, isIntegerOnly, locale } = options.rules()
      return [options.value() ?? null, min ?? null, max ?? null, isIntegerOnly, locale, options.isDisabled()] as const
    },
    (next, prev) => {
      if (next[5] && (draft.value !== null || shown.value !== null || isKeptAtBlur.value)) {
        reset()
        return
      }
      const hasKept = shown.value !== null || isKeptAtBlur.value
      let isReplaced = false
      if (!Object.is(next[0], prev[0]) && hasKept && !isRevealing) {
        reset()
        isReplaced = true
      }
      const rulesChanged = next.slice(1, 5).some((item, index) => !Object.is(item, prev[index + 1]))
      if (rulesChanged && !isReplaced && shown.value !== null && draft.value !== null) {
        const rejection = judge(draft.value)
        shown.value = rejection
      }
    },
  )

  return { draft, isKeptAtBlur, entryError, fieldStatus, alertMessage, onInput, commit, reset }
}
