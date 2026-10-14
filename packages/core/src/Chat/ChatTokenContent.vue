<script setup lang="ts">
import type { VNode } from 'vue'
import type { ChatComposerToken } from './types.js'
import { computed } from 'vue'
import Badge from '../Badge/Badge.vue'
import Icon from '../Icon/Icon.vue'
import { isCustomToken } from './tokens.js'

const props = defineProps<{ token: ChatComposerToken }>()

const custom = computed(() => isCustomToken(props.token) ? props.token : undefined)
const badge = computed(() => isCustomToken(props.token) ? undefined : props.token)
const view = computed(() => {
  const render = custom.value?.render
  if (!render)
    return undefined
  return { render: (): VNode => render() }
})
const iconName = computed(() => {
  const icon = badge.value?.icon
  return icon?.includes(':') ? icon : undefined
})
const glyph = computed(() => {
  const icon = badge.value?.icon
  return icon && !icon.includes(':') ? icon : undefined
})
</script>

<template>
  <component :is="view" v-if="view" />
  <Badge
    v-else-if="badge"
    :label="badge.label ?? badge.value"
    :variant="badge.variant"
  >
    <template v-if="iconName || glyph" #icon>
      <Icon v-if="iconName" :name="iconName" />
      <Icon v-else :icon="glyph" />
    </template>
  </Badge>
</template>
