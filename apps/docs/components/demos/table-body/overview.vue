<script setup lang="ts">
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from '@astryx-vue/core/Table'

interface Member {
  name: string
  role: string
  status: string
}

const members: Member[] = [
  { name: 'Alice Johnson', role: 'Engineer', status: 'Active' },
  { name: 'Bob Smith', role: 'Designer', status: 'Active' },
  { name: 'Carol White', role: 'Manager', status: 'Invited' },
]
</script>

<template>
  <Table label="Team members">
    <TableHeader>
      <TableRow is-header-row>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell>Role</TableHeaderCell>
        <TableHeaderCell>Status</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="member in members" :key="member.name">
        <TableCell>{{ member.name }}</TableCell>
        <TableCell>{{ member.role }}</TableCell>
        <TableCell>{{ member.status }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
