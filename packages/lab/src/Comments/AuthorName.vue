<script setup lang="ts">
import type { CommentUser } from './types.js'
import { Link, Text } from '@astryx-vue/core'

defineOptions({ name: 'AstryxCommentAuthorName' })

defineProps<{
  author: CommentUser
  id?: string
}>()
</script>

<template>
  <Text
    :id="id"
    type="label"
    color="primary"
    weight="medium"
    :max-lines="1"
    class="astryx-comment-author-name"
    :data-author-name="author.name"
  >
    <Link v-if="author.href != null" :href="author.href" type="inherit" color="inherit">
      {{ author.name }}
    </Link>
    <template v-else>
      {{ author.name }}
    </template>
  </Text>
</template>
