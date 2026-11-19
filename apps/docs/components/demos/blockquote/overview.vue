<script setup lang="ts">
import { Blockquote } from '@astryx-vue/core/Blockquote'
import { Stack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Stack direction="vertical" :gap="4" style="width: 500px; max-width: 100%">
    <Blockquote>
      Design is not just what it looks like and feels like. Design is how it works.
    </Blockquote>
    <Blockquote cite="Steve Jobs">
      The people who are crazy enough to think they can change the world are the ones who do.
    </Blockquote>
  </Stack>
</template>
