<script setup lang="ts">
import type { ChatToolCallItem } from './types.js'
import { computed, ref, useId } from 'vue'
import Badge from '../Badge/Badge.vue'
import Icon from '../Icon/Icon.vue'
import ChatStatusMark from './ChatStatusMark.vue'
import '../../styles/chat.css'

const props = defineProps<{
  call: ChatToolCallItem
  expandable?: boolean
}>()

const isDetailOpen = ref(false)
const detailId = `astryx-chat-tool-detail-${useId()}`
const status = computed(() => props.call.status ?? 'complete')

function toggle(): void {
  isDetailOpen.value = !isDetailOpen.value
}
</script>

<template>
  <div class="astryx-chat-tool-calls__entry">
    <button
      v-if="expandable"
      type="button"
      class="astryx-chat-tool-calls__row"
      data-expandable=""
      :aria-expanded="isDetailOpen"
      :aria-controls="isDetailOpen ? detailId : undefined"
      @click="toggle"
    >
      <ChatStatusMark :status="status" :error-message="call.errorMessage" />
      <span class="astryx-chat-tool-calls__name">{{ call.name }}</span>
      <Badge v-if="call.node" class="astryx-chat-tool-calls__node" variant="neutral">
        {{ call.node }}
      </Badge>
      <span v-if="call.target" class="astryx-chat-tool-calls__target">{{ call.target }}</span>
      <span v-if="call.additions != null || call.deletions != null || call.stats" class="astryx-chat-tool-calls__stats">
        <span v-if="call.additions != null" class="astryx-chat-tool-calls__additions">+{{ call.additions }}</span>
        <span v-if="call.deletions != null" class="astryx-chat-tool-calls__deletions">-{{ call.deletions }}</span>
        <span v-if="call.stats">{{ call.stats }}</span>
      </span>
      <span v-if="call.duration && status === 'complete'" class="astryx-chat-tool-calls__duration">{{ call.duration }}</span>
      <span class="astryx-chat-tool-calls__chevron" :data-open="isDetailOpen || undefined">
        <Icon icon="chevronDown" size="xsm" color="inherit" />
      </span>
    </button>
    <div v-else class="astryx-chat-tool-calls__row">
      <ChatStatusMark :status="status" :error-message="call.errorMessage" />
      <span class="astryx-chat-tool-calls__name">{{ call.name }}</span>
      <Badge v-if="call.node" class="astryx-chat-tool-calls__node" variant="neutral">
        {{ call.node }}
      </Badge>
      <span v-if="call.target" class="astryx-chat-tool-calls__target">{{ call.target }}</span>
      <span v-if="call.additions != null || call.deletions != null || call.stats" class="astryx-chat-tool-calls__stats">
        <span v-if="call.additions != null" class="astryx-chat-tool-calls__additions">+{{ call.additions }}</span>
        <span v-if="call.deletions != null" class="astryx-chat-tool-calls__deletions">-{{ call.deletions }}</span>
        <span v-if="call.stats">{{ call.stats }}</span>
      </span>
      <span v-if="call.duration && status === 'complete'" class="astryx-chat-tool-calls__duration">{{ call.duration }}</span>
    </div>
    <div v-if="expandable && isDetailOpen" :id="detailId" class="astryx-chat-tool-calls__detail">
      <slot name="detail" />
    </div>
  </div>
</template>
