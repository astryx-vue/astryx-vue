<script setup lang="ts">
import { Link } from '@astryx-vue/core/Link'
</script>

<template>
  <div class="link-preview" style="width: 16rem">
    <Link href="#notes" :max-lines="2" size="sm" weight="semibold">
      Field notes from the harbor survey, including the tide table and the list of boats still in the channel.
    </Link>
  </div>
</template>
