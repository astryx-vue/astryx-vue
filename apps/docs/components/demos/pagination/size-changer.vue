<script setup lang="ts">
import { Pagination } from '@astryx-vue/core/Pagination'
import { ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const currentPage = ref(1)
const total = ref(200)
const pageSize = ref(10)
const { pick } = useDemoText()
</script>

<template>
  <div class="demo-container">
    <Pagination
      v-model:page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      show-size-changer
      :page-size-options="[10, 20, 50]"
    />
    <p class="demo-result">
      {{ pick(`每页 ${pageSize} 条，当前第 ${currentPage} 页`, `${pageSize} per page, page ${currentPage}`) }}
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
