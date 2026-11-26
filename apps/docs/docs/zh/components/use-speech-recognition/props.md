---
layout: component-docs
title: useSpeechRecognition
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useSpeechRecognition 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseSpeechRecognitionOptions</code></td>
        <td>—</td>
        <td>可选。不传就按当前 Astryx 语言一直听，直到调用 <code>stop</code>。</td>
      </tr>
      <tr>
        <td><code>options.lang</code></td>
        <td><code>string</code></td>
        <td>当前语言</td>
        <td>识别用的 BCP-47 语言标签。</td>
      </tr>
      <tr>
        <td><code>options.continuous</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>一直听，直到调用 <code>stop</code> 或 <code>abort</code>。</td>
      </tr>
      <tr>
        <td><code>options.interimResults</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>在最终结果之前就报告中间结果。</td>
      </tr>
      <tr>
        <td><code>options.audioContext</code></td>
        <td><code>AudioContext</code></td>
        <td>共享的那个</td>
        <td>用来测麦克风音量的音频上下文。不传就用按需创建的共享上下文。</td>
      </tr>
      <tr>
        <td><code>options.transformTranscript</code></td>
        <td><code>(text: string) =&gt; string</code></td>
        <td>—</td>
        <td>每段转写在报告之前先经过它改写。</td>
      </tr>
      <tr>
        <td><code>options.onTranscript</code></td>
        <td><code>(transcript: string, isFinal: boolean) =&gt; void</code></td>
        <td>—</td>
        <td>每段中间结果和每段最终结果都会调用。</td>
      </tr>
      <tr>
        <td><code>options.onResult</code></td>
        <td><code>(transcript: string) =&gt; void</code></td>
        <td>—</td>
        <td>每段最终转写调用一次。</td>
      </tr>
      <tr>
        <td><code>options.onError</code></td>
        <td><code>(error: { error: string, message?: string }) =&gt; void</code></td>
        <td>—</td>
        <td>识别失败时调用，麦克风权限被拒绝也算。</td>
      </tr>
      <tr>
        <td><code>options.onStart</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>识别开始时调用。</td>
      </tr>
      <tr>
        <td><code>options.onEnd</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>识别结束时调用。</td>
      </tr>
      <tr>
        <td><code>options.onVolumeSample</code></td>
        <td><code>(volume: number) =&gt; void</code></td>
        <td>—</td>
        <td>麦克风打开期间，每个动画帧调用一次。</td>
      </tr>
      <tr>
        <td><code>options.trackVolume</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>打开一路麦克风分析，得到音量和频段。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useSpeechRecognition 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isSupported</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>当前浏览器有没有语音识别。服务端和水合服务端标记的那次渲染里是 false，挂载之后浏览器支持的话变成 true。</td>
      </tr>
      <tr>
        <td><code>isListening</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>识别是否正在进行。</td>
      </tr>
      <tr>
        <td><code>isSpeaking</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>麦克风此刻是否听到说话声。</td>
      </tr>
      <tr>
        <td><code>volume</code></td>
        <td><code>ComputedRef&lt;number&gt;</code></td>
        <td>正在听时的麦克风音量，0 到 1。</td>
      </tr>
      <tr>
        <td><code>bands</code></td>
        <td><code>ComputedRef&lt;number[]&gt;</code></td>
        <td>从低到高的频段电平，每项 0 到 1。</td>
      </tr>
      <tr>
        <td><code>rawBands</code></td>
        <td><code>ComputedRef&lt;number[]&gt;</code></td>
        <td>校准之前的同一组频段。</td>
      </tr>
      <tr>
        <td><code>interimTranscript</code></td>
        <td><code>ComputedRef&lt;string&gt;</code></td>
        <td>中间转写，没有时是空字符串。</td>
      </tr>
      <tr>
        <td><code>start</code></td>
        <td><code>() =&gt; void</code></td>
        <td>开始识别。</td>
      </tr>
      <tr>
        <td><code>stop</code></td>
        <td><code>() =&gt; void</code></td>
        <td>停止识别，并等最终转写出来。</td>
      </tr>
      <tr>
        <td><code>abort</code></td>
        <td><code>() =&gt; void</code></td>
        <td>立刻停止识别。</td>
      </tr>
      <tr>
        <td><code>toggle</code></td>
        <td><code>() =&gt; void</code></td>
        <td>空闲时开始，正在听时停止。</td>
      </tr>
    </tbody>
  </table>
</div>
