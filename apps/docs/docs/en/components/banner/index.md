---
layout: component-docs
title: Banner
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { bannerAction, bannerCollapsible, bannerDismiss, bannerFullWidth, bannerStatuses } from '../../../../components/demos/banner'
</script>

## Usage

Use `Banner` for persistent messages that require attention or action.

```vue
<script setup lang="ts">
import { Banner } from '@astryx-vue/core/Banner'
</script>

<template>
  <Banner
    status="success"
    title="Changes saved"
    description="Your settings are up to date."
    is-dismissable
  />
</template>
```

Import the theme once in the application entry:

```ts
import '@astryx-vue/themes/neutral.css'
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pick a status that matches the message: info for updates, warning for caution, error for problems, success for confirmations. |
| <Badge variant="success">Do</Badge> | Use the card container inside page content and the section container for full-width messages that span the entire page. |
| <Badge variant="success">Do</Badge> | Make info and success banners dismissable. Keep error banners visible until the user fixes the issue. |
| <Badge variant="success">Do</Badge> | Keep titles short and scannable: "Payment failed" not "There was a problem processing your most recent payment." |
| <Badge variant="error">Don't</Badge> | Use Banner for short-lived messages that disappear on their own; use Toast instead. |
| <Badge variant="error">Don't</Badge> | Stack multiple banners with the same status; combine related messages into one banner. |

## Examples

<DemoExample
  :demo="bannerAction"
  description="A button in the end slot lets the user act on the message."
  locale="en"
  title="Action"
/>

<DemoExample
  :demo="bannerCollapsible"
  description="One banner with an action, a dismiss control, and details that start open. The details go in the default slot."
  locale="en"
  title="Collapsible"
/>

<DemoExample
  :demo="bannerDismiss"
  description="isDismissable lets the user close the banner after reading it."
  locale="en"
  title="Dismiss"
/>

<DemoExample
  :demo="bannerFullWidth"
  description="With container set to section, the banner runs edge to edge without a rounded corner, for a notice at the top of the page."
  locale="en"
  title="Full width"
/>

<DemoExample
  :demo="bannerStatuses"
  description="Info, success, warning, and error, for an update, a confirmation, a caution, and a problem."
  locale="en"
  title="Statuses"
/>

## Usage guidance

The `status` prop sets the tone of a banner, and picking the wrong one makes readers misjudge how urgent the message is. The list below covers which status fits which kind of message, plus two usages that are easy to overlook.

- Use `info` for general information and updates.
- Use `success` for the result of a successful action.
- Use `warning` for situations that call for caution.
- Use `error` for problems that block progress.
- Set `:collapsible="false"` for details that users must read, so those details stay visible and no click is needed to open them.
- Mount urgent messages when the user action that triggers them happens.

The status also decides the role the banner exposes to screen readers: `warning` and `error` use `role="alert"`, while `info` and `success` use `role="status"`. Note that messages already present in the initial page render may not be announced by screen readers, so the more urgent a message is, the better it works when mounted in response to a user action.

For a single field validation message, use [FieldStatus](/en/components/field-status).
