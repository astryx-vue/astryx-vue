import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { CheckboxInputChangeAction, CheckboxInputChangeEvent, CheckboxValue } from './types.js'
import { computed, shallowRef, watch } from 'vue'

interface CheckboxActionOptions {
  model: Ref<CheckboxValue>
  changeAction: () => CheckboxInputChangeAction | undefined
  emitChange: (value: boolean, event: CheckboxInputChangeEvent) => void
  emitError: (error: unknown, value: boolean, event: CheckboxInputChangeEvent) => void
}

export function useCheckboxAction(options: CheckboxActionOptions): { value: ComputedRef<CheckboxValue>, isPending: ShallowRef<boolean>, commit: (value: boolean, event: Event) => void } {
  const optimistic = shallowRef<boolean | null>(null)
  const isPending = shallowRef(false)
  watch(options.model, () => {
    optimistic.value = null
  })

  function commit(value: boolean, originalEvent: Event): void {
    const event: CheckboxInputChangeEvent = new CustomEvent('change', { cancelable: true, detail: { value, originalEvent } })
    if (originalEvent.defaultPrevented)
      event.preventDefault()
    optimistic.value = value
    options.model.value = value
    options.emitChange(value, event)
    const action = options.changeAction()
    if (!action || event.defaultPrevented) {
      optimistic.value = null
      return
    }
    isPending.value = true
    const finish = (): void => {
      isPending.value = false
      optimistic.value = null
    }
    try {
      const result = action(value, event)
      if (result == null) {
        finish()
        return
      }
      void Promise.resolve(result).then(finish, (error: unknown) => {
        finish()
        options.emitError(error, value, event)
      })
    }
    catch (error) {
      finish()
      options.emitError(error, value, event)
    }
  }

  return { value: computed(() => optimistic.value ?? options.model.value), isPending, commit }
}
