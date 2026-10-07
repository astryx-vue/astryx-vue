---
layout: component-docs
title: 视觉隐藏
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="VisuallyHidden Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>'span'</code></td><td>根 HTML 元素或 Vue 组件。实时区域或块级内容可使用 <code>div</code>。</td></tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="VisuallyHidden 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>对辅助技术公开、但从视觉界面隐藏的内容。此插槽为必需项。</td></tr>
    </tbody>
  </table>
</div>

## 模板引用

组件公开 `element`。类型为 `HTMLElement | null`。
`element` 指向最终渲染的根元素。

## 样式约束

- 组件忽略传入的 `class`。
- 组件忽略传入的 `style`。
- 固定的隐藏样式不接受外部覆盖。

## 原生属性

以下内容传入根元素：

- `aria-*` 属性。
- `role`。
- `id`。
- `data-*` 属性。
- 原生事件监听器。

:::warning 隐藏内容
不得在 `VisuallyHidden` 内放置交互控件。视觉界面无法显示这些控件。

必须对所有用户隐藏内容时，使用条件渲染或原生 `hidden` 属性。
:::
