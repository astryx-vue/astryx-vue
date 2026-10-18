<script setup lang="ts">
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from '@astryx-vue/core/Table'

const rows = [
  { name: 'Atlas', seats: '12' },
  { name: 'Beacon', seats: '8' },
]
</script>

<template>
  <!-- 表格由子组件拼成，没有 data/columns：表头单元格的半粗字重、次要文字颜色
       和底部分隔线全都来自父级 Table，这正是 TableHeaderCell 的作用。 -->
  <Table>
    <TableHeader>
      <TableRow is-header-row>
        <TableHeaderCell>Project</TableHeaderCell>
        <TableHeaderCell align="end">
          Seats
        </TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="row in rows" :key="row.name">
        <TableCell>{{ row.name }}</TableCell>
        <TableCell align="end">
          {{ row.seats }}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
