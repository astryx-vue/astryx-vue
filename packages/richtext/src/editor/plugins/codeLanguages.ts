import type { CodeLanguage } from '@astryx-vue/core'

/** 列出的语言值里，标识符包含 `word` 的那个；后面的条目优先。 */
export function listedLanguage(
  languages: ReadonlyArray<CodeLanguage> | undefined,
  word: string,
): CodeLanguage | undefined {
  if (languages == null)
    return undefined
  for (let i = languages.length - 1; i >= 0; i--) {
    if (languages[i]!.identifiers.includes(word))
      return languages[i]
  }
  return undefined
}
