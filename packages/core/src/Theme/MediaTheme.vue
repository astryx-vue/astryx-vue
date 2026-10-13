<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { MediaThemeProps } from './types.js'
import { computed, inject, provide, useAttrs, useTemplateRef } from 'vue'
import { mediaThemeKey, themeContextKey } from './context.js'
import { bridgeSurfaceTokens } from './themeStyle.js'
import { useAutoMediaMode } from './useAutoMediaMode.js'
import '../../styles/media-theme.css'

defineOptions({ name: 'AstryxMediaTheme', inheritAttrs: false })

const props = withDefaults(defineProps<MediaThemeProps>(), {
  fallback: 'dark',
})

const attrs = useAttrs()
const root = useTemplateRef<HTMLElement>('root')
const theme = inject(themeContextKey, null)
const detected = useAutoMediaMode(root, computed(() => props.mode === 'auto'))

const resolved = computed<'dark' | 'light' | 'off'>(() => {
  if (props.mode === 'off')
    return 'off'
  if (props.mode === 'auto')
    return detected.value ?? props.fallback
  return props.mode
})

provide(mediaThemeKey, resolved)

const rootStyle = computed<CSSProperties>(() => {
  const surface = resolved.value === 'dark'
    ? theme?.value.theme.onDark
    : resolved.value === 'light'
      ? theme?.value.theme.onLight
      : undefined
  if (!surface)
    return {}
  return bridgeSurfaceTokens(surface)
})

defineExpose({ element: root })
</script>

<template>
  <div
    ref="root"
    class="astryx-media-theme"
    :class="attrs.class"
    :data-astryx-media="resolved === 'off' ? undefined : resolved"
    :style="[rootStyle, attrs.style as CSSProperties]"
  >
    <slot />
  </div>
</template>
