<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { InternationalizationProvider } from '@astryx-vue/core/InternationalizationProvider'
import { List, ListItem } from '@astryx-vue/core/List'
import { useCollator } from '@astryx-vue/core/locale'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { VStack } from '@astryx-vue/core/Stack'
import { computed, defineComponent, h, ref } from 'vue'

const PEOPLE = ['Zoë', 'emma', 'Örjan', 'Ana', 'Émile', 'oscar', 'Åsa']

// useCollator reads the nearest provider, so the list renders inside it.
const PeopleList = defineComponent(() => {
  const collator = useCollator()
  const sorted = computed(() => [...PEOPLE].sort(collator.value.compare))

  return () => h(List, { density: 'compact', hasDividers: true }, () =>
    sorted.value.map(name => h(ListItem, { key: name, label: name })))
})

const locale = ref('en')
</script>

<template>
  <InternationalizationProvider :locale="locale">
    <Card :width="320" :padding="4">
      <VStack :gap="3">
        <SegmentedControl v-model="locale" label="Sort order" size="sm">
          <SegmentedControlItem value="en" label="English" />
          <SegmentedControlItem value="sv-SE" label="Swedish" />
        </SegmentedControl>
        <PeopleList />
      </VStack>
    </Card>
  </InternationalizationProvider>
</template>
