<script setup lang="ts">
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { ref } from 'vue'

const view = ref<string | null>('list')
const marks = ref(['bold'])
</script>

<template>
  <VStack :gap="4">
    <VStack :gap="1">
      <Text color="secondary" type="label">
        Single selection
      </Text>
      <ToggleButtonGroup v-model:value="view" label="View mode">
        <ToggleButton is-icon-only label="List view" tooltip="List view" value="list">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-list" />
          </template>
        </ToggleButton>
        <ToggleButton is-icon-only label="Grid view" tooltip="Grid view" value="grid">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-grid" />
          </template>
        </ToggleButton>
        <ToggleButton is-icon-only label="Table view" tooltip="Table view" value="table">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-table" />
          </template>
        </ToggleButton>
      </ToggleButtonGroup>
    </VStack>
    <VStack :gap="1">
      <Text color="secondary" type="label">
        Multiple selections
      </Text>
      <ToggleButtonGroup v-model:value="marks" label="Formatting" type="multiple">
        <ToggleButton is-icon-only label="Bold" tooltip="Bold" value="bold">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-text-bold" />
          </template>
        </ToggleButton>
        <ToggleButton is-icon-only label="Italic" tooltip="Italic" value="italic">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-text-italic" />
          </template>
        </ToggleButton>
        <ToggleButton is-icon-only label="Underline" tooltip="Underline" value="underline">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-text-underline" />
          </template>
        </ToggleButton>
        <ToggleButton is-icon-only label="Strikethrough" tooltip="Strikethrough" value="strikethrough">
          <template #icon>
            <span class="css-icon css-icon--sm i-carbon-text-strikethrough" />
          </template>
        </ToggleButton>
      </ToggleButtonGroup>
    </VStack>
  </VStack>
</template>
