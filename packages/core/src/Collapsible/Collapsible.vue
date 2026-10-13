<script setup lang="ts">
import type { CollapsibleEmits, CollapsibleProps, CollapsibleSlots } from './types.js'
import { computed, inject, shallowRef, useId, useTemplateRef } from 'vue'
import Icon from '../Icon/Icon.vue'
import { collapsibleGroupKey, collapsibleGroupPresentationKey } from './context.js'
import '../../styles/collapsible.css'

defineOptions({ name: 'AstryxCollapsible' })

const props = withDefaults(defineProps<Omit<CollapsibleProps, 'isOpen'>>(), {
  defaultIsOpen: true,
  isDisabled: false,
})

const emit = defineEmits<CollapsibleEmits>()
defineSlots<CollapsibleSlots>()
const open = defineModel<boolean | undefined>('isOpen', { default: undefined })
const localIsOpen = shallowRef(props.defaultIsOpen)
const group = inject(collapsibleGroupKey, null)
const presentation = inject(collapsibleGroupPresentationKey, null)
const isGrouped = computed(() => group != null && props.value != null && props.value !== '')
const isOpen = computed(() => {
  if (isGrouped.value && group != null && props.value != null)
    return group.isOpen(props.value)
  return open.value ?? localIsOpen.value
})
const density = computed(() => presentation?.density.value ?? null)
const hasDividers = computed(() => presentation?.hasDividers.value ?? false)
const chevronPosition = computed(() => props.chevronPosition ?? presentation?.chevronPosition.value ?? 'end')
const isChevronAtStart = computed(() => chevronPosition.value === 'start')
const contentId = `astryx-collapsible-${useId()}`
const root = useTemplateRef<HTMLDivElement>('root')
const element = computed(() => root.value ?? null)

defineExpose({ element })

function toggle(): void {
  if (props.isDisabled)
    return

  if (isGrouped.value && group != null && props.value != null) {
    group.toggle(props.value)
    return
  }

  const next = !isOpen.value
  localIsOpen.value = next
  open.value = next
  emit('openChange', next)
}
</script>

<template>
  <div
    ref="root"
    class="astryx-collapsible"
    :data-density="density || undefined"
    :data-dividers="hasDividers || undefined"
  >
    <button
      type="button"
      class="astryx-collapsible-trigger"
      :data-chevron-position="chevronPosition"
      :data-open="isOpen ? 'open' : undefined"
      :data-disabled="isDisabled ? 'disabled' : undefined"
      :aria-expanded="isOpen"
      :aria-controls="contentId"
      :aria-disabled="isDisabled || undefined"
      :tabindex="isDisabled ? -1 : undefined"
      @click="toggle"
    >
      <Icon
        v-if="isChevronAtStart"
        class="astryx-collapsible-chevron"
        color="secondary"
        icon="chevronRight"
        size="sm"
      />
      <span class="astryx-collapsible-trigger-label">
        <slot name="trigger">{{ trigger }}</slot>
      </span>
      <Icon
        v-if="!isChevronAtStart"
        class="astryx-collapsible-chevron"
        color="secondary"
        icon="chevronDown"
        size="sm"
      />
    </button>
    <Transition name="astryx-collapsible-reveal">
      <div
        v-show="isOpen"
        :id="contentId"
        class="astryx-collapsible-content"
        :data-open="isOpen ? 'open' : undefined"
      >
        <div class="astryx-collapsible-content-inner">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>
