import type { InjectionKey } from 'vue'

/**
 * `Typeahead` 用它告诉里面的 `BaseTypeahead`：外框、边框、选中值标签和清除按钮由我来画。
 * 单独使用的 `BaseTypeahead` 拿不到它，只渲染裸输入。
 */
export const typeaheadChromeKey: InjectionKey<true> = Symbol('astryxTypeaheadChrome')

/**
 * `Typeahead` 告诉里面的 `BaseTypeahead`：输入框被值标签盖住时，dialog 菜单关闭后
 * 焦点还给哪个元素（值标签的按钮），而不是看不见的输入框。
 */
export const typeaheadFocusKey: InjectionKey<{ inputReturnTarget: () => HTMLElement | null }> = Symbol('astryxTypeaheadFocus')
