<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@astryx-vue/core/Table'

interface Line {
  item: string
  qty: string
  amount: string
}

const lines: Line[] = [
  { item: 'Hosting', qty: '1', amount: '$24.00' },
  { item: 'Storage', qty: '2', amount: '$12.00' },
]
</script>

<template>
  <Table has-hover>
    <TableHeader>
      <TableRow is-header-row>
        <TableHeaderCell>Item</TableHeaderCell>
        <TableHeaderCell align="end">
          Qty
        </TableHeaderCell>
        <TableHeaderCell align="end">
          Amount
        </TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="line in lines" :key="line.item">
        <TableCell>{{ line.item }}</TableCell>
        <TableCell align="end">
          {{ line.qty }}
        </TableCell>
        <TableCell align="end">
          {{ line.amount }}
        </TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell :col-span="2">
          Total
        </TableCell>
        <TableCell align="end">
          $36.00
        </TableCell>
      </TableRow>
    </TableFooter>
  </Table>
</template>
