<script setup lang="ts">
import type { RichTextIconName } from './icons.js'
import { Icon, useSemanticIcon } from '@astryx-vue/core'
import { computed } from 'vue'
import { builtInIcon, RICHTEXT_ICON_KEYS } from './icons.js'

defineOptions({ name: 'AstryxRichTextToolbarIcon' })

const props = defineProps<{
  name: RichTextIconName
  /** 撤销、重做这类带方向的图标，从右往左排版时要镜像。 */
  isDirectional?: boolean
}>()

// 主题通过 `defineTheme({ icons: { 'richtext:bold': 'lucide:bold' } })` 换掉这个键；
// 没换就用包内自带的图形。
const themed = useSemanticIcon(() => RICHTEXT_ICON_KEYS[props.name])
const Fallback = computed(() => builtInIcon(props.name))
</script>

<template>
  <span class="astryx-richtext-toolbar__glyph" :data-directional="isDirectional || undefined" aria-hidden="true">
    <Icon v-if="themed" :name="themed" size="sm" />
    <component :is="Fallback" v-else />
  </span>
</template>
