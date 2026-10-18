import type { Component, ComputedRef, MaybeRefOrGetter } from 'vue'
import type { FieldStatusInput } from '../Field/types.js'
import { computed, toValue } from 'vue'
import FieldIcon from '../Field/FieldIcon.vue'
import FieldInfoTip from '../Field/FieldInfoTip.vue'

/** 状态图标相对输入框的位置。 */
export type InputStatusVariant = 'attached' | 'detached' | 'tooltip'

export interface UseInputStatusIconOptions {
  /** 输入框的状态（类型加文案），没有状态就不传。 */
  status?: MaybeRefOrGetter<FieldStatusInput | undefined>
  /**
   * 状态相对输入框怎么摆。`attached` 在框里画一个图标，`detached` 交给下面的
   * 状态文案自己带图标，`tooltip` 画一个能用键盘够到的信息按钮。
   * @default 'attached'
   */
  statusVariant?: MaybeRefOrGetter<InputStatusVariant>
  /**
   * 输入框是否在 `InputGroup` 里，组自己会画状态。
   * @default false
   */
  isInGroup?: MaybeRefOrGetter<boolean>
}

export interface UseInputStatusIconReturn {
  /**
   * 要渲染在输入框容器里的东西：`FieldIcon`（普通图标），或者 `FieldInfoTip`
   * （带 tooltip 的信息按钮）。没有该画的东西时是 `null`。
   * 和 `statusIconProps` 一起用：`<component :is="statusIcon" v-bind="statusIconProps" />`。
   */
  statusIcon: ComputedRef<Component | null>
  /** 上面那个组件要的属性。 */
  statusIconProps: ComputedRef<Record<string, unknown>>
}

/**
 * 对应原版 Astryx 的 `hooks/useInputStatusIcon`。
 *
 * 决定输入框上那颗状态图标画什么，让同一状态下所有输入框长得一样：
 * `attached` 画一个不说话的图标，文案留给下面的状态栏；`detached` 什么都不画，
 * 因为状态栏自己带了图标；`tooltip` 画一个真按钮，键盘、鼠标、触摸、读屏都能
 * 摸到它的说明。在 `InputGroup` 里也不画，组自己会画。
 *
 * 上游还会返回一个 `describedBy`，用来接进输入框的 `aria-describedby`。
 * 我们这边 `Field` 已经把状态文案渲染成视觉隐藏文本并接进 `aria-describedby` 了，
 * tooltip 按钮自己也带着 `aria-describedby`，所以不需要再返回一个 id。
 */
export function useInputStatusIcon(options: UseInputStatusIconOptions = {}): UseInputStatusIconReturn {
  const hasStatus = computed(() => toValue(options.status) != null)

  const statusIcon = computed<Component | null>(() => {
    if (!hasStatus.value)
      return null
    if (toValue(options.isInGroup ?? false))
      return null
    const variant = toValue(options.statusVariant ?? 'attached')
    if (variant === 'detached')
      return null
    const status = toValue(options.status)
    if (variant === 'tooltip' && status?.message)
      return FieldInfoTip
    return FieldIcon
  })

  const statusIconProps = computed<Record<string, unknown>>(() => {
    const status = toValue(options.status)
    if (status == null)
      return {}
    if (toValue(options.statusVariant ?? 'attached') === 'tooltip' && status.message)
      return { text: status.message, type: status.type }
    return { type: status.type }
  })

  return { statusIcon, statusIconProps }
}
