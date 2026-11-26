<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { InternationalizationProvider } from '@astryx-vue/core/InternationalizationProvider'
import { List, ListItem } from '@astryx-vue/core/List'
import { useTranslator } from '@astryx-vue/core/locale'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { defineComponent, h, ref } from 'vue'

const INVOICES = Array.from({ length: 9 }, (_, index) => `INV-${1001 + index}`)
const PAGE_SIZE = 3

// useTranslator reads the nearest provider, so the list renders inside it.
const InvoiceList = defineComponent(() => {
  const { t } = useTranslator()
  const shownCount = ref(PAGE_SIZE)
  const total = INVOICES.length

  return () => h(VStack, { gap: 3 }, () => [
    h(List, { density: 'compact', hasDividers: true }, () =>
      INVOICES.slice(0, shownCount.value).map(invoice => h(ListItem, { key: invoice, label: invoice }))),
    h(HStack, { gap: 2, hAlign: 'between', vAlign: 'center' }, () => [
      h(Text, { type: 'supporting' }, () =>
        t('@astryx.pagination.count', { from: 1, to: shownCount.value, total })),
      h(Button, {
        label: t('@astryx.metadataList.showMore'),
        size: 'sm',
        isDisabled: shownCount.value >= total,
        onClick: () => { shownCount.value += PAGE_SIZE },
      }),
    ]),
  ])
})

const locale = ref('en')
</script>

<template>
  <InternationalizationProvider :locale="locale">
    <Card :width="360" :padding="4">
      <VStack :gap="3">
        <SegmentedControl v-model="locale" label="Language" size="sm">
          <SegmentedControlItem value="en" label="English" />
          <SegmentedControlItem value="zh-CN" label="中文" />
        </SegmentedControl>
        <InvoiceList />
      </VStack>
    </Card>
  </InternationalizationProvider>
</template>
