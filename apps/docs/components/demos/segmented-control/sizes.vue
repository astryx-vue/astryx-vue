<script setup lang="ts">
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const small = ref('day')
const medium = ref('day')
const large = ref('day')
</script>

<template>
  <div class="segmented-control-preview">
    <VStack class="segmented-control-preview__rows" :gap="5" align="start">
      <VStack :gap="2" align="start">
        <Text type="supporting" color="secondary">
          Small
        </Text>
        <SegmentedControl v-model="small" label="Range" size="sm">
          <SegmentedControlItem label="Day" value="day" />
          <SegmentedControlItem label="Week" value="week" />
          <SegmentedControlItem label="Month" value="month" />
        </SegmentedControl>
      </VStack>

      <VStack :gap="2" align="start">
        <Text type="supporting" color="secondary">
          Medium
        </Text>
        <SegmentedControl v-model="medium" label="Range" size="md">
          <SegmentedControlItem label="Day" value="day" />
          <SegmentedControlItem label="Week" value="week" />
          <SegmentedControlItem label="Month" value="month" />
        </SegmentedControl>
      </VStack>

      <VStack :gap="2" align="start">
        <Text type="supporting" color="secondary">
          Large
        </Text>
        <SegmentedControl v-model="large" label="Range" size="lg">
          <SegmentedControlItem label="Day" value="day" />
          <SegmentedControlItem label="Week" value="week" />
          <SegmentedControlItem label="Month" value="month" />
        </SegmentedControl>
      </VStack>
    </VStack>
  </div>
</template>
