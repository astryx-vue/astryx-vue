<script setup lang="ts">
import { CheckboxList, CheckboxListItem } from '@astryx-vue/core/CheckboxList'
import { VStack } from '@astryx-vue/core/Stack'
import { ref } from 'vue'

const saved = ref(['csv'])
const locked = ref<string[]>([])
const pending = ref<string[]>([])
</script>

<template>
  <div style="width: 320px; max-width: 100%">
    <VStack :gap="6">
      <CheckboxList v-model="saved" label="Saved export" is-read-only>
        <CheckboxListItem label="CSV" value="csv" />
        <CheckboxListItem label="JSON" value="json" />
      </CheckboxList>
      <CheckboxList v-model="locked" label="Managed export" is-disabled disabled-reason="Ask an administrator">
        <CheckboxListItem label="CSV" value="csv" />
        <CheckboxListItem label="JSON" value="json" />
      </CheckboxList>
      <CheckboxList v-model="pending" label="Live export">
        <CheckboxListItem label="CSV" value="csv" is-loading />
        <CheckboxListItem label="JSON" value="json" />
      </CheckboxList>
    </VStack>
  </div>
</template>
