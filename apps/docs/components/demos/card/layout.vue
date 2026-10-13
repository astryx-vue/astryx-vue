<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutFooter, LayoutHeader } from '@astryx-vue/core/Layout'
import { HStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
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
            <Button label="Cancel" variant="ghost" />
            <Button label="Save changes" variant="primary" />
          </HStack>
        </LayoutFooter>
      </template>
    </Layout>
  </Card>
</template>
