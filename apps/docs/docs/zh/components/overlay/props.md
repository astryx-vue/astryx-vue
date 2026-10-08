---
layout: component-docs
title: 覆盖层
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Overlay Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>showOn</code></td>
        <td><code>OverlayShowOn</code></td>
        <td><code>'always'</code></td>
        <td>未绑定 <code>isOpen</code> 时遮罩的出现方式，完全由 CSS 驱动。<code>always</code> 一直可见；<code>hover</code> 在悬停或容器内获得焦点时出现；<code>focus</code> 只在容器内获得焦点时出现；<code>hover-or-focus</code> 是 <code>hover</code> 的别名。触屏设备上 <code>hover</code> 改成点按切换。</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>由 JavaScript 控制的可见性，优先级高于 <code>showOn</code> 和点按切换。用 <code>v-model:isOpen</code> 绑定；不绑定时可见性交回 <code>showOn</code>。为 <code>false</code> 时遮罩不可见、并设为 <code>inert</code>，里面的按钮不会进入 Tab 顺序。</td>
      </tr>
      <tr>
        <td><code>scrim</code></td>
        <td><code>OverlayScrimMode</code></td>
        <td><code>'dark'</code></td>
        <td>遮罩的背景，同时决定遮罩内部内容使用哪一套表面语义。<code>dark</code> 和 <code>light</code> 分别让内部内容按深色、浅色表面取色；<code>false</code> 不画背景，内容保持页面当前主题。</td>
      </tr>
      <tr>
        <td><code>position</code></td>
        <td><code>OverlayPosition</code></td>
        <td><code>'fill'</code></td>
        <td>遮罩覆盖的范围。<code>fill</code> 铺满整块内容；<code>bottom</code> 和 <code>top</code> 是贴在一条边上的横条，出现和消失时从那条边滑进滑出。</td>
      </tr>
      <tr>
        <td><code>align</code></td>
        <td><code>OverlayAlign</code></td>
        <td><code>'end'</code></td>
        <td>内容在遮罩里的对齐方式。遮罩按列排布，所以这是水平方向：<code>start</code> 靠起始边，<code>end</code> 靠结束边，<code>center</code> 两轴居中。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="Overlay Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>底层内容：图片、视频、插画，或任何自带边界的区块。遮罩覆盖在它上面。</td>
      </tr>
      <tr>
        <td><code>content</code></td>
        <td>遮罩内部的内容。保持精简，一个按钮或一行标签就够了。不提供这个插槽时，组件只渲染底层内容，不会画出遮罩。</td>
      </tr>
    </tbody>
  </table>
</div>

## OverlayScrim

`OverlayScrim` 是遮罩本身的渲染组件，从 `@astryx-vue/core/Overlay` 导出，供 `useOverlay` 的使用者渲染遮罩。`Overlay` 内部用的就是它，属性含义与上表一致。

<div class="component-api-table" role="region" aria-label="OverlayScrim Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>scrim</code></td>
        <td><code>OverlayScrimMode</code></td>
        <td><code>'dark'</code></td>
        <td>遮罩背景与内部内容使用的表面语义。</td>
      </tr>
      <tr>
        <td><code>position</code></td>
        <td><code>OverlayPosition</code></td>
        <td><code>'fill'</code></td>
        <td>遮罩覆盖的范围。</td>
      </tr>
      <tr>
        <td><code>align</code></td>
        <td><code>OverlayAlign</code></td>
        <td><code>'end'</code></td>
        <td>内容在遮罩里的对齐方式。</td>
      </tr>
      <tr>
        <td><code>showOn</code></td>
        <td><code>OverlayShowOn</code></td>
        <td><code>'always'</code></td>
        <td>未绑定 <code>isOpen</code> 时的出现方式。</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>受控可见性。传入时忽略 <code>showOn</code>，并在为 <code>false</code> 时把遮罩设为 <code>inert</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

它的默认插槽就是遮罩内容，根元素上带有 <code>data-position</code>、<code>data-align</code>、<code>data-scrim</code>、<code>data-visibility</code>，主题可以据此定制；遮罩内部的内容包在一层 <code>data-astryx-media="dark | light"</code> 的代理元素里，它只负责切换表面语义，不影响布局。

## useOverlay

`useOverlay` 给一个已经存在的容器加上同样的遮罩行为。选项与 `Overlay` 的属性同名，区别在于可以传 `ref` 或 `computed` 保持响应式。

<div class="component-api-table" role="region" aria-label="useOverlay Result" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>挂到容器元素上，用 <code>ref="containerRef"</code>。</td>
      </tr>
      <tr>
        <td><code>containerProps</code></td>
        <td><code>ComputedRef&lt;OverlayContainerProps&gt;</code></td>
        <td>容器需要的属性（作用域类名、点按切换处理），用 <code>v-bind</code> 挂上。它带来定位、裁剪，以及触屏下的点按切换。</td>
      </tr>
      <tr>
        <td><code>scrimProps</code></td>
        <td><code>ComputedRef&lt;OverlayScrimProps&gt;</code></td>
        <td>传给渲染在容器内部的 <code>OverlayScrim</code>。</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>ComputedRef&lt;boolean | undefined&gt;</code></td>
        <td>遮罩实际使用的可见性：绑定的 <code>isOpen</code>、触屏点按的状态，或 <code>undefined</code>（此时由 CSS 决定）。</td>
      </tr>
      <tr>
        <td><code>hasTouchToggle</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>当前是否处于"点按切换"状态（触屏设备 + <code>hover</code> 模式）。</td>
      </tr>
      <tr>
        <td><code>toggle</code></td>
        <td><code>() =&gt; void</code></td>
        <td>翻转点按切换的状态。绑定 <code>isOpen</code> 时它不生效。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

根元素为 `<div>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。

`class` 会与 <code>astryx-overlay</code> 合并，`style` 与组件自己写入的圆角合并。传入的点击处理与触屏点按切换会同时生效。
