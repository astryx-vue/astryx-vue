---
layout: component-docs
title: Chat Composer Drawer
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { chatComposerDrawerAttachments, chatComposerDrawerCollapsible, chatComposerDrawerFeedback, chatComposerDrawerWithProgress } from '../../../../components/demos/chat-composer-drawer'
</script>

## Usage

Use ChatComposerDrawer in the ChatComposer drawer slot for supplementary content such as attachments, context chips, or previews. Provide `count` only when people should be able to collapse that content.

```ts
import { ChatComposerDrawer } from '@astryx-vue/core/Chat'
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give `label` a concrete plural noun such as “Attachments” so the expand and collapse actions have a useful accessible name. |
| <Badge variant="success">Do</Badge> | Use controlled `v-model:is-collapsed` with `collapsedChange` when another part of the page owns drawer state; otherwise use `defaultIsCollapsed`. |
| <Badge variant="error">Don't</Badge> | Put primary composer actions in the drawer; use ChatComposer `footerActions` or `sendActions` so those controls remain available when the drawer is collapsed. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="chatComposerDrawerAttachments"
  description="Drawer with two rows: a scrollable carousel of image thumbnails and a row of removable file tokens. Omit count to keep the drawer always expanded."
  locale="en"
  title="ChatComposerDrawer — Attachments"
/>

<DemoExample
  :demo="chatComposerDrawerCollapsible"
  description="Drawer with many items and a collapse toggle. Pass count to enable the toggle; collapsed state shows a badge with the total count and a label."
  locale="en"
  title="ChatComposerDrawer — Collapsible"
/>

<DemoExample
  :demo="chatComposerDrawerFeedback"
  description="Chat composer drawer with a feedback prompt and selectable lettered options. Use for user confirmation workflows that require explicit action before proceeding."
  locale="en"
  title="ChatComposerDrawer — Feedback"
/>

<DemoExample
  :demo="chatComposerDrawerWithProgress"
  description="Drawer paired with a context progress bar in the header. Show context window usage when attachments consume part of the available token budget."
  locale="en"
  title="ChatComposerDrawer — With Progress"
/>
