<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { Tokenizer } from '@astryx-vue/core/Tokenizer'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const people = computed(() => [
  { id: 'alice', label: pick('爱丽丝·约翰逊', 'Alice Johnson') },
  { id: 'bob', label: pick('鲍勃·史密斯', 'Bob Smith') },
  { id: 'charlie', label: pick('查理·布朗', 'Charlie Brown') },
  { id: 'diana', label: pick('戴安娜·普林斯', 'Diana Prince') },
])
const source = computed(() => createStaticSource(people.value))
const errorValue = ref<SearchableItem[]>([])
const warningValue = ref<SearchableItem[]>([])
const successValue = ref<SearchableItem[]>([])
warningValue.value = [people.value[0]!]
successValue.value = [people.value[1]!, people.value[3]!]
const disabledValue = computed(() => [people.value[0]!, people.value[2]!])
</script>

<template>
  <div class="demo-stack">
    <Tokenizer
      :model-value="disabledValue"
      :search-source="source"
      :label="pick('禁用', 'Disabled field')"
      disabled
    />
    <Tokenizer
      v-model="errorValue"
      :search-source="source"
      :label="pick('错误', 'Error message')"
      :placeholder="pick('搜索成员', 'Search people...')"
      required
      status="error"
      :status-message="pick('至少需要一位审阅人', 'At least one reviewer is required')"
      :debounce-ms="0"
    />
    <Tokenizer
      v-model="warningValue"
      :search-source="source"
      :label="pick('警告', 'Warning message')"
      :placeholder="pick('搜索成员', 'Search people...')"
      status="warning"
      :status-message="pick('建议至少添加 2 位审批人', 'Consider adding at least 2 approvers')"
      :debounce-ms="0"
    />
    <Tokenizer
      v-model="successValue"
      :search-source="source"
      :label="pick('成功', 'Success message')"
      :placeholder="pick('搜索成员', 'Search people...')"
      status="success"
      :status-message="pick('必需的审阅人都已添加', 'All required reviewers added')"
      :debounce-ms="0"
    />
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 25rem;
  max-width: calc(100vw - 4rem);
}
</style>
