<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { Timestamp } from '@astryx-vue/core/Timestamp'

provideAstryxLocale('en')
</script>

<template>
  <Timestamp value="2026-03-25T12:00:00Z" color="primary" />
</template>
