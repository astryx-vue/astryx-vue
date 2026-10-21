<script setup lang="ts">
import type { BannerEmits, BannerProps, BannerSlots, BannerStatus } from './types.js'
import { computed, shallowRef, toRaw, useId, useTemplateRef, watch } from 'vue'
import FieldIcon from '../Field/FieldIcon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/banner.css'
import '../../styles/field.css'

defineOptions({ name: 'AstryxBanner' })

const props = withDefaults(defineProps<Omit<BannerProps, 'isOpen'>>(), {
  container: 'card',
  elevation: 'none',
  collapsible: true,
})
const emit = defineEmits<BannerEmits>()
const slots = defineSlots<BannerSlots>()
const messages = useAstryxMessages()
const openModel = defineModel<boolean | undefined>('isOpen', { default: undefined })
const localOpen = shallowRef(props.defaultIsOpen ?? false)
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

const knownStatuses = new Set<BannerStatus>(['info', 'warning', 'error', 'success'])
const visualStatus = computed(() => knownStatuses.has(props.status) ? props.status : undefined)
const expandText = computed(() => props.expandLabel ?? messages.value.banner.expand)
const collapseText = computed(() => props.collapseLabel ?? messages.value.banner.collapse)
const dismissTooltip = computed(() => props.dismissLabel ?? messages.value.banner.dismiss)
const dismissName = computed(() => {
  if (props.dismissLabel)
    return props.dismissLabel
  return messages.value.banner.dismissTitled(messages.value.banner.dismiss, props.title)
})
const hasEnd = computed(() => !!slots.end)
const centered = computed(() => !props.description && !slots.description && (hasEnd.value || !!props.isDismissable))

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
    v-if="!dismissed"
    ref="root"
    class="astryx-banner-frame"
    :data-container="container"
    :data-elevation="elevation"
    :data-expanded="hasContent && expanded || undefined"
    @focusin="focusin"
    @pointerdown.capture="pointerdown"
  >
    <div
      class="astryx-banner astryx-banner-header"
      :data-centered="centered || undefined"
      :data-container="container"
      :data-status="visualStatus"
    >
      <span class="astryx-banner-icon" :data-status="visualStatus" aria-hidden="true">
        <slot name="icon">
          <component :is="icon" v-if="icon" />
          <FieldIcon v-else-if="visualStatus" :type="visualStatus" />
        </slot>
      </span>
      <div class="astryx-banner-message" :data-has-actions="hasEnd || undefined">
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
      <div v-if="hasEnd || isDismissable || (hasContent && collapsible)" class="astryx-banner-actions">
        <slot name="end" />
        <IconButton
          v-if="hasContent && collapsible"
          ref="toggleButton"
          variant="ghost"
          size="sm"
          :label="expanded ? collapseText : expandText"
          :tooltip="expanded ? collapseText : expandText"
          :aria-expanded="expanded"
          :aria-controls="expanded ? contentId : undefined"
          @click="toggle"
        >
          <svg class="astryx-banner-chevron" :data-expanded="expanded || undefined" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
        </IconButton>
        <IconButton
          v-if="isDismissable"
          variant="ghost"
          size="sm"
          :label="dismissName"
          :tooltip="dismissTooltip"
          @click="dismiss"
        >
          <FieldIcon type="clear" />
        </IconButton>
      </div>
    </div>
    <div
      v-if="hasContent && expanded"
      :id="hasContent && collapsible ? contentId : undefined"
      ref="content"
      class="astryx-banner-content"
      :data-container="container"
      :data-status="visualStatus"
    >
      <slot />
    </div>
  </div>
</template>
