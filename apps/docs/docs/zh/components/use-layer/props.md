---
layout: component-docs
title: useLayer
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useLayer 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>mode</code></td>
        <td><code>'context' | 'fixed'</code></td>
        <td>必填</td>
        <td>定位方式：<code>context</code> 跟着锚点元素，<code>fixed</code> 用 <code>x</code> / <code>y</code> 给的坐标。</td>
      </tr>
      <tr>
        <td><code>anchor</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>context 模式下外部的锚点元素。不传就把返回的 <code>anchorRef</code> 绑到触发器上。</td>
      </tr>
      <tr>
        <td><code>placement</code></td>
        <td><code>'above' | 'below' | 'start' | 'end' | MaybeRefOrGetter</code></td>
        <td><code>'below'</code></td>
        <td>浮层落在锚点的哪一侧。逻辑方向：<code>start</code> / <code>end</code> 在 RTL 下自动镜像。空间不够时翻到对面。</td>
      </tr>
      <tr>
        <td><code>alignment</code></td>
        <td><code>'start' | 'center' | 'end' | MaybeRefOrGetter</code></td>
        <td><code>'center'</code></td>
        <td>沿方位轴的对齐方式。</td>
      </tr>
      <tr>
        <td><code>gap</code></td>
        <td><code>number</code></td>
        <td><code>4</code></td>
        <td>浮层与锚点之间的空隙，单位 px。</td>
      </tr>
      <tr>
        <td><code>x</code></td>
        <td><code>number | MaybeRefOrGetter</code></td>
        <td><code>0</code></td>
        <td>fixed 模式的横向视口坐标。</td>
      </tr>
      <tr>
        <td><code>y</code></td>
        <td><code>number | MaybeRefOrGetter</code></td>
        <td><code>0</code></td>
        <td>fixed 模式的纵向视口坐标。</td>
      </tr>
      <tr>
        <td><code>isDefaultOpen</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>首次渲染就打开。</td>
      </tr>
      <tr>
        <td><code>lightDismiss</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>false</code></td>
        <td>点击外部是否关闭浮层。</td>
      </tr>
      <tr>
        <td><code>lazyMount</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>false</code></td>
        <td>是否等到第一次 <code>show()</code> 才渲染内容。渲染与否看 <code>isMounted</code>。</td>
      </tr>
      <tr>
        <td><code>onShow</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td><code>show()</code> 打开浮层后调用。靠 <code>isDefaultOpen</code> 首次渲染就打开不算一次显示，不会调用它。</td>
      </tr>
      <tr>
        <td><code>onHide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td><code>hide()</code> 关闭浮层后调用。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useLayer 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>ShallowRef&lt;boolean&gt;</code></td>
        <td>浮层当前是否打开。</td>
      </tr>
      <tr>
        <td><code>anchorRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>context 模式的锚点元素，用 <code>:ref</code> 绑到触发器上；fixed 模式下不用设。</td>
      </tr>
      <tr>
        <td><code>contentRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>浮层容器。定位靠它量尺寸，点击外部也靠它判断。</td>
      </tr>
      <tr>
        <td><code>contentStyle</code></td>
        <td><code>ComputedRef&lt;CSSProperties&gt;</code></td>
        <td>内联坐标：context 模式是量出来的 <code>top</code> / <code>left</code>；fixed 模式是 <code>position: fixed</code> 加 <code>x</code> / <code>y</code>。</td>
      </tr>
      <tr>
        <td><code>resolvedPlacement</code></td>
        <td><code>ComputedRef&lt;'above' | 'below' | 'start' | 'end'&gt;</code></td>
        <td>考虑空间翻转之后实际生效的方位。fixed 模式下等于请求的方位。</td>
      </tr>
      <tr>
        <td><code>isMounted</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>内容是否该渲染。<code>lazyMount</code> 打开时，第一次 <code>show()</code> 之前一直是 false。</td>
      </tr>
      <tr>
        <td><code>id</code></td>
        <td><code>string</code></td>
        <td>浮层的唯一 ID，用于 <code>aria-controls</code>、<code>aria-describedby</code> 这类关系。</td>
      </tr>
      <tr>
        <td><code>anchorId</code></td>
        <td><code>string</code></td>
        <td>锚点的 CSS 标识，用于高级定位场景。</td>
      </tr>
      <tr>
        <td><code>show</code></td>
        <td><code>() =&gt; void</code></td>
        <td>打开浮层。</td>
      </tr>
      <tr>
        <td><code>hide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>关闭浮层。</td>
      </tr>
    </tbody>
  </table>
</div>
