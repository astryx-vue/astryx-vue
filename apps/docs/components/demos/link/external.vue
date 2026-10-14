<script setup lang="ts">
import { Link } from '@astryx-vue/core/Link'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack :gap="2">
    <Link href="https://github.com" is-external-link is-standalone>
      GitHub
    </Link>
    <Link href="https://developer.mozilla.org" is-external-link is-standalone>
      MDN Web Docs
    </Link>
    <Link href="https://react.dev" is-external-link has-underline is-standalone>
      React Documentation
    </Link>
  </VStack>
</template>
