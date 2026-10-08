<script setup lang="ts">
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const partial = ref('draft')
const disabled = ref('published')
const fill = ref('week')
</script>

<template>
  <div class="segmented-control-preview">
    <VStack class="segmented-control-preview__rows" :gap="5" align="start">
      <VStack :gap="2" align="start">
        <Text type="supporting" color="secondary">
          One segment disabled
        </Text>
        <SegmentedControl v-model="partial" label="Visibility">
          <SegmentedControlItem label="Draft" value="draft" />
          <SegmentedControlItem is-disabled label="Scheduled" value="scheduled" />
          <SegmentedControlItem label="Published" value="published" />
        </SegmentedControl>
      </VStack>

      <VStack :gap="2" align="start">
        <Text type="supporting" color="secondary">
          Whole control disabled, with a reason
        </Text>
        <SegmentedControl
          v-model="disabled"
          disabled-message="Only workspace owners can change this."
          is-disabled
          label="Visibility"
        >
          <SegmentedControlItem label="Draft" value="draft" />
          <SegmentedControlItem label="Scheduled" value="scheduled" />
          <SegmentedControlItem label="Published" value="published" />
        </SegmentedControl>
      </VStack>

      <VStack :gap="2" align="start">
        <Text type="supporting" color="secondary">
          Filling a narrow card
        </Text>
        <div class="segmented-control-preview__frame">
          <SegmentedControl v-model="fill" label="Reporting range" layout="fill">
            <SegmentedControlItem label="Day" value="day" />
            <SegmentedControlItem label="Week" value="week" />
            <SegmentedControlItem label="Month" value="month" />
          </SegmentedControl>
        </div>
      </VStack>
    </VStack>
  </div>
</template>
