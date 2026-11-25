import type { ComputedRef, Ref } from 'vue'
import type { PowerSearchFilter } from './types.js'
import { computed } from 'vue'

interface OpenSession {
  mode: 'create' | 'edit'
  index: number
}

export interface UseFilterTokenNamingOptions {
  /** 拼名称元素 id 用的前缀，一般是输入框 id。 */
  idPrefix: () => string
  session: Ref<OpenSession | null>
  filters: Readonly<Ref<readonly PowerSearchFilter[]>>
  /** 这个条件用内置的 PowerSearchToken 渲染（没有被 `token` 插槽或 `components` 换掉）。 */
  isBuiltIn: (filter: PowerSearchFilter) => boolean
  /** 点这个条件会打开编辑器（而不是直接提交）。 */
  opensEditor: (filter: PowerSearchFilter) => boolean
}

export interface UseFilterTokenNamingReturn {
  /** 摊到内置 PowerSearchToken 上的 `nameId`、`opensEditor`、`expanded`。 */
  tokenProps: (filter: PowerSearchFilter, index: number) => Record<string, unknown>
  /** 摊到编辑器外层的 `role` 和 `aria-labelledby`。 */
  editorAttrs: ComputedRef<Record<string, string | undefined>>
}

/**
 * 内置筛选标签的弹层状态和编辑器名称。
 *
 * 标签按钮带 `aria-haspopup="dialog"` 和 `aria-expanded`，编辑器是一个以标签全部可见文字
 * 命名的非模态对话框。换掉了标签的调用方自己命名，编辑器保持普通浮层。
 */
export function useFilterTokenNaming(options: UseFilterTokenNamingOptions): UseFilterTokenNamingReturn {
  function nameId(index: number): string {
    return `${options.idPrefix()}-token-${index}-name`
  }

  function tokenProps(filter: PowerSearchFilter, index: number): Record<string, unknown> {
    const session = options.session.value
    return {
      nameId: nameId(index),
      opensEditor: options.opensEditor(filter),
      expanded: session?.mode === 'edit' && session.index === index,
    }
  }

  const editorAttrs = computed<Record<string, string | undefined>>(() => {
    const session = options.session.value
    const filter = session?.mode === 'edit' ? options.filters.value[session.index] : undefined
    if (session == null || filter == null || !options.isBuiltIn(filter))
      return {}
    return { 'role': 'dialog', 'aria-labelledby': nameId(session.index) }
  })

  return { tokenProps, editorAttrs }
}
