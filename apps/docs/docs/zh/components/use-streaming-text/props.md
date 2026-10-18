---
layout: component-docs
title: useStreamingText
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useStreamingText 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>targetText</code></td>
        <td><code>MaybeRefOrGetter&lt;string&gt;</code></td>
        <td>—</td>
        <td>要显示出来的完整文字。有新分片到达时，把累积后的文字更新到这里。</td>
      </tr>
      <tr>
        <td><code>isStreaming</code></td>
        <td><code>MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>false</code></td>
        <td>现在是不是还在流式输出。为 false 时直接返回完整的 <code>targetText</code>。</td>
      </tr>
      <tr>
        <td><code>options</code></td>
        <td><code>MaybeRefOrGetter&lt;UseStreamingTextOptions&gt;</code></td>
        <td>—</td>
        <td>显示节奏的配置，可以不传。</td>
      </tr>
      <tr>
        <td><code>options.speed</code></td>
        <td><code>'natural' | 'fast' | 'instant'</code></td>
        <td><code>'natural'</code></td>
        <td>显示节奏的档位。<code>natural</code> 每个动效节拍往前推一小段；<code>fast</code> 的节拍快一倍，落后的量追得更快；<code>instant</code> 不带动画，直接给全文。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useStreamingText 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>displayedText</code></td>
        <td><code>ComputedRef&lt;string&gt;</code></td>
        <td>该渲染出来的那一段。流式过程中会稳稳地往完整的 <code>targetText</code> 长；不在流式时就是 <code>targetText</code> 本身。</td>
      </tr>
    </tbody>
  </table>
</div>
