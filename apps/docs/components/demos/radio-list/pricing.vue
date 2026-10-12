<script setup lang="ts">
import { RadioList, RadioListItem } from '@astryx-vue/core/RadioList'
import { Text } from '@astryx-vue/core/Text'
import { shallowRef } from 'vue'

const value = shallowRef('')
</script>

<template>
  <RadioList v-model="value" label="Plan">
    <RadioListItem label="Free" value="free">
      <template #end>
        <Text type="body" color="secondary">
          $0/mo
        </Text>
      </template>
    </RadioListItem>
    <RadioListItem label="Pro" value="pro">
      <template #end>
        <Text type="body" color="secondary">
          $9/mo
        </Text>
      </template>
    </RadioListItem>
    <RadioListItem label="Enterprise" value="enterprise">
      <template #end>
        <Text type="body" color="secondary">
          Custom
        </Text>
      </template>
    </RadioListItem>
  </RadioList>
</template>
