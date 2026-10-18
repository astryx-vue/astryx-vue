---
layout: component-docs
title: useClickableContainer
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useClickableContainer 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseClickableContainerOptions</code></td>
        <td>—</td>
        <td>可点容器的配置对象。必传。</td>
      </tr>
      <tr>
        <td><code>options.containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>外层容器的 ref。必传。</td>
      </tr>
      <tr>
        <td><code>options.interactiveRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>容器里真正承担交互的那个元素的 ref（链接或按钮）。既没给 <code>onClick</code> 也没给 <code>href</code> 时，点击会转交给它。</td>
      </tr>
      <tr>
        <td><code>options.onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>—</td>
        <td>点在容器表面（不是嵌套控件）上时调用。</td>
      </tr>
      <tr>
        <td><code>options.href</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>跳转地址。给了它，点容器就会跳到这里。</td>
      </tr>
      <tr>
        <td><code>options.target</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>链接的 target，例如 <code>'_blank'</code>。和 <code>href</code> 一起决定跳转方式。</td>
      </tr>
      <tr>
        <td><code>options.disabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>容器是否停用。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useClickableContainer 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>绑到容器上的点击处理函数。</td>
      </tr>
      <tr>
        <td><code>onMouseUp</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>绑到容器上的鼠标抬起处理函数，负责有 <code>href</code> 时的中键跳转。</td>
      </tr>
    </tbody>
  </table>
</div>
