<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core'
import {
  AlertDialog,
  Avatar,
  Button,
  DropdownMenu,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  MoreMenu,
  pixel,
  proportional,
  StackItem,
  StatusDot,
  Table,
  TableSelectionToolbar,
  Text,
  useClipboard,
  useTableSelection,
  useTableSelectionState,
  useTableSortable,
  useTableSortableState,
  useToast,
  VisuallyHidden,
  VStack,
} from '@astryx-vue/core'
import { computed, h, ref } from 'vue'

type MemberRole = 'owner' | 'admin' | 'editor' | 'viewer'
type MemberStatus = 'active' | 'invited' | 'suspended'

interface MemberRow extends Record<string, unknown> {
  id: string
  name: string
  email: string
  role: MemberRole
  team: string
  status: MemberStatus
  lastActive: string
  lastActiveISO: string
}

const ROLE_LABEL: Record<MemberRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}

const ROLE_RANK: Record<MemberRole, number> = {
  owner: 0,
  admin: 1,
  editor: 2,
  viewer: 3,
}

const ROLE_ORDER: MemberRole[] = ['owner', 'admin', 'editor', 'viewer']

const STATUS_LABEL: Record<MemberStatus, string> = {
  active: 'Active',
  invited: 'Invited',
  suspended: 'Suspended',
}

const STATUS_DOT_VARIANT: Record<MemberStatus, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  invited: 'warning',
  suspended: 'neutral',
}

const STATUS_RANK: Record<MemberStatus, number> = {
  active: 0,
  invited: 1,
  suspended: 2,
}

const INITIAL_MEMBERS: MemberRow[] = [
  { id: '1', name: 'Olivia Martin', email: 'olivia.martin@example.com', role: 'owner', team: 'Leadership', status: 'active', lastActive: 'Today', lastActiveISO: '2025-07-08' },
  { id: '2', name: 'Jackson Lee', email: 'jackson.lee@example.com', role: 'admin', team: 'Platform', status: 'active', lastActive: 'Today', lastActiveISO: '2025-07-08' },
  { id: '3', name: 'Isabella Nguyen', email: 'isabella.nguyen@example.com', role: 'editor', team: 'Design', status: 'active', lastActive: 'Yesterday', lastActiveISO: '2025-07-07' },
  { id: '4', name: 'William Kim', email: 'william.kim@example.com', role: 'editor', team: 'Platform', status: 'active', lastActive: 'Jul 5', lastActiveISO: '2025-07-05' },
  { id: '5', name: 'Sofia Davis', email: 'sofia.davis@example.com', role: 'viewer', team: 'Marketing', status: 'invited', lastActive: 'Never', lastActiveISO: '' },
  { id: '6', name: 'Mia Wilson', email: 'mia.wilson@example.com', role: 'admin', team: 'Design', status: 'active', lastActive: 'Jul 6', lastActiveISO: '2025-07-06' },
  { id: '7', name: 'Lucas Brown', email: 'lucas.brown@example.com', role: 'editor', team: 'Mobile', status: 'suspended', lastActive: 'Jun 2', lastActiveISO: '2025-06-02' },
  { id: '8', name: 'Ethan Jones', email: 'ethan.jones@example.com', role: 'editor', team: 'Mobile', status: 'active', lastActive: 'Jul 3', lastActiveISO: '2025-07-03' },
  { id: '9', name: 'Ava Taylor', email: 'ava.taylor@example.com', role: 'viewer', team: 'Finance', status: 'active', lastActive: 'Jun 28', lastActiveISO: '2025-06-28' },
  { id: '10', name: 'Noah Garcia', email: 'noah.garcia@example.com', role: 'editor', team: 'Platform', status: 'active', lastActive: 'Today', lastActiveISO: '2025-07-08' },
  { id: '11', name: 'Emma Rodriguez', email: 'emma.rodriguez@example.com', role: 'viewer', team: 'Support', status: 'invited', lastActive: 'Never', lastActiveISO: '' },
  { id: '12', name: 'Liam Patel', email: 'liam.patel@example.com', role: 'admin', team: 'Security', status: 'active', lastActive: 'Yesterday', lastActiveISO: '2025-07-07' },
  { id: '13', name: 'Charlotte Chen', email: 'charlotte.chen@example.com', role: 'editor', team: 'Marketing', status: 'active', lastActive: 'Jul 1', lastActiveISO: '2025-07-01' },
  { id: '14', name: 'James Okafor', email: 'james.okafor@example.com', role: 'viewer', team: 'Finance', status: 'suspended', lastActive: 'May 19', lastActiveISO: '2025-05-19' },
  { id: '15', name: 'Amelia Novak', email: 'amelia.novak@example.com', role: 'editor', team: 'Support', status: 'active', lastActive: 'Jul 4', lastActiveISO: '2025-07-04' },
  { id: '16', name: 'Henry Silva', email: 'henry.silva@example.com', role: 'viewer', team: 'Security', status: 'active', lastActive: 'Jun 30', lastActiveISO: '2025-06-30' },
]

