<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const content = '| Identifier | Endpoint | Status | Accessibility status and remediation owner |\n|---|---|---|---|\n| [PR #6860](https://github.com/facebook/astryx/pull/6860) | https://example.com/v2/pipelines/build/runs/1284/logs | `needs_revision_before_landing_v2` | Pass |\n| [PR #6852](https://github.com/facebook/astryx/pull/6852) | https://example.com/v2/pipelines/docs/runs/97/logs | `ContentNegotiationMiddleware` | Review |'
</script>

<template>
  <div class="markdown-preview__column" style="width: 390px">
    <Markdown :content="content" />
  </div>
</template>
