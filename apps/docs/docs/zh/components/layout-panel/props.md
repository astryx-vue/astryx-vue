---
layout: component-docs
title: 布局面板
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="LayoutPanel 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>hasDivider</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在朝内容的那条边上画一条线。紧挨着的 <code>ResizeHandle</code> 已经在同一条边画线时，这里就不要开。</td></tr>
<tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>内容比面板高的时候，在面板里滚动。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>这个地标的无障碍名称。</td></tr>
<tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>用间距刻度写内边距，会盖掉外层布局传下来的值。写 <code>0</code> 就是通栏。</td></tr>
<tr><td><code>resizable</code></td><td><code>LayoutResizable</code></td><td>—</td><td><code>useResizable</code> 返回的 <code>props</code>。传了它宽度就由那个 hook 说了算，<code>width</code> 不再生效。旁边要放一个 <code>ResizeHandle</code>，并把同一个对象交给它。</td></tr>
<tr><td><code>role</code></td><td><code>string</code></td><td>—</td><td>ARIA 地标角色，例如 <code>navigation</code>。</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>面板宽度。写数字按像素，写字符串原样使用。传了 <code>resizable</code> 就不起作用。</td></tr>
</tbody></table>
</div>

`SpacingStep` 可以取这些值：

```ts
type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
```

## 插槽

- `default`：面板内容。

## 模板引用

`LayoutPanel` 公开 `element`。
类型为 `HTMLDivElement | null`。

## 原生属性

根元素会接收 HTML 属性、`aria-*` 属性、`data-*` 属性、`class` 和 `style`。`class` 会和组件自己的类合并。
