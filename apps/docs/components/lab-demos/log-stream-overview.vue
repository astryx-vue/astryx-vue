<script setup lang="ts">
import type { LogEntry } from '@astryx-vue/lab'
import { LogStream } from '@astryx-vue/lab'

const entries: LogEntry[] = [
  { id: 'one', timestamp: '14:02', level: 'info', source: 'api', message: 'Request complete' },
  { id: 'two', timestamp: '14:03', level: 'debug', source: 'cache', message: 'Cache hit' },
  { id: 'three', timestamp: '14:04', level: 'warn', source: 'api', message: 'Rate limit near' },
]
</script>

<template>
  <LogStream :entries="entries" :max-height="160" :has-timestamps="false" label="Deployment logs" style="width: 100%" />
</template>
