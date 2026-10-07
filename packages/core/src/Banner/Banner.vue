<script setup lang="ts">
import type { BannerEmits, BannerProps, BannerSlots } from './types.js'
import { computed, shallowRef, toRaw, useId, useTemplateRef, watch } from 'vue'
import FieldIcon from '../Field/FieldIcon.vue'
import IconButton from '../IconButton/IconButton.vue'
import '../../styles/banner.css'
import '../../styles/field.css'

defineOptions({ name: 'AstryxBanner' })
const props = withDefaults(defineProps<Omit<BannerProps, 'isOpen'>>(), { container: 'card', elevation: 'none', collapsible: true, defaultIsOpen: false, expandLabel: 'Expand details', collapseLabel: 'Collapse details' })
const emit = defineEmits<BannerEmits>()
const slots = defineSlots<BannerSlots>()
const openModel = defineModel<boolean | undefined>('isOpen', { default: undefined })
const localOpen = shallowRef(props.defaultIsOpen)
const dismissed = shallowRef(false)
const expanded = computed(() => !props.collapsible || (openModel.value ?? localOpen.value))
const hasContent = computed(() => !!slots.default)
const icon = computed(() => props.icon ? toRaw(props.icon) : undefined)
const root = useTemplateRef<HTMLDivElement>('root')
const content = useTemplateRef<HTMLDivElement>('content')
const toggleButton = useTemplateRef<InstanceType<typeof IconButton>>('toggleButton')
const titleId = `astryx-banner-${useId()}`
const contentId = `${titleId}-content`
const element = computed(() => root.value ?? null)
defineExpose({ element })
let focusOrigin: HTMLElement | null = null

function remember(candidate: EventTarget | null): void {
  if (candidate instanceof HTMLElement && candidate !== root.value?.ownerDocument.body && !root.value?.contains(candidate))
    focusOrigin = candidate
}
function focusin(event: FocusEvent): void {
  remember(event.relatedTarget)
}
function pointerdown(): void {
  remember(root.value?.ownerDocument.activeElement ?? null)
}
function toggle(): void {
  const value = !expanded.value
  localOpen.value = value
  openModel.value = value
}
function dismiss(): void {
  const ownsFocus = root.value?.contains(root.value.ownerDocument.activeElement)
  if (ownsFocus && focusOrigin?.isConnected)
    focusOrigin.focus({ preventScroll: true })
  dismissed.value = true
  emit('dismiss')
}
watch(expanded, (value) => {
  if (!value && content.value?.contains(content.value.ownerDocument.activeElement))
    toggleButton.value?.element?.focus({ preventScroll: true })
}, { flush: 'pre' })
</script>

<template>
  <div
    v-if="!dismissed" ref="root" class="astryx-banner" :role="status === 'warning' || status === 'error' ? 'alert' : 'status'"
    :data-status="status" :data-container="container" :data-elevation="elevation" :data-expanded="hasContent && expanded || undefined"
    @focusin="focusin" @pointerdown.capture="pointerdown"
  >
    <div class="astryx-banner-header">
      <span class="astryx-banner-icon" aria-hidden="true"><slot name="icon"><component :is="icon" v-if="icon" /><FieldIcon v-else :type="status" /></slot></span>
      <div class="astryx-banner-message" :data-has-actions="!!$slots.end || undefined">
        <div :id="titleId" class="astryx-banner-title">
          <slot name="title">
            {{ title }}
          </slot>
        </div>
        <div v-if="description || $slots.description" class="astryx-banner-description">
          <slot name="description">
            {{ description }}
          </slot>
        </div>
      </div>
      <div v-if="$slots.end || isDismissable || (hasContent && collapsible)" class="astryx-banner-actions">
        <slot name="end" />
        <IconButton v-if="hasContent && collapsible" ref="toggleButton" variant="ghost" size="sm" :label="expanded ? collapseLabel : expandLabel" :aria-expanded="expanded" :aria-controls="expanded ? contentId : undefined" @click="toggle">
          <svg class="astryx-banner-chevron" :data-expanded="expanded || undefined" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
        </IconButton>
        <IconButton v-if="isDismissable" variant="ghost" size="sm" :label="dismissLabel ?? `Dismiss ${title}`" @click="dismiss">
          <FieldIcon type="clear" />
        </IconButton>
      </div>
    </div>
    <div v-if="hasContent && expanded" :id="contentId" ref="content" class="astryx-banner-content">
      <slot />
    </div>
  </div>
</template>
