---
layout: component-docs
title: 语音输入按钮
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatDictationButton 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>dictation</code></td><td><code>{ isSupported, isListening, bands, volume, toggle }</code></td><td>—</td><td>必填。<code>useChatDictation</code> 或 <code>useSpeechRecognition</code> 的返回值。用 <code>reactive()</code> 包一层也认，每个字段都会跟着变。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md'</code></td><td><code>'md'</code></td><td>按钮尺寸，交给 <code>Button</code>，同时决定那些竖条的宽和高。</td></tr>
<tr><td><code>isHiddenWhenUnsupported</code></td><td><code>boolean</code></td><td><code>true</code></td><td>浏览器没有语音识别能力时把这个控件藏起来。设成 <code>false</code> 就留在原地，只是禁用。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>本地化的“Start dictation” / “Stop dictation”</td><td>按钮给读屏用的名字。</td></tr>
</tbody></table>
</div>

正在听的时候按钮用强调色。输入音量超过爆音线时，竖条会往错误色偏，麦克风太响一眼就能看出来。
