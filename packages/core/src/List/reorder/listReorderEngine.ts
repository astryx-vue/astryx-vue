/**
 * @file listReorderEngine.ts
 * @input The options of a reorderable object and the collections it is
 *   mounted on
 * @output `listReorderEngine`: the machinery a reorderable object carries.
 *   It creates one session per collection, and `start` finds the collection
 *   the object is mounted on. `mountSession` records each mount
 * @position List reorder internals. reorderable/createReorderable.ts puts it
 *   on every object it makes; ListReorderHost.vue mounts each session
 */
import type { ListReorderEngine, ListReorderOptions } from './reorderTypes.js'
import { devWarn } from '../../composables/useDevWarning.js'
import { ListReorderController } from './reorderController.js'

/** The sessions each object's options are mounted on, oldest first. */
const sessionsByOptions = new WeakMap<ListReorderOptions, ListReorderController[]>()

/** Records `controller` as mounted for `options`; returns the unmount. */
export function mountSession(options: ListReorderOptions, controller: ListReorderController): () => void {
  const sessions = sessionsByOptions.get(options) ?? []
  sessionsByOptions.set(options, [...sessions.filter(session => session !== controller), controller])
  return () => {
    const rest = (sessionsByOptions.get(options) ?? []).filter(session => session !== controller)
    if (rest.length > 0)
      sessionsByOptions.set(options, rest)
    else
      sessionsByOptions.delete(options)
  }
}

export const listReorderEngine: ListReorderEngine = {
  createSession: (getList, hintId, rows) => new ListReorderController(getList, hintId, rows),
  start: (options, key) => {
    const sessions = sessionsByOptions.get(options) ?? []
    if (sessions.length > 1) {
      devWarn(
        'createReorderable',
        '`start` was called on an object passed to more than one '
        + 'collection: it starts reorder mode in the one mounted last.',
      )
    }
    const session = sessions.at(-1)
    if (session == null || !session.startByKey(key)) {
      devWarn(
        'createReorderable',
        `\`start(${String(key)})\` found no mounted item with `
        + 'that key that can be reordered, so it did nothing.',
      )
    }
  },
}
