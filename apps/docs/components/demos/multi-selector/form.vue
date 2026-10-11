<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const columns = ref(['name', 'email'])
const filters = ref<string[]>([])
const { pick } = useDemoText()
</script>

<template>
  <div class="demo-stack">
    <MultiSelector
      v-model="columns"
      :options="[
        { value: 'name', label: pick('姓名', 'Name') },
        { value: 'email', label: pick('邮箱', 'Email') },
        { value: 'role', label: pick('角色', 'Role') },
        { value: 'status', label: pick('状态', 'Status') },
        { value: 'created', label: pick('创建时间', 'Created at') },
      ]"
      :label="pick('可见列', 'Visible columns')"
      :description="pick('选择表格里要显示的列', 'Choose which columns to display in the table')"
      required
      select-all
      trigger-display="labels"
    />
    <MultiSelector
      v-model="filters"
      :options="[
        pick('启用', 'Active'),
        pick('停用', 'Inactive'),
        pick('待处理', 'Pending'),
        pick('已归档', 'Archived'),
      ]"
      :label="pick('状态筛选', 'Status filter')"
      :description="pick('按状态筛选', 'Filter by status')"
      :placeholder="pick('全部状态', 'All statuses')"
      optional
      trigger-display="badges"
    />
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
