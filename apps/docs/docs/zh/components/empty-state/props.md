---
layout: component-docs
title: 空状态
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="EmptyState Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>title</code></td>
        <td><code>string</code></td>
        <td>必填</td>
        <td>主要信息，渲染为空状态里的标题元素。要写清“什么是空的”，例如 “No projects yet”，避免 “No data” 这类宽泛说法。</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>标题下方的辅助文字，解释这块区域为什么是空的，或者用户接下来可以做什么。渲染为 <code>&lt;div&gt;</code>。</td>
      </tr>
      <tr>
        <td><code>headingLevel</code></td>
        <td><code>1 | 2 | 3 | 4 | 5 | 6</code></td>
        <td><code>3</code></td>
        <td>标题的语义级别，只决定渲染的 HTML 标签（h1–h6），使标题能接上文档大纲。标题的视觉大小在任何级别下都相同。</td>
      </tr>
      <tr>
        <td><code>isCompact</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>启用紧凑变体：收紧间距和文字大小，适用于卡片、侧边栏等空间受限的区域，操作按钮也会改为竖排。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="EmptyState Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>icon</code></td>
        <td>标题上方的图标或插图。外层容器带有 <code>aria-hidden="true"</code>，因此放在这里的图标不需要设置 <code>label</code>。</td>
      </tr>
      <tr>
        <td><code>title</code></td>
        <td>标题的富内容，会覆盖 <code>title</code> 属性，例如在标题里放一个链接。</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td>说明文字的富内容，会覆盖 <code>description</code> 属性。因为渲染为 <code>&lt;div&gt;</code>，这里可以放列表、链接等块级元素。</td>
      </tr>
      <tr>
        <td><code>actions</code></td>
        <td>说明文字下方的操作按钮，通常是一到两个。默认横向排列并自动换行，<code>isCompact</code> 为 true 时改为竖向排列。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

根元素为 `<div>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。

根元素默认带有 `role="status"`，显式传入的 `role` 会覆盖它。

## 主题令牌

`packages/themes/neutral/empty-state.css` 提供以下令牌，主题可以覆盖它们：

<div class="component-api-table" role="region" aria-label="EmptyState Tokens" tabindex="0">
  <table>
    <thead>
      <tr><th>令牌</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>--astryx-empty-state-title-foreground</code></td>
        <td>标题颜色，默认与主要文字色一致。</td>
      </tr>
      <tr>
        <td><code>--astryx-empty-state-description-foreground</code></td>
        <td>说明文字颜色，默认与次要文字色一致。</td>
      </tr>
      <tr>
        <td><code>--astryx-empty-state-text-width</code></td>
        <td>标题与说明组成的文字列的最大宽度，默认 360px。</td>
      </tr>
    </tbody>
  </table>
</div>
