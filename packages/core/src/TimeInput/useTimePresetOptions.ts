import type { ComputedRef, Ref, ShallowRef } from 'vue'
import { computed, nextTick, shallowRef } from 'vue'
import { useDismiss } from '../composables/useDismiss.js'
import { formatISOTime, isTimeInRange } from '../composables/useTimeValue.js'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'

export interface TimePresetOptionsInput {
  /** 预设时间的分钟间隔。不传就没有预设列表。 */
  interval: () => number | undefined
  hasSeconds: () => boolean
  min: () => string | undefined
  max: () => string | undefined
  isLocked: () => boolean
  value: () => string | null | undefined
  /** 字段外壳，列表锚在它下面。 */
  container: Ref<HTMLElement | null>
  /** 列表本身。 */
  list: Ref<HTMLElement | null>
  commit: (time: string) => void
  focusInput: () => void
}

export interface TimePresetOptions {
  timeOptions: ComputedRef<string[]>
  showsOptions: ComputedRef<boolean>
  isOptionsOpen: ShallowRef<boolean>
  activeOption: ShallowRef<number>
  optionsStyle: ComputedRef<{ top: string, left: string }>
  openOptions: () => void
  closeOptions: () => void
  moveActive: (step: number) => void
  selectOption: (index: number) => void
}

/**
 * 时钟图标下的预设时间列表：按间隔生成可选时间，方向键和 Enter 在输入框里代管，
 * 列表挂在字段下方，点到字段或列表里不关，点别处或按 Escape 关。
 */
export function useTimePresetOptions(input: TimePresetOptionsInput): TimePresetOptions {
  const timeOptions = computed<string[]>(() => {
    const interval = input.interval()
    if (interval == null || interval <= 0)
      return []
    const options: string[] = []
    for (let minutes = 0; minutes < 24 * 60; minutes += interval) {
      const value = formatISOTime({ hours: Math.floor(minutes / 60), minutes: minutes % 60, seconds: 0 }, input.hasSeconds())
      if (isTimeInRange(value, input.min(), input.max()))
        options.push(value)
    }
    return options
  })
  const showsOptions = computed(() => timeOptions.value.length > 0)
  const isOptionsOpen = shallowRef(false)
  const activeOption = shallowRef(-1)
  const position = usePositionedLayer({
    anchor: input.container,
    layer: input.list,
    isOpen: isOptionsOpen,
    placement: computed(() => 'below' as const),
    alignment: computed(() => 'start' as const),
    gap: 4,
  })
  const optionsStyle = computed(() => ({
    top: `${position.position.value.top}px`,
    left: `${position.position.value.left}px`,
  }))

  function closeOptions(): void {
    isOptionsOpen.value = false
    activeOption.value = -1
  }

  useDismiss({
    container: input.list,
    trigger: input.container,
    isEnabled: isOptionsOpen,
    dismissOnEscape: 'ignore',
    onDismiss: closeOptions,
  })

  function scrollActiveOption(): void {
    const layer = input.list.value
    const index = activeOption.value
    if (!layer || index < 0)
      return
    const option = layer.querySelector<HTMLElement>(`[data-option-index="${index}"]`)
    if (!option)
      return
    const layerRect = layer.getBoundingClientRect()
    const optionRect = option.getBoundingClientRect()
    if (optionRect.top < layerRect.top)
      layer.scrollTop -= layerRect.top - optionRect.top
    else if (optionRect.bottom > layerRect.bottom)
      layer.scrollTop += optionRect.bottom - layerRect.bottom
  }

  function openOptions(): void {
    if (input.isLocked() || !showsOptions.value || isOptionsOpen.value)
      return
    const value = input.value()
    activeOption.value = value == null ? -1 : timeOptions.value.indexOf(value)
    isOptionsOpen.value = true
    void nextTick(scrollActiveOption)
  }

  function moveActive(step: number): void {
    const total = timeOptions.value.length
    if (total === 0)
      return
    const current = activeOption.value < 0 ? (step > 0 ? -1 : total) : activeOption.value
    activeOption.value = (current + step + total) % total
    void nextTick(scrollActiveOption)
  }

  function selectOption(index: number): void {
    const value = timeOptions.value[index]
    if (value == null || input.isLocked())
      return
    input.commit(value)
    closeOptions()
    input.focusInput()
  }

  return { timeOptions, showsOptions, isOptionsOpen, activeOption, optionsStyle, openOptions, closeOptions, moveActive, selectOption }
}
