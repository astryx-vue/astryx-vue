<script setup lang="ts">
import type { LogEntry } from '@astryx-vue/lab'
import { LogStream } from '@astryx-vue/lab'

const entries: LogEntry[] = [
  { id: 'req-1', timestamp: '14:02:11.482', level: 'info', source: 'api', message: 'GET /api/projects 200', detail: 'Completed in 42 ms with 18 projects.' },
  { id: 'req-2', timestamp: '14:02:12.106', level: 'debug', source: 'cache', message: 'Cache hit for project:list' },
  { id: 'req-3', timestamp: '14:02:12.884', level: 'warn', source: 'api', message: 'Rate limit is approaching', detail: '92 of 100 requests used in the current window.' },
  { id: 'req-4', timestamp: '14:02:13.021', level: 'error', source: 'worker', message: 'Failed to refresh preview', detail: 'The upstream request timed out after 5 seconds.' },
]
</script>

<template>
  <LogStream :entries="entries" :max-height="260" label="Deployment logs" style="width: 100%" />
</template>
