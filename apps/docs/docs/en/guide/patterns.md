---
title: Patterns
---

<script setup lang="ts">
import { chatPatternConversation, chatPatternLanding } from '../../../components/demos/chat'
</script>

# Patterns

A conversation is a composition. The transcript, bubbles, reasoning, tool calls, citations, and the composer are separate components, and the page decides how they sit together. Nothing here calls a model. The body is a slot. Long replies are Markdown, and a source becomes a citation.

Before any transcript exists, the page is a greeting and one composer. The mode can move among writing, coding, research, and creative work. Sensitive and deep modes insert a chip instead. @ opens people, and / opens commands. Files sit in the drawer, and a long paste becomes a chip too. The microphone appears only when the browser can recognize speech. Choosing a category writes that suggestion into the composer.

Once a thread exists, the transcript is a column and the composer stays at the bottom. While the assistant is still writing, send becomes stop and the log is marked as streaming. Reasoning opens first, a tool call moves from running to complete, and the answer carries a citation. A generated document opens from a card. The full playground page keeps that document in a resizable side panel, and below 768px it becomes a full-screen dialog.

Both examples below can be used. The full pages are in the playground: [AI Chat Landing](/en/playground/?template=ai-chat-landing) and [AI Chat Conversation](/en/playground/?template=ai-chat). Density, unread rules, and metadata are documented on [Chat](/en/components/chat).

<DemoExample
  :demo="chatPatternLanding"
  description="Greeting, modes, mentions, commands, attachments, and category suggestions share one composer. Choosing a suggestion writes that prompt and switches the mode."
  locale="en"
  title="Landing"
/>

<DemoExample
  :demo="chatPatternConversation"
  description="One transcript carries reasoning, tool calls, a citation, and a document card. Sending grows the reply in that order, and stop is available while it is still running. The card opens a full-screen dialog."
  locale="en"
  title="Conversation"
/>

## Pinned headers and footers

In a long region, a header scrolls out of sight and a commit button scrolls out of reach, so people scroll back and forth. `Layout` defaults to `height="fill"`: it fills its container and only the body scrolls, while the header and footer stay put.

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Layout, LayoutContent, LayoutFooter, LayoutHeader } from '@astryx-vue/core/Layout'

const rows = [/* a long list */]
</script>

<template>
  <Layout :padding="4" default-has-dividers>
    <template #header>
      <LayoutHeader>Orders</LayoutHeader>
    </template>

    <LayoutContent>
      <OrderRow v-for="row in rows" :key="row.id" v-bind="row" />
    </LayoutContent>

    <template #footer>
      <LayoutFooter>
        <Button label="Save" />
        <Button label="Cancel" variant="secondary" />
      </LayoutFooter>
    </template>
  </Layout>
</template>
```

A few notes.

- Write `padding` once, on `Layout`. The header, body, and footer share one inline padding, so their text lines up on one vertical line.
- `defaultHasDividers` draws the line on both the header and the footer, so neither region needs its own `hasDivider`.
- A title plus one primary action goes in `LayoutHeader`. When the header carries a row of interactive controls, such as filters, sort, or bulk actions, use `Toolbar` instead; it handles arrow-key movement by the toolbar accessibility rules.
- The footer holds only the actions that must stay reachable: Save, Submit, Next. Secondary actions stay in the body.

To check it: scroll the body to the bottom. The header and footer have not moved, the dividers still run edge to edge, and the header title still shares a left edge with the first line of the body.

## Side detail panels

In a master-detail view, selecting a row usually navigates away, and coming back means finding your place again. A fixed-width panel on the end edge keeps the list in place instead.

```vue
<script setup lang="ts">
import { EmptyState } from '@astryx-vue/core/EmptyState'
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { ref } from 'vue'

const selected = ref<Order | null>(null)
</script>

<template>
  <Layout>
    <LayoutContent>
      <OrderRow
        v-for="row in rows"
        :key="row.id"
        v-bind="row"
        @select="selected = row"
      />
    </LayoutContent>

    <template #end>
      <LayoutPanel :width="380" has-divider is-scrollable label="Order details">
        <OrderDetail v-if="selected" :order="selected" />
        <EmptyState
          v-else
          is-compact
          title="No order selected"
          description="Pick a row on the left and its details appear here."
        />
      </LayoutPanel>
    </template>
  </Layout>
</template>
```

- A panel width between 340 and 420 works well. `width` as a number is pixels.
- `hasDivider` draws the edge facing the content. Do not draw a line on both sides.
- `isScrollable` lets long details scroll inside the panel without moving the list.
- Put an `EmptyState` in when nothing is selected. An empty panel collapses to a sliver, then the page jumps wider on the first selection.

To let people drag the width, hand `useResizable` to both the panel and a `ResizeHandle`.

```vue
<script setup lang="ts">
import { useResizable } from '@astryx-vue/core'
import { Layout, LayoutContent, LayoutPanel } from '@astryx-vue/core/Layout'
import { ResizeHandle } from '@astryx-vue/core/Resizable'

const detail = useResizable({
  defaultSize: 380,
  minSize: 320,
  maxSize: 560,
})
</script>

<template>
  <Layout>
    <LayoutContent>Body</LayoutContent>

    <template #end>
      <ResizeHandle
        direction="horizontal"
        is-reversed
        has-divider
        :resizable="detail.props"
        label="Resize the details panel"
      />
      <LayoutPanel :width="detail.size" :has-divider="false" is-scrollable label="Details">
        Detail content
      </LayoutPanel>
    </template>
  </Layout>
</template>
```

On the end edge, turn `isReversed` on so dragging left makes the panel wider. The handle carries `has-divider` and the panel turns `hasDivider` off, so one edge draws one line.

On a narrow screen, do not squeeze. Let the panel go and show the details in a `Dialog` or a `BottomSheet` instead. See [Responsive layout](/en/guide/responsive).
