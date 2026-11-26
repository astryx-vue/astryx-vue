<script setup lang="ts">
import { useAnnounce } from '@astryx-vue/core'
import { Card } from '@astryx-vue/core/Card'
import { List, ListItem } from '@astryx-vue/core/List'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const PRODUCTS = [
  'Desk lamp',
  'Desk organizer',
  'Standing desk',
  'Office chair',
  'Chair mat',
  'Monitor arm',
  'Monitor stand',
  'Keyboard tray',
]

const ANNOUNCE_DELAY_MS = 500

function filterProducts(query: string): string[] {
  const needle = query.trim().toLowerCase()
  return PRODUCTS.filter(product => product.toLowerCase().includes(needle))
}

const announce = useAnnounce()
const query = ref('')
const matches = computed(() => filterProducts(query.value))

let timer: ReturnType<typeof setTimeout> | null = null

function cancelPending(): void {
  if (timer != null) {
    clearTimeout(timer)
    timer = null
  }
}

watch(query, (value) => {
  cancelPending()
  if (value === '')
    return
  const nextCount = filterProducts(value).length
  timer = setTimeout(() => {
    timer = null
    announce(nextCount === 0 ? 'No results' : `${nextCount} ${nextCount === 1 ? 'result' : 'results'}`)
  }, ANNOUNCE_DELAY_MS)
})

// A count still pending at unmount would be spoken for a filter that is gone.
onBeforeUnmount(cancelPending)
</script>

<template>
  <Card :width="360" :padding="4">
    <VStack :gap="3">
      <TextInput v-model="query" label="Filter products" has-clear />
      <Text v-if="matches.length === 0" type="body" color="secondary">
        No results
      </Text>
      <List v-else density="compact">
        <ListItem v-for="product in matches" :key="product" :label="product" />
      </List>
    </VStack>
  </Card>
</template>
