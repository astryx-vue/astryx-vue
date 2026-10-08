<script setup lang="ts">
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="text-preview__stack">
    <Text as="p" display="block" :max-lines="1">
      这是一段非常长的示例文本，用于演示当内容超出容器宽度时，设置 maxLines 为 1 会在一行末尾截断并显示省略号，从而保持界面整洁而不破坏整体布局。
    </Text>
    <Text as="p" display="block" :max-lines="2">
      这是一段非常长的示例文本，用于演示当内容超出容器宽度时，设置 maxLines 为 2 会限制在两行内显示，超出部分截断并显示省略号，从而保持界面整洁而不破坏整体布局。
    </Text>
  </div>
</template>
