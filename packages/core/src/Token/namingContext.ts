import type { InjectionKey, Ref } from 'vue'

/**
 * 包一层 Token 的内部组件（PowerSearch 的筛选标签）用它给 Token 换名字。
 * 这类标签的可见文字比 `label` 长（值放在 `end` 插槽里），按钮和删除按钮
 * 都要按全部可见文字命名。不从包里导出。
 */
export interface TokenNaming {
  /** 可点击 token 内层按钮的名称。调用方给了 `aria-labelledby` 时不用它。 */
  actionName?: string
  /** 删除按钮名称里代替 `label` 的那段文字，「移除」这个词仍来自语言包。 */
  removeName?: string
}

export const tokenNamingKey: InjectionKey<Readonly<Ref<TokenNaming>>> = Symbol('astryx-token-naming')
