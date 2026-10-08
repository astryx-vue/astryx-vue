<script setup lang="ts">
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { shallowRef } from 'vue'

const view = shallowRef<string | null | string[]>('board')
const isFiltering = shallowRef(true)
</script>

<template>
  <div class="toggle-button-preview">
    <div class="toggle-button-preview__row">
      <ToggleButtonGroup v-model:value="view" label="View mode">
        <ToggleButton value="list" label="List">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-list" />
          </template>
        </ToggleButton>
        <ToggleButton value="board" label="Board">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-column" />
          </template>
        </ToggleButton>
        <ToggleButton value="timeline" label="Timeline">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-calendar" />
          </template>
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
    <div class="toggle-button-preview__row">
      <ToggleButton v-model:is-pressed="isFiltering" label="Filter">
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-filter" />
        </template>
        <template #pressedIcon>
          <span class="css-icon css-icon--sm i-carbon-filter" style="color: var(--astryx-icon-accent-foreground)" />
        </template>
      </ToggleButton>
    </div>
  </div>
</template>
