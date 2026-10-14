<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
import { Pagination } from '@astryx-vue/core/Pagination'
import { VStack } from '@astryx-vue/core/Stack'
import { Table } from '@astryx-vue/core/Table'
import { ref } from 'vue'

const rows = [
  { id: '1', date: 'Apr 18', description: 'Payment received', amount: '$2,450.00' },
  { id: '2', date: 'Apr 15', description: 'Subscription renewal', amount: '$99.00' },
  { id: '3', date: 'Apr 12', description: 'Refund issued', amount: '-$180.00' },
  { id: '4', date: 'Apr 10', description: 'Invoice paid', amount: '$1,200.00' },
]

const columns = [
  { key: 'date', header: 'Date' },
  { key: 'description', header: 'Description' },
  { key: 'amount', header: 'Amount' },
]

const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <VStack style="width: 100%; max-width: 500px">
    <Heading :level="4">
      Transactions
    </Heading>
    <Table :columns="columns" :data="rows" id-key="id" />
    <Pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      show-size-changer
      :page-size-options="[10, 25, 50, 100]"
      :total="350"
      variant="count"
      style="padding-top: 8px; flex-direction: row-reverse"
    />
  </VStack>
</template>
