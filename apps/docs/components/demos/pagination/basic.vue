<script setup lang="ts">
import { ref } from 'vue'
import { Pagination } from '@astryx-vue/core/Pagination'

const currentPage = ref(1)
const total = ref(200)
const pageSize = ref(10)
</script>

<template>
  <div class="demo-container">
    <Pagination v-model:page="currentPage" :total="total" :page-size="pageSize" />
    <p class="demo-result">
      当前第 {{ currentPage }} 页，共 {{ Math.ceil(total / pageSize) }} 页
    </p>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.demo-result {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
