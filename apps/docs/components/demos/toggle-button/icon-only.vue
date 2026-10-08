<script setup lang="ts">
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { shallowRef } from 'vue'

const tools = shallowRef<string | null | string[]>(['columns'])
const isRecording = shallowRef(false)
</script>

<template>
  <div class="toggle-button-preview">
    <div class="toggle-button-preview__row">
      <ToggleButtonGroup v-model:value="tools" label="Board tools" type="multiple">
        <ToggleButton value="filter" is-icon-only label="Filter" tooltip="Filter">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-filter" />
          </template>
        </ToggleButton>
        <ToggleButton value="sort" is-icon-only label="Sort" tooltip="Sort">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-arrows-vertical" />
          </template>
        </ToggleButton>
        <ToggleButton value="columns" is-icon-only label="Columns" tooltip="Columns">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-column" />
          </template>
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
    <div class="toggle-button-preview__row">
      <ToggleButton
        v-model:is-pressed="isRecording"
        is-icon-only
        label="Record"
        tooltip="Record"
      >
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-microphone" />
        </template>
        <template #pressedIcon>
          <span class="css-icon css-icon--sm i-carbon-stop-filled" style="color: var(--astryx-icon-error-foreground)" />
        </template>
      </ToggleButton>
    </div>
  </div>
</template>
