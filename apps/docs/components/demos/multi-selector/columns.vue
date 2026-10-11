<script setup lang="ts">
import { MultiSelector } from '@astryx-vue/core/MultiSelector'
import { computed, ref } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const selected = ref(['name', 'email', 'role', 'status'])
const { pick } = useDemoText()
const options = computed(() => [
  { value: 'name', label: pick('姓名', 'Name') },
  { value: 'email', label: pick('邮箱', 'Email') },
  { value: 'role', label: pick('角色', 'Role') },
  { value: 'status', label: pick('状态', 'Status') },
  { value: 'created', label: pick('创建时间', 'Created') },
  { value: 'updated', label: pick('更新时间', 'Updated') },
  { value: 'actions', label: pick('操作', 'Actions') },
])
</script>

<template>
  <div class="demo-field">
    <MultiSelector
      v-model="selected"
      :options="options"
      :label="pick('列', 'Columns')"
      label-hidden
      :placeholder="pick('列', 'Columns')"
      searchable
      select-all
      trigger-display="count"
    />
  </div>
</template>

<style scoped>
.demo-field {
  width: 20rem;
  max-width: calc(100vw - 4rem);
}
</style>
