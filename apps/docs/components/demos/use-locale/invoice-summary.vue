<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { InternationalizationProvider } from '@astryx-vue/core/InternationalizationProvider'
import { useLocale } from '@astryx-vue/core/locale'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { computed, defineComponent, h, ref } from 'vue'

const ISSUED_ON = new Date(2026, 10, 2)
const AMOUNT_DUE = 1234.5

// useLocale reads the nearest provider, so the summary renders inside it.
const InvoiceSummary = defineComponent(() => {
  const { locale } = useLocale()
  const issuedOn = computed(() => new Intl.DateTimeFormat(locale.value, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(ISSUED_ON))
  const amountDue = computed(() => new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'USD',
  }).format(AMOUNT_DUE))

  return () => h(VStack, { gap: 1 }, () => [
    h(HStack, { hAlign: 'between' }, () => [
      h(Text, { type: 'body', color: 'secondary' }, () => 'Issued'),
      h(Text, { type: 'body' }, () => issuedOn.value),
    ]),
    h(HStack, { hAlign: 'between' }, () => [
      h(Text, { type: 'body', color: 'secondary' }, () => 'Amount due'),
      h(Text, { type: 'body', weight: 'bold' }, () => amountDue.value),
    ]),
  ])
})

const locale = ref('en')
</script>

<template>
  <InternationalizationProvider :locale="locale">
    <Card :width="320" :padding="4">
      <VStack :gap="3">
        <SegmentedControl v-model="locale" label="Language" size="sm">
          <SegmentedControlItem value="en" label="English" />
          <SegmentedControlItem value="de-DE" label="German" />
        </SegmentedControl>
        <InvoiceSummary />
      </VStack>
    </Card>
  </InternationalizationProvider>
</template>
