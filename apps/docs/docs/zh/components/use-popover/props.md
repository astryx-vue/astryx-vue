---
layout: component-docs
title: usePopover
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="usePopover 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>placement</code></td>
        <td><code>'above' | 'below' | 'start' | 'end' | MaybeRefOrGetter</code></td>
        <td><code>'below'</code></td>
        <td>浮层落在触发器的哪一侧。逻辑方向：<code>start</code> / <code>end</code> 在 RTL 下自动镜像。空间不够时翻到对面。</td>
      </tr>
      <tr>
        <td><code>alignment</code></td>
        <td><code>'start' | 'center' | 'end' | MaybeRefOrGetter</code></td>
        <td><code>'start'</code></td>
        <td>沿方位轴的对齐方式。</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>boolean | undefined | MaybeRefOrGetter</code></td>
        <td>—</td>
        <td>受控的打开状态。不传就由 hook 自己管。</td>
      </tr>
      <tr>
        <td><code>isEnabled</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>触发器点击是否打开浮层。</td>
      </tr>
      <tr>
        <td><code>hasLightDismiss</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>点击外部是否关闭。</td>
      </tr>
      <tr>
        <td><code>hasEscapeDismiss</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>按 Escape 是否关闭。</td>
      </tr>
      <tr>
        <td><code>hasAutoFocus</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>打开后是否把焦点移到内容里第一个真正的操作控件。对话框里没有可聚焦元素时，焦点落到内容容器上。</td>
      </tr>
      <tr>
        <td><code>closeButtonSelector</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>初始焦点要跳过的控件选择器，比如组件自带的关闭按钮。</td>
      </tr>
      <tr>
        <td><code>dialogLabel</code></td>
        <td><code>string | MaybeRefOrGetter</code></td>
        <td>—</td>
        <td>弹出层对话框的无障碍名称。没有可见标题时要传。</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td><code>'dialog' | 'none' | MaybeRefOrGetter</code></td>
        <td><code>'dialog'</code></td>
        <td>内容容器的 ARIA role。菜单、列表框这类自己带 role、且触发器自己保留焦点的弹层用 <code>none</code>。</td>
      </tr>
      <tr>
        <td><code>isModal</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td><code>role="dialog"</code> 时是否模态（<code>aria-modal</code>）。</td>
      </tr>
      <tr>
        <td><code>onShow</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>浮层显示后调用。</td>
      </tr>
      <tr>
        <td><code>onHide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>浮层隐藏后调用。需要时用它把焦点还给触发器。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="usePopover 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>浮层当前是否打开。</td>
      </tr>
      <tr>
        <td><code>triggerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>负责打开浮层的元素。用 <code>:ref</code> 绑上去，hook 会挂事件和 ARIA 属性。</td>
      </tr>
      <tr>
        <td><code>anchorRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>定位用的锚点。没设时退回到 <code>triggerRef</code>。</td>
      </tr>
      <tr>
        <td><code>contentRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>浮层内容容器，焦点陷阱和关闭逻辑都靠它。</td>
      </tr>
      <tr>
        <td><code>id</code></td>
        <td><code>string</code></td>
        <td>浮层的唯一 ID，用于 <code>aria-controls</code>。</td>
      </tr>
      <tr>
        <td><code>anchorId</code></td>
        <td><code>string</code></td>
        <td>锚点的 CSS 标识，用于高级定位场景。</td>
      </tr>
      <tr>
        <td><code>contentStyle</code></td>
        <td><code>ComputedRef&lt;CSSProperties&gt;</code></td>
        <td>浮层的内联坐标，摊到内容元素的 <code>style</code> 上。</td>
      </tr>
      <tr>
        <td><code>resolvedPlacement</code></td>
        <td><code>ComputedRef&lt;'above' | 'below' | 'start' | 'end'&gt;</code></td>
        <td>考虑空间翻转之后实际生效的方位。</td>
      </tr>
      <tr>
        <td><code>surfaceProps</code></td>
        <td><code>ComputedRef&lt;Record&lt;string, unknown&gt;&gt;</code></td>
        <td>内容元素的属性：<code>id</code>、<code>role</code>、<code>aria-modal</code>、<code>aria-label</code>、<code>tabindex</code>。</td>
      </tr>
      <tr>
        <td><code>triggerProps</code></td>
        <td><code>ComputedRef&lt;Record&lt;string, unknown&gt;&gt;</code></td>
        <td>hook 自动写到 <code>triggerRef</code> 上的 ARIA 属性：<code>aria-haspopup</code>、<code>aria-expanded</code>、<code>aria-controls</code>。</td>
      </tr>
      <tr>
        <td><code>show</code></td>
        <td><code>() =&gt; void</code></td>
        <td>主动打开浮层。</td>
      </tr>
      <tr>
        <td><code>hide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>主动关闭浮层。</td>
      </tr>
      <tr>
        <td><code>toggle</code></td>
        <td><code>() =&gt; void</code></td>
        <td>在打开和关闭之间切换。</td>
      </tr>
    </tbody>
  </table>
</div>
