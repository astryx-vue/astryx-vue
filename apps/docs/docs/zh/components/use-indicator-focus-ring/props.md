---
layout: component-docs
title: useIndicatorFocusRing
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useIndicatorFocusRing 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>containerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>必填。只包住指示器的那个元素。它唯一的元素子节点就是要画环的东西。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean | MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>false</code></td>
        <td>停用时跳过焦点环，因为停用的控件本来就接不到焦点。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useIndicatorFocusRing 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>focusProps</code></td>
        <td><code>{ onFocus: (event: FocusEvent) =&gt; void, onBlur: () => void }</code></td>
        <td>绑在拿着可聚焦输入框的那个元素上：<code>onFocus</code> 绑 <code>@focusin</code>，<code>onBlur</code> 绑 <code>@focusout</code>。</td>
      </tr>
    </tbody>
  </table>
</div>
