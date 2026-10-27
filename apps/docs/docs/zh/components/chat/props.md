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
        <td><code>align</code></td>
        <td><code>'top' | 'bottom'</code></td>
        <td><code>'bottom'</code></td>
        <td>消息不到一屏时贴顶还是贴底。<code>'bottom'</code> 在消息前面留一块弹性空白；<code>'top'</code> 不留，消息从顶上排。</td>
      </tr>
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

<code>default</code> 插槽是各行。<code>emptyState</code> 在没有 <code>default</code> 时显示，<code>empty</code> 是它的别名。根节点是 <code>role="log"</code>，<code>aria-live="polite"</code>。

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
        <td>一轮回复里的工具调用。空数组不渲染。每项可以带 <code>name</code>、<code>status</code>、<code>target</code>、<code>duration</code>、<code>node</code>、<code>additions</code>、<code>deletions</code>、<code>stats</code>、<code>errorMessage</code>、<code>key</code>、<code>resultDetail</code>、<code>data</code>。<code>detail</code> 是 <code>resultDetail</code> 的别名。</td>
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

发出 <code>expandedChange</code>，参数是下一个布尔值。<code>detail</code> 插槽收到 <code>{ call }</code>，用来替换 <code>call.resultDetail</code>。分组收起时只显示最新一条；面板在打开前是 <code>inert</code>。等待中和进行中用加载指示。错误会放进一段视觉隐藏的文字里读出来。

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
        <td>正在输入的人。空字符串会被丢掉。不传名字时只有三个点。一个人、两个人、三个及以上各有一句文案。</td>
      </tr>
    </tbody>
  </table>
</div>

根节点是 <code>role="status"</code>，并带 <code>aria-live="polite"</code>。文案就写在这个区域里，不再经 <code>useAnnounce</code> 播第二遍。

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

## ChatComposer

<div class="component-api-table" role="region" aria-label="ChatComposer 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>受控草稿，用 <code>v-model</code> 绑定。不传时由外壳自己保存。</td>
      </tr>
      <tr>
        <td><code>placeholder</code></td>
        <td><code>string</code></td>
        <td>当前语言的「输入消息……」</td>
        <td>草稿为空时的占位文字。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>停用编辑和发送。正在生成时如果显示停止，停止按钮仍然可以点。</td>
      </tr>
      <tr>
        <td><code>density</code></td>
        <td><code>'compact' | 'balanced' | 'spacious'</code></td>
        <td><code>'balanced'</code></td>
        <td>外壳内边距。宽松和均衡用同一套间距。</td>
      </tr>
      <tr>
        <td><code>elevation</code></td>
        <td><code>'low' | 'none'</code></td>
        <td><code>'low'</code></td>
        <td>低阴影在悬停和焦点时加深。none 是平的，靠边框区分。只有键盘把焦点放进编辑器时才画出焦点环。</td>
      </tr>
      <tr>
        <td><code>isStopShown</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>用停止代替发送。</td>
      </tr>
      <tr>
        <td><code>status</code></td>
        <td><code>{ type: 'error' | 'warning', message?: string }</code></td>
        <td>-</td>
        <td>错误用 alert，警告用 status。</td>
      </tr>
      <tr>
        <td><code>statusPosition</code></td>
        <td><code>'top' | 'bottom'</code></td>
        <td><code>'bottom'</code></td>
        <td>状态条贴在外壳上方或下方，并伸进圆角后面。</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="component-api-table" role="region" aria-label="ChatComposer 事件" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>参数</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>submit</code></td>
        <td><code>value: string</code></td>
        <td>草稿去掉首尾空白后仍有内容时发出，然后清空草稿。</td>
      </tr>
      <tr>
        <td><code>stop</code></td>
        <td>-</td>
        <td>停止被点下。</td>
      </tr>
      <tr>
        <td><code>change</code></td>
        <td><code>value: string</code></td>
        <td>草稿变化，包括发送后的清空。</td>
      </tr>
      <tr>
        <td><code>update:modelValue</code></td>
        <td><code>value: string</code></td>
        <td>和 change 一起发出，给 <code>v-model</code> 用。</td>
      </tr>
    </tbody>
  </table>
