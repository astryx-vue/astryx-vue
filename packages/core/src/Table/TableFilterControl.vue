<script setup lang="ts">
import type { TableFilterContribution, TableFilterValue } from './types.js'
import { ref, watch } from 'vue'
import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useAstryxMessages } from '../locale/context.js'
import Popover from '../Popover/Popover.vue'
import Selector from '../Selector/Selector.vue'
import TextInput from '../TextInput/TextInput.vue'

const props = defineProps<{
  filter: TableFilterContribution
}>()

const messages = useAstryxMessages()
const draft = ref<string>(typeof props.filter.value === 'string' ? props.filter.value : '')

watch(() => props.filter.value, (value) => {
  draft.value = typeof value === 'string' ? value : ''
})

function commit(value: TableFilterValue | null) {
  props.filter.onChange(value)
}

function onInlineInput(value: string) {
  draft.value = value
  commit(value === '' ? null : value)
}
</script>

<template>
  <div class="astryx-table__filter">
    <TextInput
      v-if="filter.variant === 'inline' && filter.field.type === 'string'"
      :model-value="draft"
      :label="filter.field.label"
      is-label-hidden
      size="sm"
      :placeholder="filter.field.label"
      @update:model-value="onInlineInput"
    />
    <Selector
      v-else-if="filter.variant === 'inline'"
      :model-value="draft || null"
      :label="filter.field.label"
      size="sm"
      :placeholder="messages.table.filterAll"
      :options="filter.field.options ?? []"
      @update:model-value="value => commit(value == null || value === '' ? null : String(value))"
    />
    <Popover v-else :label="filter.field.label" :has-close-button="false" :width="240">
      <IconButton variant="ghost" size="sm" :label="filter.field.label">
        <Icon icon="funnel" size="sm" />
      </IconButton>
      <template #content>
        <div class="astryx-table__filter-popover">
          <TextInput
            v-if="filter.field.type === 'string'"
            :model-value="draft"
            :label="filter.field.label"
            is-label-hidden
            size="sm"
            :placeholder="filter.field.label"
            @update:model-value="value => draft = value"
          />
          <Selector
            v-else
            :model-value="draft || null"
            :label="filter.field.label"
            size="sm"
            :placeholder="messages.table.filterAll"
            :options="filter.field.options ?? []"
            @update:model-value="value => draft = value == null ? '' : String(value)"
          />
          <div class="astryx-table__filter-actions">
            <Button variant="ghost" size="sm" :label="messages.table.reset" @click="draft = ''; commit(null)">
              {{ messages.table.reset }}
            </Button>
            <Button variant="primary" size="sm" :label="messages.table.apply" @click="commit(draft === '' ? null : draft)">
              {{ messages.table.apply }}
            </Button>
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>
