<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useScrollableArea } from '@astryx-vue/core'
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { computed, ref } from 'vue'

const ACTIVITY = [
  'Maya created the Checkout project',
  'Sam invited Lee',
  'Build 318 passed',
  'Lee opened "Card total rounds down"',
  'Maya deployed 1.4.2 to staging',
  'Build 319 failed',
  'Sam fixed the rounding test',
  'Build 320 passed',
  'Maya deployed 1.4.3 to production',
  'Lee closed "Card total rounds down"',
]

const count = ref(3)
const { viewport, content, viewportAttrs, viewportStyle, state } = useScrollableArea({
  axis: 'block',
  keyboardAccess: { owner: 'viewport', label: 'Activity log' },
  overscroll: 'contain',
})

function bindContent(el: Element | ComponentPublicInstance | null): void {
  content.value = el instanceof HTMLElement ? el : null
}

const shadowClass = computed(() => {
  const { isScrollable, atStart, atEnd } = state.value.block
  return {
    'activity-log-demo__viewport--above': isScrollable && !atStart,
    'activity-log-demo__viewport--below': isScrollable && !atEnd,
  }
})
</script>

<template>
  <Card :width="320" :padding="4">
    <VStack :gap="3">
      <HStack h-align="between" align="center">
        <Heading :level="4">
          Activity log
        </Heading>
        <Button
          label="Add entry"
          variant="secondary"
          :is-disabled="count === ACTIVITY.length"
          @click="count += 1"
        />
      </HStack>
      <div
        :ref="viewport"
        v-bind="viewportAttrs"
        class="activity-log-demo__viewport"
        :class="shadowClass"
        :style="viewportStyle"
      >
        <div :ref="bindContent" class="activity-log-demo__content">
          <Text v-for="entry in ACTIVITY.slice(0, count)" :key="entry" type="body">
            {{ entry }}
          </Text>
        </div>
      </div>
    </VStack>
  </Card>
</template>

<style scoped>
.activity-log-demo__viewport {
  --_shadow-top: inset 0 12px 8px -8px var(--astryx-color-shadow);
  --_shadow-bottom: inset 0 -12px 8px -8px var(--astryx-color-shadow);

  height: 160px;
}

.activity-log-demo__viewport--above {
  box-shadow: var(--_shadow-top);
}

.activity-log-demo__viewport--below {
  box-shadow: var(--_shadow-bottom);
}

.activity-log-demo__viewport--above.activity-log-demo__viewport--below {
  box-shadow: var(--_shadow-top), var(--_shadow-bottom);
}

.activity-log-demo__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
