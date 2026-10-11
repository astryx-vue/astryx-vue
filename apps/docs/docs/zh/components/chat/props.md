---
layout: component-docs
title: 对话
outline: false
footer: false
---

## ChatLayout

<div class="component-api-table" role="region" aria-label="ChatLayout 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>density</code></td>
        <td><code>'compact' | 'balanced' | 'spacious'</code></td>
        <td><code>'balanced'</code></td>
        <td>间距、气泡宽度和底部磨砂。单条消息可以自己覆盖。</td>
      </tr>
      <tr>
        <td><code>scrollRef</code></td>
        <td><code>HTMLElement | null</code></td>
        <td>-</td>
        <td>代替布局自己滚动的元素。不传时由布局滚动。自己滚动时底部停靠是 sticky，外部滚动时改成 fixed。</td>
      </tr>
      <tr>
        <td><code>showScrollButton</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>是否渲染内置的回到底部按钮。用 <code>scrollButton</code> 插槽替换，或者根本不需要这个按钮时设为 <code>false</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="component-api-table" role="region" aria-label="ChatLayout 插槽" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>会话记录，通常放一个 <code>ChatMessageList</code>。</td>
      </tr>
      <tr>
        <td><code>composer</code></td>
        <td>贴在底部，位于磨砂层之上。</td>
      </tr>
      <tr>
        <td><code>empty</code></td>
        <td>没有默认插槽时显示。</td>
      </tr>
      <tr>
        <td><code>scrollButton</code></td>
        <td>替换内置按钮。参数：<code>isVisible</code>、<code>label</code>（只在有未读新消息时有值）、<code>scrollToBottom</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

模板引用暴露 <code>element</code> 和 <code>scrollToBottom()</code>。<code>scrollToBottom</code> 会清掉「有新消息」，再用弹簧滚到底部。

## ChatLayoutScrollButton

<div class="component-api-table" role="region" aria-label="ChatLayoutScrollButton 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isVisible</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>胶囊是否可见。隐藏时仍挂在树上，方便淡出，并带 <code>inert</code>。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>把胶囊拉宽。不传时只有向下的图标。无障碍名称回退到「滚动到底部」。</td>
      </tr>
    </tbody>
  </table>
</div>

按下按钮时发出 <code>click</code>。

## ChatMessageList

<div class="component-api-table" role="region" aria-label="ChatMessageList 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>density</code></td>
        <td><code>'compact' | 'balanced' | 'spacious'</code></td>
        <td><code>'balanced'</code></td>
        <td>传给没有自己设置密度的消息。</td>
      </tr>
      <tr>
        <td><code>gap</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>顶层行之间的间距，走间距刻度。只改间距，不改内边距。</td>
      </tr>
      <tr>
        <td><code>scrollToTopAction</code></td>
        <td><code>() =&gt; Promise&lt;void&gt;</code></td>
        <td>-</td>
        <td>顶部哨兵进入滚动容器时加载更早的消息。Promise 结束前显示加载指示。上一次还没结束时，再次进入不会重复触发。</td>
      </tr>
      <tr>
        <td><code>isStreaming</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>助手消息还在增长时设置 <code>aria-busy</code>。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>本地化的「消息列表」</td>
        <td>日志的无障碍名称。</td>
      </tr>
    </tbody>
  </table>
</div>

<code>default</code> 插槽是各行。<code>empty</code> 在没有 <code>default</code> 时显示。根节点是 <code>role="log"</code>，<code>aria-live="polite"</code>。

## ChatMessage

<div class="component-api-table" role="region" aria-label="ChatMessage 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>sender</code></td>
        <td><code>'user' | 'assistant' | 'system'</code></td>
        <td>-</td>
        <td>这条消息是谁发的。<code>system</code> 居中，头像、名字和元信息都忽略。</td>
      </tr>
      <tr>
        <td><code>name</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>纯文本名字。正文以气泡开头时，更适合把名字放在气泡上。</td>
      </tr>
      <tr>
        <td><code>density</code></td>
        <td><code>'compact' | 'balanced' | 'spacious'</code></td>
        <td>先看列表，再回退到 <code>'balanced'</code></td>
        <td>只作用于这一行的密度。</td>
      </tr>
    </tbody>
  </table>
