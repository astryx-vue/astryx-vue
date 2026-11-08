import type { Ref } from 'vue'
import type { Instant } from './types.js'
import { onMounted, onScopeDispose, shallowRef } from 'vue'

const UPDATE_INTERVAL_MS = 60 * 1000
const listeners = new Set<() => void>()
let interval: ReturnType<typeof setInterval> | null = null
let currentTime = 0 as Instant

function getSnapshot(): Instant {
  return currentTime
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  if (interval == null) {
    currentTime = Date.now()
    interval = setInterval(() => {
      currentTime = Date.now()
      listeners.forEach(active => active())
    }, UPDATE_INTERVAL_MS)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && interval != null) {
      clearInterval(interval)
      interval = null
    }
  }
}

/** 客户端每分钟走一格。服务端和挂载前是 0，这时不画「现在」线。 */
export function useCurrentTime(): Ref<Instant> {
  const time = shallowRef<Instant>(0)
  onMounted(() => {
    const stop = subscribe(() => {
      time.value = getSnapshot()
    })
    time.value = getSnapshot()
    onScopeDispose(stop)
  })
  return time
}
