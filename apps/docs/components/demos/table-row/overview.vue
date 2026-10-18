<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from '@astryx-vue/core/Table'

provideAstryxLocale('en')
</script>

<template>
  <Table has-hover>
    <TableHeader>
      <TableRow is-header-row>
        <TableHeaderCell>Name</TableHeaderCell>
        <TableHeaderCell>Role</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Alice Johnson</TableCell>
        <TableCell>Engineer</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Bob Smith</TableCell>
        <TableCell>Designer</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
