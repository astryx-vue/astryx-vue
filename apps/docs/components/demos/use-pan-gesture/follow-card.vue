<script setup lang="ts">
import type { PanGestureEvent } from '@astryx-vue/core'
import { useAnimator, usePanGesture } from '@astryx-vue/core'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref, useTemplateRef } from 'vue'

const card = useTemplateRef<HTMLElement>('card')
const animator = useAnimator(card)
const state = ref('—')

// Where the card was when the drag began.
let start = { x: 0, y: 0 }

function onPan(event: PanGestureEvent): void {
  state.value = event.state
  if (event.state === 'began') {
    const { x, y } = animator.get()
    animator.stop()
    start = { x, y }
  }
  if (event.state === 'began' || event.state === 'changed') {
    animator.set({ x: start.x + event.translation.x, y: start.y + event.translation.y })
    return
  }
  // Springs home from the speed of the release.
  void animator.animate({ x: 0, y: 0 }, { velocity: event.velocity })
}

usePanGesture(card, { onPan })
</script>

<template>
  <VStack :gap="2" align="center">
    <div class="pan-stage">
      <div ref="card" class="pan-card">
        Drag me
      </div>
    </div>
    <Text type="supporting" color="secondary">
      {{ state }}
    </Text>
  </VStack>
</template>

<style scoped>
.pan-stage {
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 220px;
  overflow: hidden;
}

.pan-card {
  display: grid;
  place-items: center;
  width: 120px;
  height: 120px;
  border-radius: var(--astryx-radius-container, 12px);
  background: var(--astryx-color-accent);
  color: var(--astryx-color-on-accent, #fff);
  cursor: grab;
  user-select: none;
}
</style>
