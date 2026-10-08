<script setup lang="ts">
import { Link } from '@astryx-vue/core/Link'
</script>

<template>
  <div class="link-preview__row">
    <Link href="/">
      默认链接
    </Link>
    <Link href="/" color="primary">
      主要链接
    </Link>
    <Link href="/" color="secondary">
      次要链接
    </Link>
    <Link href="/" color="accent">
      强调链接
    </Link>
  </div>
</template>
