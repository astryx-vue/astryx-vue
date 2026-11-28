---
layout: component-docs
title: 布局面板
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="LayoutPanel 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>hasDivider</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在朝内容的那条边上画一条线：start 插槽里在行内结束边，end 插槽里在行内起始边。不写它也不写 <code>padding</code> 时，面板和内容共用一个间距。Layout 的 <code>defaultHasDividers</code> 对它不生效。紧挨着的 <code>ResizeHandle</code> 已经在同一条边画线时，这里就不要开。</td></tr>
<tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>内容比面板高的时候，在面板里滚动。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>这个地标的无障碍名称。面板在滚动（且没设 <code>role</code>）期间，它同时是滚动分组的名称，没设时用翻译过的「内容」。</td></tr>
<tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>用间距刻度给四边写内边距，会替换自动内边距以及与内容共用的间距。写 <code>0</code> 就是通栏。</td></tr>
<tr><td><code>resizable</code></td><td><code>LayoutResizable</code></td><td>—</td><td><code>useResizable()</code> 的返回值，或它的 <code>props</code>。传了它宽度就由那个 hook 说了算，<code>width</code> 不再生效。旁边要放一个 <code>ResizeHandle</code>，并把同一个对象交给它。对象里带着这块区域的轴 <code>_direction</code>（<code>'horizontal' | 'vertical'</code>），要和把手的 <code>direction</code> 一致。只有 <code>_size</code> 是必填的，手写 <code>{ _size: 250 }</code> 依然可用。区域收起时，面板里的焦点会移到它的 <code>ResizeHandle</code>，收起期间面板为 inert 并对读屏隐藏。宽度为 0 的面板不占位，也不露出任何子元素。拿到 hook 自己返回值的面板，收起和展开时从朝 <code>ResizeHandle</code> 的那条边滑合滑开；手写的对象不滑。</td></tr>
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
