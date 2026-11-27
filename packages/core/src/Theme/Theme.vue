<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ThemeProps } from './types.js'
import { computed, inject, provide, useAttrs, useTemplateRef, watch } from 'vue'
import { syntaxThemeKey } from '../Code/syntaxContext.js'
import { devWarn } from '../composables/useDevWarning.js'
import { reducedMotionMarkProps } from '../motion/reducedMotionMark.js'
import { themeContextKey, themeNestingKey } from './context.js'
import { isDefinedTheme, neutralTheme } from './defineTheme.js'
import { resolveKnobs } from './motionKnobs.js'
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
const parent = inject(themeContextKey, null)

// A value that is not a defined theme applies no theme of its own. The subtree
// keeps the theme around it, or Neutral's defaults at the root, and still takes
// this Theme's mode.
const ownTheme = computed(() => isDefinedTheme(props.theme) ? props.theme : null)
const applied = computed(() => ownTheme.value ?? parent?.value.theme ?? null)
const appliedName = computed(() => applied.value?.name ?? null)

function describeValue(value: unknown): string {
  if (typeof value === 'string')
    return `the string "${value}"`
  if (value === null)
    return 'null'
  if (typeof value === 'object')
    return 'an object that defineTheme() did not make'
  return `a value of type ${typeof value}`
}

watch(ownTheme, (theme) => {
  if (theme !== null)
    return
  const value: unknown = props.theme
  const fix = value === 'light' || value === 'dark' || value === 'system'
    ? `To set the color mode, use mode="${value}".`
    : 'Pass a theme from defineTheme() or a theme package.'
  devWarn('Theme', `\`theme\` takes a theme from defineTheme(), but got ${describeValue(value)}. ${fix} Until then, this Theme applies no theme of its own.`)
}, { immediate: true })

provide(themeNestingKey, true)
provide(themeContextKey, computed(() => ({
  theme: applied.value ?? neutralTheme,
  mode: props.mode,
})))
const syntax = computed(() => ownTheme.value?.syntax ?? parentSyntax?.value ?? null)
if (parentSyntax || ownTheme.value?.syntax)
  provide(syntaxThemeKey, syntax)

// A theme whose motion knobs reduce motion for everyone marks its root, and the
// root theme marks `<html>`, so layers teleported outside the wrapper follow.
// No public theme resolves to `'always'` yet, so the mark is never written.
const reducesMotion = computed(() => resolveKnobs(applied.value?.axes?.motion).reducedMotion === 'always')

useThemeRootSync(isNested, () => appliedName.value, () => props.mode, () => reducesMotion.value)

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
    :data-astryx-theme="appliedName ?? undefined"
    :data-astryx-color-mode="mode === 'system' ? undefined : mode"
    v-bind="reducedMotionMarkProps(reducesMotion)"
    :style="[rootStyle, attrs.style as CSSProperties]"
  >
    <ThemeStyle v-if="ownTheme?.css" :css="ownTheme.css" />
    <slot />
  </div>
</template>
