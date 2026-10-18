---
layout: component-docs
title: 对话输入区
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatComposer 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string</code></td><td>—</td><td>草稿内容。用 <code>v-model</code> 绑上，输入区就完全按这个字符串显示；不绑，它自己存。</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td>本地化的“Type a message…”</td><td>草稿为空时显示的提示文字。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>不能编辑也不能发送。这时候停止按钮还能按，用户仍然可以取消回答。</td></tr>
<tr><td><code>density</code></td><td><code>ChatComposerDensity</code></td><td><code>'balanced'</code></td><td>输入区内部的疏密：<code>compact</code>、<code>balanced</code>、<code>spacious</code>。</td></tr>
<tr><td><code>elevation</code></td><td><code>'none' | 'low'</code></td><td><code>'low'</code></td><td><code>low</code> 是抬起的，悬停和聚焦时阴影更深。<code>none</code> 是平的，改成画一条边框。两种情况键盘聚焦到输入框都会有聚焦环，鼠标点进去没有。</td></tr>
<tr><td><code>isStopShown</code></td><td><code>boolean</code></td><td><code>false</code></td><td>把发送换成停止。助手还在往外吐字的时候打开它。</td></tr>
<tr><td><code>status</code></td><td><code>ChatComposerStatus</code></td><td>—</td><td>提示对象，<code>{ type: 'error' | 'warning', message }</code>。error 会作为警报播报，warning 作为状态播报。</td></tr>
<tr><td><code>statusPosition</code></td><td><code>'top' | 'bottom'</code></td><td><code>'bottom'</code></td><td>提示放在输入区上面还是下面。</td></tr>
</tbody></table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="ChatComposer 事件" tabindex="0">
<table><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody>
<tr><td><code>submit</code></td><td><code>string</code></td><td>提交了一份去掉首尾空白、且不为空的草稿。提交完草稿会被清空。</td></tr>
<tr><td><code>stop</code></td><td>—</td><td>按了停止。</td></tr>
<tr><td><code>change</code></td><td><code>string</code></td><td>草稿变了，也包括提交成功后的清空。</td></tr>
<tr><td><code>update:modelValue</code></td><td><code>string</code></td><td>输入区希望你写回的草稿。<code>v-model</code> 绑的就是它。</td></tr>
</tbody></table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="ChatComposer 插槽" tabindex="0">
<table><thead><tr><th>插槽</th><th>说明</th></tr></thead><tbody>
<tr><td><code>drawer</code></td><td>输入区上方的可折叠内容，一般放 <code>ChatComposerDrawer</code>。</td></tr>
<tr><td><code>headerActions</code></td><td>页眉靠开头那一侧。放小号的纯图标按钮正好跟这一行对齐。</td></tr>
<tr><td><code>headerContext</code></td><td>页眉靠末尾那一侧。放用量表这类上下文信息。</td></tr>
<tr><td><code>input</code></td><td>换掉默认的标签输入框。草稿从 <code>useChatComposerContext</code> 里读。</td></tr>
<tr><td><code>footerActions</code></td><td>页脚靠开头那一侧。中号按钮跟发送按钮对得上。</td></tr>
<tr><td><code>sendActions</code></td><td>紧挨在发送按钮前面，例如放一个麦克风或语音输入按钮。</td></tr>
<tr><td><code>sendButton</code></td><td>换掉默认的发送和停止按钮。</td></tr>
</tbody></table>
</div>

## 暴露

<div class="component-api-table" role="region" aria-label="ChatComposer 暴露" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>说明</th></tr></thead><tbody>
<tr><td><code>element</code></td><td><code>HTMLElement | null</code></td><td>最外层那块框，用来量尺寸或滚动。</td></tr>
</tbody></table>
</div>
