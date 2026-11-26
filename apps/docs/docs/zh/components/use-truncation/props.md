---
layout: component-docs
title: useTruncation
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useTruncation 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>maxLines</code></td>
        <td><code>MaybeRefOrGetter&lt;number&gt;</code></td>
        <td>必填</td>
        <td>文字最多显示几行。<code>1</code> 比较宽度；大于 1 用 Range 量真实高度，绕开 <code>-webkit-line-clamp</code> 夹住的 <code>scrollHeight</code>；<code>0</code> 不测量。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTruncation 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>bind</code></td>
        <td><code>(element: Element | null) =&gt; void</code></td>
        <td>用 <code>:ref="truncation.bind"</code> 绑到被测量的元素上。换成别的元素时，旧元素的观察自动解除。</td>
      </tr>
      <tr>
        <td><code>isTruncated</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>文字此刻是否被截断。只在它为真时再渲染显示全文的提示。</td>
      </tr>
      <tr>
        <td><code>fullText</code></td>
        <td><code>Ref&lt;string&gt;</code></td>
        <td>元素当前的全部文字，每次测量时更新；尺寸不变、只换了文字时也会跟上。</td>
      </tr>
    </tbody>
  </table>
</div>
