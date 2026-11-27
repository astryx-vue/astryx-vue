<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Button } from '@astryx-vue/core/Button'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutPanel } from '@astryx-vue/core/Layout'
import { List, ListItem } from '@astryx-vue/core/List'
import { Section } from '@astryx-vue/core/Section'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}
</script>

<template>
  <Section :padding="4">
    <Layout height="fill">
      <template #header>
        <LayoutHeader has-divider>
          <HStack align="center" :gap="2">
            <Heading :level="4">
              Projects
            </Heading>
            <Badge variant="info" label="3 active" />
          </HStack>
        </LayoutHeader>
      </template>
      <template #start>
        <LayoutPanel has-divider :width="140">
          <List>
            <ListItem label="Dashboard" is-selected />
            <ListItem label="Analytics" />
            <ListItem label="Settings" />
          </List>
        </LayoutPanel>
      </template>
      <LayoutContent>
        <VStack :gap="2">
          <Heading :level="5">
            Welcome back
          </Heading>
          <Text type="body" color="secondary">
            You have 3 active projects and 2 pending reviews.
          </Text>
        </VStack>
      </LayoutContent>
      <template #footer>
        <LayoutFooter has-divider>
          <HStack :gap="2" h-align="end">
            <Button label="New Project" variant="primary" @click="demo('New Project')" />
          </HStack>
        </LayoutFooter>
      </template>
    </Layout>
  </Section>
</template>
