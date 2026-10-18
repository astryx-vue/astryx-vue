import type { InjectionKey } from 'vue'

/**
 * `Typeahead` 用它告诉里面的 `BaseTypeahead`：外框、边框、选中值标签和清除按钮由我来画。
 * 单独使用的 `BaseTypeahead` 拿不到它，只渲染裸输入。
 */
export const typeaheadChromeKey: InjectionKey<true> = Symbol('astryxTypeaheadChrome')
