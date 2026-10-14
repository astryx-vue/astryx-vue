<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Field } from '@astryx-vue/core/Field'
import { InputGroup } from '@astryx-vue/core/InputGroup'
import { Selector } from '@astryx-vue/core/Selector'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const visibility = [
  {
    value: 'private',
    label: 'Private',
    icon: 'css-icon css-icon--sm i-carbon-locked',
    description: 'Only members can access this space and its content.',
  },
  {
    value: 'public',
    label: 'Public',
    icon: 'css-icon css-icon--sm i-carbon-earth',
    description: 'Anyone at the company can find and join this space.',
  },
]

const condensed = ref('private')
const full = ref('private')
const grouped = ref('private')
</script>

<template>
  <VStack :gap="6" style="width: 320px; max-width: 100%">
    <Selector
      v-model="condensed"
      label="Visibility"
      description="Default trigger: one line at the size token."
      :options="visibility"
    />
    <Selector
      v-model="full"
      label="Visibility"
      description="A stacked value: the description gets its own line, and the trigger grows by exactly one line."
      :options="visibility"
    >
      <template #selected="{ option }">
        <span v-if="option" class="selector-value">
          <span :class="option.icon" aria-hidden="true" />
          <span>
            <span class="selector-value__label">{{ option.label }}</span>
            <span class="selector-value__description">{{ option.description }}</span>
          </span>
        </span>
      </template>
    </Selector>
    <Field input-id="visibility-grouped" label="Visibility">
      <InputGroup>
        <Selector
          v-model="grouped"
          label="Visibility"
          is-label-hidden
          :options="visibility"
        >
          <template #selected="{ option }">
            <span v-if="option" class="selector-value selector-value--inline">
              <span :class="option.icon" aria-hidden="true" />
              <span>{{ option.label }}</span>
            </span>
          </template>
        </Selector>
        <template #after>
          <Button label="Save" />
        </template>
      </InputGroup>
    </Field>
  </VStack>
</template>

<style scoped>
.selector-value {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
}

.selector-value--inline {
  align-items: center;
}

.selector-value__label,
.selector-value__description {
  display: block;
}

.selector-value__description {
  color: var(--astryx-color-text-secondary, #525252);
  font-size: 0.75rem;
  line-height: 1.4;
}
</style>