function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count !== 1 ? 's' : ''}`
}

const members = ref<MemberRow[]>(INITIAL_MEMBERS)
const selectedKeys = ref<ReadonlySet<string>>(new Set())
const pendingRemoval = ref<string[] | null>(null)
const removalTitle = ref('')
const showToast = useToast()
const { copy } = useClipboard()

function updateMembers(ids: ReadonlySet<string>, patch: Partial<MemberRow>): void {
  members.value = members.value.map(member => (ids.has(member.id) ? { ...member, ...patch } : member))
}

function confirmRemoval(): void {
  if (!pendingRemoval.value)
    return
  const removed = new Set(pendingRemoval.value)
  members.value = members.value.filter(member => !removed.has(member.id))
  const next = new Set(selectedKeys.value)
  for (const id of removed)
    next.delete(id)
  selectedKeys.value = next
  pendingRemoval.value = null
}

function askRemoval(ids: string[]): void {
  const member = ids.length === 1 ? members.value.find(m => m.id === ids[0]) : undefined
  removalTitle.value = ids.length === 1
    ? `Remove ${member?.name ?? 'member'}?`
    : `Remove ${pluralize(ids.length, 'member')}?`
  pendingRemoval.value = ids
}

const columns: TableColumn<MemberRow>[] = [
  {
    key: 'name',
    header: 'Name',
    width: proportional(1),
    sortable: true,
    renderCell: member => h(HStack, { gap: 3, vAlign: 'center' }, () => [
      h(Avatar, { name: member.name, size: 'sm' }),
      h(Text, { type: 'body', maxLines: 1 }, () => member.name),
    ]),
  },
  {
    key: 'email',
    header: 'Email',
    width: proportional(1),
    sortable: true,
    renderCell: member => h(Text, { type: 'body', color: 'secondary', maxLines: 1 }, () => member.email),
  },
  {
    key: 'role',
    header: 'Role',
    width: pixel(112),
    sortable: { compare: (a, b) => ROLE_RANK[a.role] - ROLE_RANK[b.role] },
    renderCell: member => h(Text, { type: 'body' }, () => ROLE_LABEL[member.role]),
  },
  {
    key: 'team',
    header: 'Team',
    width: pixel(128),
    sortable: true,
    renderCell: member => h(Text, { type: 'body', maxLines: 1 }, () => member.team),
  },
  {
    key: 'status',
    header: 'Status',
    width: pixel(128),
    sortable: { compare: (a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] },
    renderCell: member => h(HStack, { gap: 2, vAlign: 'center' }, () => [
      h(StatusDot, { variant: STATUS_DOT_VARIANT[member.status], label: STATUS_LABEL[member.status] }),
      h(Text, { type: 'body' }, () => STATUS_LABEL[member.status]),
    ]),
  },
  {
    key: 'lastActive',
    header: 'Last active',
    width: pixel(112),
    sortable: { compare: (a, b) => a.lastActiveISO.localeCompare(b.lastActiveISO) },
    renderCell: member => h(Text, { type: 'supporting', color: 'secondary' }, () => member.lastActive),
  },
  {
    key: 'actions',
    header: () => h(VisuallyHidden, () => 'Actions'),
    width: pixel(56),
    renderCell: member => h(DropdownMenu, {
      button: {
        label: `Actions for ${member.name}`,
        variant: 'ghost',
        size: 'sm',
        icon: () => h(Icon, { icon: 'i-heroicons-ellipsis-horizontal', size: 'sm' }),
        isIconOnly: true,
      },
      hasChevron: false,
      alignment: 'end',
      items: [
        {
          label: 'Edit member',
          icon: 'i-heroicons-pencil',
          onClick: () => showToast({ body: `Demo: editing ${member.name} would open here`, uniqueID: `edit-${member.id}` }),
        },
        {
          label: 'Copy email',
          icon: 'i-heroicons-document-duplicate',
          onClick: () => void copy(member.email).then(copied => showToast({
            body: copied ? `Copied ${member.email}` : `Could not copy ${member.email}`,
            uniqueID: `copy-${member.id}`,
          })),
        },
        {
          label: 'Resend invite',
          icon: 'i-heroicons-envelope',
          isDisabled: member.status !== 'invited',
          onClick: () => showToast({ body: `Demo: the invite would be resent to ${member.email} here`, uniqueID: `resend-${member.id}` }),
        },
        {
          label: member.status === 'suspended' ? 'Reactivate member' : 'Suspend member',
          icon: 'i-heroicons-no-symbol',
          isDisabled: member.status === 'invited',
          onClick: () => updateMembers(new Set([member.id]), {
            status: member.status === 'suspended' ? 'active' : 'suspended',
          }),
        },
        { type: 'divider' as const },
        {
          label: 'Remove member',
          icon: 'i-heroicons-trash',
          variant: 'destructive' as const,
          onClick: () => askRemoval([member.id]),
        },
      ],
    }),
  },
]

const { sortedData, sortConfig } = useTableSortableState<MemberRow>({
  data: members,
  columns,
  defaultSort: [{ sortKey: 'name', direction: 'ascending' }],
})
const sortablePlugin = useTableSortable<MemberRow>(sortConfig)

const { selectionConfig, selectionState } = useTableSelectionState<MemberRow>({
  data: members,
  idKey: 'id',
  selectedKeys,
  setSelectedKeys: (next) => {
    selectedKeys.value = next
  },
})
const selectionPlugin = useTableSelection<MemberRow>({
  ...selectionConfig,
  getRowLabel: member => member.name,
})

const bulkMenuItems = computed(() => [
  {
    label: 'Change role',
    items: ROLE_ORDER.map(role => ({
      label: ROLE_LABEL[role],
      onClick: () => updateMembers(selectionState.selectedKeys, { role }),
    })),
  },
  {
    label: 'Export',
    icon: 'i-heroicons-arrow-down-tray',
    onClick: () => showToast({
      body: `Demo: ${pluralize(selectionState.selectedKeys.size, 'member')} would be exported here`,
      uniqueID: 'export-members',
    }),
  },
])
</script>

<template>
  <Layout height="fill">
    <template #header>
      <LayoutHeader has-divider :padding="4">
        <VStack :gap="4">
          <HStack :gap="3" vAlign="center" wrap="wrap">
            <StackItem size="fill">
              <Heading :level="1">
                Members
              </Heading>
            </StackItem>
            <Button
              label="Invite member"
              variant="primary"
              size="lg"
              @click="showToast({ body: 'Demo: the invite form would open here', uniqueID: 'invite-member' })"
            >
              <template #icon>
                <Icon icon="i-heroicons-user-plus" />
              </template>
            </Button>
          </HStack>
          <TableSelectionToolbar v-if="selectionState.hasSelection" :selection="selectionState">
            <template #start>
              <Button label="Remove" variant="ghost" @click="askRemoval(Array.from(selectionState.selectedKeys))">
                <template #icon>
                  <Icon icon="i-heroicons-trash" />
                </template>
              </Button>
              <!-- 次要的批量操作收进溢出菜单，手机宽度下工具条也放得下。 -->
              <MoreMenu label="More bulk actions" :items="bulkMenuItems" />
            </template>
          </TableSelectionToolbar>
          <Text v-else type="supporting" color="secondary">
            {{ pluralize(members.length, 'member') }}
          </Text>
        </VStack>
      </LayoutHeader>
    </template>
    <LayoutContent role="main" :padding="0">
      <Table
        :data="sortedData"
        :columns="columns"
        id-key="id"
        density="balanced"
        dividers="rows"
        text-overflow="truncate"
        has-hover
        :plugins="{ selection: selectionPlugin, sortable: sortablePlugin }"
      />
    </LayoutContent>
  </Layout>
  <AlertDialog
    :is-open="pendingRemoval !== null"
    :title="removalTitle"
    description="They lose access to this workspace right away. You can invite them again later."
    action-label="Remove"
    @open-change="isOpen => { if (!isOpen) pendingRemoval = null }"
    @action="confirmRemoval"
  />
</template>
