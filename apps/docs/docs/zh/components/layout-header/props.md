---
layout: component-docs
title: 布局页眉
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="LayoutHeader 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>hasDivider</code></td><td><code>boolean</code></td><td>—</td><td>在底边画一条线。不写时看外层 <code>Layout</code> 的 <code>defaultHasDividers</code>，都没有就是 <code>false</code>。</td></tr>
<tr><td><code>height</code></td><td><code>number | string</code></td><td>—</td><td>页眉高度。写数字按像素，写字符串原样使用。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>这个地标的无障碍名称。</td></tr>
<tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>用间距刻度写内边距。写 <code>0</code> 就是让内容自己管边距。</td></tr>
<tr><td><code>paddingBlockEnd</code></td><td><code>SpacingStep</code></td><td>—</td><td>只改下边内边距，会盖掉这一条边上的 <code>padding</code>，方便标签下划线和分隔线贴住页眉边缘。</td></tr>
<tr><td><code>role</code></td><td><code>string</code></td><td>—</td><td>ARIA 地标角色。</td></tr>
</tbody></table>
</div>

`SpacingStep` 可以取这些值：

```ts
type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
```

## 插槽

- `default`：页眉内容。

## 模板引用

`LayoutHeader` 公开 `element`。
类型为 `HTMLDivElement | null`。

## 原生属性

根元素会接收 HTML 属性、`aria-*` 属性、`data-*` 属性、`class` 和 `style`。`class` 会和组件自己的类合并。
