import type { ComputedRef } from 'vue'
import type { ButtonClickAction } from './types.js'
import { computed, shallowRef } from 'vue'

interface UseButtonActionOptions {
  clickAction: () => ButtonClickAction | undefined
  emitClick: (event: MouseEvent) => void
  isDisabled: ComputedRef<boolean>
  isInterruptible: ComputedRef<boolean>
  isLoading: ComputedRef<boolean>
}

interface UseButtonActionReturn {
  handleClick: (event: MouseEvent) => Promise<void> | void
  isPending: ComputedRef<boolean>
}

export function useButtonAction({
  clickAction,
  emitClick,
  isDisabled,
  isInterruptible,
  isLoading,
}: UseButtonActionOptions): UseButtonActionReturn {
  const pendingCount = shallowRef(0)
  const isPending = computed(() => pendingCount.value > 0)

  function finishAction(): void {
    pendingCount.value = Math.max(0, pendingCount.value - 1)
  }

  function handleClick(event: MouseEvent): Promise<void> | void {
    const isActionBlocked = isDisabled.value
      || ((isLoading.value || isPending.value) && !isInterruptible.value)

    if (isActionBlocked) {
      event.preventDefault()
      return
    }

    emitClick(event)

    const action = clickAction()
    if (action == null || event.defaultPrevented)
      return

    pendingCount.value += 1

    try {
      const result = action(event)

      if (result == null) {
        finishAction()
        return
      }

      return Promise.resolve(result).finally(finishAction)
    }
    catch (error) {
      finishAction()
      throw error
    }
  }

  return {
    handleClick,
    isPending,
  }
}
