<script setup lang="ts">
import { Link } from '@astryx-vue/core/Link'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack :gap="2">
    <Link href="https://github.com" is-external-link>
      GitHub
    </Link>
    <Link href="https://developer.mozilla.org" is-external-link>
      MDN Web Docs
    </Link>
    <Link href="https://vuejs.org" is-external-link has-underline>
      Vue Documentation
    </Link>
  </VStack>
</template>
