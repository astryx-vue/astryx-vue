<script setup lang="ts">
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="text-preview__clamp">
    <div>
      <Text type="label" display="block">
        Break-word (default for multi-line)
      </Text>
      <div class="text-preview__box">
        <Text type="body" :max-lines="2" word-break="break-word">
          This is a verylongunbreakableword for a break-word example
        </Text>
      </div>
    </div>
    <div>
      <Text type="label" display="block">
        Break-all (default for single-line)
      </Text>
      <div class="text-preview__box">
        <Text type="body" :max-lines="2" word-break="break-all">
          Breaks anywhere: abcdefghijklmnopqrstuvwxyz0123456789
        </Text>
      </div>
    </div>
  </div>
</template>
