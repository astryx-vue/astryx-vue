import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { ParseOutlineFromMarkdownOptions } from './parseOutlineFromMarkdown.js'
import type { OutlineItem } from './types.js'
import { computed, toValue } from 'vue'
import { parseOutlineFromMarkdown } from './parseOutlineFromMarkdown.js'

/** 正文或插件一变，目录跟着变。 */
export function useOutlineFromMarkdown(
  markdown: MaybeRefOrGetter<string>,
  options?: MaybeRefOrGetter<ParseOutlineFromMarkdownOptions | undefined>,
): ComputedRef<OutlineItem[]> {
  return computed(() => parseOutlineFromMarkdown(toValue(markdown), toValue(options)))
}
