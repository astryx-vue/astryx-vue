<script setup lang="ts">
import { Button, Dialog, Layout, LayoutContent, LayoutFooter, Text } from '@astryx-vue/core'
import { DialogHeroHeader } from '@astryx-vue/lab'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Button label="Open onboarding" @click="isOpen = true" />
  <Dialog :is-open="isOpen" width="420" @open-change="isOpen = $event">
    <Layout>
      <template #header>
        <DialogHeroHeader title="Welcome aboard" media-mode="dark" @open-change="isOpen = $event">
          <template #media>
            <svg viewBox="0 0 420 180" width="100%" aria-hidden="true" focusable="false" style="display: block">
              <defs>
                <linearGradient id="hero-sky" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#1e1b4b" />
                  <stop offset="1" stop-color="#0e7490" />
                </linearGradient>
              </defs>
              <rect width="420" height="180" fill="url(#hero-sky)" />
              <circle cx="320" cy="60" r="28" fill="#fde68a" />
              <path d="M0 150 L120 90 L220 140 L320 100 L420 150 L420 180 L0 180 Z" fill="#0f172a" opacity="0.6" />
            </svg>
          </template>
        </DialogHeroHeader>
      </template>
      <template #content>
        <LayoutContent>
          <Text>Get started in three steps: invite your team, connect a data source, and share your first dashboard.</Text>
        </LayoutContent>
      </template>
      <template #footer>
        <LayoutFooter>
          <Button variant="primary" label="Get started" @click="isOpen = false" />
        </LayoutFooter>
      </template>
    </Layout>
  </Dialog>
</template>
