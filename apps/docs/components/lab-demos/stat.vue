<script setup lang="ts">
import { Stat } from '@astryx-vue/lab'
</script>

<template>
  <Stat
    label="Monthly active users"
    value="1.28M"
    :delta="{ value: '+12.4%', direction: 'up' }"
    description="vs. previous 30 days"
  />
</template>
