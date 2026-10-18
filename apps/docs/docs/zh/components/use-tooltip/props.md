---
layout: component-docs
title: useTooltip
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useTooltip 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>placement</code></td>
        <td><code>'above' | 'below' | 'start' | 'end' | MaybeRefOrGetter</code></td>
        <td><code>'above'</code></td>
        <td>相对触发器的方位。逻辑方向：<code>start</code> / <code>end</code> 在 RTL 下自动镜像。空间不够时翻到对面。</td>
      </tr>
      <tr>
        <td><code>alignment</code></td>
        <td><code>'start' | 'center' | 'end' | MaybeRefOrGetter</code></td>
        <td><code>'center'</code></td>
        <td>沿方位轴的对齐方式。</td>
      </tr>
      <tr>
        <td><code>delay</code></td>
        <td><code>number | MaybeRefOrGetter</code></td>
        <td><code>200</code></td>
        <td>悬停多久才显示，单位毫秒。</td>
      </tr>
      <tr>
        <td><code>hideDelay</code></td>
        <td><code>number | MaybeRefOrGetter</code></td>
        <td><code>0</code></td>
        <td>指针或焦点离开后多久隐藏，单位毫秒。<code>0</code> 表示走内部 100 毫秒的桥接时间。</td>
      </tr>
      <tr>
        <td><code>focusTrigger</code></td>
        <td><code>'auto' | 'always' | 'never' | MaybeRefOrGetter</code></td>
        <td><code>'auto'</code></td>
        <td>焦点何时打开提示。<code>auto</code> 只给本来就能聚焦的元素挂焦点监听。</td>
      </tr>
      <tr>
        <td><code>touchTrigger</code></td>
        <td><code>'auto' | 'tap' | 'none' | MaybeRefOrGetter</code></td>
        <td><code>'auto'</code></td>
        <td>没有 hover 的触摸设备上轻点做什么。<code>auto</code> 在触发器自己有动作时不打开；<code>tap</code> 总是打开；<code>none</code> 从不打开。</td>
      </tr>
      <tr>
        <td><code>isEnabled</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>是否启用悬停与焦点触发。</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>boolean | undefined | MaybeRefOrGetter</code></td>
        <td>—</td>
        <td>受控的打开状态。<code>true</code> 强制显示，<code>false</code> 强制隐藏，<code>undefined</code> 交给悬停/焦点管理。</td>
      </tr>
      <tr>
        <td><code>isDefaultOpen</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>挂载时是否显示。</td>
      </tr>
      <tr>
        <td><code>onShow</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>提示显示后调用。</td>
      </tr>
      <tr>
        <td><code>onHide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>提示隐藏后调用。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTooltip 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>提示当前是否显示。受控的 <code>isOpen</code> 优先于悬停状态。</td>
      </tr>
      <tr>
        <td><code>triggerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>触发器元素。用 <code>:ref</code> 绑上去，hook 会挂事件和 ARIA 关联。</td>
      </tr>
      <tr>
        <td><code>contentRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>气泡容器。</td>
      </tr>
      <tr>
        <td><code>id</code></td>
        <td><code>string</code></td>
        <td>气泡的唯一 ID。</td>
      </tr>
      <tr>
        <td><code>anchorId</code></td>
        <td><code>string</code></td>
        <td>锚点的 CSS 标识，用于高级定位场景。</td>
      </tr>
      <tr>
        <td><code>describedBy</code></td>
        <td><code>string</code></td>
        <td>要拼进 <code>aria-describedby</code> 的 ID。hook 已经写到 <code>triggerRef</code> 上了，手写 ARIA 时才需要它。</td>
      </tr>
      <tr>
        <td><code>contentStyle</code></td>
        <td><code>ComputedRef&lt;CSSProperties&gt;</code></td>
        <td>气泡的内联坐标。</td>
      </tr>
      <tr>
        <td><code>resolvedPlacement</code></td>
        <td><code>ComputedRef&lt;'above' | 'below' | 'start' | 'end'&gt;</code></td>
        <td>考虑空间翻转之后实际生效的方位。</td>
      </tr>
      <tr>
        <td><code>contentProps</code></td>
        <td><code>ComputedRef&lt;Record&lt;string, unknown&gt;&gt;</code></td>
        <td>气泡的属性：<code>id</code>、<code>role="tooltip"</code>，以及保持显示的指针事件。</td>
      </tr>
    </tbody>
  </table>
</div>
