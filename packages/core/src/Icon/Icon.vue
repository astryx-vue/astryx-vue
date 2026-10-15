<script setup lang="ts">
import type { Component } from 'vue'
import type { IconProps, IconSize, IconSlots } from './types.js'
import { computed, useId } from 'vue'
import { useIconDefaultSize } from './context.js'
import { iconGlyphSlug, isIconGlyph } from './glyphs.js'
import { getIcon, warnMissingIcon } from './registry.js'
import { renderIconMarkup } from './svg.js'
import { useSemanticIcon } from './useSemanticIcon.js'
import '../../styles/icon.css'

defineOptions({ name: 'AstryxIcon' })

const props = withDefaults(defineProps<IconProps>(), {
  color: 'inherit',
})

defineSlots<IconSlots>()

const inheritedSize = useIconDefaultSize()
const idPrefix = `i${useId().replace(/\W/g, '')}-`

const directName = computed(() => props.name != null && props.name !== '' ? props.name : undefined)
const semanticId = useSemanticIcon(() => typeof props.icon === 'string' ? props.icon : undefined)

const registeredSemanticId = computed(() => {
  const id = semanticId.value
  if (!id || directName.value != null)
    return undefined
  return getIcon(id) ? id : undefined
})

const resolvedSize = computed<IconSize | undefined>(() => {
  if (props.size != null)
    return props.size
  if (inheritedSize.value != null)
    return inheritedSize.value
  // A direct Iconify name tracks the surrounding font. Sized slots stretch the box.
  if (directName.value != null)
    return undefined
  return 'md'
})

const iconMarkup = computed(() => {
  const query = directName.value ?? registeredSemanticId.value
  if (query == null)
    return undefined
  const data = getIcon(query)
  if (data == null) {
    if (directName.value != null)
      warnMissingIcon(directName.value)
    return undefined
  }
  return renderIconMarkup(data, idPrefix)
})

const glyphSlug = computed(() => {
  if (directName.value != null || registeredSemanticId.value != null)
    return undefined
  return typeof props.icon === 'string' && isIconGlyph(props.icon)
    ? iconGlyphSlug(props.icon)
    : undefined
})

const providedClass = computed(() => {
  if (directName.value != null || registeredSemanticId.value != null || glyphSlug.value != null)
    return undefined
  if (typeof props.icon !== 'string' || semanticId.value != null)
    return undefined
  return props.icon
})

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
    :data-color="color"
    :data-size="resolvedSize"
  >
    <!-- Iconify bodies are SVG path data from a collection, not caller HTML. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <span v-if="iconMarkup" class="astryx-icon__svg" v-html="iconMarkup" />
    <span v-else-if="glyphSlug" class="astryx-icon__glyph" :class="`astryx-icon--${glyphSlug}`" />
    <!--
      Utility icon classes (UnoCSS `i-*`) set width and height to 100% outside
      any layer, which would override this box's size if the class sat on it.
      The box owns the size; the class only paints the inside.
    -->
    <span v-else-if="providedClass" class="astryx-icon__external" :class="providedClass" />
    <component :is="iconComponent" v-else-if="iconComponent && directName == null" />
    <slot v-else-if="directName == null" />
  </span>
</template>
