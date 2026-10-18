<script setup lang="ts">
import { InternationalizationProvider } from '@astryx-vue/core/InternationalizationProvider'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { Selector } from '@astryx-vue/core/Selector'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const locale = ref('en')
const selected = ref<string | null>(null)

const options = [
  { value: 'americas', label: 'Americas' },
  { value: 'emea', label: 'EMEA' },
  { value: 'apac', label: 'APAC' },
]
</script>

<template>
  <div class="internationalization-provider-preview">
    <VStack :gap="4" align="center">
      <SegmentedControl v-model="locale" label="Language" size="sm">
        <SegmentedControlItem label="EN" value="en" />
        <SegmentedControlItem label="中文" value="zh-CN" />
      </SegmentedControl>
      <InternationalizationProvider :locale="locale">
        <Selector
          v-model="selected"
          label="Billing region"
          :options="options"
          :width="240"
        />
      </InternationalizationProvider>
    </VStack>
  </div>
</template>
