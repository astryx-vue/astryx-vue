---
layout: component-docs
title: 标签
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Badge Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>BadgeVariant</code></td>
        <td><code>'neutral'</code></td>
        <td>标签的视觉变体。语义变体：neutral、info、success、warning、error；分类颜色：blue、cyan、green、orange、pink、purple、red、teal、yellow。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="Badge 插槽" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>default</code></td><td>标签的文字内容。</td></tr>
      <tr><td><code>icon</code></td><td>可选的前置图标。不得用图标代替文字。</td></tr>
    </tbody>
  </table>
</div>

## 原生属性

根元素为 `<span>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。

`Badge` 是只读指示器。不得为标签添加交互行为。
