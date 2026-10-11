---
layout: component-docs
title: Chat
outline: false
footer: false
---

## ChatLayout

<div class="component-api-table" role="region" aria-label="ChatLayout Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>density</code></td>
        <td><code>'compact' | 'balanced' | 'spacious'</code></td>
        <td><code>'balanced'</code></td>
        <td>Spacing, bubble width, and the frosted dock. Messages can override it.</td>
      </tr>
      <tr>
        <td><code>scrollRef</code></td>
        <td><code>HTMLElement | null</code></td>
        <td>-</td>
        <td>Element that scrolls instead of the layout. Leave it unset and the layout scrolls itself. The dock is sticky for self scroll and fixed for an external scroller.</td>
      </tr>
      <tr>
        <td><code>showScrollButton</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Renders the built-in scroll-to-bottom button. Set <code>false</code> when the <code>scrollButton</code> slot replaces it, or when the button should be absent.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="component-api-table" role="region" aria-label="ChatLayout Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The transcript. Usually one <code>ChatMessageList</code>.</td>
      </tr>
      <tr>
        <td><code>composer</code></td>
        <td>Pinned to the bottom, above the frosted scrim.</td>
      </tr>
      <tr>
        <td><code>empty</code></td>
        <td>Shown when the default slot is omitted.</td>
      </tr>
      <tr>
        <td><code>scrollButton</code></td>
        <td>Replaces the built-in button. Props: <code>isVisible</code>, <code>label</code> (set only while new messages are waiting), and <code>scrollToBottom</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

A template ref exposes <code>element</code> and <code>scrollToBottom()</code>. <code>scrollToBottom</code> clears the new-message label and springs to the bottom.

## ChatLayoutScrollButton

<div class="component-api-table" role="region" aria-label="ChatLayoutScrollButton Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isVisible</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Whether the pill is shown. A hidden pill stays mounted so it can fade, and is marked <code>inert</code>.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Widens the pill. Omit it for the icon-only down arrow. The accessible name falls back to “Scroll to bottom”.</td>
      </tr>
    </tbody>
  </table>
</div>

Emits <code>click</code> when the button is pressed.

## ChatMessageList

<div class="component-api-table" role="region" aria-label="ChatMessageList Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>density</code></td>
        <td><code>'compact' | 'balanced' | 'spacious'</code></td>
        <td><code>'balanced'</code></td>
        <td>Passed to messages that do not set their own.</td>
      </tr>
      <tr>
        <td><code>gap</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>Gap between top-level rows, on the spacing scale. Overrides the density gap without changing padding.</td>
      </tr>
      <tr>
        <td><code>scrollToTopAction</code></td>
        <td><code>() =&gt; Promise&lt;void&gt;</code></td>
        <td>-</td>
        <td>Loads older messages when the top sentinel intersects the scroll parent. A spinner shows while the promise is pending. A second intersection is ignored until it settles.</td>
      </tr>
      <tr>
        <td><code>isStreaming</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Sets <code>aria-busy</code> while an assistant message is still streaming.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>localized “Messages”</td>
        <td>Accessible name of the log.</td>
      </tr>
    </tbody>
  </table>
</div>

The <code>default</code> slot is the rows. The <code>empty</code> slot shows when <code>default</code> is omitted. The root is <code>role="log"</code> with <code>aria-live="polite"</code>.

## ChatMessage

<div class="component-api-table" role="region" aria-label="ChatMessage Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>sender</code></td>
        <td><code>'user' | 'assistant' | 'system'</code></td>
        <td>-</td>
        <td>Who the row is from. <code>system</code> is centered and ignores avatar, name, and metadata.</td>
      </tr>
      <tr>
        <td><code>name</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Plain sender name. Prefer the bubble <code>name</code> when the body starts with a bubble.</td>
      </tr>
      <tr>
        <td><code>density</code></td>
        <td><code>'compact' | 'balanced' | 'spacious'</code></td>
        <td>the list, then <code>'balanced'</code></td>
        <td>Density for this row only.</td>
      </tr>
    </tbody>
  </table>
</div>

Slots: <code>default</code> (body), <code>avatar</code>, <code>name</code> (replaces the prop), <code>metadata</code>. The article is named from the visible name, or from “Message from {sender}”.

## ChatMessageBubble

<div class="component-api-table" role="region" aria-label="ChatMessageBubble Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>'filled' | 'ghost'</code></td>
        <td><code>'filled'</code></td>
        <td><code>filled</code> paints the sender surface. <code>ghost</code> drops the background and the block padding so mixed content still lines up.</td>
      </tr>
      <tr>
        <td><code>name</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Sender name aligned to the bubble padding.</td>
      </tr>
      <tr>
        <td><code>group</code></td>
        <td><code>'first' | 'middle' | 'last'</code></td>
        <td>-</td>
        <td>Tightens a corner when several bubbles stack. Leave it unset for a standalone bubble.</td>
      </tr>
    </tbody>
  </table>
</div>

Sender and density come from the surrounding <code>ChatMessage</code>. Slots: <code>default</code>, <code>name</code>, <code>metadata</code>. Attributes fall through to the bubble element.

## ChatMessageMetadata

<div class="component-api-table" role="region" aria-label="ChatMessageMetadata Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>timestamp</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Short time text. The <code>timestamp</code> slot replaces it.</td>
      </tr>
      <tr>
        <td><code>footer</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Secondary text, such as a model name. The <code>footer</code> slot replaces it.</td>
      </tr>
      <tr>
        <td><code>status</code></td>
        <td><code>'sending' | 'sent' | 'delivered' | 'read' | 'error'</code></td>
        <td>-</td>
        <td>Delivery state. The row renders nothing when timestamp, footer, and status are all absent.</td>
      </tr>
    </tbody>
  </table>
