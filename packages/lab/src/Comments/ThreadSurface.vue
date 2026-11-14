<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ActivationSource, ThreadDivider } from './utils.js'
import { Card, Section, useClickableContainer, VisuallyHidden } from '@astryx-vue/core'
import { ref } from 'vue'
import { activationSourceOf, toElement } from './utils.js'

defineOptions({ name: 'AstryxCommentThreadSurface' })

const props = defineProps<{
  dividers: readonly ThreadDivider[]
  isFilled: boolean
  isSelectable: boolean
  isSelected: boolean
  label: string
  revealClass?: string | Record<string, boolean>
  revealStyle?: CSSProperties
  surface: 'card' | 'section'
  threadId: string
}>()

const emit = defineEmits<{
  change: [isSelected: boolean, source: ActivationSource]
}>()

export type { ThreadDivider }

const containerRef = ref<HTMLElement | null>(null)
const controlRef = ref<HTMLElement | null>(null)

function setContainerRef(el: unknown): void {
  containerRef.value = toElement(el)
}
const isFocused = ref(false)

function toggle(event?: { detail?: number }): void {
  emit('change', !props.isSelected, activationSourceOf(event))
}

const handlers = useClickableContainer({
  containerRef,
  interactiveRef: controlRef,
  onClick: event => toggle(event),
})
</script>

<template>
  <Section
    v-if="surface === 'section'"
    :ref="setContainerRef"
    :variant="isFilled ? 'muted' : 'transparent'"
    :dividers="[...dividers]"
    :padding="3"
    width="100%"
    class="astryx-thread-surface astryx-thread-section-overlap"
    :data-selectable="isSelectable ? 'true' : undefined"
    :data-focused="isSelectable && isFocused ? 'true' : undefined"
    :data-filled="isFilled ? 'true' : undefined"
    :class="revealClass"
    :style="revealStyle"
    :data-thread-id="threadId"
    data-thread-surface="section"
    :data-selected="isSelected ? 'true' : 'false'"
    @click="isSelectable ? handlers.onClick($event) : undefined"
    @mouseup="isSelectable ? handlers.onMouseUp($event) : undefined"
  >
    <VisuallyHidden v-if="isSelectable">
      <button
        ref="controlRef"
        type="button"
        :aria-label="label"
        :aria-pressed="isSelected"
        @click="toggle($event)"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </VisuallyHidden>
    <slot />
  </Section>
  <Card
    v-else
    :ref="setContainerRef"
    variant="default"
    elevation="none"
    :padding="3"
    width="100%"
    class="astryx-thread-surface"
    :data-selectable="isSelectable ? 'true' : undefined"
    :data-focused="isSelectable && isFocused ? 'true' : undefined"
    :data-filled="isFilled ? 'true' : undefined"
    :class="revealClass"
    :style="revealStyle"
    :data-thread-id="threadId"
    data-thread-surface="card"
    :data-selected="isSelected ? 'true' : 'false'"
    @click="isSelectable ? handlers.onClick($event) : undefined"
    @mouseup="isSelectable ? handlers.onMouseUp($event) : undefined"
  >
    <VisuallyHidden v-if="isSelectable">
      <button
        ref="controlRef"
        type="button"
        :aria-label="label"
        :aria-pressed="isSelected"
        @click="toggle($event)"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </VisuallyHidden>
    <slot />
  </Card>
</template>
