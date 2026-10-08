<script setup lang="ts">
import { Link } from '@astryx-vue/core/Link'
</script>

<template>
  <div class="link-preview__row">
    <Link href="https://github.com" is-external-link>
      GitHub
    </Link>
    <Link href="https://example.com" is-external-link has-underline>
      External link with underline
    </Link>
  </div>
</template>
