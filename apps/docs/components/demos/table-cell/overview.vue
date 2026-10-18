<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@astryx-vue/core/Table'

const rows = [
  { name: 'Alice Chen', role: 'Engineer', seats: '12' },
  { name: 'Bob Smith', role: 'Designer', seats: '8' },
  { name: 'Cara Diaz', role: 'Researcher', seats: '5' },
]
</script>

<template>
  <!-- 表格由子组件拼成，没有 data/columns：单元格的内边距、字号和行分隔线
       全都来自父级 Table，这正是 TableCell 的作用。 -->
  <Table has-hover>
    <TableHeader>
      <TableRow is-header-row>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell>Role</TableHeaderCell>
        <TableHeaderCell align="end">
          Seats
        </TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="row in rows" :key="row.name">
        <TableCell>{{ row.name }}</TableCell>
        <TableCell>{{ row.role }}</TableCell>
        <TableCell align="end">
          {{ row.seats }}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
