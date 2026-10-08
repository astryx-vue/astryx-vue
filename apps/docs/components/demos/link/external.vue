<script setup lang="ts">
import { Link } from '@astryx-vue/core/Link'
</script>

<template>
  <div class="link-preview__row">
    <Link href="https://github.com" is-external-link>
      GitHub
    </Link>
    <Link href="https://example.com" is-external-link has-underline>
      带下划线的外部链接
    </Link>
  </div>
</template>
