import type { ComputedRef, Ref } from 'vue'
import type { TextInputChangeAction, TextInputChangeEvent } from './types.js'
import { computed, shallowRef, watch } from 'vue'

interface TextInputActionOptions {
  model: Ref<string>
  changeAction: () => TextInputChangeAction | undefined
  emitChange: (value: string, event: TextInputChangeEvent) => void
  emitError: (error: unknown, value: string, event: TextInputChangeEvent) => void
}

export function useTextInputAction(options: TextInputActionOptions): {
  commit: (value: string, event: Event) => void
  value: ComputedRef<string>
  isPending: ComputedRef<boolean>
} {
  const optimistic = shallowRef<string | null>(null)
  const pendingCount = shallowRef(0)
  let revision = 0

  // An explicit parent update always wins over a locally optimistic value.
  watch(options.model, () => {
    optimistic.value = null
  })

  function commit(value: string, event: Event): void {
    const current = ++revision
    // Native input events are not cancelable; this component event always is.
    const changeEvent: TextInputChangeEvent = new CustomEvent('change', { cancelable: true, detail: { value, originalEvent: event } })
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
