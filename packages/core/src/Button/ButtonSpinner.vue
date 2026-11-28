<script setup lang="ts">
defineOptions({
  name: 'ButtonSpinner',
})

defineProps<{
  label: string
  /** 控件自己播报忙碌时，加载圈只是装饰：对读屏隐藏，也不带 status 角色。 */
  isDecorative?: boolean
}>()
</script>

<template>
  <span
    class="astryx-spinner astryx-button__spinner"
    :role="isDecorative ? undefined : 'status'"
    :aria-label="isDecorative ? undefined : label"
    :aria-hidden="isDecorative ? 'true' : undefined"
  />
</template>
