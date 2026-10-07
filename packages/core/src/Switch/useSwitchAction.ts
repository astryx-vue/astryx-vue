import type { ComputedRef, Ref } from 'vue'
import type { SwitchChangeAction, SwitchChangeEvent } from './types.js'
import { computed, shallowRef, watch } from 'vue'

interface SwitchActionOptions {
  model: Ref<boolean>
  changeAction: () => SwitchChangeAction | undefined
  emitChange: (value: boolean, event: SwitchChangeEvent) => void
  emitError: (error: unknown, value: boolean, event: SwitchChangeEvent) => void
}

export function useSwitchAction(options: SwitchActionOptions): {
  commit: (value: boolean, event: Event) => void
  value: ComputedRef<boolean>
  isPending: ComputedRef<boolean>
} {
  const optimistic = shallowRef<boolean | null>(null)
  const pendingCount = shallowRef(0)
  let revision = 0

  watch(options.model, () => {
    optimistic.value = null
  })

  function commit(value: boolean, event: Event): void {
    const current = ++revision
    const changeEvent: SwitchChangeEvent = new CustomEvent('change', { cancelable: true, detail: { value, originalEvent: event } })
    if (event.defaultPrevented)
      changeEvent.preventDefault()
    optimistic.value = value
    options.model.value = value
    options.emitChange(value, changeEvent)
    const action = options.changeAction()
    if (!action || changeEvent.defaultPrevented) {
      optimistic.value = null
      return
    }

    pendingCount.value += 1
    const finish = (): void => {
      pendingCount.value -= 1
      if (current === revision)
        optimistic.value = null
    }
    try {
      const result = action(value, changeEvent)
      if (result == null) {
        finish()
        return
      }
      void Promise.resolve(result).then(finish, (error: unknown) => {
        finish()
        options.emitError(error, value, changeEvent)
      })
    }
    catch (error) {
      finish()
      options.emitError(error, value, changeEvent)
    }
  }

  return {
    commit,
    value: computed(() => optimistic.value ?? options.model.value),
    isPending: computed(() => pendingCount.value > 0),
  }
}
