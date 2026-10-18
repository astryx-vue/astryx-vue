---
layout: component-docs
title: useFocusTrap
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useFocusTrap 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseFocusTrapOptions</code></td>
        <td>—</td>
        <td>焦点陷阱的配置对象。必填。</td>
      </tr>
      <tr>
        <td><code>options.container</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>要关住焦点的元素。模板里绑同一个模板引用。必填。</td>
      </tr>
      <tr>
        <td><code>options.isEnabled</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>—</td>
        <td>陷阱是否生效。打开时装上监听并把焦点送进去，关闭时摘掉监听。必填。</td>
      </tr>
      <tr>
        <td><code>options.initialFocus</code></td>
        <td><code>() =&gt; HTMLElement | null</code></td>
        <td>—</td>
        <td>陷阱打开时先聚焦哪个元素。返回 <code>null</code> 就退回第一个可聚焦元素。可不传。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useFocusTrap 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>focusFirst</code></td>
        <td><code>() =&gt; void</code></td>
        <td>聚焦容器里的第一个可聚焦元素。</td>
      </tr>
      <tr>
        <td><code>focusLast</code></td>
        <td><code>() =&gt; void</code></td>
        <td>聚焦容器里的最后一个可聚焦元素。</td>
      </tr>
      <tr>
        <td><code>update</code></td>
        <td><code>() =&gt; void</code></td>
        <td>留给需要在子元素变化后重新测量的调用方。它什么都不做：可聚焦元素在每次按键时都会重新读。</td>
      </tr>
    </tbody>
  </table>
</div>
