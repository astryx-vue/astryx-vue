<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useOverflow } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { DropdownMenu } from '@astryx-vue/core/DropdownMenu'
import { useToast } from '@astryx-vue/core/Toast'
import { computed } from 'vue'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}

const actions = [
  'Bold',
  'Italic',
  'Underline',
  'Strikethrough',
  'Link',
  'Quote',
  'Code',
  'Clear formatting',
]

const GAP = 4

const { containerRef, measureRef, visibleCount, hasOverflow } = useOverflow(actions.length, { gap: GAP })

function bindMeasure(el: Element | ComponentPublicInstance | null): void {
  measureRef.value = el instanceof HTMLElement ? el : null
}

function bindContainer(el: Element | ComponentPublicInstance | null): void {
  containerRef.value = el instanceof HTMLElement ? el : null
}

const moreButton = { label: 'More', variant: 'ghost', size: 'sm' } as const
const allItems = actions.map(label => ({ label }))
const hiddenItems = computed(() => actions.slice(visibleCount.value).map(label => ({ label })))
</script>

<template>
  <Card :padding="2" class="overflow-toolbar-demo">
    <!-- Takes no space and paints nothing, so the hook measures every item without a flicker. Do not use display: none, which stops measurement. -->
    <!-- eslint-disable-next-line vue-a11y/no-aria-hidden-on-focusable -- 测量层带 inert，里面的按钮不可聚焦。 -->
    <div :ref="bindMeasure" class="overflow-toolbar-demo__row overflow-toolbar-demo__measure" aria-hidden="true" inert>
      <Button v-for="label in actions" :key="label" :label="label" variant="ghost" size="sm" />
      <div data-overflow-indicator>
        <DropdownMenu :button="moreButton" :items="allItems" />
      </div>
    </div>
    <div :ref="bindContainer" class="overflow-toolbar-demo__row" role="group" aria-label="Text formatting">
      <Button v-for="label in actions.slice(0, visibleCount)" :key="label" :label="label" variant="ghost" size="sm" @click="demo(label)" />
      <DropdownMenu v-if="hasOverflow" :button="moreButton" :items="hiddenItems" />
    </div>
  </Card>
</template>

<style scoped>
.overflow-toolbar-demo {
  resize: horizontal;
  overflow: hidden;
  width: 480px;
  min-width: 120px;
  max-width: 100%;
}

.overflow-toolbar-demo__row {
  display: flex;
  gap: 4px;
}

.overflow-toolbar-demo__measure {
  position: absolute;
  visibility: hidden;
  height: 0;
  overflow: hidden;
  white-space: nowrap;
  pointer-events: none;
}
</style>
