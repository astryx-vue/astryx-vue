<script setup lang="ts">
import { useDragToSnapPoints } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { ref, useTemplateRef } from 'vue'

// Offsets down from where the sheet rests: open, half open, peeking.
const SNAP_POINTS = [0, 110, 200]
const LABELS = ['Open', 'Half', 'Peek']

const sheet = useTemplateRef<HTMLElement>('sheet')
const settled = ref(0)

const { settleTo } = useDragToSnapPoints(sheet, {
  axis: 'y',
  snapPoints: SNAP_POINTS,
  onSettle: (index) => {
    settled.value = index
  },
})
</script>

<template>
  <VStack :gap="4" align="center">
    <div class="snap-stage">
      <div ref="sheet" class="snap-sheet">
        <div class="snap-grabber" />
        {{ LABELS[settled] }}
      </div>
    </div>
    <HStack :gap="2">
      <Button
        v-for="(label, index) in LABELS"
        :key="label"
        :label="label"
        :variant="index === settled ? 'primary' : 'secondary'"
        @click="settleTo(index)"
      />
    </HStack>
  </VStack>
</template>

<style scoped>
.snap-stage {
  position: relative;
  width: 100%;
  max-width: 360px;
  height: 260px;
  overflow: hidden;
  border-radius: var(--astryx-radius-container, 12px);
  background: var(--astryx-color-background-muted, rgb(0 0 0 / 4%));
}

.snap-sheet {
  position: absolute;
  inset: 20px 0 auto;
  display: grid;
  justify-items: center;
  align-content: start;
  gap: 12px;
  height: 240px;
  padding-top: 8px;
  border-radius: var(--astryx-radius-container, 12px) var(--astryx-radius-container, 12px) 0 0;
  background: var(--astryx-color-accent);
  color: var(--astryx-color-on-accent, #fff);
  cursor: grab;
  user-select: none;
}

.snap-grabber {
  width: 36px;
  height: 5px;
  border-radius: 3px;
  background: currentcolor;
  opacity: 0.5;
}
</style>
