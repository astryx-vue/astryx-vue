<script setup lang="ts">
import { Pagination } from '@astryx-vue/core/Pagination'
import { ref } from 'vue'

const page = ref(3)
</script>

<template>
  <Pagination
    v-model:page="page"
    :page-size="10"
    :total="240"
    variant="input"
  />
</template>
