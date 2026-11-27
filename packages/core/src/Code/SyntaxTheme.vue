<script setup lang="ts">
import type { SyntaxThemeDefinition } from './syntaxTheme.js'
import { computed, provide } from 'vue'
import { devPropError, isDevBuild } from '../composables/internal/devBuild.js'
import { syntaxThemeKey } from './syntaxContext.js'
import { syntaxThemeStyle } from './syntaxTheme.js'

defineOptions({ name: 'AstryxSyntaxTheme', inheritAttrs: false })

const props = defineProps<{
  theme: SyntaxThemeDefinition
}>()

if (isDevBuild() && props.theme == null) {
  throw devPropError(
    'SyntaxTheme',
    'theme',
    'is required: a theme from defineSyntaxTheme(), for example <SyntaxTheme :theme="myTheme">.',
  )
}

const style = computed(() => syntaxThemeStyle(props.theme))
provide(syntaxThemeKey, computed(() => props.theme))
</script>

<template>
  <div
    class="astryx-syntax-theme"
    :class="$attrs.class"
    :data-astryx-syntax-theme="theme.name"
    :style="[style, $attrs.style as string]"
  >
    <slot />
  </div>
</template>
