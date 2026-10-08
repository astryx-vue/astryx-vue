<script setup lang="ts">
import { Link } from '@astryx-vue/core/Link'
</script>

<template>
  <div class="link-preview__row">
    <Link href="/" color="primary">
      Primary
    </Link>
    <Link href="/" color="secondary">
      Secondary
    </Link>
    <Link href="/" color="accent">
      Accent
    </Link>
    <Link href="/" color="inherit">
      Inherit
    </Link>
  </div>
</template>
