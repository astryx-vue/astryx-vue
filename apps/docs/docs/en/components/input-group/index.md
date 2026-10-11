---
layout: component-docs
title: Input Group
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { inputGroupBasic, inputGroupWithIcon } from '../../../../components/demos/input-group'
</script>

## Usage

`InputGroup` combines input fields with prefix, suffix, or action buttons.

## Examples

<DemoExample
  :demo="inputGroupBasic"
  description="Combine input with prefix/suffix slots for URL, email scenarios."
  locale="en"
  title="Basic Usage"
/>

<DemoExample
  :demo="inputGroupWithIcon"
  description="The before slot can hold a short prefix that explains the field."
  locale="en"
  title="Prefix"
/>
