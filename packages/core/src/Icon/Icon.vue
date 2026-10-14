<script setup lang="ts">
import type { Component } from 'vue'
import type { IconProps, IconSize, IconSlots } from './types.js'
import { computed } from 'vue'
import { useIconDefaultSize } from './context.js'
import { iconGlyphSlug, isIconGlyph } from './glyphs.js'
import '../../styles/icon.css'

defineOptions({ name: 'AstryxIcon' })

const props = withDefaults(defineProps<IconProps>(), {
  color: 'inherit',
})

defineSlots<IconSlots>()

const inheritedSize = useIconDefaultSize()

const resolvedSize = computed<IconSize>(() => props.size ?? inheritedSize.value ?? 'md')

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
    :data-color="color"
    :data-size="resolvedSize"
  >
    <span v-if="glyphSlug" class="astryx-icon__glyph" :class="`astryx-icon--${glyphSlug}`" />
    <!--
      Utility icon classes (UnoCSS `i-*`) set width and height to 100% outside
      any layer, which would override this box's size if the class sat on it.
      The box owns the size; the class only paints the inside.
    -->
    <span v-else-if="providedClass" class="astryx-icon__external" :class="providedClass" />
    <component :is="iconComponent" v-else-if="iconComponent" />
    <slot v-else />
  </span>
</template>
