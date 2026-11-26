<script setup lang="ts">
import { useAnimator } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { useTemplateRef } from 'vue'

const card = useTemplateRef<HTMLElement>('card')
const animator = useAnimator(card)

let origin: { x: number, y: number, at: number } | null = null
let last = { x: 0, y: 0, at: 0 }
let velocity = { x: 0, y: 0 }

function onPointerDown(event: PointerEvent): void {
  const { x, y } = animator.get()
  animator.stop()
  origin = { x: event.clientX - x, y: event.clientY - y, at: event.timeStamp }
  last = { x, y, at: event.timeStamp }
  velocity = { x: 0, y: 0 }
  card.value?.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent): void {
  if (!origin)
    return
  const x = event.clientX - origin.x
  const y = event.clientY - origin.y
  const seconds = (event.timeStamp - last.at) / 1000
  if (seconds > 0)
    velocity = { x: (x - last.x) / seconds, y: (y - last.y) / seconds }
  last = { x, y, at: event.timeStamp }
  animator.set({ x, y })
}

function onPointerUp(): void {
  if (!origin)
    return
  origin = null
  // Springs home from the speed of the release.
  void animator.animate({ x: 0, y: 0 }, { velocity })
}
</script>

<template>
  <VStack :gap="4" align="center">
    <div class="drag-card-stage">
      <div
        ref="card"
        class="drag-card"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        Drag me
      </div>
    </div>
    <HStack :gap="2">
      <Button label="Pop" @click="animator.animate({ scale: 1.2 }).then(() => animator.animate({ scale: 1 }))" />
      <Button label="Spin" @click="animator.animate({ rotate: animator.get().rotate + 90 })" />
      <Button label="Fling" @click="animator.decay({ x: 900 })" />
      <Button label="Reset" variant="secondary" @click="animator.animate({ x: 0, y: 0, scale: 1, rotate: 0 })" />
    </HStack>
  </VStack>
</template>

<style scoped>
.drag-card-stage {
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 200px;
  overflow: hidden;
}

.drag-card {
  display: grid;
  place-items: center;
  width: 120px;
  height: 120px;
  border-radius: var(--astryx-radius-container, 12px);
  background: var(--astryx-color-accent);
  color: var(--astryx-color-on-accent, #fff);
  cursor: grab;
  touch-action: none;
  user-select: none;
}
</style>
