<script setup lang="ts">
import { CheckboxList, CheckboxListItem } from '@astryx-vue/core/CheckboxList'
import { shallowRef } from 'vue'

const value = shallowRef(['updates', 'security'])
</script>

<template>
  <CheckboxList v-model="value" label="Email preferences">
    <CheckboxListItem label="Product updates" value="updates" description="New features and improvements" />
    <CheckboxListItem label="Security alerts" value="security" description="Important account security notifications" />
    <CheckboxListItem label="Marketing" value="marketing" description="Tips, offers, and promotions" />
    <CheckboxListItem label="Beta program" value="beta" description="Currently closed to new members" is-disabled />
  </CheckboxList>
</template>
