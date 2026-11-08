import type { ComputedRef } from 'vue'
import type { CalendarEvent, Instant, ScheduleEventSource } from './types.js'
import { computed, shallowRef, watch } from 'vue'

interface EventRecord {
  status: 'pending' | 'fulfilled' | 'rejected'
  promise: Promise<void>
  value: ReadonlyArray<CalendarEvent>
  error: unknown
}

const eventLoaderCache = new WeakMap<
  Exclude<ScheduleEventSource, ReadonlyArray<CalendarEvent>>,
  Map<string, EventRecord>
>()

function readAsyncEvents(
  loader: Exclude<ScheduleEventSource, ReadonlyArray<CalendarEvent>>,
  start: Instant,
  end: Instant,
  onSettle: () => void,
): EventRecord {
  let loaderCache = eventLoaderCache.get(loader)
  if (loaderCache == null) {
    loaderCache = new Map()
    eventLoaderCache.set(loader, loaderCache)
  }
  const key = `${start}:${end}`
  let record = loaderCache.get(key)
  if (record == null) {
    record = {
      status: 'pending',
      promise: Promise.resolve()
        .then(() => loader(start, end))
        .then(
          (value) => {
            if (record != null) {
              record.status = 'fulfilled'
              record.value = value
            }
          },
          (error) => {
            if (record != null) {
              record.status = 'rejected'
              record.error = error
            }
          },
        )
        .finally(onSettle),
      value: [],
      error: null,
    }
    loaderCache.set(key, record)
  }
  return record
}

export function useAsyncEvents(
  source: () => ScheduleEventSource,
  range: () => { start: Instant, end: Instant },
): ComputedRef<{ loading: boolean, events: ReadonlyArray<CalendarEvent> }> {
  const revision = shallowRef(0)
  watch(
    () => {
      const events = source()
      const { start, end } = range()
      return typeof events === 'function' ? `${start}:${end}` : 'static'
    },
    () => {
      revision.value += 1
    },
  )

  return computed(() => {
    void revision.value
    const events = source()
    if (typeof events !== 'function')
      return { loading: false, events }
    const { start, end } = range()
    const record = readAsyncEvents(events, start, end, () => {
      revision.value += 1
    })
    if (record.status === 'pending')
      return { loading: true, events: [] }
    if (record.status === 'rejected')
      throw record.error
    return { loading: false, events: record.value }
  })
}
