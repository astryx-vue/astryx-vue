<script setup lang="ts">
import type { CollapsibleEmits, CollapsibleProps, CollapsibleSlots } from './types.js'
import { computed, inject, useId, useTemplateRef } from 'vue'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import Icon from '../Icon/Icon.vue'
import { collapsibleGroupPresentationKey } from './context.js'
import { useCollapsible } from './useCollapsible.js'
import '../../styles/collapsible.css'

defineOptions({ name: 'AstryxCollapsible' })

const props = withDefaults(defineProps<Omit<CollapsibleProps, 'isOpen'>>(), {
  defaultIsOpen: true,
  isDisabled: false,
})

const emit = defineEmits<CollapsibleEmits>()
defineSlots<CollapsibleSlots>()
const open = defineModel<boolean | undefined>('isOpen', { default: undefined })
const collapsible = useCollapsible({
  value: () => props.value,
  isCollapsible: {
    isOpen: open,
    defaultIsOpen: () => props.defaultIsOpen,
    onOpenChange: isOpen => emit('openChange', isOpen),
  },
})
const isOpen = collapsible.isOpen
const presentation = inject(collapsibleGroupPresentationKey, null)
const density = computed(() => presentation?.density.value ?? null)
const hasDividers = computed(() => presentation?.hasDividers.value ?? false)
const chevronPosition = computed(() => props.chevronPosition ?? presentation?.chevronPosition.value ?? 'end')
const isChevronAtStart = computed(() => chevronPosition.value === 'start')
const { pressableProps } = usePressFeedback({ hasOverlay: false })
const contentId = `astryx-collapsible-${useId()}`
const root = useTemplateRef<HTMLDivElement>('root')
const element = computed(() => root.value ?? null)

defineExpose({ element })

function toggle(): void {
  if (props.isDisabled)
    return

  collapsible.toggle()
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
      v-bind="pressableProps"
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
