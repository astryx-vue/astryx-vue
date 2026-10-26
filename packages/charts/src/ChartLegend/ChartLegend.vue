<script setup lang="ts">
import type { ChartLegendProps } from './types.js'
import { HStack, Text, VStack } from '@astryx-vue/core'
import { computed } from 'vue'
import { swatchVariantForType } from '../ChartSwatch/swatch.js'
import { ChartSwatch } from '../ChartSwatch/index.js'
import { useChartMessages } from '../messages.js'

import '../../styles/chart-legend.css'

defineOptions({ name: 'AstryxChartLegend' })

const props = withDefaults(defineProps<ChartLegendProps>(), {
  items: () => [],
  position: 'bottom',
  alignment: 'start',
})

const t = useChartMessages()

const isVertical = computed(() => props.position === 'start' || props.position === 'end')

/** `start` / `end` 摆在图表两侧，用纵向列表；`top` / `bottom` 用可换行的横向列表。 */
const listComponent = computed(() => isVertical.value ? VStack : HStack)

const listProps = computed<Record<string, unknown>>(() => isVertical.value
  ? { gap: 2, hAlign: props.alignment, class: ['astryx-chart-legend', 'astryx-chart-legend--vertical'] }
  : { gap: 4, justify: props.alignment, vAlign: 'center', wrap: 'wrap', class: 'astryx-chart-legend' })
</script>

<template>
  <component
    :is="listComponent"
    v-if="items.length > 0"
    role="list"
    :aria-label="t('@astryx.chartLegend.label')"
    v-bind="listProps"
  >
    <!-- 文案不保证不重（两个系列可以共用一个 label），所以键里带上序号。 -->
    <HStack
      v-for="(item, index) in items"
      :key="`${item.label}-${index}`"
      :gap="2"
      vAlign="center"
      role="listitem"
    >
      <ChartSwatch
        :color="item.color"
        :variant="swatchVariantForType(item.type)"
      />
      <Text type="supporting">
        {{ item.label }}
      </Text>
    </HStack>
  </component>
</template>
