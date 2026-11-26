<script setup lang="ts">
import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from '@astryx-vue/core/Table'
import { useTruncation } from '@astryx-vue/core/Text'
import { Tooltip } from '@astryx-vue/core/Tooltip'

interface FileAsset {
  name: string
  path: string
  maxLines: 1 | 2
}

const files: FileAsset[] = [
  { name: 'build', path: 'artifacts/release/build-20261103-120344/index.html', maxLines: 1 },
  { name: 'bundle', path: 'reports/coverage/packages/core/src/components/Calendar/index.html', maxLines: 2 },
  { name: 'readme', path: 'README.md', maxLines: 1 },
]

// One measurement per cell. The clamp in the style below must match its maxLines.
const truncations = files.map(file => useTruncation(file.maxLines))
</script>

<template>
  <Table label="Assets">
    <TableHeader>
      <TableRow is-header-row>
        <TableHeaderCell>Asset</TableHeaderCell>
        <TableHeaderCell>Path</TableHeaderCell>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(file, index) in files" :key="file.name">
        <TableCell>{{ file.name }}</TableCell>
        <TableCell>
          <Tooltip
            :content="truncations[index]!.fullText.value"
            placement="above"
            :is-enabled="truncations[index]!.isTruncated.value"
          >
            <span
              :ref="(element) => truncations[index]!.bind(element as Element | null)"
              :tabindex="truncations[index]!.isTruncated.value ? 0 : undefined"
              :class="file.maxLines === 1 ? 'truncation-demo__single' : 'truncation-demo__clamped'"
            >{{ file.path }}</span>
          </Tooltip>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<style scoped>
.truncation-demo__single {
  display: block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.truncation-demo__clamped {
  display: -webkit-box;
  max-width: 120px;
  overflow: hidden;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