</div>

插槽有 drawer、headerActions、headerContext、input、footerActions、sendActions、sendButton。模板引用暴露 element。

## ChatComposerInput

<div class="component-api-table" role="region" aria-label="ChatComposerInput 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>单独受控时使用。放在外壳里且不传时，跟外壳的草稿走。</td>
      </tr>
      <tr>
        <td><code>placeholder</code></td>
        <td><code>string</code></td>
        <td>外壳或当前语言的占位</td>
        <td>空编辑器上的提示。</td>
      </tr>
      <tr>
        <td><code>maxRows</code></td>
        <td><code>number</code></td>
        <td><code>8</code></td>
        <td>超过这么多行后开始内部滚动。一行按 22px 算。</td>
      </tr>
      <tr>
        <td><code>triggers</code></td>
        <td><code>ChatComposerTrigger[]</code></td>
        <td>-</td>
        <td>在词首输入触发字符时打开建议列表。触发器上的 <code>hasMultiWordQuery</code> 让查询穿过空格和标点，直到换行、超过 64 个字符，或同一个触发字符再次出现。不设时，空格或制表符结束查询。多词查询没有匹配、也没写 <code>emptySearchText</code> 时，列表先藏起来。有触发器时编辑器是 combobox。</td>
      </tr>
      <tr>
        <td><code>debounceMs</code></td>
        <td><code>number</code></td>
        <td><code>150</code></td>
        <td>异步搜索的等待。同步结果不延迟，第一次异步搜索立刻开始。</td>
      </tr>
      <tr>
        <td><code>hasHistory</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>光标在开头时上方向键取回上一条已发送草稿，在末尾时下方向键往回走。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>当前语言的「消息输入框」</td>
        <td>编辑器的无障碍名称。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td>外壳的停用状态</td>
        <td>停用编辑。</td>
      </tr>
      <tr>
        <td><code>pasteAsToken</code></td>
        <td><code>useChatPasteAsToken 的返回值 | false</code></td>
        <td>超过 200 字变成标记</td>
        <td>传 false 时长文本按原文插入。</td>
      </tr>
      <tr>
        <td><code>pasteAction</code></td>
        <td><code>(event, text) => boolean | void</code></td>
        <td>-</td>
        <td>纯文本粘贴的第一站。返回 true 时输入框不再自己插入。</td>
      </tr>
    </tbody>
  </table>
</div>

事件有 change、update:modelValue、submit、files、keydown。files 来自粘贴或拖入的文件，拖入不会让浏览器打开文件。keydown 在建议列表处理完之后发出，preventDefault 会跳过回车发送和历史。模板引用上有 insertToken、expandToken、insertText、focus、getValue。

## ChatComposerDrawer

<div class="component-api-table" role="region" aria-label="ChatComposerDrawer 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>count</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>传入后才能折叠，并显示在默认摘要里。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>当前语言的「项目」</td>
        <td>摘要和展开、折叠的无障碍名称都用它。</td>
      </tr>
      <tr>
        <td><code>isCollapsed</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>受控折叠，用 <code>v-model:is-collapsed</code>。</td>
      </tr>
      <tr>
        <td><code>defaultIsCollapsed</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>未绑定时的初始状态。</td>
      </tr>
    </tbody>
  </table>
</div>

collapsedChange 在折叠状态变化时发出。默认插槽是展开后的内容。collapsedSummary 替换计数和名称，按钮自己仍带无障碍名称。

## ChatSendButton

<div class="component-api-table" role="region" aria-label="ChatSendButton 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isStopShown</code></td>
        <td><code>boolean</code></td>
        <td>外壳的停止状态</td>
        <td>停止用次要按钮，发送用主要按钮。停止不受停用影响。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td>草稿为空或外壳停用</td>
        <td>只停用发送。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'sm' | 'md'</code></td>
        <td><code>'md'</code></td>
        <td>按钮尺寸。外壳会把圆角收成和外边框同心的圆形。</td>
      </tr>
    </tbody>
  </table>
</div>

