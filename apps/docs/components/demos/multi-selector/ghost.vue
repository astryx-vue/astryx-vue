<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const columns = ref(['name', 'email'])
const filters = ref(['active'])
const { pick } = useDemoText()
</script>

<template>
  <div class="toolbar">
    <Button :label="pick('刷新', 'Refresh')" variant="ghost" />
    <MultiSelector
      v-model="columns"
      :options="[
        { value: 'name', label: pick('姓名', 'Name') },
        { value: 'email', label: pick('邮箱', 'Email') },
        { value: 'role', label: pick('角色', 'Role') },
        { value: 'status', label: pick('状态', 'Status') },
        { value: 'created', label: pick('创建时间', 'Created') },
      ]"
      :label="pick('列', 'Columns')"
      label-hidden
      variant="ghost"
      trigger-display="labels"
      :placeholder="pick('列', 'Columns')"
      width="max-content"
    />
    <MultiSelector
      v-model="filters"
      :options="[
        { value: 'active', label: pick('启用', 'Active') },
        { value: 'inactive', label: pick('停用', 'Inactive') },
        { value: 'pending', label: pick('待处理', 'Pending') },
        { value: 'archived', label: pick('已归档', 'Archived') },
      ]"
      :label="pick('状态', 'Status')"
      label-hidden
      variant="ghost"
      trigger-display="labels"
      :placeholder="pick('状态', 'Status')"
      width="max-content"
    />
    <Button :label="pick('导出', 'Export')" variant="ghost" />
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  max-width: 100%;
}
</style>
