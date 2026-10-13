<script setup lang="ts">
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="text-preview__clamp">
    <div>
      <Text type="label" display="block">
        Wrap (default)
      </Text>
      <div class="text-preview__box">
        <Text type="body" text-wrap="wrap">
          This text wraps normally at word boundaries when it reaches the edge.
        </Text>
      </div>
    </div>
    <div>
      <Text type="label" display="block">
        Nowrap
      </Text>
      <div class="text-preview__box text-preview__box--clip">
        <Text type="body" text-wrap="nowrap">
          This text does not wrap and will overflow its container.
        </Text>
      </div>
    </div>
    <div>
      <Text type="label" display="block">
        Balance
      </Text>
      <div class="text-preview__box">
        <Text type="body" text-wrap="balance">
          This text is balanced for better visual appearance across lines.
        </Text>
      </div>
    </div>
    <div>
      <Text type="label" display="block">
        Pretty
      </Text>
      <div class="text-preview__box">
        <Text type="body" text-wrap="pretty">
          This text uses pretty wrap to avoid orphans at the end of paragraphs.
        </Text>
      </div>
    </div>
  </div>
</template>
