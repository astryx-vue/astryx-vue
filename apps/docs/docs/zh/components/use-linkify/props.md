---
layout: component-docs
title: useLinkify
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useLinkify 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>text</code></td>
        <td><code>MaybeRefOrGetter&lt;string&gt;</code></td>
        <td>—</td>
        <td>要扫描的纯文字。空文字得到只有它自己的一段文字。</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;UseLinkifyOptions&gt;</code></td>
        <td>—</td>
        <td>配置对象。</td>
      </tr>
      <tr>
        <td><code>options.patterns</code></td>
        <td><code>LinkifyPattern[]</code></td>
        <td>—</td>
        <td>自定义格式，加在内置的网址和邮箱识别之外（<code>hasBuiltins</code> 为 false 时取代它们）。每条有带全局标志的正则 <code>pattern</code>、生成地址的 <code>href(match)</code>、可选的 <code>label(match)</code> 和可选的 <code>isExternal</code>（默认 <code>false</code>）。</td>
      </tr>
      <tr>
        <td><code>options.hasBuiltins</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>是否带上内置的 http(s) 网址和邮箱识别。想让 <code>patterns</code> 完全决定哪些会变成链接时设为 <code>false</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useLinkify 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>（返回值）</td>
        <td><code>ComputedRef&lt;LinkifySegment[]&gt;</code></td>
        <td>按顺序排列的 <code>{ type: 'text', text }</code> 和 <code>{ type: 'link', text, href, isExternal }</code> 片段，跟着传入的文字和选项变化。</td>
      </tr>
    </tbody>
  </table>
</div>
