import { getCurrentInstance, useId } from 'vue'

/**
 * 树形表格按披露模式（disclosure）标注，不按 treegrid：表格没有在格子和行之间用方向键移动的键盘模型，
 * 声明 treegrid 等于承诺了不存在的操作方式。所以行上不带 `aria-level`、`aria-expanded`，
 * 展开状态在每个父行的展开按钮上；缩进只是视觉上的。行只带一个非 ARIA 的层级标记，
 * 让展开按钮找到自己的直接子行，用 `aria-controls` 指过去。
 */
export const TREE_LEVEL_ATTRIBUTE = 'data-tree-level'

let fallbackPrefix = 0

/** 一张树形表格的行 id 前缀。在组件外面调用插件时退回自增编号。 */
export function useTreeRowIdPrefix(): string {
  if (getCurrentInstance() != null)
    return useId()
  fallbackPrefix += 1
  return `astryx-tree-${fallbackPrefix}`
}

/**
 * 行的 DOM id：表格前缀加行自己的 id。`[A-Za-z0-9-]` 以外的字符（含 `_`）都写成 `_<十六进制码>_`，
 * 不同的行 id 一定得到不同的 DOM id。
 */
export function treeRowDomId(prefix: string, id: string): string {
  const encoded = id.replace(/[^A-Z0-9-]/giu, char => `_${char.codePointAt(0)?.toString(16)}_`)
  return `${prefix}-${encoded}`
}