</div>

The status icon’s accessible name is localized, for example “Message read”. On a user row the items run from the inline end.

## ChatSystemMessage

<div class="component-api-table" role="region" aria-label="ChatSystemMessage Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>'default' | 'divider'</code></td>
        <td><code>'default'</code></td>
        <td><code>default</code> is a centered line. <code>divider</code> draws a rule on each side. The root is <code>role="status"</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

Slots: <code>default</code>, and <code>icon</code> (ignored for <code>divider</code>).

## ChatToolCalls

<div class="component-api-table" role="region" aria-label="ChatToolCalls Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>calls</code></td>
        <td><code>ChatToolCallItem[]</code></td>
        <td>-</td>
        <td>Tool calls from one assistant turn. An empty array renders nothing. Each item may set <code>name</code>, <code>status</code>, <code>target</code>, <code>duration</code>, <code>node</code>, <code>additions</code>, <code>deletions</code>, <code>stats</code>, <code>errorMessage</code>, <code>key</code>, and <code>detail</code>.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>localized “{count} tool calls”</td>
        <td>Summary shown while a group is expanded.</td>
      </tr>
      <tr>
        <td><code>v-model:isExpanded</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Controlled expanded state of a multi-call group.</td>
      </tr>
      <tr>
        <td><code>defaultIsExpanded</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Initial state while <code>isExpanded</code> is unbound.</td>
      </tr>
    </tbody>
  </table>
</div>

Emits <code>expandedChange</code> with the next boolean. The <code>detail</code> slot receives <code>{ call }</code> and replaces <code>call.detail</code>. A collapsed group shows the latest call; the panel is <code>inert</code> until opened. Pending and running calls use a spinner. An error is spoken from a visually hidden string.

## ChatReasoning

<div class="component-api-table" role="region" aria-label="ChatReasoning Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>localized “Thinking”</td>
        <td>Header label.</td>
      </tr>
      <tr>
        <td><code>duration</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Shown after the label once streaming has finished, such as <code>12s</code>.</td>
      </tr>
      <tr>
        <td><code>isStreaming</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Shimmers the label and hides the preview and the duration.</td>
      </tr>
      <tr>
        <td><code>v-model:isExpanded</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Controlled expanded state.</td>
      </tr>
      <tr>
        <td><code>defaultIsExpanded</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Initial state while <code>isExpanded</code> is unbound.</td>
      </tr>
    </tbody>
  </table>
</div>

The default slot is the full trace. A single text node is also the collapsed preview. Emits <code>expandedChange</code>. The panel is <code>inert</code> while collapsed.

## ChatTypingIndicator

<div class="component-api-table" role="region" aria-label="ChatTypingIndicator Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>names</code></td>
        <td><code>string[]</code></td>
        <td>-</td>
        <td>People currently typing. Empty names are dropped. No names leaves the dots only. One, two, and three or more each get their own sentence, which is also announced.</td>
      </tr>
    </tbody>
  </table>
</div>

The root is <code>role="status"</code>. The announcement goes through <code>useAnnounce</code> as well, so some readers may hear the sentence twice.

## ChatUnreadDivider

<div class="component-api-table" role="region" aria-label="ChatUnreadDivider Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>localized “New”</td>
        <td>Short label at the end of the rule. The accessible name is “{label} messages below”.</td>
      </tr>
    </tbody>
  </table>
</div>

The root is <code>role="separator"</code>. It is not a <code>.astryx-chat-message</code>, so the new-message tracker does not treat it as a message.

## Composables

<code>useChatStreamScroll({ scrollRef })</code> follows the bottom of <code>scrollRef</code>. The first time the content can scroll it jumps; later growth uses a spring, unless reduced motion is requested. Scrolling up unlocks at once. Settling within 10px of the bottom locks again. <code>isScrolledUp</code> feeds the button.

<code>useChatNewMessages({ isLocked, onResize })</code> watches the transcript height. When the last <code>.astryx-chat-message</code> changes while unlocked, <code>hasNewMessages</code> becomes true until <code>dismiss()</code>. <code>ChatLayout</code> announces that change.

<code>useChatStreamScroll</code>, <code>useChatNewMessages</code>, and <code>useAnnounce</code> are exported from <code>@astryx-vue/core</code>. Reduced motion is read with <code>useMediaQuery</code>.

## Theming

Colors, type, radius, shadow, and motion come from the shared tokens. There is no chat-only theme file.

- `--astryx-color-neutral` / `--astryx-color-text-primary`: filled bubble surface and text.
- `--astryx-color-text-secondary`, `--astryx-color-text-disabled`: metadata, system lines, and secondary tool text.
- `--astryx-color-error`, `--astryx-color-success`, `--astryx-color-accent`: failed status, additions, and the typing dots.
- `--astryx-focus-outline-color`: keyboard outline on disclosure buttons.
- `--astryx-color-background-popover` / `--astryx-shadow-med`: the scroll-to-bottom pill.
- `--astryx-radius-chat`: standalone bubble radius. Compact density uses `--astryx-radius-container`.
- `--astryx-duration-fast-max`, `--astryx-duration-medium-max`, `--astryx-duration-slow-max`, `--astryx-ease-standard`: pill, disclosure, and typing motion.

## Native attributes

`ChatLayout`, `ChatMessageList`, `ChatMessage`, `ChatSystemMessage`, `ChatToolCalls`, `ChatReasoning`, `ChatTypingIndicator`, and `ChatUnreadDivider` forward attributes to their root. `ChatMessageBubble` forwards them to the bubble, not the name or metadata. `ChatMessageMetadata` forwards them to the metadata row.
