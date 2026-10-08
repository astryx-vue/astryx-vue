<script setup lang="ts">
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { shallowRef } from 'vue'

const alignment = shallowRef<string | null | string[]>('start')
const columns = shallowRef<string | null | string[]>(['owner', 'status'])
</script>

<template>
  <div class="toggle-button-preview">
    <div class="toggle-button-preview__row">
      <ToggleButtonGroup v-model:value="alignment" label="Text alignment">
        <ToggleButton value="start" label="Start" />
        <ToggleButton value="center" label="Center" />
        <ToggleButton value="end" label="End" />
      </ToggleButtonGroup>
    </div>
    <div class="toggle-button-preview__row">
      <ToggleButtonGroup
        v-model:value="columns"
        label="Visible columns"
        type="multiple"
      >
        <ToggleButton value="owner" label="Owner" />
        <ToggleButton value="status" label="Status" />
        <ToggleButton value="due" label="Due date" />
      </ToggleButtonGroup>
    </div>
  </div>
</template>
