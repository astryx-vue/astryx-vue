<script setup lang="ts">
import { Dialog, DialogHeader } from '@astryx-vue/core/Dialog'
import { Layout, LayoutContent, LayoutHeader } from '@astryx-vue/core/Layout'
</script>

<template>
  <Dialog is-inline is-open width="400" :padding="0">
    <Layout height="auto">
      <LayoutHeader :padding="4">
        <DialogHeader
          title="Edit Profile"
          subtitle="Update your personal information"
          has-close-button
        />
      </LayoutHeader>
      <LayoutContent :padding="0" :is-scrollable="false">
        <p class="dialog-header-preview__body">
          Dialog body content goes here.
        </p>
      </LayoutContent>
    </Layout>
  </Dialog>
</template>
