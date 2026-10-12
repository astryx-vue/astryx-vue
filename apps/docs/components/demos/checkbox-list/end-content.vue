<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { CheckboxList, CheckboxListItem } from '@astryx-vue/core/CheckboxList'
import { shallowRef } from 'vue'

const value = shallowRef(['free'])
</script>

<template>
  <CheckboxList v-model="value" label="Add-on packages" has-dividers>
    <CheckboxListItem label="Free tier" value="free" description="Basic features included">
      <template #end>
        <Badge variant="success">
          $0/mo
        </Badge>
      </template>
    </CheckboxListItem>
    <CheckboxListItem label="Pro tier" value="pro" description="Advanced analytics and integrations">
      <template #end>
        <Badge variant="info">
          $9/mo
        </Badge>
      </template>
    </CheckboxListItem>
    <CheckboxListItem label="Enterprise" value="enterprise" description="Custom solutions and dedicated support">
      <template #end>
        <Badge variant="purple">
          Custom
        </Badge>
      </template>
    </CheckboxListItem>
  </CheckboxList>
</template>
