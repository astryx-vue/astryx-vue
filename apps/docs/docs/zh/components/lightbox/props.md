---
layout: component-docs
title: 灯箱
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Lightbox 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>对话框是否打开。用 <code>v-model:is-open</code> 绑定。</td></tr>
<tr><td><code>media</code></td><td><code>LightboxMedia | readonly LightboxMedia[]</code></td><td>—</td><td>一项，或一组。数组会显示上一张、下一张和计数。</td></tr>
<tr><td><code>index</code></td><td><code>number</code></td><td>—</td><td>受控的图库下标。用 <code>v-model:index</code> 绑定。</td></tr>
<tr><td><code>defaultIndex</code></td><td><code>number</code></td><td><code>0</code></td><td>没有传 <code>index</code> 时的起始下标。</td></tr>
<tr><td><code>hasZoom</code></td><td><code>boolean</code></td><td><code>false</code></td><td>双击、Enter、Space、<code>+</code>、<code>-</code> 缩放图片。放大后方向键平移。</td></tr>
<tr><td><code>hasAutoPlay</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示出视频时开始播放。</td></tr>
</tbody></table>
</div>

`LightboxMedia` 是 `{ src, alt, caption?, type? }`。`type` 为 `image` 或 `video`，默认 `image`。

## 事件

<div class="component-api-table" role="region" aria-label="Lightbox 事件" tabindex="0">
<table><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody>
<tr><td><code>update:isOpen</code></td><td><code>boolean</code></td><td>关闭、Escape 或点遮罩时，请求改变打开状态。</td></tr>
<tr><td><code>update:index</code></td><td><code>number</code></td><td>上一张、下一张，或未放大时按方向键，请求换到新的下标。</td></tr>
</tbody></table>
</div>

## useLightbox

```ts
const { bindings, open, close, isOpen, index, getTriggerProps } = useLightbox({
  media,
  hasZoom: false,
  hasAutoPlay: false,
})
```

`bindings` 是给 `v-bind` 用的属性和更新监听。`open(index)` 设置下标并打开对话框。`getTriggerProps(index)` 返回 `role="button"`、`tabindex="0"`、`aria-haspopup="dialog"`，以及键盘激活，给自定义触发元素用。

## 主题

对话框类名是 `astryx-lightbox`。说明文字用 large 字号、`on-dark` 颜色，最大宽度 600px，块方向起始边距为间距 2，行内两侧为间距 3。关闭和翻页按钮距画面边缘为间距 3。
