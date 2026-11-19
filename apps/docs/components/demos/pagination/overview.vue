<script setup lang="ts">
import { Pagination } from '@astryx-vue/core/Pagination'
import { Stack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const pagesPage = ref(3)
const countPage = ref(2)
const compactPage = ref(5)
const dotsPage = ref(3)
</script>

<template>
  <Stack direction="vertical" :gap="5" h-align="center" class="pagination-overview">
    <Pagination v-model:page="dotsPage" label="Dots pagination" :total-pages="8" variant="dots" />
    <Pagination v-model:page="compactPage" label="Compact pagination" :total-pages="10" variant="compact" />
    <Pagination
      v-model:page="countPage"
      label="Count pagination"
      :total-items="200"
      :page-size="20"
      variant="count"
    />
    <Pagination
      v-model:page="pagesPage"
      label="Pages pagination"
      :total-items="200"
      :page-size="10"
      variant="pages"
    />
  </Stack>
</template>

<style scoped>
.pagination-overview {
  width: 100%;
}
</style>
