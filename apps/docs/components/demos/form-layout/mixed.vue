<script setup lang="ts">
import { CheckboxList, CheckboxListItem } from '@astryx-vue/core/CheckboxList'
import { FormLayout } from '@astryx-vue/core/FormLayout'
import { Selector } from '@astryx-vue/core/Selector'
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const name = shallowRef('Maya Torres')
const role = shallowRef('editor')
const notifications = shallowRef(['email', 'push'])

const roles = [
  { label: 'Viewer', value: 'viewer' },
  { label: 'Editor', value: 'editor' },
  { label: 'Admin', value: 'admin' },
]
</script>

<template>
  <FormLayout>
    <TextInput v-model="name" label="Full Name" />
    <Selector v-model="role" label="Role" :options="roles" />
    <CheckboxList v-model="notifications" label="Notifications">
      <CheckboxListItem label="Email" value="email" />
      <CheckboxListItem label="SMS" value="sms" />
      <CheckboxListItem label="Push" value="push" />
    </CheckboxList>
  </FormLayout>
</template>
