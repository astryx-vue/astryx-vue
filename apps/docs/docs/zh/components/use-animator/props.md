---
layout: component-docs
title: useAnimator
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useAnimator 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>target</code></td>
        <td><code>MaybeRefOrGetter&lt;HTMLElement | null | undefined&gt;</code></td>
        <td>—</td>
        <td>要驱动的元素：模板 ref、getter 或元素本身。animator 跟着它当前指向的元素走，没有元素时调用都不做事。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useAnimator 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>animate</code></td>
        <td><code>(target: AnimatorValues, options?: { velocity?: AnimatorValues }) =&gt; Promise&lt;void&gt;</code></td>
        <td>用状态切换弹簧把给定通道带到目标值。不传 <code>velocity</code> 时从元素此刻的速度接着走。到达终点，或被后面的调用接管时 resolve。</td>
      </tr>
      <tr>
        <td><code>decay</code></td>
        <td><code>(velocity: AnimatorValues) =&gt; Promise&lt;void&gt;</code></td>
        <td>从松手速度开始惯性滑行，单位是每秒（像素、角度等）。停下或被接管时 resolve。</td>
      </tr>
      <tr>
        <td><code>set</code></td>
        <td><code>(values: AnimatorValues) =&gt; void</code></td>
        <td>直接把给定通道放到这些值，并结束它们的动画。</td>
      </tr>
      <tr>
        <td><code>get</code></td>
        <td><code>() =&gt; AnimatorSnapshot</code></td>
        <td>每个通道此刻在屏幕上的值。</td>
      </tr>
      <tr>
        <td><code>getVelocity</code></td>
        <td><code>() =&gt; AnimatorSnapshot</code></td>
        <td>每个通道此刻的速度，单位是每秒。</td>
      </tr>
      <tr>
        <td><code>stop</code></td>
        <td><code>() =&gt; void</code></td>
        <td>让所有通道停在当前位置。</td>
      </tr>
    </tbody>
  </table>
</div>

## createAnimator

<div class="component-api-table" role="region" aria-label="createAnimator" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>createAnimator</code></td>
        <td><code>(element: HTMLElement) =&gt; Animator</code></td>
        <td>不在组件里时使用。返回上面这些方法，外加 <code>destroy</code>。</td>
      </tr>
      <tr>
        <td><code>destroy</code></td>
        <td><code>() =&gt; void</code></td>
        <td>停下所有动画并放开元素，元素保留当前显示的值。之后的调用都不做事。</td>
      </tr>
      <tr>
        <td><code>AnimatorValues</code></td>
        <td><code>Partial&lt;Record&lt;'x' | 'y' | 'scale' | 'rotate' | 'opacity', number&gt;&gt;</code></td>
        <td>按通道给出的值或速度。<code>x</code>、<code>y</code> 是像素，<code>scale</code> 以 1 为原大小，<code>rotate</code> 是角度，<code>opacity</code> 是 0 到 1。</td>
      </tr>
    </tbody>
  </table>
</div>
