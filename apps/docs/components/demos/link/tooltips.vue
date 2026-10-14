<script setup lang="ts">
import { Link } from '@astryx-vue/core/Link'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack align="center" :gap="4">
    <Link href="#" tooltip="Configure your account settings" is-standalone>
      Settings
    </Link>
    <Link href="#" tooltip="View and edit your profile" is-standalone>
      Profile
    </Link>
    <Link href="#" tooltip="Get help and support" color="secondary" is-standalone>
      Help
    </Link>
  </HStack>
</template>
