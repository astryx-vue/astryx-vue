<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutFooter, LayoutHeader } from '@astryx-vue/core/Layout'
import { HStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Card :width="380">
    <Layout height="auto">
      <template #header>
        <LayoutHeader has-divider>
          <Heading :level="3">
            Edit Profile
          </Heading>
        </LayoutHeader>
      </template>
      <Text type="body" color="secondary">
        Update your display name, bio, and profile photo. Changes are saved immediately.
      </Text>
      <template #footer>
        <LayoutFooter has-divider>
          <HStack :gap="2" h-align="end">
            <Button label="Cancel" variant="ghost" @click="demo('Cancel')" />
            <Button label="Save changes" variant="primary" @click="demo('Save changes')" />
          </HStack>
        </LayoutFooter>
      </template>
    </Layout>
  </Card>
</template>
