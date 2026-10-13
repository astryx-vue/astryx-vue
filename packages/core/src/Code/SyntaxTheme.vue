<script setup lang="ts">
import type { SyntaxThemeDefinition } from './syntaxTheme.js'
import { computed } from 'vue'
import { syntaxThemeStyle } from './syntaxTheme.js'

defineOptions({ name: 'AstryxSyntaxTheme', inheritAttrs: false })

const props = defineProps<{
  theme: SyntaxThemeDefinition
}>()

const style = computed(() => syntaxThemeStyle(props.theme))
</script>

<template>
  <div class="astryx-syntax-theme" :class="$attrs.class" :style="[style, $attrs.style as string]">
    <slot />
  </div>
</template>
