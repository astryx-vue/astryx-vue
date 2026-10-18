---
layout: component-docs
title: useTypeahead
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useTypeahead 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseTypeaheadOptions</code></td>
        <td>—</td>
        <td>配置对象。</td>
      </tr>
      <tr>
        <td><code>options.getItemLabels</code></td>
        <td><code>() =&gt; ReadonlyArray&lt;string | null | undefined&gt;</code></td>
        <td>—</td>
        <td>按 DOM 顺序返回各项的标签。某一项是 null 或空字符串，表示这个位置不参与匹配，下标仍然跟调用方的项对得上。</td>
      </tr>
      <tr>
        <td><code>options.onMatch</code></td>
        <td><code>(index: number) =&gt; void</code></td>
        <td>—</td>
        <td>匹配到之后把下标告诉你，你可以聚焦或者选中它；通常接 <code>useListFocus</code> 的 <code>focusItem</code>。</td>
      </tr>
      <tr>
        <td><code>options.getCurrentIndex</code></td>
        <td><code>() =&gt; number</code></td>
        <td><code>() =&gt; -1</code></td>
        <td>从哪一项开始找，一般是当前聚焦的那项。同一个字母一直按，就会在匹配项之间轮着走。负的数表示当前没有项。</td>
      </tr>
      <tr>
        <td><code>options.resetMs</code></td>
        <td><code>number</code></td>
        <td><code>750</code></td>
        <td>多久没有新按键就清空缓冲区，单位毫秒。</td>
      </tr>
      <tr>
        <td><code>options.isDisabled</code></td>
        <td><code>(index: number) =&gt; boolean</code></td>
        <td>—</td>
        <td>这个下标要不要跳过，比如禁用项。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTypeahead 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>onKeyDown</code></td>
        <td><code>(event: KeyboardEvent) =&gt; boolean</code></td>
        <td>按键处理函数。吃掉一个可打印字符时返回 <code>true</code>，调用方就不用再自己处理这个键。</td>
      </tr>
      <tr>
        <td><code>reset</code></td>
        <td><code>() =&gt; void</code></td>
        <td>清掉还没超时的缓冲区，比如这组选项关掉的时候。</td>
      </tr>
    </tbody>
  </table>
</div>
