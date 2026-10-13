<script setup lang="ts">
import type { TextType } from '@astryx-vue/core/Text'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const types: {
  type: TextType
  label: string
  sample: string
  hasStrikethrough?: boolean
  hasTabularNumbers?: boolean
}[] = [
  { type: 'body', label: 'Body text', sample: 'Body text for paragraphs and general content' },
  { type: 'large', label: 'Large text', sample: 'Large text for introductions and callouts' },
  { type: 'label', label: 'Label text', sample: 'Label text for form fields and section titles' },
  { type: 'supporting', label: 'Supporting text', sample: 'Supporting text for captions and metadata' },
  { type: 'code', label: 'Code text', sample: 'const theme = defineTheme({})' },
  { type: 'body', label: 'Strikethrough', sample: 'Body text with strikethrough decoration', hasStrikethrough: true },
  { type: 'body', label: 'Tabular numbers', sample: '1,234.56  78.90  100,000.00', hasTabularNumbers: true },
]
</script>

<template>
  <VStack :gap="3">
    <VStack v-for="item in types" :key="item.label" :gap="0">
      <Text type="supporting" color="secondary">
        {{ item.label }}
      </Text>
      <Text
        :type="item.type"
        display="block"
        :has-strikethrough="item.hasStrikethrough"
        :has-tabular-numbers="item.hasTabularNumbers"
      >
        {{ item.sample }}
      </Text>
    </VStack>
  </VStack>
</template>
