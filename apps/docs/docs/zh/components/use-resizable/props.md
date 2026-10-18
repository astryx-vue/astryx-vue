---
layout: component-docs
title: useResizable
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useResizable 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>defaultSize</code></td>
        <td><code>ResizableSize | string</code></td>
        <td><code>250</code></td>
        <td>初始尺寸。数字、精确的 <code>"Npx"</code>、以及 <code>pixel(value)</code> 都按像素算。精确的 <code>"N%"</code> 不带额外像素限制。<code>percent(value, { min: pixel(value) })</code> 或 <code>percent(value, { max: pixel(value) })</code> 会再加上一个像素下限或上限。百分比只解析一次成像素：给了 <code>containerRef</code> 就按它算，否则按视口算，之后不再跟着基准变化。</td>
      </tr>
      <tr>
        <td><code>minSize</code></td>
        <td><code>ResizableSize | string</code></td>
        <td><code>50</code></td>
        <td>最小尺寸。数字、精确的 <code>"Npx"</code>、<code>pixel(value)</code> 仍按像素；精确的 <code>"N%"</code> 不带额外像素限制；<code>percent()</code> 会加且只加一个限制。百分比下限在基准变化时会重新解析，并把当前像素值夹回范围内。</td>
      </tr>
      <tr>
        <td><code>maxSize</code></td>
        <td><code>ResizableSize | string</code></td>
        <td><code>Infinity</code></td>
        <td>最大尺寸。数字、精确的 <code>"Npx"</code>、<code>pixel(value)</code> 仍按像素；精确的 <code>"N%"</code> 不带额外像素限制；<code>percent()</code> 会加且只加一个限制。百分比上限在基准变化时会重新解析，并把当前像素值夹回范围内。</td>
      </tr>
      <tr>
        <td><code>containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>百分比按谁算。这个 ref 由调用方提供，hook 不会自己去猜。不传就按视口算。ref 指的元素以后可以换，基准跟着换。目标元素还没完成布局时（没挂载、<code>display:none</code>、已脱离文档），百分比先按临时的 1200px 算，也不会写进持久化。</td>
      </tr>
      <tr>
        <td><code>direction</code></td>
        <td><code>'horizontal' | 'vertical'</code></td>
        <td><code>'horizontal'</code></td>
        <td>这个区域沿哪个方向改尺寸。它决定百分比的基准取容器的行内还是块方向内容盒尺寸，也必须和交给 <code>ResizeHandle</code> 的方向一致。</td>
      </tr>
      <tr>
        <td><code>collapsible</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>拖到收起阈值以下时，是否把区域收成 0。</td>
      </tr>
      <tr>
        <td><code>collapsedSize</code></td>
        <td><code>number</code></td>
        <td><code>40</code></td>
        <td>可收起的区域低于这个像素阈值就吸到 0。</td>
      </tr>
      <tr>
        <td><code>snaps</code></td>
        <td><code>number[]</code></td>
        <td><code>[]</code></td>
        <td>拖动时要吸过去的像素值。指针离某个值不到 8px 时，尺寸就停在那里。</td>
      </tr>
      <tr>
        <td><code>autoSaveId</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>把尺寸和收起状态存进 localStorage 的键名，实际键名前面带 <code>astryx-resizable:</code>。</td>
      </tr>
      <tr>
        <td><code>defaultIsCollapsed</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>初始收起状态（非受控）。localStorage 里有记录时以记录为准。</td>
      </tr>
      <tr>
        <td><code>isCollapsed</code></td>
        <td><code>boolean</code></td>
        <td>—</td>
        <td>受控的收起状态。传了它，<code>collapse()</code>、<code>expand()</code> 和拖过阈值都不再自己改状态，而是通过 <code>onCollapseChange</code> 报给你。</td>
      </tr>
      <tr>
        <td><code>onSizeChange</code></td>
        <td><code>(size: number) =&gt; void</code></td>
        <td>—</td>
        <td>每次拖动、调整或收起之后，带上解析好的像素尺寸调用。</td>
      </tr>
      <tr>
        <td><code>onCollapseChange</code></td>
        <td><code>(isCollapsed: boolean) =&gt; void</code></td>
        <td>—</td>
        <td>收起状态每变一次调用一次，拖动或代码触发都算。</td>
      </tr>
    </tbody>
  </table>
</div>

传 <code>regions</code> 走多区域模式时，参数是 <code>regions</code>（键到 <code>ResizableRegionConfig</code> 的映射）加上 <code>direction</code>、<code>containerRef</code>、<code>autoSaveId</code>。每个区域除了上面这些尺寸、收起和吸附字段，还能给 <code>shrinkOrder</code>：容器装不下时，数字小的先让出空间。

## 返回值

<div class="component-api-table" role="region" aria-label="useResizable 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>size</code></td>
        <td><code>number</code></td>
        <td>当前尺寸，单位像素。响应式。</td>
      </tr>
      <tr>
        <td><code>isCollapsed</code></td>
        <td><code>boolean</code></td>
        <td>区域当前是否已收起。响应式。</td>
      </tr>
      <tr>
        <td><code>collapse</code></td>
        <td><code>() =&gt; void</code></td>
        <td>用代码把区域收起来。</td>
      </tr>
      <tr>
        <td><code>expand</code></td>
        <td><code>() =&gt; void</code></td>
        <td>从收起状态展开。</td>
      </tr>
      <tr>
        <td><code>resize</code></td>
        <td><code>(size: number) =&gt; void</code></td>
        <td>调到指定的像素尺寸。</td>
      </tr>
      <tr>
        <td><code>props</code></td>
        <td><code>ResizableProps</code></td>
        <td>展开给可调整的组件，或者交给 <code>ResizeHandle</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

传 <code>regions</code> 时返回 <code>Record&lt;string, ResizableRegion&gt;</code>：每个键对应一个形状相同的对象。
