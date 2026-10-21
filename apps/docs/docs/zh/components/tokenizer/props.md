---
layout: component-docs
title: 标签输入框
outline: false
footer: false
---

## Tokenizer Props

<div class="component-api-table" role="region" aria-label="Tokenizer Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>T[]</code></td><td><code>[]</code></td><td>已选条目。</td></tr>
      <tr><td><code>searchSource</code></td><td><code>SearchSource&lt;T&gt;</code></td><td>必需</td><td>静态或异步搜索源。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>字段标签。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方的说明。</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签旁边信息图标里的提示文字。</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>视觉上隐藏标签，读屏仍然读得到。旧名 <code>labelHidden</code> 同样可用，两者任一为真就隐藏。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Add…</code> / <code>添加…</code></td><td>输入框占位符。只在还没有标签时显示。</td></tr>
      <tr><td><code>hasCreate</code></td><td><code>boolean</code></td><td><code>false</code></td><td>允许把输入的文字收成新标签。没匹配到结果时下拉会多出「新建 …」一项，此时变化的类型是 <code>create</code>。</td></tr>
      <tr><td><code>creatable</code></td><td><code>boolean</code></td><td><code>false</code></td><td><code>hasCreate</code> 的旧名。两者任一为真即生效。</td></tr>
      <tr><td><code>overflow</code></td><td><code>'none' | 'unfocused-inline' | 'unfocused-layer'</code></td><td><code>'none'</code></td><td>失焦时是否收成一行并显示 <code>+N</code>。</td></tr>
      <tr><td><code>maxEntries</code></td><td><code>number</code></td><td>—</td><td>最多可选几条。达到上限后输入框只读。</td></tr>
      <tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>输入停顿后再搜索。</td></tr>
      <tr><td><code>minQueryLength</code></td><td><code>number</code></td><td><code>1</code></td><td>够长才去搜索的下限，按人眼看到的字符数算。太短就完全不搜，下拉也不打开——除非开了 <code>hasCreate</code>：「新建 …」是从输入文字派生的，不用搜。</td></tr>
      <tr><td><code>hasEntriesOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>聚焦后还没输入就展示结果。</td></tr>
      <tr><td><code>showOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td><code>hasEntriesOnFocus</code> 的旧名。两者任一为真即生效。</td></tr>
      <tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>挂载后自动聚焦输入框。</td></tr>
      <tr><td><code>menuWidth</code></td><td><code>number</code></td><td>—</td><td>下拉想要的宽度，单位像素。窄不过输入区，再宽会被视口截住。</td></tr>
      <tr><td><code>maxMenuItems</code></td><td><code>number</code></td><td><code>10</code></td><td>下拉最多显示多少条结果。「新建 …」这一项是在它们之外另加的。</td></tr>
      <tr><td><code>hasClear</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否显示全部清除按钮，一次清掉所有标签。</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td><code>hasClear</code> 的旧名。两者任一为真即生效。</td></tr>
      <tr><td><code>emptySearchText</code></td><td><code>string | null</code></td><td><code>'No results found'</code> / <code>'未找到结果'</code></td><td>没有匹配结果时显示的文字。<code>null</code> 当作没给，退回默认；空字符串表示什么都不显示。要放链接这类富内容用 <code>empty</code> 插槽。</td></tr>
      <tr><td><code>emptyText</code></td><td><code>string | null</code></td><td>—</td><td><code>emptySearchText</code> 的旧名。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用整个字段和所有标签交互。</td></tr>
      <tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>说明为什么被禁用。和 <code>disabled</code> 一起用时，输入框改用 <code>aria-disabled</code> 加 <code>readonly</code>，因此仍然可聚焦，鼠标悬停或键盘聚焦都能读到这段说明。</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td><code>disabledMessage</code> 的旧名。</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>状态样式。</td></tr>
      <tr><td><code>statusMessage</code></td><td><code>string</code></td><td>—</td><td>字段下方的状态说明。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>输入框和标签的尺寸。</td></tr>
      <tr><td><code>required</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标记为必填。</td></tr>
      <tr><td><code>optional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标签上显示「可选」标记。</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>表单字段名。每个已选 id 提交一次。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>整个字段的宽度（数字按像素算，字符串原样使用）。</td></tr>
    </tbody>
  </table>
</div>

## Tokenizer Emits

<div class="component-api-table" role="region" aria-label="Tokenizer Emits" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: T[]</code></td><td>已选条目变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>value: T[]</code>、<code>change: TokenizerChange</code></td><td>带上这次变化的类型：<code>add</code>、<code>create</code>、<code>remove</code>、<code>clear</code>。</td></tr>
      <tr><td><code>changeQuery</code></td><td><code>query: string</code></td><td>查询文字变化时触发。</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td><code>changeQuery</code> 的旧名。两个都会触发。</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>列表打开或关闭时触发。</td></tr>
      <tr><td><code>focus</code></td><td><code>event: FocusEvent</code></td><td>焦点从外面进入整个字段时触发。</td></tr>
      <tr><td><code>blur</code></td><td><code>event: FocusEvent</code></td><td>焦点离开整个字段时触发，不只是离开输入框。</td></tr>
    </tbody>
  </table>
</div>

## Tokenizer Slots

<div class="component-api-table" role="region" aria-label="Tokenizer Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>—</td><td>输入区开头的图标，在所有标签之前。</td></tr>
      <tr><td><code>end</code></td><td>—</td><td>输入区末尾的内容，比如按钮或结果计数。</td></tr>
      <tr><td><code>token</code></td><td><code>{ item, remove }</code></td><td>自定义已选标签，替换默认的 <code>Token</code>。</td></tr>
      <tr><td><code>item</code></td><td><code>{ item, isActive, isSelected }</code></td><td>自定义下拉条目，替换默认的 <code>TypeaheadItem</code>。</td></tr>
      <tr><td><code>empty</code></td><td>—</td><td>自定义空状态。</td></tr>
    </tbody>
  </table>
</div>

上面没列出的原生属性和事件监听会落到输入框上，所以 `@keydown`、`@paste` 和 `aria-*` 的用法跟普通 `<input>` 一样。`keydown` 监听先于内部的标签间导航执行，调用 `event.preventDefault()` 就能跳过内部处理。
