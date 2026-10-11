<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { Tokenizer } from '@astryx-vue/core/Tokenizer'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const source = computed(() => createStaticSource([{ id: 'ada', label: 'Ada' }]))
const selected = computed(() => [{ id: 'ada', label: 'Ada' }])
</script>

<template>
  <div class="demo-container">
    <Tokenizer
      :model-value="selected"
      :search-source="source"
      :label="pick('审阅人', 'Reviewer')"
      disabled
      :disabled-reason="pick('评审已经结束', 'The review is closed')"
    />
    <Tokenizer
      :search-source="source"
      :label="pick('收件人', 'Recipients')"
      status="error"
      :status-message="pick('至少添加一位收件人', 'Add at least one recipient')"
    />
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
