/**
 * 浮层的呈现保持（上游 Layer/presentationHold.ts）。
 *
 * 能用不止一种方式呈现的浮层（手机上是底部弹层的浮层、触屏长出和指针进场），
 * 在打开那一刻做选择；关闭动画必须用同一种呈现播完，哪怕中途条件变了（手机
 * 转过了紧凑宽度、换了指针）。这里只做一件事：打开时记下选择，一直保持到组件
 * 说关闭已经结束（底部弹层退场播完、浮层卸载）再放开。什么时候算结束由组件
 * 决定，这里不管时机。
 *
 * 和输入遮挡（inputHold.ts）不是一回事：那个是在呈现动画期间挡住输入。
 */
import type { ComputedRef, MaybeRefOrGetter, ShallowRef } from 'vue'
import { computed, shallowRef, toValue, watch } from 'vue'

/** 命令式的呈现保持，给在打开事件里做选择的代码用。 */
export interface PresentationHold<P> {
  /** 记下打开时的选择，替换掉之前保持的。 */
  take: (presentation: P) => void
  /** 保持中的选择；没有保持时是 undefined。 */
  current: () => P | undefined
  /** 是否有保持中的选择。 */
  isHeld: () => boolean
  /** 放开保持（关闭已经结束）。 */
  release: () => void
}

export function createPresentationHold<P>(): PresentationHold<P> {
  let held: { readonly value: P } | null = null
  return {
    take(presentation) {
      held = { value: presentation }
    },
    current: () => held?.value,
    isHeld: () => held != null,
    release() {
      held = null
    },
  }
}

export interface PresentationHoldState<P> {
  /** 保持中的选择；没有保持时是 null。 */
  readonly presentation: ComputedRef<P | null>
  /** 从打开那次渲染起为 true，直到 `release()`。 */
  readonly isHeld: ComputedRef<boolean>
  /** 放开保持（关闭已经结束）。 */
  readonly release: () => void
}

/**
 * 响应式的呈现保持：`isOpen` 变成 true 的那一刻记下当时的 `presentation`，
 * 之后无论 `presentation` 变成什么都保持不变，直到 `release()`。
 */
export function usePresentationHold<P>(options: {
  isOpen: MaybeRefOrGetter<boolean>
  presentation: MaybeRefOrGetter<P>
}): PresentationHoldState<P> {
  const held: ShallowRef<{ readonly value: P } | null> = shallowRef(null)

  function takeIfOpening(): void {
    if (toValue(options.isOpen) && held.value == null)
      held.value = { value: toValue(options.presentation) }
  }

  watch(() => toValue(options.isOpen), takeIfOpening, { immediate: true })

  const current = computed(() => {
    if (held.value != null)
      return held.value
    return toValue(options.isOpen) ? { value: toValue(options.presentation) } : null
  })

  function release(): void {
    held.value = null
    // 关闭还没结束时又打开了：这次打开重新记下当时的选择。
    takeIfOpening()
  }

  return {
    presentation: computed(() => current.value?.value ?? null),
    isHeld: computed(() => current.value != null),
    release,
  }
}
