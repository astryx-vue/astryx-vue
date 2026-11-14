<script setup lang="ts">
import type { CommentPinParticipant, CommentPinSize } from '@astryx-vue/lab'
import { CommentPin } from '@astryx-vue/lab'

const PEOPLE = {
  ada: { id: 'ada', name: 'Ada Lovelace', avatarSrc: 'https://i.pravatar.cc/80?img=47' },
  lin: { id: 'lin', name: 'Lin Chen', avatarSrc: 'https://i.pravatar.cc/80?img=32' },
  mira: { id: 'mira', name: 'Mira Patel', avatarSrc: 'https://i.pravatar.cc/80?img=5' },
  noah: { id: 'noah', name: 'Noah Williams', avatarSrc: 'https://i.pravatar.cc/80?img=12' },
  sam: { id: 'sam', name: 'Sam Rivera', avatarSrc: 'https://i.pravatar.cc/80?img=15' },
} as const satisfies Record<string, CommentPinParticipant>

const EVERYONE = [PEOPLE.ada, PEOPLE.lin, PEOPLE.mira, PEOPLE.noah, PEOPLE.sam] as const satisfies readonly [CommentPinParticipant, ...CommentPinParticipant[]]
const SIZES: CommentPinSize[] = ['sm', 'md', 'lg']

const rows = [
  {
    name: 'Single',
    props: { label: 'Open annotation from Ada', participants: [PEOPLE.ada] },
  },
  {
    name: 'Grouped',
    props: {
      label: 'Open 4 grouped annotations from Ada and Lin',
      participants: [PEOPLE.ada, PEOPLE.lin],
      threadCount: 4,
    },
  },
  {
    name: 'Group overflow',
    props: {
      label: 'Open 8 grouped annotations from Ada, Lin, and 3 others',
      participants: EVERYONE,
      threadCount: 8,
    },
  },
  {
    name: 'Unread single',
    props: {
      label: 'Open unread annotation from Mira',
      participants: [PEOPLE.mira],
      unreadCount: 1,
    },
  },
  {
    name: 'Unread group',
    props: {
      label: 'Open 8 grouped annotations from Ada, Lin, and 3 others, 3 unread',
      participants: EVERYONE,
      threadCount: 8,
      unreadCount: 3,
    },
  },
  {
    name: 'Selected group',
    props: {
      label: 'Current group of 12 annotations from Ada, Lin, and 3 others',
      participants: EVERYONE,
      threadCount: 12,
      isSelected: true,
    },
  },
] as const
</script>

<template>
  <div class="comment-pin-sizes">
    <div class="comment-pin-sizes__row comment-pin-sizes__row--head">
      <div class="comment-pin-sizes__label">
        Size
      </div>
      <div v-for="size in SIZES" :key="size" class="comment-pin-sizes__cell">
        {{ size }}
      </div>
    </div>
    <div v-for="row in rows" :key="row.name" class="comment-pin-sizes__row">
      <div class="comment-pin-sizes__label">
        {{ row.name }}
      </div>
      <div v-for="size in SIZES" :key="size" class="comment-pin-sizes__cell">
        <CommentPin v-bind="row.props" :size="size" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-pin-sizes {
  display: flex;
  flex-direction: column;
  gap: var(--astryx-spacing-3);
  padding: var(--astryx-spacing-4);
  overflow-x: auto;
}

.comment-pin-sizes__row {
  display: flex;
  align-items: center;
  gap: var(--astryx-spacing-4);
  min-height: 44px;
}

.comment-pin-sizes__label,
.comment-pin-sizes__cell {
  min-width: 120px;
}

.comment-pin-sizes__label {
  min-width: 140px;
  color: var(--astryx-color-text-secondary);
  font-size: var(--astryx-text-supporting-size);
}
</style>
