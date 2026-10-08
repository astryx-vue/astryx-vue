<script setup lang="ts">
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="text-preview__stack">
    <Text as="p" display="block" :max-lines="1">
      Truncation keeps long content inside its container: with maxLines set to 1 the text is cut off at the end of the first line and finished with an ellipsis.
    </Text>
    <Text as="p" display="block" :max-lines="2">
      Truncation keeps long content inside its container: with maxLines set to 2 the text is limited to two lines, and anything beyond that is cut off and finished with an ellipsis, so the surrounding layout stays intact no matter how much copy the consumer passes in.
    </Text>
  </div>
</template>
