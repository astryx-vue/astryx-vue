<script setup lang="ts">
import type { CommentPinParticipant } from '@astryx-vue/lab'
import { CommentPin } from '@astryx-vue/lab'
import { ref } from 'vue'

const PEOPLE = {
  ada: {
    id: 'ada',
    name: 'Ada Lovelace',
    avatarSrc: 'https://i.pravatar.cc/80?img=47',
  },
  lin: {
    id: 'lin',
    name: 'Lin Chen',
    avatarSrc: 'https://i.pravatar.cc/80?img=32',
  },
  mira: {
    id: 'mira',
    name: 'Mira Patel',
    avatarSrc: 'https://i.pravatar.cc/80?img=5',
  },
} as const satisfies Record<string, CommentPinParticipant>

const selected = ref<'content' | 'margin' | null>('content')

function toggle(id: 'content' | 'margin'): void {
  selected.value = selected.value === id ? null : id
}
</script>

<template>
  <div class="comment-pin-canvas">
    <img
      src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=1040&h=600&fit=crop&auto=format"
      alt="Design materials arranged on a desk"
    >
    <div class="comment-pin-canvas__over">
      <CommentPin
        label="Open 4 grouped annotations over the image"
        :participants="[PEOPLE.ada, PEOPLE.lin]"
        :thread-count="4"
        :is-selected="selected === 'content'"
        :is-dimmed="selected != null && selected !== 'content'"
        @click="toggle('content')"
      />
    </div>
    <div class="comment-pin-canvas__margin">
      <div class="comment-pin-canvas__margin-marker">
        <CommentPin
          label="Open margin annotation from Mira"
          :participants="[PEOPLE.mira]"
          :is-selected="selected === 'margin'"
          :is-dimmed="selected != null && selected !== 'margin'"
          @click="toggle('margin')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-pin-canvas {
  position: relative;
  width: 100%;
  max-width: 520px;
  height: 300px;
  overflow: hidden;
  border-radius: var(--astryx-radius-container);
  background-color: var(--astryx-color-background-surface);
  box-shadow: var(--astryx-shadow-med);
}

.comment-pin-canvas img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comment-pin-canvas__over {
  position: absolute;
  inset-inline-start: 38%;
  inset-block-start: 34%;
  transform: translateY(-100%);
}

.comment-pin-canvas__margin {
  position: absolute;
  inset-block: 0;
  inset-inline-end: 0;
  width: 72px;
  background-color: var(--astryx-color-background-muted);
  border-inline-start: 1px solid var(--astryx-color-border);
}

.comment-pin-canvas__margin-marker {
  position: absolute;
  inset-inline-start: 50%;
  inset-block-start: 66%;
  transform: translateY(-100%);
}
</style>
