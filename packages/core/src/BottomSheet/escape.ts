import type { InjectionKey } from 'vue'

/**
 * 下面那张独立底部弹层能不能用 Escape（以及平台的关闭请求）关掉。
 * Popover 的底部弹层呈现用它把 `hasEscapeDismiss` 传进去：轻点外面、向下轻扫照样
 * 能关，Escape 可以单独关掉。单独用的 BottomSheet 读默认值 true，`purpose` 的规则
 * 不变；弹层自己再给里面提供 true，嵌套在里面的弹层从「允许」重新开始。
 */
export const bottomSheetEscapeKey: InjectionKey<() => boolean> = Symbol('astryx-bottom-sheet-escape')
