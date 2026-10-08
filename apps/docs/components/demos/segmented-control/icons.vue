<script setup lang="ts">
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const withLabels = ref('grid')
const iconOnly = ref('grid')
</script>

<template>
  <div class="segmented-control-preview">
    <VStack class="segmented-control-preview__rows" :gap="5" align="start">
      <VStack :gap="2" align="start">
        <Text type="supporting" color="secondary">
          Icon with a label
        </Text>
        <SegmentedControl v-model="withLabels" label="Layout">
          <SegmentedControlItem label="Grid" value="grid">
            <template #icon>
              <span class="css-icon i-carbon-grid" />
            </template>
          </SegmentedControlItem>
          <SegmentedControlItem label="Board" value="board">
            <template #icon>
              <span class="css-icon i-carbon-column" />
            </template>
          </SegmentedControlItem>
          <SegmentedControlItem label="List" value="list">
            <template #icon>
              <span class="css-icon i-carbon-list" />
            </template>
          </SegmentedControlItem>
        </SegmentedControl>
      </VStack>

      <VStack :gap="2" align="start">
        <Text type="supporting" color="secondary">
          Icon only
        </Text>
        <SegmentedControl v-model="iconOnly" label="Layout">
          <SegmentedControlItem is-label-hidden label="Grid" value="grid">
            <template #icon>
              <span class="css-icon i-carbon-grid" />
            </template>
          </SegmentedControlItem>
          <SegmentedControlItem is-label-hidden label="Board" value="board">
            <template #icon>
              <span class="css-icon i-carbon-column" />
            </template>
          </SegmentedControlItem>
          <SegmentedControlItem is-label-hidden label="List" value="list">
            <template #icon>
              <span class="css-icon i-carbon-list" />
            </template>
          </SegmentedControlItem>
        </SegmentedControl>
      </VStack>
    </VStack>
  </div>
</template>
