<script setup lang="ts">
import { NavItem } from '@astryx-vue/core/NavItem'
</script>

<template>
  <div class="nav-overview--row">
    <NavItem href="#inbox" icon-class="i-carbon-email" is-selected label="Inbox" />
    <NavItem href="#documents" icon-class="i-carbon-document" label="Documents" />
  </div>
</template>
