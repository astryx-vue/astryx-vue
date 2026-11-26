<script setup lang="ts">
import type { CollapsibleEmits, CollapsibleProps, CollapsibleSlots } from './types.js'
import { computed, useId, useTemplateRef } from 'vue'
import { moveFocusLeftBehind, noteFocusWithin, useFocusLeavingChange } from '../composables/internal/focusLeaving.js'
import { useLayoutDisclosure } from '../composables/internal/layoutDisclosure.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import Icon from '../Icon/Icon.vue'
import { readLayerScoped } from '../layer/scopedProvide.js'
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
const presentation = readLayerScoped(collapsibleGroupPresentationKey)
const density = computed(() => presentation?.density.value ?? null)
const hasDividers = computed(() => presentation?.hasDividers.value ?? false)
const chevronPosition = computed(() => props.chevronPosition ?? presentation?.chevronPosition.value ?? 'end')
const isChevronAtStart = computed(() => chevronPosition.value === 'start')
const { pressableProps } = usePressFeedback({ hasOverlay: false })
const contentId = `astryx-collapsible-${useId()}`
const root = useTemplateRef<HTMLDivElement>('root')
const element = computed(() => root.value ?? null)
const triggerButton = useTemplateRef<HTMLButtonElement>('triggerButton')
const content = useTemplateRef<HTMLDivElement>('content')
const { isExiting } = useLayoutDisclosure({
  animatedLayout: () => props.animatedLayout,
  isOpen: () => isOpen.value,
  content: () => content.value ?? null,
  chevron: () => triggerButton.value?.querySelector<HTMLElement>('.astryx-collapsible-chevron') ?? null,
})

// 内容里的焦点在收起时会被藏起来，要移回触发按钮；焦点在别处就不动。
useFocusLeavingChange(
  () => isOpen.value,
  wasOpen => (wasOpen ? noteFocusWithin(content.value) : null),
  note => moveFocusLeftBehind(note, triggerButton.value, content.value),
)

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
      ref="triggerButton"
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
    <!-- 有句柄时开合交给布局动效，不再走 CSS 过渡；收起后内容播完退场才隐藏。 -->
    <Transition name="astryx-collapsible-reveal" :css="animatedLayout == null">
      <div
        v-show="isOpen || isExiting"
        :id="contentId"
        ref="content"
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
