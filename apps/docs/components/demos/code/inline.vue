<script setup lang="ts">
import { Code } from '@astryx-vue/core/Code'
</script>

<template>
  <div class="code-preview__prose">
    <p class="code-preview__sentence">
      Pass <Code>isLoading</Code> to keep the button busy until the promise settles.
    </p>
    <p class="code-preview__sentence code-preview__sentence--large">
      Run <Code size="inherit">npm run build:packages</Code> before you publish.
    </p>
    <p class="code-preview__sentence code-preview__sentence--muted">
      The <Code color="secondary">variant</Code> prop selects the visual style.
    </p>
  </div>
</template>
