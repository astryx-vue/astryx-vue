---
layout: component-docs
title: Calendar
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { calendarBasic, calendarRange } from '../../../../components/demos/calendar'
</script>

## Usage

Calendar component documentation.

## Examples

<DemoExample
  :demo="calendarBasic"
  description="Click to select date, arrow keys to navigate, Enter to confirm."
  locale="en"
  title="Basic Usage"
/>

<DemoExample
  :demo="calendarRange"
  description="Limit selectable date range with minValue and maxValue."
  locale="en"
  title="Date Range"
/>

