---
layout: component-docs
title: 可滚动区域
outline: false
footer: false
---

## Scrollable Area Props

<div class="component-api-table" role="region" aria-label="Scrollable Area Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>axis</code></td>
        <td><code>'inline' | 'block' | 'both'</code></td>
        <td><code>'block'</code></td>
        <td>允许滚动的逻辑轴。物理方向随书写模式和方向变化。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>无障碍名称，必填。只有某一轴溢出时，视口才进入 Tab 顺序。</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td><code>'group' | 'region'</code></td>
        <td><code>'group'</code></td>
        <td>这块命名视口的角色。</td>
      </tr>
      <tr>
        <td><code>overscroll</code></td>
        <td><code>'allow' | 'contain'</code></td>
        <td><code>'allow'</code></td>
        <td>滚到边缘后，手势要不要交给外层。只有这一轴确实溢出时才会收住。</td>
      </tr>
      <tr>
        <td><code>stickyContainment</code></td>
        <td><code>'whenScrollable' | 'always'</code></td>
        <td><code>'whenScrollable'</code></td>
        <td><code>whenScrollable</code> 在内容装得下时把 sticky 交给外层。<code>always</code> 始终把这个视口留作 sticky 边界。</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td><code>0</code></td>
        <td>内容盒四边的内边距。</td>
      </tr>
      <tr>
        <td><code>paddingInline</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>内容盒的行向内边距，覆盖这一轴上的 <code>padding</code>。</td>
      </tr>
      <tr>
        <td><code>paddingInlineStart</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>内容盒的行起始边内边距。</td>
      </tr>
      <tr>
        <td><code>paddingInlineEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>内容盒的行结束边内边距。</td>
      </tr>
      <tr>
        <td><code>paddingBlock</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>内容盒的块向内边距，覆盖这一轴上的 <code>padding</code>。</td>
      </tr>
      <tr>
        <td><code>paddingBlockStart</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>内容盒的块起始边内边距。</td>
      </tr>
      <tr>
        <td><code>paddingBlockEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>内容盒的块结束边内边距。</td>
      </tr>
      <tr>
        <td><code>isFullBleed</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>让视口逃出祖先的内边距。内容内边距保持不变。</td>
      </tr>
      <tr>
        <td><code>scrollbars</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>外层有 <code>ScrollbarsProvider</code> 时，这块区域要不要换成自绘滚动条。设为 <code>false</code> 就保留原生滚动条。</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>视口宽度。数字按像素处理，字符串原样使用。</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>视口高度。数字按像素处理，字符串原样使用。</td>
      </tr>
      <tr>
        <td><code>maxWidth</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>视口最大宽度。</td>
      </tr>
      <tr>
        <td><code>minHeight</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>视口最小高度。</td>
      </tr>
    </tbody>
  </table>
</div>

`SpacingStep` 的取值是 `0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10`。

## 插槽

<div class="component-api-table" role="region" aria-label="Scrollable Area Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>放进被观察的内容盒。行向和双轴模式会把内容盒的行向尺寸设成 <code>max-content</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## useScrollableArea

组件自己已经有视口和内容盒时，从 <code>@astryx-vue/core</code> 引入。选项是 <code>axis</code>、<code>label</code>、<code>role</code>、<code>overscroll</code>、<code>stickyContainment</code>。返回 <code>viewport</code>（回调 ref）、<code>content</code>、<code>viewportAttrs</code>、<code>viewportStyle</code> 和 <code>state</code>。

溢出容差是 1px。还没量到时，请求的轴是 <code>overflow: clip</code>。量到溢出后，溢出的轴改成 <code>auto</code>。

## useScrollOverflow

<code>useScrollOverflow()</code> 观察一个横向滚动容器。把 <code>scrollRef</code> 绑到元素上。<code>overflowStart</code>、<code>overflowEnd</code>、<code>hasOverflow</code> 都是 ref。容差是 1px。

## 原生属性

`ScrollableArea` 渲染 `<div>`。

以下内容落到视口上：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。

`class` 会合并。视口还写 `data-scroll-axis`，测量之后再写 `data-scrollable-*` 以及 `data-scroll-*-start` / `data-scroll-*-end`。
