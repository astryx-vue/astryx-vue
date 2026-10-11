---
layout: component-docs
title: Markdown
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Markdown Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>content</code></td><td><code>string</code></td><td>—</td><td>Markdown 源码。省略时使用默认插槽里的文本。</td></tr>
      <tr><td><code>contentAlign</code></td><td><code>'start' | 'center'</code></td><td><code>'start'</code></td><td>设置了 <code>contentWidth</code> 时，正文行宽的水平对齐。</td></tr>
      <tr><td><code>contentWidth</code></td><td><code>number | string</code></td><td>—</td><td>正文最大宽度。数字按像素。表格和代码块仍占满容器。</td></tr>
      <tr><td><code>components</code></td><td><code>MarkdownComponents</code></td><td>—</td><td>替换某一类节点的渲染。可选键：<code>blockquote</code>、<code>code</code>、<code>heading</code>、<code>hr</code>、<code>image</code>、<code>inlineCode</code>、<code>link</code>、<code>list</code>、<code>paragraph</code>、<code>table</code>。</td></tr>
      <tr><td><code>density</code></td><td><code>'default' | 'compact'</code></td><td><code>'default'</code></td><td><code>compact</code> 收紧块与块之间的间距。</td></tr>
      <tr><td><code>display</code></td><td><code>'block' | 'inline'</code></td><td><code>'block'</code></td><td><code>inline</code> 把源码当成短语，渲染在 <code>span</code> 里。</td></tr>
      <tr><td><code>headingLevelStart</code></td><td><code>1 | 2 | 3 | 4 | 5 | 6</code></td><td><code>1</code></td><td>Markdown 里的 <code>#</code> 对应的标题级别。更深的标题一起后移，到 <code>h6</code> 为止。</td></tr>
      <tr><td><code>isStreaming</code></td><td><code>boolean</code></td><td><code>false</code></td><td>平滑揭示追加的文本，并且只重新解析最后一个未完成的块。</td></tr>
      <tr><td><code>onLinkClick</code></td><td><code>(href: string, event: MouseEvent) =&gt; void | false</code></td><td>—</td><td>链接被点击时调用。返回 <code>false</code> 会取消跳转。</td></tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="Markdown 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>没传 <code>content</code> 时，当作 Markdown 源码的文本。</td></tr>
    </tbody>
  </table>
</div>

## 暴露

<div class="component-api-table" role="region" aria-label="Markdown 暴露" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>element</code></td><td><code>HTMLElement | null</code></td><td>根元素。</td></tr>
    </tbody>
  </table>
</div>

## 组合式函数

`useStreamingText(targetText, isStreaming?, options?)` 把一段不断变长的文本平滑成稳定的揭示。`options.speed` 可以是 `natural`、`fast` 或 `instant`。未在流式输出，或用户偏好减少动态效果时，直接返回全文。

## 原生属性

块级渲染的根元素是 `<div role="document">`，行内渲染是 `<span>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。

传入 `role` 时使用传入的值。
