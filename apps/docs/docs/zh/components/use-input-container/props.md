---
layout: component-docs
title: useInputContainer
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useInputContainer 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseInputContainerOptions</code></td>
        <td>—</td>
        <td>必填。输入框容器的配置对象。</td>
      </tr>
      <tr>
        <td><code>options.containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>必填。外层容器（要变成可点的那一圈）的 ref。</td>
      </tr>
      <tr>
        <td><code>options.inputRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>必填。里面那个输入框、文本域或别的可聚焦控件的 ref。</td>
      </tr>
      <tr>
        <td><code>options.disabled</code></td>
        <td><code>boolean | MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>false</code></td>
        <td>输入框是否停用。每次事件都重新读一次。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useInputContainer 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>挂到外层容器的 <code>click</code> 上。</td>
      </tr>
      <tr>
        <td><code>onMouseUp</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>挂到外层容器的 <code>mouseup</code> 上。</td>
      </tr>
    </tbody>
  </table>
</div>
