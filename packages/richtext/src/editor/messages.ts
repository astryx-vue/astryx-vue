import { useAstryxMessages } from '@astryx-vue/core'
import { computed } from 'vue'

type Dotted<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Dotted<T[K], `${P}${K}.`>
}[keyof T & string]

type CoreMessages = ReturnType<typeof useAstryxMessages>['value']

/** 编辑器和工具栏里的文案键，写成 `toolbar.bold` 这样的点分路径。 */
export type RichTextMessageKey = Dotted<CoreMessages['richTextEditor']>

export type RichTextTranslator = (key: RichTextMessageKey) => string

/**
 * 取编辑器和工具栏的文案。文案放在 core 的 `locale/messages/rich-text-editor.ts` 里，
 * 随 `<InternationalizationProvider>` 的语言切换；包本身不再自带译文。
 */
export function useRichTextMessages(): RichTextTranslator {
  const messages = useAstryxMessages()
  const table = computed(() => messages.value.richTextEditor as unknown as Record<string, unknown>)
  return (key) => {
    let node: unknown = table.value
    for (const part of key.split('.'))
      node = (node as Record<string, unknown> | undefined)?.[part]
    return typeof node === 'string' ? node : key
  }
}
