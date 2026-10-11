<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const options = computed(() => [
  { value: 'email', label: pick('邮件', 'Email') },
  { value: 'push', label: pick('推送', 'Push') },
])
</script>

<template>
  <div class="demo-container">
    <MultiSelector
      :options="options"
      :model-value="['email']"
      :label="pick('通知', 'Notifications')"
      disabled
      :disabled-reason="pick('项目已归档', 'This project is archived')"
    />
    <MultiSelector
      :options="options"
      :label="pick('渠道', 'Channels')"
      status="error"
      :status-message="pick('至少选一个渠道', 'Choose at least one channel')"
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
