<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref<string[]>(['read'])
const { pick } = useDemoText()
const options = computed(() => [
  { value: 'read', label: pick('阅读', 'Read') },
  { value: 'write', label: pick('编辑', 'Write') },
  { type: 'divider' as const },
  {
    type: 'section' as const,
    label: pick('管理', 'Admin'),
    options: [
      { value: 'invite', label: pick('邀请', 'Invite') },
      { value: 'billing', label: pick('账单', 'Billing'), disabled: true },
    ],
  },
])
</script>

<template>
  <div class="demo-container">
    <MultiSelector
      v-model="selected"
      :options="options"
      :label="pick('权限', 'Access')"
      select-all
      clearable
      searchable
    />
    <p class="demo-result">
      {{ pick('已选：', 'Selected: ') }}{{ selected.join(', ') || pick('无', 'none') }}
    </p>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: min(20rem, 100%);
}
.demo-result {
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
</style>
