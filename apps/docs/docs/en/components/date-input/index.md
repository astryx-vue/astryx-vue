---
layout: component-docs
title: Date Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dateInputBasic, dateInputClearable } from '../../../../components/demos/date-input'
</script>

## Usage

Date Input component documentation.

## Examples

<DemoExample
  :demo="dateInputBasic"
  description="Click to open calendar popover, select date to close automatically."
  locale="en"
  title="Basic Usage"
/>

<DemoExample
  :demo="dateInputClearable"
  description="Enable clearable to show clear button next to selected date."
  locale="en"
  title="Clearable"
/>

