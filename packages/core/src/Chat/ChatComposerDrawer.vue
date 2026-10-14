<script setup lang="ts">
import type { ChatComposerDrawerEmits, ChatComposerDrawerProps, ChatComposerDrawerSlots } from './types.js'
import { computed, ref, useId } from 'vue'
import Badge from '../Badge/Badge.vue'
import { useAstryxMessages } from '../locale/index.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatComposerDrawer', inheritAttrs: false })

const props = withDefaults(defineProps<Omit<ChatComposerDrawerProps, 'isCollapsed'>>(), {
  defaultIsCollapsed: false,
})
const emit = defineEmits<ChatComposerDrawerEmits>()
defineSlots<ChatComposerDrawerSlots>()
const model = defineModel<boolean | undefined>('isCollapsed', { default: undefined })

const messages = useAstryxMessages()
const contentId = useId()
const internalCollapsed = ref(props.defaultIsCollapsed)
const collapsed = computed(() => model.value ?? internalCollapsed.value)
const canCollapse = computed(() => props.count != null)
const label = computed(() => props.label ?? messages.value.chat.drawerLabel)
const actionLabel = computed(() => collapsed.value
  ? messages.value.chat.drawerExpand(label.value)
  : messages.value.chat.drawerCollapse(label.value))

function toggle(): void {
  const next = !collapsed.value
  internalCollapsed.value = next
  model.value = next
  emit('collapsedChange', next)
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Enter' && event.key !== ' ')
    return
  event.preventDefault()
  toggle()
}
</script>

<template>
  <div v-bind="$attrs" class="astryx-chat-drawer" :data-collapsed="canCollapse && collapsed ? '' : undefined">
    <div
      v-if="canCollapse"
      class="astryx-chat-drawer__toggle"
      role="button"
      tabindex="0"
      :aria-expanded="!collapsed"
      :aria-controls="contentId"
      :aria-label="actionLabel"
      @click="toggle"
      @keydown="onKeyDown"
    >
      <div class="astryx-chat-drawer__summary" :data-hidden="collapsed ? undefined : ''" aria-hidden="true" inert>
        <slot name="collapsedSummary">
          <Badge variant="neutral" :label="count" />
          <span class="astryx-chat-drawer__label">{{ label }}</span>
        </slot>
      </div>
      <div class="astryx-chat-drawer__handle" :data-hidden="collapsed ? '' : undefined" />
    </div>
    <div
      :id="contentId"
      class="astryx-chat-drawer__grid"
      :data-collapsed="canCollapse && collapsed ? '' : undefined"
      :inert="canCollapse && collapsed ? true : undefined"
    >
      <div class="astryx-chat-drawer__content" :data-collapsed="canCollapse && collapsed ? '' : undefined">
        <slot />
      </div>
    </div>
  </div>
</template>
