<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const content = '| Method | Path | Behavior | Response |\n|---|---|---|---|\n| `GET` | `/v2/projects/{projectId}/documents` | Lists documents in the project, newest first. Paginates with `cursor`. | `200` `DocumentPage` |\n| `POST` | `/v2/projects/{projectId}/documents` | Creates a document. Rejects a duplicate `slug` in the same project. | `201` `Document`, `409` on conflict |\n| `PATCH` | `/v2/documents/{documentId}` | Updates title, body, or tags. Fields left out are untouched. | `200` `Document` |\n| `DELETE` | `/v2/documents/{documentId}` | Soft-deletes the document; it stays readable for 30 days. | `204` no content |'
</script>

<template>
  <div class="markdown-preview__column" style="width: 390px">
    <Markdown :content="content" />
  </div>
</template>
