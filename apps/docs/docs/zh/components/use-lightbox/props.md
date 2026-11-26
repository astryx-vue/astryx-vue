---
layout: component-docs
title: useLightbox
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useLightbox 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>media</code></td>
        <td><code>LightboxMedia | readonly LightboxMedia[]</code></td>
        <td>—</td>
        <td>一张图片或一段视频，或图集的数组。传数组就是图集。</td>
      </tr>
      <tr>
        <td><code>hasZoom</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>让图片可以缩放，和 <code>Lightbox</code> 一样。</td>
      </tr>
      <tr>
        <td><code>hasAutoPlay</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>视频在打开的查看器里显示时自动播放。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useLightbox 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>bindings</code></td>
        <td><code>ComputedRef</code></td>
        <td>给 <code>Lightbox</code> 做 <code>v-bind</code> 的属性和更新监听。</td>
      </tr>
      <tr>
        <td><code>open</code></td>
        <td><code>(index?: number) =&gt; void</code></td>
        <td>设置图集下标（默认 0）并打开查看器。</td>
      </tr>
      <tr>
        <td><code>close</code></td>
        <td><code>() =&gt; void</code></td>
        <td>关闭查看器。</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>查看器是否打开。</td>
      </tr>
      <tr>
        <td><code>index</code></td>
        <td><code>Ref&lt;number&gt;</code></td>
        <td>正在显示的这一项的下标。</td>
      </tr>
      <tr>
        <td><code>getTriggerProps</code></td>
        <td><code>(index: number) =&gt; LightboxTriggerProps</code></td>
        <td>按钮角色、<code>tabindex</code>、<code>aria-haspopup="dialog"</code>、点击，以及回车或空格激活，给不是原生按钮的触发器用。</td>
      </tr>
      <tr>
        <td><code>triggerProps</code></td>
        <td><code>ComputedRef&lt;LightboxTriggerProps&gt;</code></td>
        <td>第一项的 <code>getTriggerProps</code>。</td>
      </tr>
    </tbody>
  </table>
</div>
