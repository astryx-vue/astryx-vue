<script setup lang="ts">
import type { ComponentIconSlotName, ResolvedComponentIcon } from './componentIcons.js'
import type { IconVariant } from './themeIcons.js'
import type { IconColor } from './types.js'
import { computed, inject } from 'vue'
import { themeContextKey } from '../Theme/context.js'
import { resolveComponentIcon } from './componentIcons.js'
import Icon from './Icon.vue'

defineOptions({ name: 'AstryxComponentIcon' })

const props = defineProps<{
  /** The slot this icon fills, such as `code-block-copy`. */
  iconSlot: ComponentIconSlotName
  /** The state the slot passes to a theme's slot function. */
  state?: unknown
  /** What the component draws when the theme maps nothing. */
  fallback: ResolvedComponentIcon
  color?: IconColor
}>()

const context = inject(themeContextKey, null)

// The nearest theme's `componentIcons[iconSlot]` adjusts the fallback; the result
// renders through Icon, so the theme's `icons` still choose the artwork.
const resolved = computed(() => resolveComponentIcon(props.iconSlot, props.state, props.fallback, context?.value.theme))
// Resolution keeps only a variant the nearest theme lists.
const variant = computed(() => resolved.value.variant as IconVariant | undefined)
</script>

<template>
  <Icon
    v-if="resolved.icon != null"
    :icon="resolved.icon"
    :variant="variant"
    :size="resolved.size"
    :color="color"
  />
</template>
