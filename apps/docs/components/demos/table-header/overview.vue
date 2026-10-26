<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@astryx-vue/core/Table'
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell>Role</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Alice Johnson</TableCell>
        <TableCell>Designer</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Bob Smith</TableCell>
        <TableCell>Engineer</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Carol White</TableCell>
        <TableCell>Manager</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
