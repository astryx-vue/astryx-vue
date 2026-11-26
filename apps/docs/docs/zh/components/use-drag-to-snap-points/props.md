---
layout: component-docs
title: useDragToSnapPoints
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useDragToSnapPoints 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>target</code></td>
        <td><code>MaybeRefOrGetter&lt;HTMLElement | null | undefined&gt;</code></td>
        <td>—</td>
        <td>被拖动的元素：模板 ref、getter 或元素本身。只沿 <code>axis</code> 移动。</td>
      </tr>
      <tr>
        <td><code>options.axis</code></td>
        <td><code>'x' | 'y'</code></td>
        <td>—</td>
        <td>元素移动的轴。改了会从元素当前位置重新创建拖动。</td>
      </tr>
      <tr>
        <td><code>options.snapPoints</code></td>
        <td><code>ReadonlyArray&lt;number&gt;</code></td>
        <td>—</td>
        <td>沿 <code>axis</code> 离静止位置的像素偏移，用前排序。空列表时拖动什么也不做。改了只重新创建拖动，元素留在原地。</td>
      </tr>
      <tr>
        <td><code>options.flickThreshold</code></td>
        <td><code>number</code></td>
        <td><code>1008</code></td>
        <td>松手速度超过它（像素/秒）时，带到甩的方向上的下一个吸附点。默认值是 UIKit 面板实测的甩动速度。</td>
      </tr>
      <tr>
        <td><code>options.onSettle</code></td>
        <td><code>(index: number) =&gt; void</code></td>
        <td>—</td>
        <td>元素停稳到某个吸附点后调用，参数是下标。每次用到时现读。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useDragToSnapPoints 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>settleTo</code></td>
        <td><code>(index: number) =&gt; void</code></td>
        <td>不用拖动就把元素停到第 <code>index</code> 个吸附点上，再调用 <code>onSettle</code>。下标越界时什么也不做，开发环境下会警告。</td>
      </tr>
    </tbody>
  </table>
</div>

## createDragToSnapPoints

<div class="component-api-table" role="region" aria-label="createDragToSnapPoints" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>createDragToSnapPoints</code></td>
        <td><code>(element: HTMLElement, options: DragToSnapPointsOptions) =&gt; DragToSnapPoints</code></td>
        <td>在组件外使用。选项和上面一样，返回 <code>settleTo</code> 和 <code>destroy</code>。</td>
      </tr>
      <tr>
        <td><code>destroy</code></td>
        <td><code>() =&gt; void</code></td>
        <td>移除所有监听，让元素停在原地。</td>
      </tr>
    </tbody>
  </table>
</div>
