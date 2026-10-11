<script setup lang="ts">
import { Token } from '@astryx-vue/core/Token'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
</script>

<template>
  <div class="demo-container">
    <p class="demo-caption">
      {{ pick('当前筛选', 'Active filters') }}
    </p>
    <div class="demo-row">
      <Token :label="pick('状态：打开', 'Status: Open')" color="green" removable />
      <Token :label="pick('优先级：高', 'Priority: High')" color="red" removable />
      <Token :label="pick('团队：设计', 'Team: Design')" color="purple" removable />
    </div>
    <p class="demo-caption">
      {{ pick('已选收件人', 'Selected recipients') }}
    </p>
    <div class="demo-row">
      <Token :label="pick('陈莎拉', 'Sarah Chen')" color="blue" removable />
      <Token :label="pick('瑞维拉', 'Alex Rivera')" color="blue" removable />
      <Token :label="pick('李乔丹', 'Jordan Lee')" color="blue" removable />
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.demo-caption {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}
.demo-caption:first-child {
  margin-top: 0;
}
</style>
