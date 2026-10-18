---
layout: component-docs
title: useCollator
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useCollator 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;Intl.CollatorOptions | undefined&gt;</code></td>
        <td>—</td>
        <td>可选的比较规则，例如数字顺序、大小写敏感度、标点处理和大小写先后。选项会变的时候传 <code>ref</code> 或取值函数，变了比较器会重建。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useCollator 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>collator</code></td>
        <td><code>ComputedRef&lt;Intl.Collator&gt;</code></td>
        <td>绑定到当前 <code>InternationalizationProvider</code> 语言的比较器，带缓存。比较时读 <code>collator.value</code>。</td>
      </tr>
    </tbody>
  </table>
</div>
