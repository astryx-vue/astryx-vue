<script setup lang="ts">
import { Center } from '@astryx-vue/core/Center'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack class="center-preview__examples" :gap="4" wrap="wrap">
    <div class="center-preview__example">
      <Center class="center-preview__stage" :height="120" :padding="0">
        <span class="center-preview__area">padding 0</span>
      </Center>
      <span class="center-preview__caption">padding="0"</span>
    </div>
    <div class="center-preview__example">
      <Center class="center-preview__stage" :height="120" :padding="3">
        <span class="center-preview__area">padding 3</span>
      </Center>
      <span class="center-preview__caption">padding="3"</span>
    </div>
    <div class="center-preview__example">
      <Center class="center-preview__stage" :height="120" :padding="6">
        <span class="center-preview__area">padding 6</span>
      </Center>
      <span class="center-preview__caption">padding="6"</span>
    </div>
    <div class="center-preview__example">
      <Center class="center-preview__stage" :height="120" :padding-block="1" :padding-inline="6">
        <span class="center-preview__area">inline 6</span>
      </Center>
      <span class="center-preview__caption">paddingInline="6" paddingBlock="1"</span>
    </div>
  </HStack>
</template>