</div>

插槽：<code>default</code>（正文）、<code>avatar</code>、<code>name</code>（替换属性）、<code>metadata</code>。article 的名称优先用可见名字，否则是「来自{发送者}的消息」。

## ChatMessageBubble

<div class="component-api-table" role="region" aria-label="ChatMessageBubble 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>'filled' | 'ghost'</code></td>
        <td><code>'filled'</code></td>
        <td><code>filled</code> 有发送者底色。<code>ghost</code> 去掉背景和上下内边距，混排内容仍然对齐。</td>
      </tr>
      <tr>
        <td><code>name</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>与气泡内边距对齐的名字。</td>
      </tr>
      <tr>
        <td><code>group</code></td>
        <td><code>'first' | 'middle' | 'last'</code></td>
        <td>-</td>
        <td>多条气泡叠在一起时收紧一角。单独一条不用传。</td>
      </tr>
    </tbody>
  </table>
</div>

发送者和密度来自外层 <code>ChatMessage</code>。插槽：<code>default</code>、<code>name</code>、<code>metadata</code>。属性落到气泡元素上。

## ChatMessageMetadata

<div class="component-api-table" role="region" aria-label="ChatMessageMetadata 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>timestamp</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>时间等短文本。<code>timestamp</code> 插槽会替换它。</td>
      </tr>
      <tr>
        <td><code>footer</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>次要文字，例如模型名。<code>footer</code> 插槽会替换它。</td>
      </tr>
      <tr>
        <td><code>status</code></td>
        <td><code>'sending' | 'sent' | 'delivered' | 'read' | 'error'</code></td>
        <td>-</td>
        <td>投递状态。时间、补充文字和状态都没有时，这一行不渲染。</td>
      </tr>
    </tbody>
  </table>
</div>

状态图标的无障碍名称会本地化，例如「消息已读」。用户消息上，各项从行尾开始排。

## ChatSystemMessage

<div class="component-api-table" role="region" aria-label="ChatSystemMessage 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>'default' | 'divider'</code></td>
        <td><code>'default'</code></td>
        <td><code>default</code> 是居中的一行。<code>divider</code> 两侧各有一条线。根节点是 <code>role="status"</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

插槽：<code>default</code>，以及 <code>icon</code>（<code>divider</code> 时忽略）。

## ChatToolCalls

<div class="component-api-table" role="region" aria-label="ChatToolCalls 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>calls</code></td>
        <td><code>ChatToolCallItem[]</code></td>
        <td>-</td>
        <td>一轮回复里的工具调用。空数组不渲染。每项可以带 <code>name</code>、<code>status</code>、<code>target</code>、<code>duration</code>、<code>node</code>、<code>additions</code>、<code>deletions</code>、<code>stats</code>、<code>errorMessage</code>、<code>key</code>、<code>detail</code>。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>本地化的「{count} 个工具调用」</td>
        <td>分组展开时的标题。</td>
      </tr>
      <tr>
        <td><code>v-model:isExpanded</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>多条调用这一组的受控展开状态。</td>
      </tr>
      <tr>
        <td><code>defaultIsExpanded</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td><code>isExpanded</code> 未绑定时的初始状态。</td>
      </tr>
    </tbody>
  </table>
</div>

发出 <code>expandedChange</code>，参数是下一个布尔值。<code>detail</code> 插槽收到 <code>{ call }</code>，用来替换 <code>call.detail</code>。分组收起时只显示最新一条；面板在打开前是 <code>inert</code>。等待中和进行中用加载指示。错误会放进一段视觉隐藏的文字里读出来。

## ChatReasoning

