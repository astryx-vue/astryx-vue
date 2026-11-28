---
layout: component-docs
title: usePanGesture
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="usePanGesture 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>target</code></td>
        <td><code>MaybeRefOrGetter&lt;Element | null | undefined&gt;</code></td>
        <td>—</td>
        <td>要拖的元素：模板 ref、getter 或元素本身。ref 换到别的节点时重新创建拖动，卸载时销毁。</td>
      </tr>
      <tr>
        <td><code>options.axis</code></td>
        <td><code>'x' | 'y'</code></td>
        <td>—</td>
        <td>只认这条轴上的拖动，另一条轴的分量永远是 0。不传时哪个方向都接。改了会重新创建拖动。</td>
      </tr>
      <tr>
        <td><code>options.onPan</code></td>
        <td><code>(event: PanGestureEvent) =&gt; void</code></td>
        <td>—</td>
        <td>拖动开始、移动、松手、被取消时调用。每次用到时现读，换函数不会重建拖动。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

无。组合式函数不交出识别器。

## PanGestureEvent

<div class="component-api-table" role="region" aria-label="PanGestureEvent" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>state</code></td>
        <td><code>'began' | 'changed' | 'ended' | 'cancelled'</code></td>
        <td>拖动走到了哪一步。</td>
      </tr>
      <tr>
        <td><code>translation</code></td>
        <td><code>{ x: number, y: number }</code></td>
        <td>从拖动开始算起移动的像素，不含起拖前那一小段。</td>
      </tr>
      <tr>
        <td><code>velocity</code></td>
        <td><code>{ x: number, y: number }</code></td>
        <td>每秒多少像素。<code>'ended'</code> 时是松手速度，<code>'cancelled'</code> 时是 0。</td>
      </tr>
    </tbody>
  </table>
</div>

## createPanGesture

<div class="component-api-table" role="region" aria-label="createPanGesture" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>createPanGesture</code></td>
        <td><code>(element: Element, options: PanGestureOptions) =&gt; PanGesture</code></td>
        <td>在组件外使用。选项和上面一样。</td>
      </tr>
      <tr>
        <td><code>destroy</code></td>
        <td><code>() =&gt; void</code></td>
        <td>移除它加过的所有监听，并取消正在进行的拖动（会报一次 <code>'cancelled'</code>）。</td>
      </tr>
    </tbody>
  </table>
</div>
