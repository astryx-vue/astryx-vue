---
layout: component-docs
title: useChatDictation
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useChatDictation parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseChatDictationOptions</code></td>
        <td>—</td>
        <td>Optional. Omit it to listen in the active Astryx locale until <code>stop</code> is called.</td>
      </tr>
      <tr>
        <td><code>options.lang</code></td>
        <td><code>string</code></td>
        <td>Active locale</td>
        <td>BCP-47 language tag for recognition.</td>
      </tr>
      <tr>
        <td><code>options.continuous</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether recognition continues until stop or abort.</td>
      </tr>
      <tr>
        <td><code>options.interimResults</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether partial transcripts are reported before the final one.</td>
      </tr>
      <tr>
        <td><code>options.audioContext</code></td>
        <td><code>AudioContext</code></td>
        <td>Shared one</td>
        <td>A shared audio context for the microphone level and cues.</td>
      </tr>
      <tr>
        <td><code>options.transformTranscript</code></td>
        <td><code>(text: string) =&gt; string</code></td>
        <td>—</td>
        <td>Rewrites each transcript before it is reported, before the upper-case rule for loud speech.</td>
      </tr>
      <tr>
        <td><code>options.input</code></td>
        <td><code>Ref&lt;ChatComposerInputHandle | null&gt;</code></td>
        <td>—</td>
        <td>The composer handle. When set, the hook shows each partial transcript in the composer and inserts each final transcript. <code>onResult</code> still runs, so do not insert that text again.</td>
      </tr>
      <tr>
        <td><code>options.hasSounds</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Play a short cue when recognition starts and stops.</td>
      </tr>
      <tr>
        <td><code>options.onResult</code></td>
        <td><code>(transcript: string) =&gt; void</code></td>
        <td>—</td>
        <td>Called with each final transcript.</td>
      </tr>
      <tr>
        <td><code>options.onTranscript</code></td>
        <td><code>(transcript: string, isFinal: boolean) =&gt; void</code></td>
        <td>—</td>
        <td>Called for each partial transcript and each final one.</td>
      </tr>
      <tr>
        <td><code>options.onError</code></td>
        <td><code>(error: { error: string, message?: string }) =&gt; void</code></td>
        <td>—</td>
        <td>Called when recognition fails, including when microphone permission is refused.</td>
      </tr>
      <tr>
        <td><code>options.onStart</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Called when recognition starts.</td>
      </tr>
      <tr>
        <td><code>options.onEnd</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Called when recognition ends.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useChatDictation return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isSupported</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>Whether this browser provides speech recognition. It is false on the server and in the render that hydrates server markup, and turns true after mount when the browser supports it.</td>
      </tr>
      <tr>
        <td><code>isListening</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>Whether recognition is active.</td>
      </tr>
      <tr>
        <td><code>isSpeaking</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>Whether the microphone currently hears speech.</td>
      </tr>
      <tr>
        <td><code>volume</code></td>
        <td><code>ComputedRef&lt;number&gt;</code></td>
        <td>Microphone level from 0 to 1 while listening.</td>
      </tr>
      <tr>
        <td><code>bands</code></td>
        <td><code>ComputedRef&lt;number[]&gt;</code></td>
        <td>Frequency band levels from low to high, each from 0 to 1.</td>
      </tr>
      <tr>
        <td><code>rawBands</code></td>
        <td><code>ComputedRef&lt;number[]&gt;</code></td>
        <td>The same bands before calibration.</td>
      </tr>
      <tr>
        <td><code>interimTranscript</code></td>
        <td><code>ComputedRef&lt;string&gt;</code></td>
        <td>The partial transcript, empty when none is pending.</td>
      </tr>
      <tr>
        <td><code>start</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Start recognition.</td>
      </tr>
      <tr>
        <td><code>stop</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Stop recognition and wait for the final transcript.</td>
      </tr>
      <tr>
        <td><code>abort</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Stop recognition immediately.</td>
      </tr>
      <tr>
        <td><code>toggle</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Start when idle, and stop when listening.</td>
      </tr>
    </tbody>
  </table>
</div>
