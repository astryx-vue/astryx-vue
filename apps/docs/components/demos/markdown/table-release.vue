<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const content = '| Service | Environment | Version | State | Updated | Owner |\n|---|---|---|---|---|---|\n| `web-gateway` | production | `4.12.0` | Healthy | 2 h ago | Platform |\n| `web-gateway` | staging | `4.13.0-rc.2` | Rolling out | 11 min ago | Platform |\n| `search-indexer` | production | `2.8.4` | Degraded — reindexing a shard after a failed migration | 40 min ago | Search |\n| `notifications` | production | `1.30.1` | Healthy | 6 h ago | Messaging |'
</script>

<template>
  <div class="markdown-preview__column" style="width: 390px">
    <Markdown :content="content" />
  </div>
</template>
