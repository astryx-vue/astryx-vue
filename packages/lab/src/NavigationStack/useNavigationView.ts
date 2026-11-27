/**
 * @file useNavigationView.ts
 * @input 栈的 `path` 和 `getKey`
 * @output useNavigationView：栈上的屏幕、正在退出的屏幕和路径变化要求的转场
 * @position NavigationStack 的视图状态。路径变化在栈重新渲染前推出转场，
 *   所以退出的屏幕在路径去掉它的那次渲染里还在。
 */

import type { ComputedRef, ShallowRef } from 'vue'
import { computed, shallowRef, watch } from 'vue'

/** 栈上的一屏。根屏幕的 `index` 是 -1，没有条目。 */
export interface ScreenModel {
  readonly key: string
  readonly entry: unknown
  readonly index: number
}

export interface Transition {
  readonly id: number
  readonly kind: 'push' | 'pop' | 'none'
  /** 转场结束时在最上面的屏幕（推入），或正在离开的屏幕（退出）。 */
  readonly top: string
  /** 它下面那一屏。 */
  readonly under: string | null
}

export interface NavigationView {
  readonly keys: string
  readonly models: readonly ScreenModel[]
  readonly leaving: ScreenModel | null
  readonly transition: Transition
}

export const ROOT_KEY = 'root'

function isPrefix(shorter: readonly ScreenModel[], longer: readonly ScreenModel[]): boolean {
  return shorter.every((model, i) => longer[i]?.key === model.key)
}

export interface UseNavigationViewReturn {
  view: ShallowRef<NavigationView>
  rendered: ComputedRef<readonly ScreenModel[]>
  topKey: ComputedRef<string>
  underKey: ComputedRef<string | null>
  depth: ComputedRef<number>
  dropLeaving: (id: number) => void
}

export function useNavigationView(
  path: () => readonly unknown[],
  getKey: () => ((entry: never, index: number) => string | number) | undefined,
): UseNavigationViewReturn {
  const models = computed<ScreenModel[]>(() => {
    const keyOf = getKey() as ((entry: unknown, index: number) => string | number) | undefined
    return [
      { key: ROOT_KEY, entry: undefined, index: -1 },
      ...path().map((entry, index) => ({
        key: `screen-${keyOf ? keyOf(entry, index) : index}`,
        entry,
        index,
      })),
    ]
  })
  const keysOf = (list: readonly ScreenModel[]): string => list.map(model => model.key).join('\u0000')
  const view = shallowRef<NavigationView>({
    keys: keysOf(models.value),
    models: models.value,
    leaving: null,
    transition: { id: 0, kind: 'none', top: models.value.at(-1)?.key ?? ROOT_KEY, under: null },
  })

  watch(models, (next) => {
    const current = view.value
    const keys = keysOf(next)
    if (keys === current.keys) {
      // 同样的屏幕，新的条目：保持最新。
      view.value = { ...current, models: next }
      return
    }
    const before = current.models
    const id = current.transition.id + 1
    let transition: Transition
    let leaving: ScreenModel | null = null
    if (next.length === before.length + 1 && isPrefix(before, next)) {
      transition = { id, kind: 'push', top: next[next.length - 1].key, under: before.at(-1)?.key ?? null }
    }
    else if (next.length < before.length && isPrefix(next, before)) {
      leaving = before[before.length - 1]
      transition = { id, kind: 'pop', top: leaving.key, under: next[next.length - 1].key }
    }
    else {
      transition = { id, kind: 'none', top: next[next.length - 1].key, under: null }
    }
    view.value = { keys, models: next, leaving, transition }
  })

  /** 退出转场 `id` 播完：把离开的屏幕拿掉。 */
  function dropLeaving(id: number): void {
    if (view.value.transition.id === id && view.value.leaving != null)
      view.value = { ...view.value, leaving: null }
  }

  const rendered = computed(() => view.value.leaving ? [...view.value.models, view.value.leaving] : view.value.models)
  const topKey = computed(() => view.value.leaving?.key ?? view.value.models.at(-1)?.key ?? ROOT_KEY)
  // 退出期间是它露出来的那一屏；其余时候是最上面一屏下面的那一屏
  // （退出播完后 `transition.under` 就是新的最上面一屏自己）。
  const underKey = computed(() =>
    view.value.leaving != null ? view.value.transition.under : (view.value.models.at(-2)?.key ?? null))
  const depth = computed(() => models.value.length - 1)

  return { view, rendered, topKey, underKey, depth, dropLeaving }
}
