<script setup lang="ts">
import type { ThemeState } from './theme'
import { Button } from '@astryx-vue/core/Button'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { Selector } from '@astryx-vue/core/Selector'
import { HStack, StackItem, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { TextInput } from '@astryx-vue/core/TextInput'
import { computed, ref } from 'vue'
import { shownTokens } from './themeShownTokens'
import { ALL_COMPONENT_NAMES, COMPONENT_VARS, resolveOptionLabel } from './themeTokensComponents'

const props = defineProps<{
  theme: ThemeState
}>()

const emit = defineEmits<{
  token: [name: string, value: string]
  addOverride: [entry: { component: string, property: string, value: string }]
  removeOverride: [id: string]
  updateOverride: [id: string, value: string]
}>()

const CUSTOM = '__custom__'

/** 点了「Custom...」的变量，改用文本框输入。 */
const customVars = ref<Set<string>>(new Set())
const newComponent = ref('button')
const newProperty = ref('')
const newValue = ref('')

const groups = Object.values(COMPONENT_VARS)
const componentOptions = ALL_COMPONENT_NAMES.map(name => ({ value: name, label: name }))

/** 选项后面显示的实际值：基础面板调过的刻度也要算进去。 */
const resolved = computed(() => shownTokens(props.theme))

function currentValue(name: string): string {
  return props.theme.componentTokens[name] ?? ''
}

function showsText(name: string, options: Array<{ value: string }>): boolean {
  if (customVars.value.has(name))
    return true
  const value = currentValue(name)
  return value !== '' && !options.some(option => option.value === value)
}

function selectorOptions(options: Parameters<typeof resolveOptionLabel>[0][]) {
  return [
    ...options.map(option => ({ value: option.value, label: resolveOptionLabel(option, resolved.value) })),
    { value: CUSTOM, label: 'Custom...' },
  ]
}

function onSelect(name: string, value: string | number | null): void {
  if (value === CUSTOM)
    customVars.value = new Set(customVars.value).add(name)
  else if (typeof value === 'string')
    emit('token', name, value)
}

function onText(name: string, value: string): void {
  emit('token', name, value)
  if (value.trim() === '') {
    const next = new Set(customVars.value)
    next.delete(name)
    customVars.value = next
  }
}

function addOverride(): void {
  if (!newProperty.value || !newValue.value)
    return
  emit('addOverride', { component: newComponent.value, property: newProperty.value, value: newValue.value })
  newProperty.value = ''
  newValue.value = ''
}
</script>

<template>
  <VStack :gap="4" class="theme-panel">
    <VStack v-for="group in groups" :key="group.label" :gap="2">
      <Heading :level="4">
        {{ group.label }}
      </Heading>
      <VStack :gap="1">
        <HStack
          v-for="item in group.vars"
          :key="item.name"
          align="center"
          justify="between"
          class="theme-panel__row"
        >
          <StackItem size="fill" class="theme-panel__label">
            <Text type="label" color="secondary" :max-lines="1">
              {{ item.description }}
            </Text>
          </StackItem>
          <StackItem class="theme-panel__control">
            <TextInput
              v-if="showsText(item.name, item.options)"
              :label="item.name"
              is-label-hidden
              size="sm"
              :model-value="currentValue(item.name)"
              :placeholder="item.default"
              @update:model-value="onText(item.name, $event)"
            />
            <Selector
              v-else
              :label="item.name"
              is-label-hidden
              size="sm"
              :options="selectorOptions(item.options)"
              :model-value="currentValue(item.name) || item.default"
              @update:model-value="onSelect(item.name, $event)"
            />
          </StackItem>
        </HStack>
      </VStack>
    </VStack>

    <Divider />

    <VStack :gap="3">
      <Heading :level="4">
        Custom Overrides
      </Heading>
      <Text type="supporting" color="secondary">
        Override any CSS property on any component.
      </Text>

      <VStack v-for="override in theme.customOverrides" :key="override.id" :gap="1">
        <HStack :gap="2" align="end">
          <StackItem size="fill" class="theme-panel__label">
            <Text type="supporting" color="secondary" :max-lines="1">
              .astryx-{{ override.component }} → {{ override.property }}
            </Text>
          </StackItem>
          <Button label="Remove" variant="ghost" size="sm" @click="emit('removeOverride', override.id)" />
        </HStack>
        <TextInput
          :label="`${override.component} ${override.property}`"
          is-label-hidden
          size="sm"
          :model-value="override.value"
          @update:model-value="emit('updateOverride', override.id, $event)"
        />
      </VStack>

      <VStack :gap="2">
        <Selector v-model="newComponent" label="Component" size="sm" :options="componentOptions" />
        <TextInput v-model="newProperty" label="CSS property (camelCase)" size="sm" placeholder="e.g. borderRadius" />
        <TextInput v-model="newValue" label="CSS value" size="sm" placeholder="e.g. 9999px" />
        <Button
          label="Add Override"
          variant="secondary"
          size="sm"
          :is-disabled="!newProperty || !newValue"
          @click="addOverride"
        />
      </VStack>
    </VStack>
  </VStack>
</template>
