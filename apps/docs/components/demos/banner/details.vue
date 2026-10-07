<script setup lang="ts">
import { Banner } from '@astryx-vue/core/Banner'
import { shallowRef } from 'vue'

const open = shallowRef(false)
</script>

<template>
  <div class="input-preview-stack">
    <Banner v-model:is-open="open" status="info" title="Two settings will change" description="Expand the details before continuing.">
      <ul class="banner-preview-list">
        <li>New members will receive a welcome email.</li>
        <li>Weekly summaries will arrive on Monday.</li>
      </ul>
    </Banner>
    <Banner status="error" title="Two fields need attention" :collapsible="false">
      <ul class="banner-preview-list">
        <li>Enter a valid email address.</li>
        <li>Choose at least one notification channel.</li>
      </ul>
    </Banner>
  </div>
</template>
