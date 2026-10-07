import type { ComputedRef, Ref } from 'vue'
import type { TextAreaChangeAction, TextAreaChangeEvent } from './types.js'
import { computed, shallowRef, watch } from 'vue'

interface TextAreaActionOptions {
  model: Ref<string>
  changeAction: () => TextAreaChangeAction | undefined
  emitChange: (value: string, event: TextAreaChangeEvent) => void
  emitError: (error: unknown, value: string, event: TextAreaChangeEvent) => void
}

export function useTextAreaAction(options: TextAreaActionOptions): {
  commit: (value: string, event: Event) => void
  value: ComputedRef<string>
  isPending: ComputedRef<boolean>
} {
  const optimistic = shallowRef<string | null>(null)
  const pendingCount = shallowRef(0)
  let revision = 0

  watch(options.model, () => {
    optimistic.value = null
  })

  function commit(value: string, event: Event): void {
    const current = ++revision
    const changeEvent: TextAreaChangeEvent = new CustomEvent('change', { cancelable: true, detail: { value, originalEvent: event } })
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
