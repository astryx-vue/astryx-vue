<script setup lang="ts">
import { getLocaleDirection } from '@astryx-vue/core'
import { useScheduleContext } from './context.js'

defineOptions({ name: 'AstryxScheduleTime' })

const ctx = useScheduleContext()
</script>

<template>
  <bdi :dir="getLocaleDirection(ctx.locale)">
    <slot />
  </bdi>
</template>
