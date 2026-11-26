---
layout: component-docs
title: useOutlineFromMarkdown
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useOutlineFromMarkdown 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>markdown</code></td>
        <td><code>MaybeRefOrGetter&lt;string&gt;</code></td>
        <td>必填</td>
        <td>Markdown 原文。和交给 <code>Markdown</code> 渲染的是同一段；会变的话传 ref 或 getter。</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;ParseOutlineFromMarkdownOptions | undefined&gt;</code></td>
        <td>—</td>
        <td>解析选项。<code>Markdown</code> 没装插件时可以不传。</td>
      </tr>
      <tr>
        <td><code>options.plugins</code></td>
        <td><code>readonly (MarkdownPlugin | MarkdownPluginEntry)[]</code></td>
        <td>—</td>
        <td>按顺序排好的插件列表。给 <code>Markdown</code> 传同一份，变换、文字和 id 才一致。换成新数组会重算目录。</td>
      </tr>
      <tr>
        <td><code>options.isFinal</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>原文是否已经写完。<code>Markdown</code> 的 <code>isStreaming</code> 开着时传 <code>false</code>，两边按同样的规则收尾。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useOutlineFromMarkdown 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>items</code></td>
        <td><code>ComputedRef&lt;OutlineItem[]&gt;</code></td>
        <td>每个根标题一项，按文中顺序排列，可以直接交给 <code>Outline</code> 的 <code>items</code>。<code>id</code> 是正文完整、没有 sources 时 <code>Markdown</code> 写在标题上的 id，<code>label</code> 是标题文字，<code>level</code> 是 1 到 6 的层级。</td>
      </tr>
    </tbody>
  </table>
</div>