<div class="component-api-table" role="region" aria-label="ChatReasoning 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>本地化的「思考中」</td>
        <td>标题。</td>
      </tr>
      <tr>
        <td><code>duration</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>流式结束后跟在标题后面，例如 <code>12s</code>。</td>
      </tr>
      <tr>
        <td><code>isStreaming</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>标题闪动，并藏起预览和耗时。</td>
      </tr>
      <tr>
        <td><code>v-model:isExpanded</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>受控展开状态。</td>
      </tr>
      <tr>
        <td><code>defaultIsExpanded</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td><code>isExpanded</code> 未绑定时的初始状态。</td>
      </tr>
    </tbody>
  </table>
</div>

默认插槽是完整推理。只有一个文本节点时，它也是收起状态的预览。发出 <code>expandedChange</code>。收起时面板是 <code>inert</code>。

## ChatTypingIndicator

<div class="component-api-table" role="region" aria-label="ChatTypingIndicator 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>names</code></td>
        <td><code>string[]</code></td>
        <td>-</td>
        <td>正在输入的人。空字符串会被丢掉。不传名字时只有三个点。一个人、两个人、三个及以上各有一句文案，并会播报。</td>
      </tr>
    </tbody>
  </table>
</div>

根节点是 <code>role="status"</code>。同一句也会经 <code>useAnnounce</code> 再播一次，有的阅读器可能听到两遍。

## ChatUnreadDivider

<div class="component-api-table" role="region" aria-label="ChatUnreadDivider 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>本地化的「新消息」</td>
        <td>线末端的短标签。无障碍名称是「{label}以下是未读消息」。</td>
      </tr>
    </tbody>
  </table>
</div>

根节点是 <code>role="separator"</code>。它没有 <code>.astryx-chat-message</code>，新消息追踪不会把它当成一条消息。

## 组合式函数

<code>useChatStreamScroll({ scrollRef })</code> 跟着 <code>scrollRef</code> 的底部走。内容第一次能滚时直接跳到底；之后的增长用弹簧，除非用户要求减少动效。向上滚会立刻松开。停在距底部 10px 以内会重新贴住。<code>isScrolledUp</code> 决定按钮出不出现。

<code>useChatNewMessages({ isLocked, onResize })</code> 看着记录高度。未贴底时，最后一个 <code>.astryx-chat-message</code> 换了，<code>hasNewMessages</code> 变成 true，直到 <code>dismiss()</code>。<code>ChatLayout</code> 会播报这次变化。

两个函数从 <code>@astryx-vue/core</code> 和 <code>@astryx-vue/core/Chat</code> 导出。<code>useAnnounce</code> 从 <code>@astryx-vue/core</code> 导出。

## 主题

```css
.my-chat {
  --astryx-chat-bubble-background: rgb(5 54 89 / 10%);
  --astryx-chat-radius: 28px;
}
```

- `--astryx-chat-bubble-background` / `--astryx-chat-bubble-foreground`：填充气泡的底色和文字。
- `--astryx-chat-meta`、`--astryx-chat-muted`：元信息、系统行、工具调用的次要文字。
- `--astryx-chat-error`、`--astryx-chat-success`、`--astryx-chat-accent`：失败状态、新增行数、输入中的圆点。
- `--astryx-chat-focus`：折叠按钮的键盘焦点描边。
- `--astryx-chat-scroll-surface` / `--astryx-chat-scroll-shadow`：回到底部的胶囊。
- `--astryx-chat-radius`：单独气泡的圆角。紧凑密度改用全局容器圆角。

这些变量目前写在对话自己的主题文件里。适合以后提成全局的有：中性表面、错误色、成功色、禁用文字、强调色、弹出层表面、悬停叠层、中等阴影、28px 对话圆角，以及常规 / 半粗字重。

## 原生属性

`ChatLayout`、`ChatMessageList`、`ChatMessage`、`ChatSystemMessage`、`ChatToolCalls`、`ChatReasoning`、`ChatTypingIndicator`、`ChatUnreadDivider` 把属性转到根节点。`ChatMessageBubble` 转到气泡，不转到名字或元信息。`ChatMessageMetadata` 转到元信息那一行。
