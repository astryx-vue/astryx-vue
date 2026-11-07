<script setup lang="ts">
import { Tour, TourStep } from '@astryx-vue/lab'
import { ref } from 'vue'

const active = ref(false)
const reason = ref('')
const save = ref<HTMLElement | null>(null)
const share = ref<HTMLElement | null>(null)
const history = ref<HTMLElement | null>(null)

function dismiss(source: string): void {
  reason.value = source
  active.value = false
}
</script>

<template>
  <div class="tour-demo">
    <div class="tour-demo__actions">
      <button ref="save" type="button">
        Save draft
      </button>
      <button ref="share" type="button">
        Share
      </button>
      <button ref="history" type="button">
        History
      </button>
    </div>
    <button type="button" @click="active = true">
      Start tour
    </button>
    <span v-if="reason" class="tour-demo__reason">Dismissed: {{ reason }}</span>
    <Tour :is-active="active" has-backdrop is-step-count-shown @dismiss="dismiss">
      <TourStep :target-ref="save" heading="Save your work">
        Changes save automatically to the cloud.
      </TourStep>
      <TourStep :target-ref="share" heading="Share with your team">
        Invite teammates from here.
      </TourStep>
      <TourStep :target-ref="history" heading="Review the history">
        Every change stays available here.
      </TourStep>
    </Tour>
  </div>
</template>

<style scoped>
.tour-demo { display: grid; gap: 16px; width: 100%; }
.tour-demo__actions { display: flex; flex-wrap: wrap; gap: 8px; }
.tour-demo__actions button { min-height: 36px; padding: 6px 12px; }
.tour-demo__reason { color: var(--astryx-color-text-secondary); font-size: 12px; }
</style>
