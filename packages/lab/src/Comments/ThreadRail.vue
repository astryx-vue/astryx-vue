<script setup lang="ts">
defineOptions({ name: 'AstryxThreadRail' })

withDefaults(defineProps<{
  from?: 'avatar' | 'row'
  to?: 'avatar' | 'row'
  collapsed?: boolean
}>(), {
  collapsed: false,
})
</script>

<template>
  <div
    v-if="collapsed"
    class="astryx-thread-rail--collapsed"
    data-thread-rail-segment="collapsed"
    aria-hidden="true"
  />
  <div
    v-else
    class="astryx-thread-rail"
    :data-from="from"
    :data-to="to"
    :data-thread-rail-segment="`${from}-${to}`"
    aria-hidden="true"
  />
</template>
