---
layout: component-docs
title: 快捷键
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Kbd Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>keys</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>必填。要呈现的键盘快捷键，按键之间用 <code>+</code> 分隔，例如 <code>"mod+k"</code>、<code>"shift+plus"</code>。每个分段渲染成一枚按键徽章，分段周围的空格会被忽略，无法识别的分段按大写显示。</td>
      </tr>
    </tbody>
  </table>
</div>

## 按键名称

<div class="component-api-table" role="region" aria-label="Kbd Key Names" tabindex="0">
  <table>
    <thead>
      <tr><th>写法</th><th>显示</th><th>朗读</th></tr>
    </thead>
    <tbody>
      <tr><td><code>mod</code></td><td><code>⌘</code> / <code>Ctrl</code></td><td>Command（Apple 平台）/ Control</td></tr>
      <tr><td><code>ctrl</code></td><td><code>⌃</code></td><td>Control</td></tr>
      <tr><td><code>alt</code></td><td><code>⌥</code></td><td>Alt</td></tr>
      <tr><td><code>shift</code></td><td><code>⇧</code></td><td>Shift</td></tr>
      <tr><td><code>enter</code> / <code>return</code></td><td><code>↵</code></td><td>Enter</td></tr>
      <tr><td><code>backspace</code></td><td><code>⌫</code></td><td>Backspace</td></tr>
      <tr><td><code>tab</code></td><td><code>⇥</code></td><td>Tab</td></tr>
      <tr><td><code>escape</code> / <code>esc</code></td><td><code>Esc</code></td><td>Escape</td></tr>
      <tr><td><code>up</code></td><td><code>↑</code></td><td>Up arrow</td></tr>
      <tr><td><code>down</code></td><td><code>↓</code></td><td>Down arrow</td></tr>
      <tr><td><code>left</code></td><td><code>←</code></td><td>Left arrow</td></tr>
      <tr><td><code>right</code></td><td><code>→</code></td><td>Right arrow</td></tr>
      <tr><td><code>plus</code></td><td><code>+</code></td><td>Plus</td></tr>
    </tbody>
  </table>
</div>

表中没有列出的分段按大写原样显示，朗读时读同一段文字，例如 `f1` 显示为 `F1`。

## 无障碍

根元素带有 `role="img"`，它的 `aria-label` 由各按键的朗读词拼接而成，例如 `keys="mod+k"` 得到 “Control + K”。徽章本身带有 `aria-hidden="true"`，因为它们画出的字形对屏幕阅读器没有意义。`role` 和 `aria-label` 由组件计算，显式传入的同名属性会被忽略，其他 `aria-*` 属性可以正常传入。

## 原生属性

根元素为 `<span>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性（`role` 和 `aria-label` 除外，见上一节）。
- `data-*` 属性。
- `class`。
- `style`。
