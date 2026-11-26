<script setup lang="ts">
import { usePressFeedback } from '@astryx-vue/core'
import { Card } from '@astryx-vue/core/Card'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const { pressableProps } = usePressFeedback()
const isFaceUp = ref(true)

function flip(): void {
  isFaceUp.value = !isFaceUp.value
}
</script>

<template>
  <div class="press-card-demo">
    <Card
      v-bind="pressableProps"
      class="press-card-demo__card"
      :width="120"
      :padding="1"
      role="button"
      tabindex="0"
      aria-label="Flip card"
      :aria-pressed="!isFaceUp"
      @click="flip"
      @keydown.enter.prevent="flip"
      @keydown.space.prevent="flip"
    >
      <div v-if="isFaceUp" class="press-card-demo__face">
        <span class="press-card-demo__corner">Q<br>♥</span>
        <span class="press-card-demo__pip">♥</span>
        <span class="press-card-demo__corner press-card-demo__corner--end">Q<br>♥</span>
      </div>
      <div v-else class="press-card-demo__back" />
    </Card>
    <Text type="supporting" color="secondary">
      Press and hold the card to see the press; tap, click, Enter or Space to flip it.
    </Text>
  </div>
</template>

<style scoped>
.press-card-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.press-card-demo__card {
  cursor: pointer;
  user-select: none;
}

.press-card-demo__card:focus-visible {
  outline: var(--astryx-focus-outline-width, 2px) var(--astryx-focus-outline-style, solid) var(--astryx-focus-outline-color, var(--astryx-color-accent));
  outline-offset: var(--astryx-focus-outline-offset, 2px);
}

.press-card-demo__face,
.press-card-demo__back {
  position: relative;
  aspect-ratio: 5 / 7;
  border-radius: 6px;
}

.press-card-demo__face {
  display: grid;
  place-items: center;
  color: #d0312d;
  font-weight: 600;
}

.press-card-demo__corner {
  position: absolute;
  inset-block-start: 6px;
  inset-inline-start: 8px;
  font-size: 13px;
  line-height: 1.1;
  text-align: center;
}

.press-card-demo__corner--end {
  inset-block: auto 6px;
  inset-inline: auto 8px;
  transform: rotate(180deg);
}

.press-card-demo__pip {
  font-size: 40px;
}

.press-card-demo__back {
  background:
    repeating-linear-gradient(45deg, rgb(255 255 255 / 0.18) 0 4px, transparent 4px 8px),
    var(--astryx-color-accent);
}
</style>
