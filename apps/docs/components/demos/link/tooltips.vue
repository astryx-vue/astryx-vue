<script setup lang="ts">
import { Link } from '@astryx-vue/core/Link'
import { HStack } from '@astryx-vue/core/Stack'
import { Tooltip } from '@astryx-vue/core/Tooltip'
</script>

<template>
  <HStack :gap="4" align="center">
    <Tooltip content="Configure your account settings">
      <Link href="#">
        Settings
      </Link>
    </Tooltip>
    <Tooltip content="View and edit your profile">
      <Link href="#">
        Profile
      </Link>
    </Tooltip>
    <Tooltip content="Get help and support">
      <Link href="#" color="secondary">
        Help
      </Link>
    </Tooltip>
  </HStack>
</template>
