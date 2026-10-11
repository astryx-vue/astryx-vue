import type { ComputedRef, Ref } from 'vue'
import { computed, ref, toValue } from 'vue'

export interface UseControllableStateOptions<T> {
  /**
   * 外面传进来的值。setup 时是 `undefined`，表示没人管，组件自己记。
   * `undefined` 不能当作一个真实取值。
   */
  modelValue: Ref<T | undefined>
  /** 没人管时用的初始值，只在 setup 时读一次。 */
  defaultValue: T
  /** 值真的变了才调用，受控和非受控都会走这里。 */
  onChange?: (value: T) => void
}

export interface ControllableState<T> {
  /** 当前值。受控时跟着 modelValue，否则是自己记的那份。 */
  value: ComputedRef<T>
  /**
   * 是否由外面管。在 setup 时定一次：一开始没传值，之后一直自己管。
   * 和 MoreMenu 里「受控与否不中途改口」的做法一致。
   */
  isControlled: ComputedRef<boolean>
  /** 写入下一个值。和当前值相同则什么都不做。 */
  setValue: (next: T) => void
}

/**
 * 受控或自己管的 v-model。
 *
 * Astryx 没有同名 hook。各组件原来各自判断「外面传了值就听外面的，没传就自己记」，
 * 这里收成一个函数，方便以后的 v-model 共用。
 */
export function useControllableState<T>(options: UseControllableStateOptions<T>): ControllableState<T> {
  const { modelValue, onChange } = options
  const controlled = modelValue.value !== undefined
  const local = ref(toValue(options.defaultValue)) as Ref<T>

  const isControlled = computed(() => controlled)
  const value = computed(() => (controlled ? modelValue.value as T : local.value))

  function setValue(next: T): void {
    if (Object.is(value.value, next))
      return
    if (controlled)
      modelValue.value = next
    else
      local.value = next
    onChange?.(next)
  }

  return { isControlled, setValue, value }
}
