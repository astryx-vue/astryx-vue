---
layout: component-docs
title: useScrollableArea
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useScrollableArea 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseScrollableAreaOptions</code></td>
        <td>—</td>
        <td>想滚哪个方向、越界手势怎么处理、Sticky 包含关系怎么给。</td>
      </tr>
      <tr>
        <td><code>options.axis</code></td>
        <td><code>'inline' | 'block' | 'both'</code></td>
        <td><code>'block'</code></td>
        <td>哪个逻辑轴可以滚。</td>
      </tr>
      <tr>
        <td><code>options.label</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>视口的无障碍名称。必填。</td>
      </tr>
      <tr>
        <td><code>options.role</code></td>
        <td><code>'group' | 'region'</code></td>
        <td><code>'group'</code></td>
        <td>视口的角色。</td>
      </tr>
      <tr>
        <td><code>options.overscroll</code></td>
        <td><code>'allow' | 'contain'</code></td>
        <td><code>'allow'</code></td>
        <td>对真的能滚的轴，越界手势怎么处理。</td>
      </tr>
      <tr>
        <td><code>options.stickyContainment</code></td>
        <td><code>'whenScrollable' | 'always'</code></td>
        <td><code>'whenScrollable'</code></td>
        <td>视口是只在能滚的时候当 Sticky 包含块，还是一直当。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useScrollableArea 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>viewport</code></td>
        <td><code>(element: unknown) =&gt; void</code></td>
        <td>视口元素的函数 ref。滚动监听和 ResizeObserver 都在这里挂上。</td>
      </tr>
      <tr>
        <td><code>content</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>内容盒的模板 ref。它的尺寸变化也在观察范围里。</td>
      </tr>
      <tr>
        <td><code>viewportAttrs</code></td>
        <td><code>ComputedRef&lt;Record&lt;string, string | number | undefined&gt;&gt;</code></td>
        <td>按当前测量结果算出的 <code>role</code>、<code>aria-label</code>、<code>tabindex</code> 和 <code>data-scroll-*</code>。</td>
      </tr>
      <tr>
        <td><code>viewportStyle</code></td>
        <td><code>ComputedRef&lt;CSSProperties&gt;</code></td>
        <td>两个轴的 <code>overflow</code>，以及所请求轴上的 <code>overscroll-behavior</code>。</td>
      </tr>
      <tr>
        <td><code>state</code></td>
        <td><code>ComputedRef&lt;ScrollableAreaState&gt;</code></td>
        <td><code>inline</code> 和 <code>block</code> 两个轴，每个都有 <code>isScrollable</code>、<code>atStart</code>、<code>atEnd</code>。</td>
      </tr>
    </tbody>
  </table>
</div>
