<script setup lang="ts">
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CheckboxListItem,
  Dialog,
  DialogHeader,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
  Link,
  List,
  ListItem,
  MetadataList,
  MetadataListItem,
  MoreMenu,
  ProgressBar,
  Selector,
  StatusDot,
  Text,
  TextArea,
  Timestamp,
  Token,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'
import { ref } from 'vue'

const isNarrow = useMediaQuery('(max-width: 1024px)')
const showPanel = ref(true)
const panelDialogOpen = ref(false)
const status = ref('in-progress')
const priority = ref('high')
const comment = ref('')

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'in-review', label: 'In review' },
  { value: 'done', label: 'Done' },
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const CHECKLIST = [
  { id: '1', label: 'Audit token refresh middleware', done: true },
  { id: '2', label: 'Add integration tests', done: false },
  { id: '3', label: 'Update runbook', done: false },
]

const COMMENTS = [
  { id: '1', author: 'Alex Johnson', body: 'Middleware patch is ready for review — catches TokenExpiredError before 401.', time: '2026-04-28T14:22:00' },
  { id: '2', author: 'Sam Rivera', body: 'Please add metrics for refresh success/failure rates.', time: '2026-04-28T15:05:00' },
]

function togglePanel() {
  if (isNarrow.value)
    panelDialogOpen.value = !panelDialogOpen.value
  else
    showPanel.value = !showPanel.value
}
</script>

<template>
  <Layout height="fill" :content-width="960">
    <template #header>
      <LayoutHeader has-divider :padding="4">
        <VStack :gap="3">
          <HStack :gap="2" :align="'center'" wrap="wrap">
            <Link href="#" color="secondary">
              <HStack :gap="1" :align="'center'">
                <Icon icon="i-heroicons-arrow-left" size="sm" />
                Back to board
              </HStack>
            </Link>
            <Badge variant="blue" label="AUTH-142" />
            <StatusDot label="In progress" variant="warning" />
            <Text type="supporting" color="secondary">Updated <Timestamp :value="'2026-04-29T09:00:00'" format="relative" /></Text>
          </HStack>
          <Heading :level="1">Fix silent JWT refresh in API gateway</Heading>
          <HStack :gap="2" :align="'center'" wrap="wrap">
            <Selector v-model="status" label="Status" :options="STATUS_OPTIONS" size="sm" />
            <Selector v-model="priority" label="Priority" :options="PRIORITY_OPTIONS" size="sm" />
            <AvatarGroup>
              <Avatar name="Alex Johnson" size="sm" />
              <Avatar name="Sam Rivera" size="sm" />
              <Avatar name="Jordan Lee" size="sm" />
            </AvatarGroup>
            <MoreMenu label="Actions" :items="[{ label: 'Copy link' }, { label: 'Archive' }, { type: 'divider' }, { label: 'Delete' }]" />
            <IconButton label="Toggle panel" @click="togglePanel">
              <Icon icon="i-heroicons-view-columns" size="sm" />
            </IconButton>
          </HStack>
        </VStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="4">
      <VStack :gap="6">
        <Card :padding="4">
          <VStack :gap="3">
            <Heading :level="2">Description</Heading>
            <Text type="body" color="secondary">
              When access tokens expire mid-session, middleware returns 401 before refresh logic runs. Implement silent refresh and add coverage for the expiry path.
            </Text>
            <HStack :gap="1" wrap="wrap">
              <Token label="backend" />
              <Token label="security" />
              <Token label="P1" variant="orange" />
            </HStack>
          </VStack>
        </Card>

        <Card :padding="4">
          <VStack :gap="3">
            <Heading :level="2">Checklist</Heading>
            <ProgressBar :value="1" :max="3" label="1 of 3 complete" />
            <List>
              <CheckboxListItem
                v-for="item in CHECKLIST"
                :key="item.id"
                :label="item.label"
                :model-value="item.done"
              />
            </List>
          </VStack>
        </Card>

        <Card :padding="4">
          <VStack :gap="4">
            <Heading :level="2">Comments</Heading>
            <VStack :gap="3">
              <Card v-for="c in COMMENTS" :key="c.id" variant="muted" :padding="3">
                <HStack :gap="2" :align="'center'">
                  <Avatar :name="c.author" size="sm" />
                  <Text type="body" weight="bold">{{ c.author }}</Text>
                  <Timestamp :value="c.time" format="date_time" />
                </HStack>
                <Text type="body">{{ c.body }}</Text>
              </Card>
            </VStack>
            <TextArea v-model="comment" label="Add comment" placeholder="Leave a comment…" />
            <HStack :justify="'end'">
              <Button label="Post comment" variant="primary" />
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </LayoutContent>

    <template v-if="!isNarrow && showPanel" #end>
      <LayoutPanel :width="320" :padding="4" has-divider label="Details">
        <VStack :gap="4">
          <Heading :level="3">Details</Heading>
          <MetadataList>
            <MetadataListItem label="Sprint">
              Q2 Infra
            </MetadataListItem>
            <MetadataListItem label="Estimate">
              3 days
            </MetadataListItem>
            <MetadataListItem label="Reporter">
              Jordan Lee
            </MetadataListItem>
          </MetadataList>
          <Divider />
          <Heading :level="4">Linked items</Heading>
          <List density="compact">
            <ListItem label="AUTH-98" description="Refresh token rotation" href="#" />
            <ListItem label="AUTH-120" description="Session audit logging" href="#" />
          </List>
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>

  <Dialog variant="fullscreen" :is-open="isNarrow && panelDialogOpen" @open-change="panelDialogOpen = $event">
    <Layout>
      <template #header>
        <DialogHeader title="Work item details" @open-change="panelDialogOpen = $event" />
      </template>
      <LayoutContent :padding="4">
        <MetadataList>
          <MetadataListItem label="Sprint">
            Q2 Infra
          </MetadataListItem>
          <MetadataListItem label="Estimate">
            3 days
          </MetadataListItem>
        </MetadataList>
      </LayoutContent>
    </Layout>
  </Dialog>
</template>
