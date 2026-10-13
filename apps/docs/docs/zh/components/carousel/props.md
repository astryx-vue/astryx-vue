---
layout: component-docs
title: 轮播
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Carousel 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>gap</code></td><td><code>0 | 0.5 | 1 | 1.5 | 2 | 3 | 4</code></td><td><code>1</code></td><td>项与项之间的间距，按间距档取值。</td></tr>
<tr><td><code>hasButtons</code></td><td><code>boolean</code></td><td><code>true</code></td><td>内容溢出时显示上一张和下一张按钮。</td></tr>
<tr><td><code>hasEdgeFade</code></td><td><code>boolean</code></td><td><code>true</code></td><td>在仍被裁切的一侧加上渐隐。</td></tr>
<tr><td><code>hasLoop</code></td><td><code>boolean</code></td><td><code>false</code></td><td>从最后一项回到第一项。内容溢出时两端按钮都保持可用。</td></tr>
<tr><td><code>hasSnap</code></td><td><code>boolean</code></td><td><code>false</code></td><td>每个直接子节点吸附到起始边。</td></tr>
<tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>滚动区域的行内内边距，并同步设置 scroll-padding。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td><code>Carousel</code></td><td>区域的无障碍名称。默认文案随语言变化，中文为「轮播」。</td></tr>
</tbody></table>
</div>

## 暴露的方法

<div class="component-api-table" role="region" aria-label="Carousel 暴露的方法" tabindex="0">
<table><thead><tr><th>名称</th><th>签名</th><th>说明</th></tr></thead><tbody>
<tr><td><code>scrollNext</code></td><td><code>() =&gt; void</code></td><td>向前滚动大约一屏。打开 <code>hasLoop</code> 时，到末尾会回到开头。</td></tr>
<tr><td><code>scrollPrev</code></td><td><code>() =&gt; void</code></td><td>向后滚动大约一屏。打开 <code>hasLoop</code> 时，到开头会回到末尾。</td></tr>
<tr><td><code>scrollTo</code></td><td><code>(index: number) =&gt; void</code></td><td>把从 0 开始的那一项滚到起始边。超出范围会夹到有效下标。只滚动轮播本身。</td></tr>
<tr><td><code>canScrollNext</code></td><td><code>() =&gt; boolean</code></td><td>是否还能向前滚。打开 <code>hasLoop</code> 时，只要内容溢出就为 true。</td></tr>
<tr><td><code>canScrollPrev</code></td><td><code>() =&gt; boolean</code></td><td>是否还能向后滚。打开 <code>hasLoop</code> 时，只要内容溢出就为 true。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：轮播项。每个顶层节点是一张幻灯片。Fragment 会展开，空白文本会跳过。

## 主题

根类名是 `astryx-carousel`。滚动区域是 `.astryx-carousel__scroller`。

- `--astryx-carousel-gap`：项间距，由 `gap` 写入。
- `--astryx-carousel-padding`：行内内边距和 scroll-padding，由 `padding` 写入。
