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
        <td><code>align</code></td>
        <td><code>'top' | 'bottom'</code></td>
        <td><code>'bottom'</code></td>
        <td>Vertical alignment when the list is shorter than its container. <code>'bottom'</code> keeps a spacer above the rows; <code>'top'</code> drops it so rows start at the top.</td>
      </tr>
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

The <code>default</code> slot is the rows. The <code>emptyState</code> slot shows when <code>default</code> is omitted; <code>empty</code> is its alias. The root is <code>role="log"</code> with <code>aria-live="polite"</code>.

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
        <td>Tool calls from one assistant turn. An empty array renders nothing. Each item may set <code>name</code>, <code>status</code>, <code>target</code>, <code>duration</code>, <code>node</code>, <code>additions</code>, <code>deletions</code>, <code>stats</code>, <code>errorMessage</code>, <code>key</code>, <code>resultDetail</code>, and <code>data</code>. <code>detail</code> is an alias of <code>resultDetail</code>.</td>
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

Emits <code>expandedChange</code> with the next boolean. The <code>detail</code> slot receives <code>{ call }</code> and replaces <code>call.resultDetail</code>. A collapsed group shows the latest call; the panel is <code>inert</code> until opened. Pending and running calls use a spinner. An error is spoken from a visually hidden string.

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
        <td>People currently typing. Empty names are dropped. No names leaves the dots only. One, two, and three or more each get their own sentence.</td>
      </tr>
    </tbody>
  </table>
</div>

The root is <code>role="status"</code> with <code>aria-live="polite"</code>. The sentence lives in that region and is not announced again through <code>useAnnounce</code>.

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

## ChatComposer

<div class="component-api-table" role="region" aria-label="ChatComposer props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Controlled draft, bound with <code>v-model</code>. Omit it and the shell keeps the draft.</td>
      </tr>
      <tr>
        <td><code>placeholder</code></td>
        <td><code>string</code></td>
        <td>The localized “Type a message…”</td>
        <td>Shown while the draft is empty.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Disables editing and send. Stop stays clickable when it is shown.</td>
      </tr>
      <tr>
        <td><code>density</code></td>
        <td><code>'compact' | 'balanced' | 'spacious'</code></td>
        <td><code>'balanced'</code></td>
        <td>Padding inside the body. Spacious uses the same spacing as balanced.</td>
      </tr>
      <tr>
        <td><code>elevation</code></td>
        <td><code>'low' | 'none'</code></td>
        <td><code>'low'</code></td>
        <td>Low deepens on hover and focus. None is flat and uses a border. The focus ring appears only when the keyboard focuses the editor.</td>
      </tr>
      <tr>
        <td><code>isStopShown</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Shows stop instead of send.</td>
      </tr>
      <tr>
        <td><code>status</code></td>
        <td><code>{ type: 'error' | 'warning', message?: string }</code></td>
        <td>-</td>
        <td>Error uses alert. Warning uses status.</td>
      </tr>
      <tr>
        <td><code>statusPosition</code></td>
        <td><code>'top' | 'bottom'</code></td>
        <td><code>'bottom'</code></td>
        <td>Places the bar above or below the body, tucked behind the radius.</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="component-api-table" role="region" aria-label="ChatComposer events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Payload</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>submit</code></td>
        <td><code>value: string</code></td>
        <td>Fires for a trimmed, non-empty draft, then clears it.</td>
      </tr>
      <tr>
        <td><code>stop</code></td>
        <td>-</td>
        <td>Stop was activated.</td>
      </tr>
      <tr>
        <td><code>change</code></td>
        <td><code>value: string</code></td>
        <td>The draft changed, including the clear after submit.</td>
      </tr>
      <tr>
        <td><code>update:modelValue</code></td>
        <td><code>value: string</code></td>
        <td>Emitted with change for <code>v-model</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

Slots are drawer, headerActions, headerContext, input, footerActions, sendActions, and sendButton. The template ref exposes element.

## ChatComposerInput

<div class="component-api-table" role="region" aria-label="ChatComposerInput props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Controlled draft. Inside a shell, an omitted value follows the shell.</td>
      </tr>
      <tr>
        <td><code>placeholder</code></td>
        <td><code>string</code></td>
        <td>The shell or the localized placeholder</td>
        <td>Hint on the empty editor.</td>
      </tr>
      <tr>
        <td><code>maxRows</code></td>
        <td><code>number</code></td>
        <td><code>8</code></td>
        <td>The editor scrolls after this many lines. A line is 22px.</td>
      </tr>
      <tr>
        <td><code>triggers</code></td>
        <td><code>ChatComposerTrigger[]</code></td>
        <td>-</td>
        <td>A trigger character at a word boundary opens suggestions. <code>hasMultiWordQuery</code> on a trigger keeps the query through spaces and punctuation until a line break, 64 characters, or the same trigger character again. Without it, a space or tab ends the query. An unmatched multi-word query hides the list when <code>emptySearchText</code> is omitted. The editor becomes a combobox.</td>
      </tr>
      <tr>
        <td><code>debounceMs</code></td>
        <td><code>number</code></td>
        <td><code>150</code></td>
        <td>Delay for an async search. Sync results are immediate, and the first async search starts at once.</td>
      </tr>
      <tr>
        <td><code>hasHistory</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Arrow Up at the start recalls the previous submission. Arrow Down at the end steps forward.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>The localized “Message input”</td>
        <td>Accessible name of the editor.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td>The shell's disabled state</td>
        <td>Disables editing.</td>
      </tr>
      <tr>
        <td><code>pasteAsToken</code></td>
        <td><code>Return value of useChatPasteAsToken | false</code></td>
        <td>Pastes longer than 200 characters become a chip</td>
        <td>Pass false to insert the text as-is.</td>
      </tr>
      <tr>
        <td><code>pasteAction</code></td>
        <td><code>(event, text) => boolean | void</code></td>
        <td>-</td>
        <td>First chance at a plain-text paste. Return true and the input will not insert it.</td>
      </tr>
    </tbody>
  </table>
