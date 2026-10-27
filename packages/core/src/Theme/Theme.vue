<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ThemeProps } from './types.js'
import { computed, inject, provide, useAttrs, useTemplateRef } from 'vue'
import { syntaxThemeKey } from '../Code/syntaxContext.js'
import { themeContextKey, themeNestingKey } from './context.js'
import { ThemeStyle } from './themeStyleTag.js'
import { useThemeRootSync } from './useThemeRootSync.js'
import '../../styles/theme.css'

defineOptions({ name: 'AstryxTheme', inheritAttrs: false })

const props = withDefaults(defineProps<ThemeProps>(), {
  mode: 'system',
})

const attrs = useAttrs()
const root = useTemplateRef<HTMLElement>('root')
const isNested = inject(themeNestingKey, false)

const parentSyntax = inject(syntaxThemeKey, null)

provide(themeNestingKey, true)
provide(themeContextKey, computed(() => ({
  theme: props.theme,
  mode: props.mode,
})))
if (parentSyntax || props.theme.syntax)
  provide(syntaxThemeKey, computed(() => props.theme.syntax ?? parentSyntax?.value ?? null))

useThemeRootSync(isNested, () => props.theme.name, () => props.mode)

const colorScheme = computed(() => {
  if (props.mode === 'dark')
    return 'dark'
  if (props.mode === 'light')
    return 'light'
  return 'light dark'
})

const rootStyle = computed<CSSProperties>(() => ({
  colorScheme: colorScheme.value,
}))

defineExpose({ element: root })
</script>

<template>
  <div
    ref="root"
    class="astryx-theme"
    :class="attrs.class"
    :data-astryx-theme="theme.name"
    :data-astryx-color-mode="mode === 'system' ? undefined : mode"
    :style="[rootStyle, attrs.style as CSSProperties]"
  >
    <ThemeStyle v-if="theme.css" :css="theme.css" />
    <slot />
  </div>
</template>
