<script setup lang="ts">
import type { ThemeState } from './theme'
import type { TokenGroupKey } from './themeTokensRaw'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ToggleButton, ToggleButtonGroup } from '@astryx-vue/core/ToggleButton'
import { computed, ref } from 'vue'
import PlaygroundTokenRow from './PlaygroundTokenRow.vue'
import { groupSections, TOKEN_GROUPS } from './themeTokensRaw'

defineProps<{
  theme: ThemeState
}>()

const emit = defineEmits<{
  token: [name: string, value: string]
}>()

const active = ref<TokenGroupKey>('colors')
const sections = computed(() => groupSections(active.value))

function onGroup(value: string | string[] | null): void {
  if (typeof value === 'string')
    active.value = value as TokenGroupKey
}
</script>

<template>
  <VStack :gap="3" class="theme-panel">
    <div class="theme-panel__scroll-x">
      <ToggleButtonGroup label="Token category" type="single" size="sm" :value="active" @change="onGroup">
        <ToggleButton
          v-for="group in TOKEN_GROUPS"
          :key="group.key"
          :label="group.label"
          :tooltip="group.label"
          :value="group.key"
          :is-icon-only="active !== group.key"
        >
          <template #icon>
            <span :class="group.icon" class="theme-panel__group-icon" aria-hidden="true" />
          </template>
        </ToggleButton>
      </ToggleButtonGroup>
    </div>

    <VStack :gap="1">
      <VStack v-for="section in sections" :key="section.title" :gap="0">
        <Text v-if="section.title" type="label" color="primary" weight="semibold" class="theme-panel__section-title">
          {{ section.title }}
        </Text>
        <PlaygroundTokenRow
          v-for="name in section.tokens"
          :key="name"
          :group="active"
          :name="name"
          :theme="theme"
          @change="emit('token', name, $event)"
        />
      </VStack>
    </VStack>
  </VStack>
</template>
