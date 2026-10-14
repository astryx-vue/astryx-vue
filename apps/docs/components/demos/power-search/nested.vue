<script setup lang="ts">
import type { PowerSearchConfig, PowerSearchFilter } from '@astryx-vue/core/PowerSearch'
import { PowerSearch } from '@astryx-vue/core/PowerSearch'
import { ref } from 'vue'

const config: PowerSearchConfig = {
  name: 'people',
  fields: [
    {
      key: 'match',
      label: 'Match',
      defaultOperator: 'all',
      operators: [
        { key: 'all', label: 'all of', value: { type: 'nested' } },
        { key: 'any', label: 'any of', value: { type: 'nested' } },
      ],
    },
    {
      key: 'name',
      label: 'Name',
      defaultOperator: 'contains',
      operators: [
        { key: 'contains', i18nKey: '@astryx.powersearch.operator.contains', value: { type: 'string' } },
        { key: 'is', i18nKey: '@astryx.powersearch.operator.is', value: { type: 'string' } },
      ],
    },
    {
      key: 'active',
      label: 'Active',
      defaultOperator: 'is_true',
      operators: [
        { key: 'is_true', i18nKey: '@astryx.powersearch.operator.isTrue', value: { type: 'empty' } },
        { key: 'is_false', i18nKey: '@astryx.powersearch.operator.isFalse', value: { type: 'empty' } },
      ],
    },
  ],
}

const filters = ref<PowerSearchFilter[]>([])
</script>

<template>
  <PowerSearch v-model:filters="filters" :config="config" />
</template>
