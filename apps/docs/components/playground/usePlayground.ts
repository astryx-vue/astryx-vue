import type { ComputedRef, Ref } from 'vue'
import type { PlaygroundCopy } from './messages'
import type { PlaygroundLocale } from './protocol'
import type { PlaygroundTemplate } from './templates'
import type { DensityPreset, ThemeColorKey, ThemeState } from './theme'
import { computed, onMounted, reactive, ref } from 'vue'
import { DEFAULT_PLAYGROUND_CODE } from './defaultCode'
import { playgroundCopy } from './messages'
import { decodeShare, encodeShare, shareHash } from './share'
import { playgroundTemplates } from './templates'
import { applyDensity, applyTheme, cloneTheme, createNeutralTheme, setThemeColor, themesEqual } from './theme'

export interface PlaygroundController {
  copy: PlaygroundCopy
  templates: PlaygroundTemplate[]
  theme: ThemeState
  code: Ref<string>
  templateId: Ref<string>
  hydrated: Ref<boolean>
  mountId: Ref<number>
  shareUrl: Ref<string>
  isNeutral: ComputedRef<boolean>
  loadTemplate: (id: string) => Promise<void>
  resetTheme: () => Promise<void>
  reloadPreview: () => void
  setColor: (key: ThemeColorKey, value: string) => void
  selectDensity: (id: DensityPreset['id']) => void
  buildShareUrl: () => Promise<string>
}

export function usePlayground(
  locale: PlaygroundLocale,
  ask: (kind: 'template' | 'theme') => Promise<boolean>,
): PlaygroundController {
  const copy = playgroundCopy(locale)
  const templates = playgroundTemplates(locale)

  const theme = reactive<ThemeState>(createNeutralTheme())
  const code = ref(DEFAULT_PLAYGROUND_CODE)
  const templateId = ref('')
  const hydrated = ref(false)
  const mountId = ref(0)
  const shareUrl = ref('')

  const isNeutral = computed(() => themesEqual(theme, createNeutralTheme()))

  onMounted(() => {
    void hydrate()
  })

  async function hydrate(): Promise<void> {
    try {
      const shared = await decodeShare(window.location.hash)
      if (shared) {
        applyTheme(theme, shared.theme)
        code.value = shared.code
        templateId.value = shared.templateId && templates.some(item => item.id === shared.templateId)
          ? shared.templateId
          : ''
      }
      else {
        // VitePress resolves `appearance` plus localStorage
        // `vitepress-theme-appearance` onto `html.dark` before paint.
        // Seed the preview once from that. The toolbar owns it afterwards.
        theme.dark = document.documentElement.classList.contains('dark')
        const fromQuery = new URLSearchParams(window.location.search).get('template')
        const match = fromQuery ? templates.find(item => item.id === fromQuery) : undefined
        if (match) {
          code.value = match.source
          templateId.value = match.id
        }
      }
    }
    finally {
      hydrated.value = true
    }
  }

  async function loadTemplate(id: string): Promise<void> {
    const next = templates.find(item => item.id === id)
    if (!next)
      return
    if (next.source !== code.value) {
      const confirmed = await ask('template')
      if (!confirmed)
        return
    }
    code.value = next.source
    templateId.value = next.id
  }

  async function resetTheme(): Promise<void> {
    if (!isNeutral.value) {
      const confirmed = await ask('theme')
      if (!confirmed)
        return
    }
    const dark = theme.dark
    applyTheme(theme, createNeutralTheme())
    theme.dark = dark
  }

  function reloadPreview(): void {
    mountId.value += 1
  }

  function setColor(key: ThemeColorKey, value: string): void {
    setThemeColor(theme, key, value)
  }

  function selectDensity(id: Parameters<typeof applyDensity>[1]): void {
    applyDensity(theme, id)
  }

  async function buildShareUrl(): Promise<string> {
    const encoded = await encodeShare({
      v: 1,
      templateId: templateId.value,
      code: code.value,
      theme: cloneTheme(theme),
    })
    const url = new URL(window.location.href)
    url.hash = shareHash(encoded)
    if (url.href.length < 100_000)
      window.history.replaceState(window.history.state, '', url)
    shareUrl.value = url.href
    return url.href
  }

  return {
    copy,
    templates,
    theme,
    code,
    templateId,
    hydrated,
    mountId,
    shareUrl,
    isNeutral,
    loadTemplate,
    resetTheme,
    reloadPreview,
    setColor,
    selectDensity,
    buildShareUrl,
  }
}