</div>

Events are change, update:modelValue, submit, files, and keydown. files comes from a paste or a drop, and a drop does not navigate away. keydown fires after an open suggestion list declines the event. preventDefault skips Enter-to-send and history. The template ref exposes insertToken, expandToken, insertText, focus, and getValue.

## ChatComposerDrawer

<div class="component-api-table" role="region" aria-label="ChatComposerDrawer props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>count</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>Enables collapse and appears in the default summary.</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>The localized “Items”</td>
        <td>Used in the summary and in the expand and collapse names.</td>
      </tr>
      <tr>
        <td><code>isCollapsed</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Controlled collapsed state, bound with <code>v-model:is-collapsed</code>.</td>
      </tr>
      <tr>
        <td><code>defaultIsCollapsed</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Initial state while unbound.</td>
      </tr>
    </tbody>
  </table>
</div>

collapsedChange fires when the collapsed state changes. The default slot is the open content. collapsedSummary replaces the count and label. The button still owns the disclosure name.

## ChatSendButton

<div class="component-api-table" role="region" aria-label="ChatSendButton props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isStopShown</code></td>
        <td><code>boolean</code></td>
        <td>The shell's stop state</td>
        <td>Stop is secondary. Send is primary. Stop ignores disabled.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td>The draft is empty or the shell is disabled</td>
        <td>Disables send only.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'sm' | 'md'</code></td>
        <td><code>'md'</code></td>
        <td>Button size. The shell rounds it to the outer radius.</td>
      </tr>
    </tbody>
  </table>
</div>

Events are send, stop, and click. sendIcon and stopIcon replace the arrow and the square. Inside a shell, a click with no listener of its own submits the draft or stops the shell.

## ChatDictationButton

Pass the return value of useChatDictation or useSpeechRecognition. size defaults to md. isHiddenWhenUnsupported defaults to true, so the control is absent when speech recognition is missing. Set it to false and the button stays, disabled. label replaces the start or stop dictation name. While listening, five bars follow the volume, and a loud signal blends the accent color toward the error color.

## ChatTokenizedText

The default slot holds the message text, and the text prop does the same job when a string is easier to pass. Each non-empty value in tokens is matched literally and replaced with a badge or custom content. Empty values are ignored. The same objects a trigger returns can be reused here.

## ChatComposerTokenElement

Wraps one chip so it cannot be edited inside the field and carries the serialized value. The input inserts these itself. Use it directly when a chip should render outside the editor.

## Composables

<code>useChatStreamScroll({ scrollRef })</code> follows the bottom of <code>scrollRef</code>. The first time the content can scroll it jumps; later growth uses a spring, unless reduced motion is requested. Scrolling up unlocks at once. Settling within 10px of the bottom locks again. <code>isScrolledUp</code> feeds the button.

<code>useChatNewMessages({ isLocked, onResize })</code> watches the transcript height. When the last <code>.astryx-chat-message</code> changes while unlocked, <code>hasNewMessages</code> becomes true until <code>dismiss()</code>. <code>ChatLayout</code> announces that change.

<code>useChatStreamScroll</code>, <code>useChatNewMessages</code>, and <code>useAnnounce</code> are exported from <code>@astryx-vue/core</code>. Reduced motion is read with <code>useMediaQuery</code>.

The composer also exports useChatComposerContext, useChatComposerTokens, useChatPasteAsToken, useChatDictation, and useSpeechRecognition. Import them from the Chat entry. The package root re-exports them. Speech recognition uses the browser API and does not bind a speech service. A paste longer than 200 characters becomes a chip by default.

## Theming

`packages/themes/neutral/chat.css` maps component variables onto semantic tokens. Another theme overrides those variables.

- `--astryx-chat-bubble-background` / `--astryx-chat-foreground`: filled bubble surface and text, mapped from `--astryx-color-neutral` and `--astryx-color-text-primary`.
- `--astryx-chat-foreground-secondary`, `--astryx-chat-foreground-muted`: metadata, system lines, and secondary tool text.
- `--astryx-chat-error`, `--astryx-chat-success`, `--astryx-chat-accent`: failed status, deletions, and a running tool.
- `--astryx-chat-unread-color`: the unread rule and its label. Neutral maps it to `--astryx-color-border-red`, so both viewports use one color.
- `--astryx-chat-focus`: keyboard outline on disclosure buttons.
- `--astryx-chat-scroll-background` / `--astryx-chat-scroll-shadow`: the scroll-to-bottom pill.
- `--astryx-chat-radius`: standalone bubble radius. Compact density uses `--astryx-chat-radius-compact`. Grouped bubbles use `--astryx-chat-radius-group` on the inner corners.
- `--astryx-duration-fast-max`, `--astryx-duration-medium-max`, `--astryx-duration-slow-max`, `--astryx-ease-standard`: pill, disclosure, and typing motion.

## Native attributes

`ChatLayout`, `ChatMessageList`, `ChatMessage`, `ChatSystemMessage`, `ChatToolCalls`, `ChatReasoning`, `ChatTypingIndicator`, `ChatUnreadDivider`, `ChatComposer`, `ChatComposerDrawer`, `ChatComposerInput`, and `ChatTokenizedText` forward attributes to their root. `ChatMessageBubble` forwards them to the bubble, not the name or metadata. `ChatMessageMetadata` forwards them to the metadata row. `ChatSendButton` and `ChatDictationButton` forward them to the button.
