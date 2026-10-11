import type { ComputedRef } from 'vue'
import { useAstryxLocale } from '@astryx-vue/core/locale'
import { computed } from 'vue'

export interface DemoText {
  isEnglish: ComputedRef<boolean>
  pick: (zh: string, en: string) => string
}

export function useDemoText(): DemoText {
  const locale = useAstryxLocale()
  const isEnglish = computed(() => locale.value === 'en')

  function pick(zh: string, en: string): string {
    return isEnglish.value ? en : zh
  }

  return { isEnglish, pick }
}

export function useLocalizedOptions(items: readonly { en: string, value: string, zh: string }[]): ComputedRef<{ label: string, value: string }[]> {
  const { pick } = useDemoText()
  return computed(() => items.map(item => ({
    label: pick(item.zh, item.en),
    value: item.value,
  })))
}
