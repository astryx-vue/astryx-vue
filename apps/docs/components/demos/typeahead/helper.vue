<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { Typeahead } from '@astryx-vue/core/Typeahead'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref(null)
const { pick } = useDemoText()
const source = computed(() => createStaticSource([
  { id: 'eng', label: pick('工程', 'Engineering') },
  { id: 'design', label: pick('设计', 'Design') },
  { id: 'marketing', label: pick('市场', 'Marketing') },
  { id: 'sales', label: pick('销售', 'Sales') },
  { id: 'product', label: pick('产品', 'Product') },
]))
</script>

<template>
  <div class="demo-container">
    <Typeahead
      v-model="selected"
      :search-source="source"
      :label="pick('部门', 'Department')"
      :placeholder="pick('搜索部门', 'Search departments...')"
      :description="pick('选择这条请求应该交给哪个部门', 'Select the department this request should be routed to')"
      :debounce-ms="0"
    />
  </div>
</template>

<style scoped>
.demo-container {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
