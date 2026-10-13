---
layout: component-docs
title: 大纲
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Outline 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>items</code></td><td><code>OutlineItem[]</code></td><td>—</td><td>按顺序排列的标题。每一项是 <code>{ id, label, level }</code>。<code>level</code> 为 1–6。</td></tr>
<tr><td><code>activeId</code></td><td><code>string</code></td><td>—</td><td>受控的当前标题。一旦传入，内置滚动侦测关闭。用 <code>v-model:active-id</code> 绑定。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td><code>Table of contents</code></td><td>导航地标的无障碍名称。默认文案随语言变化，中文为「目录」。</td></tr>
<tr><td><code>density</code></td><td><code>'default' | 'compact'</code></td><td><code>'default'</code></td><td>条目内边距。<code>compact</code> 用于密集侧栏。</td></tr>
<tr><td><code>offset</code></td><td><code>number</code></td><td><code>0</code></td><td>盖住滚动容器顶部的固定头高度，单位像素。停留线和滚动落点一起下移。</td></tr>
<tr><td><code>scrollContainer</code></td><td><code>HTMLElement | null</code></td><td>—</td><td>要跟踪的滚动容器。不传则用最近的可滚动祖先，没有就用视口。</td></tr>
<tr><td><code>hasScrollOnClick</code></td><td><code>boolean</code></td><td><code>true</code></td><td>激活一项时是否平滑滚到对应标题。</td></tr>
</tbody></table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="Outline 事件" tabindex="0">
<table><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody>
<tr><td><code>update:activeId</code></td><td><code>string</code></td><td>当前 id 变了。来源是滚动侦测，或读者激活了某一项。</td></tr>
<tr><td><code>navigateStart</code></td><td><code>string</code></td><td>一次点击开始滚向这个 id。</td></tr>
<tr><td><code>navigateEnd</code></td><td><code>string</code></td><td>这次导航结束、被打断，或到了 1.2 秒。每次开始只发一次。</td></tr>
</tbody></table>
</div>

## 主题

根类名是 `astryx-outline`。指示条读取 `--astryx-outline-indicator-top` 和 `--astryx-outline-indicator-height`，组件会按当前链接量出来。

缩进是 2px 的轨道，加上行内起始内边距：第一档为间距 3，然后是间距 7、间距 11、间距 12。`compact` 把块方向内边距从间距 2 改成间距 1。
