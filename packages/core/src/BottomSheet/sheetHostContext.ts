import type { InjectionKey, Ref } from 'vue'

/**
 * 面板内容里再写的面板（或切换器）只在外面那张打开时才呈现：外面那张关了它跟着离开，
 * 自己的状态还开着的话，外面那张回来时它也回来。它的状态始终是使用者的，这里从不写它。
 */
export interface BottomSheetHostContext {
  /** 外面那张面板现在是否打开（切换器里就是这一步是否是当前那步）。 */
  isOpen: Readonly<Ref<boolean>>
}

export const bottomSheetHostKey: InjectionKey<BottomSheetHostContext | null> = Symbol('astryx-bottom-sheet-host')
