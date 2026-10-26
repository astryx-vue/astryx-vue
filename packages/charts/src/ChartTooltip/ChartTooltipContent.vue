<script setup lang="ts">
import type { TooltipSeriesValue } from '../tooltip.js'
import { HStack, Text, VStack } from '@astryx-vue/core'
import { ChartSwatch } from '../ChartSwatch/index.js'
import { swatchVariantForType } from '../ChartSwatch/swatch.js'

/**
 * 提示框的默认内容：上面一行是悬停的 x 值，下面每个系列一行。
 * 只有一个系列时省掉系列名——图里只有一个东西，写出来是多余的。
 */
defineOptions({ name: 'AstryxChartTooltipContent' })

defineProps<{
  xValue: unknown
  rows: TooltipSeriesValue[]
}>()
</script>

<template>
  <VStack :gap="1">
    <Text
      type="body"
      weight="semibold"
    >
      {{ String(xValue) }}
    </Text>
    <Text
      v-if="rows.length === 1"
      type="supporting"
    >
      {{ String(rows[0].value) }}
    </Text>
    <VStack
      v-else
      :gap="1"
    >
      <!-- 文案不保证不重，键里带上序号。 -->
      <HStack
        v-for="(row, index) in rows"
        :key="`${row.key}-${index}`"
        vAlign="center"
        :gap="2"
      >
        <ChartSwatch
          :color="row.color"
          :variant="swatchVariantForType(row.type)"
        />
        <Text type="supporting">
          {{ row.label }}
        </Text>
        <Text
          type="supporting"
          weight="semibold"
        >
          {{ String(row.value) }}
        </Text>
      </HStack>
    </VStack>
  </VStack>
</template>
