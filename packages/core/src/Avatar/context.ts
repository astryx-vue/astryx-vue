import type { ComputedRef, InjectionKey, Ref } from 'vue'
import { defineLayerScopedKey } from '../layer/scopedProvide.js'

/**
 * 头像换算出来的像素尺寸。子组件（例如 `AvatarStatusDot`）靠它把自身大小
 * 跟着头像走，所以这里给的是响应式的值：给快照会冻住第一次读到的尺寸。
 *
 * 没有住在任何头像里时取默认的 36，和默认尺寸 `md` 一致。
 */
export const AvatarSizeContext = defineLayerScopedKey<ComputedRef<number> | null>('AvatarSizeContext', null)

/**
 * 状态元素往外层头像报自己读屏名字的入口。
 *
 * 头像根元素是 `role="img"`，子节点的语义会被剪掉，所以状态名字只能拼进头像
 * 自己的无障碍名称里才到得了辅助技术（WCAG 4.1.2）。状态点在自己的 setup 里
 * 往这个 ref 写 `label`，卸载时清空；头像那边用 computed 直接读，不用额外的
 * 状态和事件。
 *
 * 一个头像只有一个 status 插槽，所以这里只留一格：多个状态点同时上报时最后
 * 一个生效。
 */
export const AvatarStatusLabelContext: InjectionKey<Ref<string | undefined>> = Symbol('AvatarStatusLabelContext')
