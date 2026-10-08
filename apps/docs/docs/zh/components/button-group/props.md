---
layout: component-docs
title: 按钮组
outline: false
footer: false
---

## ButtonGroup Props

<div class="component-api-table" role="region" aria-label="ButtonGroup Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>按钮组的无障碍名称，供屏幕阅读器在组内导航时播报。</td></tr>
      <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>按钮的排列方向，组内方向键沿此方向移动焦点。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>组内按钮继承的默认尺寸；子按钮设置了自己的 size 时优先使用。</td></tr>
      <tr><td><code>elevation</code></td><td><code>'none' | 'low' | 'med' | 'high'</code></td><td><code>'none'</code></td><td>整个按钮组的静止阴影强度；放入组内的按钮不再单独显示阴影。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用组内全部 Button 和 IconButton。</td></tr>
    </tbody>
  </table>
</div>

## 插槽

ButtonGroup 通过必需的默认插槽接收 Button 或 IconButton。

## 键盘导航

| 按键 | 行为 |
| --- | --- |
| 左右方向键 | 在水平组中移动焦点。 |
| 上下方向键 | 在垂直组中移动焦点。 |
| `Home` | 聚焦第一个可用按钮。 |
| `End` | 聚焦最后一个可用按钮。 |

- 键盘导航跳过禁用按钮。
- 从右到左的水平布局会交换左右方向键的行为。

## 模板引用

`ButtonGroup` 公开 `element`。
类型为 `HTMLDivElement | null`。

## 原生属性

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。
