<script setup lang="ts">
import type { NavItemEmits, NavItemProps, NavItemSlots } from './types.js'
import { computed, useAttrs, useSlots } from 'vue'
import { isExternalNavTarget, resolveNavRoot } from './link.js'
import '../../styles/nav-item.css'

defineOptions({ name: 'AstryxNavItem', inheritAttrs: false })

const props = withDefaults(defineProps<NavItemProps>(), {
  block: false,
  isDisabled: false,
  isIconOnly: false,
  isSelected: false,
  plain: false,
  size: 'md',
})

const emit = defineEmits<NavItemEmits>()
defineSlots<NavItemSlots>()
const slots = useSlots()
const attrs = useAttrs()
function forwardedAttrs(): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
  )
}

const isLink = computed(() => props.href != null && props.href !== '' && !props.isDisabled)
const root = computed(() => resolveNavRoot(props.href, props.isDisabled, props.as))
const glyph = computed(() => {
  if (props.isSelected && props.selectedIconClass)
    return props.selectedIconClass
  return props.iconClass
})
const showSelectedArtwork = computed(() =>
  props.isSelected && (props.selectedIconClass != null || slots.selectedIcon != null),
)
const hasIcon = computed(() =>
  Boolean(props.iconClass || props.selectedIconClass || slots.icon || slots.selectedIcon),
)

const rel = computed(() => {
  if (!isLink.value)
    return undefined
  const parts = new Set((props.rel ?? '').split(' ').filter(Boolean))
  if (isExternalNavTarget(props.target)) {
    parts.add('noopener')
    parts.add('noreferrer')
  }
  return parts.size > 0 ? [...parts].join(' ') : undefined
})

function onClick(event: MouseEvent): void {
  if (props.isDisabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <component
    :is="root"
    v-bind="forwardedAttrs()"
    class="astryx-nav-item"
    :class="[
      attrs.class,
      `astryx-nav-item--${size}`,
      {
        'astryx-nav-item--block': block,
        'astryx-nav-item--disabled': isDisabled,
        'astryx-nav-item--icon-only': isIconOnly,
        'astryx-nav-item--plain': plain,
        'astryx-nav-item--selected': isSelected && !plain,
      },
    ]"
    :style="attrs.style"
    :href="isLink ? href : undefined"
    :to="isLink && as != null ? href : undefined"
    :target="isLink ? target : undefined"
    :rel="rel"
    :type="isLink ? undefined : 'button'"
    :disabled="isLink ? undefined : isDisabled"
    :aria-current="isSelected ? 'page' : undefined"
    :aria-disabled="isDisabled || undefined"
    :aria-label="isIconOnly ? label : undefined"
    :aria-expanded="expanded == null ? undefined : expanded ? 'true' : 'false'"
    :aria-controls="controls"
    :aria-haspopup="hasPopup"
    :data-selected="isSelected || undefined"
    @click="onClick"
  >
    <span v-if="hasIcon" class="astryx-nav-item__icon" aria-hidden="true">
      <template v-if="showSelectedArtwork">
        <slot name="selectedIcon">
          <span class="astryx-nav-item__glyph" :class="glyph" />
        </slot>
      </template>
      <template v-else>
        <slot name="icon">
          <span v-if="glyph" class="astryx-nav-item__glyph" :class="glyph" />
        </slot>
      </template>
    </span>
    <span v-if="!isIconOnly" class="astryx-nav-item__label">
      <slot>{{ label }}</slot>
    </span>
    <span v-if="!isIconOnly && $slots.end" class="astryx-nav-item__end">
      <slot name="end" />
    </span>
  </component>
</template>
