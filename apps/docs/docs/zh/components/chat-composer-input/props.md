---
layout: component-docs
title: 对话输入框
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatComposerInput 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>v-model</code></td><td><code>string</code></td><td>—</td><td>草稿内容。放在 <code>ChatComposer</code> 里时，不传就用外层那份草稿。</td></tr>
<tr><td><code>placeholder</code></td><td><code>string</code></td><td>先用外层的，再用本地化的“Type a message…”</td><td>草稿为空时才显示的提示文字。</td></tr>
<tr><td><code>maxRows</code></td><td><code>number</code></td><td><code>8</code></td><td>超过几行以后输入框开始自己滚动。</td></tr>
<tr><td><code>triggers</code></td><td><code>ChatComposerTrigger[]</code></td><td>—</td><td>敲哪些字符会弹出候选列表。每个触发项带上字符、搜索来源、以及选中后插什么。</td></tr>
<tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>异步搜索的等待时间。同步数据源不等待。</td></tr>
<tr><td><code>hasHistory</code></td><td><code>boolean</code></td><td><code>true</code></td><td>光标在草稿首尾时按方向键，翻出之前提交过的内容。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>本地化的“Message input”</td><td>编辑区给读屏用的名字。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>跟随外层输入区</td><td>不能编辑。不传就跟着外层输入区的禁用状态。</td></tr>
<tr><td><code>pasteAsToken</code></td><td><code>{ onPaste } | false</code></td><td>内置的长度阈值</td><td>粘贴的长文本会变成一个标签。传 <code>useChatPasteAsToken</code> 的返回值可以改阈值，传 <code>false</code> 就原样插入文字。</td></tr>
<tr><td><code>pasteAction</code></td><td><code>(event, text) =&gt; boolean | void</code></td><td>—</td><td>纯文本粘贴时最先拿到机会。返回 <code>true</code> 表示你处理了，输入框不再自己插入。</td></tr>
</tbody></table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="ChatComposerInput 事件" tabindex="0">
<table><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody>
<tr><td><code>update:modelValue</code></td><td><code>string</code></td><td>序列化后的草稿，标签的值也算在里面。<code>v-model</code> 绑的就是它。</td></tr>
<tr><td><code>change</code></td><td><code>string</code></td><td>草稿变了，不管是手打、粘贴，还是代码塞进去的。</td></tr>
<tr><td><code>submit</code></td><td><code>string</code></td><td>没按 Shift 的回车。Shift+回车是换行。</td></tr>
<tr><td><code>files</code></td><td><code>File[]</code></td><td>粘贴或拖进来的文件。拖文件进来不会让页面跳走。</td></tr>
<tr><td><code>keydown</code></td><td><code>KeyboardEvent</code></td><td>候选列表没有接这个按键时的按下事件。调 <code>preventDefault()</code> 可以跳过回车发送和历史翻阅。</td></tr>
</tbody></table>
</div>

## 暴露的方法

<div class="component-api-table" role="region" aria-label="ChatComposerInput 暴露的方法" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>说明</th></tr></thead><tbody>
<tr><td><code>insertToken</code></td><td><code>(token) =&gt; string | undefined</code></td><td>在光标处塞一个标签，返回它的 id。</td></tr>
<tr><td><code>expandToken</code></td><td><code>(id: string) =&gt; void</code></td><td>把一个标签还原成它序列化出来的文字。</td></tr>
<tr><td><code>insertText</code></td><td><code>(text: string) =&gt; void</code></td><td>在光标处插入纯文本。</td></tr>
<tr><td><code>focus</code></td><td><code>() =&gt; void</code></td><td>聚焦到编辑区，用户原来在这个框里的光标位置不动。</td></tr>
<tr><td><code>getValue</code></td><td><code>() =&gt; string</code></td><td>序列化后的草稿，标签的值也算在里面。</td></tr>
</tbody></table>
</div>
