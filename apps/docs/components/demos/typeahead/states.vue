<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { Typeahead } from '@astryx-vue/core/Typeahead'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const source = computed(() => createStaticSource([
  { id: 'draft', label: pick('草稿', 'Draft') },
  { id: 'review', label: pick('审核中', 'In review') },
]))
</script>

<template>
  <div class="demo-container">
    <Typeahead
      :search-source="source"
      :label="pick('状态', 'Status')"
      :model-value="{ id: 'review', label: pick('审核中', 'In review') }"
      disabled
      :disabled-reason="pick('只有编辑可以修改', 'Only editors can change this')"
      :debounce-ms="0"
    />
    <Typeahead
      :search-source="source"
      :label="pick('负责人', 'Owner')"
      status="error"
      :status-message="pick('请选择负责人', 'Choose an owner')"
      :debounce-ms="0"
      show-on-focus
    />
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: min(20rem, 100%);
}
</style>
