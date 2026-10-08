---
layout: component-docs
title: 复选指示器
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="属性列表" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>state</code></td><td><code>'unchecked' | 'checked' | 'indeterminate'</code></td><td>—</td><td>必需，要展示的标记状态。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>指示器尺寸，md 为 24px，sm 为 20px。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>以禁用的视觉样式展示，仅影响外观，不涉及交互行为。</td></tr>
</tbody></table>
</div>

## 插槽

- 默认插槽替换勾选和半选标记。
- 插槽内容只作装饰。
- 不得在插槽中放入可聚焦控件。

## 无障碍

- 根元素固定为 `aria-hidden="true"`。
- 组件不设置交互角色。
- 组件不接收 `role`、`tabindex` 或 `contenteditable`。
- 组件不提供点击事件或键盘行为。
- 模板引用的 `element` 是 `HTMLSpanElement | null`。

## 主题

指示器与 [CheckboxInput](/components/checkbox-input/props#主题) 共用颜色变量。

- `.astryx-checkbox-indicator`：指示器外框。
- `.astryx-checkbox-indicator-check`：勾选标记。
- `.astryx-checkbox-indicator-dash`：半选标记。
- `data-state`：当前显示状态。
- `data-size`：当前尺寸。
- `data-disabled`：禁用状态。
