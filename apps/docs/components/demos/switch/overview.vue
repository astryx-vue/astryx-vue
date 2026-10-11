<script setup lang="ts">
import { Switch } from '@astryx-vue/core/Switch'
import { shallowRef } from 'vue'

const enabled = shallowRef(true)
</script>

<template>
  <Switch v-model="enabled" label="Notifications" />
</template>
