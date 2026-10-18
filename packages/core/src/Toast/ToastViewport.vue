<script setup lang="ts">
import type { ToastDismissReason, ToastPlacement } from './types.js'
import { computed, reactive, watch } from 'vue'

import { toastStore } from './store.js'
import Toast from './Toast.vue'

const props = withDefaults(defineProps<{
  placement?: ToastPlacement
}>(), {
  placement: 'bottom-center',
})

const isTopPlacement = computed(() => props.placement.startsWith('top'))

const classes = computed(() => [
  'astryx-toast-viewport',
  `astryx-toast-viewport--placement-${props.placement}`,
])

// Rows clip their toast while the row track opens and closes. Once a row has
// settled the clip is released so the card shadow can paint.
const settled = reactive(new Set<string>())

function handleRowTransitionEnd(id: string, event: TransitionEvent) {
  if (event.target !== event.currentTarget || event.propertyName !== 'grid-template-rows')
    return
  const item = toastStore.toasts.find(t => t.id === id)
  if (!item)
    return
  if (item.isExiting)
    toastStore.finalize(id)
  else
    settled.add(id)
}

function handleDismiss(id: string, reason: ToastDismissReason) {
  settled.delete(id)
  toastStore.dismissFromCard(id, reason)
}

watch(
  () => toastStore.toasts.map(t => t.id).join(','),
  () => {
    const live = new Set(toastStore.toasts.map(t => t.id))
    for (const id of [...settled]) {
      if (!live.has(id))
        settled.delete(id)
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      :class="classes"
      aria-live="polite"
      aria-atomic="false"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="astryx-toast-viewport__row"
        :class="[
          isTopPlacement ? 'astryx-toast-viewport__row--from-top' : 'astryx-toast-viewport__row--from-bottom',
          { 'astryx-toast-viewport__row--exiting': toast.isExiting },
        ]"
        @transitionend="handleRowTransitionEnd(toast.id, $event)"
      >
        <div
          class="astryx-toast-viewport__clip"
          :class="{ 'astryx-toast-viewport__clip--settled': settled.has(toast.id) }"
        >
          <Toast
            :type="toast.type"
            :body="toast.body"
            :is-auto-hide="toast.isAutoHide"
            :auto-hide-duration="toast.autoHideDuration"
            :end-content="toast.endContent"
            :is-exiting="toast.isExiting"
            @dismiss="handleDismiss(toast.id, $event)"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
