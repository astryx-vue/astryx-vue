<script setup lang="ts">
import { Pagination } from '@astryx-vue/core/Pagination'
import { ref } from 'vue'

const page = ref(3)
</script>

<template>
  <!-- 5 pages fit the card, so the numbered buttons stay visible instead of collapsing. -->
  <Pagination
    v-model:page="page"
    :page-size="10"
    :total="50"
    prev-label="Previous"
    next-label="Next"
  />
</template>
