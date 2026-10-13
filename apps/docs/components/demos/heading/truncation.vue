<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
</script>

<template>
  <div class="heading-preview__clamp">
    <div class="heading-preview__box">
      <Heading :level="2" :max-lines="1">
        Very Long Heading That Will Be Truncated To One Line With Ellipsis
      </Heading>
    </div>
    <div class="heading-preview__box">
      <Heading :level="2" :max-lines="2">
        Very Long Heading That Will Be Truncated To Two Lines To Keep Card Layout Compact
      </Heading>
    </div>
  </div>
</template>
