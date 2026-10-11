---
layout: component-docs
title: Pagination
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { paginationBasic, paginationSizeChanger } from '../../../../components/demos/pagination'
</script>

## Usage

`Pagination` provides navigation controls for paginated content.

## Examples

<DemoExample
  :demo="paginationBasic"
  description="Click page numbers or use prev/next buttons to navigate."
  locale="en"
  title="Basic Usage"
/>

<DemoExample
  :demo="paginationSizeChanger"
  description="Enable showSizeChanger to let users choose page size."
  locale="en"
  title="Page Size"
/>
