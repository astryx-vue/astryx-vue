import type { Ref } from 'vue'
import { computed, ref } from 'vue'

export interface PendingChange<T> {
  busy: Readonly<Ref<boolean>>
  run: (value: T) => Promise<void>
}

/**
 * Runs a change action after the value is already committed.
 * Overlapping calls stay busy until the last one settles.
 */
export function usePendingChange<T>(action: () => ((value: T) => void | Promise<void>) | undefined): PendingChange<T> {
  const pending = ref(0)

  async function run(value: T): Promise<void> {
    const next = action()
    if (!next)
      return
    pending.value += 1
    try {
      await next(value)
    }
    catch {
      // The value is already committed. A failed action must not leave the field busy.
    }
    finally {
      pending.value -= 1
    }
  }

  return {
    busy: computed(() => pending.value > 0),
    run,
  }
}