send、stop、click 三个事件。sendIcon 和 stopIcon 替换上箭头和方块。放在外壳里且没有自己监听时，点击会提交当前草稿或发出外壳的停止。

## ChatDictationButton

需要传入 useChatDictation 或 useSpeechRecognition 的返回值。size 默认 md。isHiddenWhenUnsupported 默认 true，不支持时不渲染；设为 false 时按钮留着并停用。label 覆盖开始或停止听写的无障碍名称。听的时候按钮上是五根音量条，音量过大时颜色从强调色混向错误色。

## ChatTokenizedText

默认插槽放消息文字；要直接传字符串时用 text 属性，效果一样。tokens 里每个非空 value 按字面替换成徽章或自定义内容。空 value 会被忽略。同一组对象可以同时给输入框的 onSelect 和这里用。

## ChatComposerTokenElement

包住一枚标记，让它在可编辑区域里不可编辑，并带上序列化用的值。一般由输入框自己插入，需要在气泡外单独画一枚时也可以直接用。

## 组合式函数

<code>useChatStreamScroll({ scrollRef })</code> 跟着 <code>scrollRef</code> 的底部走。内容第一次能滚时直接跳到底；之后的增长用弹簧，除非用户要求减少动效。向上滚会立刻松开。停在距底部 10px 以内会重新贴住。<code>isScrolledUp</code> 决定按钮出不出现。

<code>useChatNewMessages({ isLocked, onResize })</code> 看着记录高度。未贴底时，最后一个 <code>.astryx-chat-message</code> 换了，<code>hasNewMessages</code> 变成 true，直到 <code>dismiss()</code>。<code>ChatLayout</code> 会播报这次变化。

<code>useChatStreamScroll</code>、<code>useChatNewMessages</code> 和 <code>useAnnounce</code> 从 <code>@astryx-vue/core</code> 导出。减少动效通过 <code>useMediaQuery</code> 读取。

输入套件另外导出 useChatComposerContext、useChatComposerTokens、useChatPasteAsToken、useChatDictation 和 useSpeechRecognition。它们从 Chat 子路径引入，包根也会再导出一份。语音识别只用浏览器接口，不绑定语音服务。长文本粘贴的默认阈值是 200 个字符。

## 主题

`packages/themes/neutral/chat.css` 把组件变量映射到语义 token。换主题时覆盖这些变量即可。

- `--astryx-chat-bubble-background` / `--astryx-chat-foreground`：填充气泡的底色和文字，对应 `--astryx-color-neutral` 和 `--astryx-color-text-primary`。
- `--astryx-chat-foreground-secondary`、`--astryx-chat-foreground-muted`：元信息、系统行、工具调用的次要文字。
- `--astryx-chat-error`、`--astryx-chat-success`、`--astryx-chat-accent`：失败状态、删除行数、进行中的工具。
- `--astryx-chat-unread-color`：未读分隔线的线和标签，Neutral 映射到 `--astryx-color-border-red`，两条视口用同一个颜色。
- `--astryx-chat-focus`：折叠按钮的键盘焦点描边。
- `--astryx-chat-scroll-background` / `--astryx-chat-scroll-shadow`：回到底部的胶囊。
- `--astryx-chat-radius`：单独气泡的圆角。紧凑密度用 `--astryx-chat-radius-compact`。成组气泡的内侧用 `--astryx-chat-radius-group`。
- `--astryx-duration-fast-max`、`--astryx-duration-medium-max`、`--astryx-duration-slow-max`、`--astryx-ease-standard`：胶囊、折叠和输入中圆点的动效。

## 原生属性

`ChatLayout`、`ChatMessageList`、`ChatMessage`、`ChatSystemMessage`、`ChatToolCalls`、`ChatReasoning`、`ChatTypingIndicator`、`ChatUnreadDivider`、`ChatComposer`、`ChatComposerDrawer`、`ChatComposerInput`、`ChatTokenizedText` 把属性转到根节点。`ChatMessageBubble` 转到气泡，不转到名字或元信息。`ChatMessageMetadata` 转到元信息那一行。`ChatSendButton` 和 `ChatDictationButton` 转到按钮外层。
