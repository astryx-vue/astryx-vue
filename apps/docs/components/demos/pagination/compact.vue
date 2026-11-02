<script setup lang="ts">
import { Pagination } from '@astryx-vue/core/Pagination'
import { ref } from 'vue'

const page = ref(5)
</script>

<template>
  <Pagination
    v-model:page="page"
    :page-size="10"
    :total="100"
    variant="compact"
    has-first-last
  />
</template>
