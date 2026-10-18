---
layout: component-docs
title: 头像组溢出
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="AvatarGroupOverflow 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>count</code></td><td><code>number</code></td><td>—</td><td>藏起来的头像数量。显示成 <code>+N</code>，读屏名也用它拼。必填。</td></tr>
</tbody></table>
</div>

## 事件

- `click(event: MouseEvent)`：点这个圆圈时触发。绑了这个监听，圆圈才会变成能聚焦的按钮。

## 插槽

- `default`：自定义的计数文字，例如 `12+`。不写就用 `+N`。
