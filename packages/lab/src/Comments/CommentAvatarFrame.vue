<script setup lang="ts">
import type { CommentUser } from './types.js'
import { Avatar, Center, Thumbnail, useTranslator } from '@astryx-vue/core'
import { computed } from 'vue'

defineOptions({ name: 'AstryxCommentAvatarFrame' })

const props = defineProps<{
  user?: CommentUser
  spacer?: boolean
}>()

const { t } = useTranslator()

const isAgent = computed(() => props.user?.kind === 'agent')
</script>

<template>
  <Center v-if="spacer || user == null" class="astryx-comment-avatar-spacer" aria-hidden="true" />
  <Center
    v-else
    class="astryx-comment-avatar-frame"
    :data-avatar-shape="isAgent ? 'agent' : 'person'"
  >
    <Thumbnail
      v-if="isAgent && user.avatarUrl != null && user.avatarUrl.trim() !== ''"
      :src="user.avatarUrl"
      :alt="t('@astryx.comments.agentLogo', { name: user.name })"
      class="astryx-comment-avatar"
    />
    <Avatar
      v-else
      :name="user.name"
      :src="user.avatarUrl === '' ? undefined : user.avatarUrl"
      :size="32"
      :shape="isAgent ? 'rounded' : 'circle'"
      :tooltip="false"
      class="astryx-comment-avatar"
    />
  </Center>
</template>
