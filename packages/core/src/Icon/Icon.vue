<script setup lang="ts">
import type { Component } from 'vue'
import type { IconProps, IconSize, IconSlots } from './types.js'
import { computed, useId } from 'vue'
import { useIconDefaultSize } from './context.js'
import { iconGlyphSlug, isIconGlyph } from './glyphs.js'
import { getIcon, warnMissingIcon } from './registry.js'
import { renderIconMarkup } from './svg.js'
import '../../styles/icon.css'

defineOptions({ name: 'AstryxIcon' })

const props = withDefaults(defineProps<IconProps>(), {
  color: 'inherit',
})

defineSlots<IconSlots>()

const inheritedSize = useIconDefaultSize()
const idPrefix = `i${useId().replace(/\W/g, '')}-`

const hasName = computed(() => props.name != null && props.name !== '')

const resolvedSize = computed<IconSize | undefined>(() => {
  if (props.size != null)
    return props.size
  if (inheritedSize.value != null)
    return inheritedSize.value
  // A named icon tracks the surrounding font. Sized slots stretch the box.
  if (hasName.value)
    return undefined
  return 'md'
})

const iconMarkup = computed(() => {
  if (!hasName.value || props.name == null)
    return undefined
  const data = getIcon(props.name)
  if (data == null) {
    warnMissingIcon(props.name)
    return undefined
  }
  return renderIconMarkup(data, idPrefix)
})

const glyphSlug = computed(() => typeof props.icon === 'string' && isIconGlyph(props.icon)
  ? iconGlyphSlug(props.icon)
  : undefined)

const providedClass = computed(() => typeof props.icon === 'string' && !isIconGlyph(props.icon)
  ? props.icon
  : undefined)

const iconComponent = computed<Component | undefined>(() => props.icon != null && typeof props.icon !== 'string'
  ? props.icon
  : undefined)

const a11yAttrs = computed(() => {
  const label = props.label

  return label != null && label !== ''
    ? ({ 'role': 'img', 'aria-label': label } as const)
    : ({ 'aria-hidden': 'true' } as const)
})
</script>

<template>
  <span
    v-bind="a11yAttrs"
    class="astryx-icon"
    :class="hasName ? undefined : providedClass"
    :data-color="color"
    :data-size="resolvedSize"
  >
    <!-- Iconify bodies are SVG path data from a collection, not caller HTML. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <span v-if="hasName && iconMarkup" class="astryx-icon__svg" v-html="iconMarkup" />
    <span v-else-if="!hasName && glyphSlug" class="astryx-icon__glyph" :class="`astryx-icon--${glyphSlug}`" />
    <component :is="iconComponent" v-else-if="!hasName && iconComponent" />
    <slot v-else-if="!hasName && !providedClass" />
  </span>
</template>
