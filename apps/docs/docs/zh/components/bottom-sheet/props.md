---
layout: component-docs
title: 底部弹窗
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="BottomSheet Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>面板的无障碍名称，必填。它通过 <code>aria-label</code> 与面板关联；面板没有内置标题可以自动取名。</td>
      </tr>
      <tr>
        <td><code>v-model:isOpen</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>受控的打开状态。绑定后组件完全跟随这个值，Escape、遮罩点击和拖动只发出更新请求；不绑定时组件自己管理状态。</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>BottomSheetHeight | number | string</code></td>
        <td><code>'capped'</code></td>
        <td>面板的高度。命名档位 hug（贴合内容，最多 92%）、capped（约 62%）、tall（约 92%）；数字按像素解释，字符串按 CSS 长度原样使用。内容超出可见高度时在面板内部滚动。</td>
      </tr>
      <tr>
        <td><code>snapPoints</code></td>
        <td><code>readonly BottomSheetSnapPoint[]</code></td>
        <td>-</td>
        <td>拖动时可以停靠的额外高度。数字是视口比例，<code>'50%'</code> 是百分比，<code>'320px'</code> 是绝对高度；面板自身高度始终是最高的档位。不传时面板只能打开和关闭。</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>BottomSheetPadding</code></td>
        <td>-</td>
        <td>内容区的内边距，取值来自间距刻度。不设置时使用主题为底部弹窗定义的内边距，主题没有定义时取 <code>--spacing-4</code>（16px），四个逻辑边相同；传入 <code>0</code> 可以让内容紧贴面板边缘。内容区是容器，唯一子元素是自带内边距的区块时该区块会顶掉这层内边距。</td>
      </tr>
      <tr>
        <td><code>purpose</code></td>
        <td><code>BottomSheetPurpose</code></td>
        <td><code>'info'</code></td>
        <td>隐式关闭的尺度，与 <code>Dialog</code> 一致。info 允许 Escape、遮罩点击和拖动关闭；form 只允许 Escape；required 屏蔽全部隐式关闭并使用 <code>alertdialog</code> 语义。</td>
      </tr>
      <tr>
        <td><code>hasScrim</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>是否渲染遮罩并以模态方式打开。为 <code>true</code> 时使用 <code>showModal()</code>：顶层显示、焦点限制、锁定页面滚动、背景不可交互。为 <code>false</code> 时使用 <code>show()</code>，页面保持可交互和可滚动。</td>
      </tr>
      <tr>
        <td><code>finalFocusRef</code></td>
        <td><code>HTMLElement | null</code></td>
        <td><code>null</code></td>
        <td>关闭后接收焦点的元素，用来替换打开时的那个元素。适用于触发器会被重新创建、或打开时的焦点元素不可靠的场景。</td>
      </tr>
      <tr>
        <td><code>isInline</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>把面板渲染在普通文档流里，不使用 <code>&lt;dialog&gt;</code>、遮罩、焦点限制和动画。用于在已经是 inert 的容器中预览面板本身，例如组件文档。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="BottomSheet Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>面板的内容，渲染在拖动条下方的滚动区域里。</td>
      </tr>
    </tbody>
  </table>
</div>

## 事件与模板引用

<div class="component-api-table" role="region" aria-label="BottomSheet Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>签名</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>openChange</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>面板请求切换状态时触发：Escape、遮罩点击、拖动关闭，或 <code>v-model:isOpen</code> 的写入。</td>
      </tr>
      <tr>
        <td><code>update:isOpen</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>由 <code>v-model:isOpen</code> 自动监听，一般不需要手动处理。</td>
      </tr>
      <tr>
        <td><code>motionStart</code></td>
        <td><code>(motion: 'entering' | 'exiting') =&gt; void</code></td>
        <td>进入或退出动画开始时触发。</td>
      </tr>
      <tr>
        <td><code>motionComplete</code></td>
        <td><code>(motion: 'entering' | 'exiting') =&gt; void</code></td>
        <td>进入或退出动画结束时触发。退出动画完成后才会关闭 <code>&lt;dialog&gt;</code> 并把焦点还回去。</td>
      </tr>
      <tr>
        <td><code>snap</code></td>
        <td><code>(visibleHeight: number) =&gt; void</code></td>
        <td>拖动停靠到某个档位时触发，参数是面板此刻的可见高度（像素）。</td>
      </tr>
      <tr>
        <td><code>element</code></td>
        <td><code>HTMLDivElement | null</code></td>
        <td>面板元素，通过模板引用暴露；<code>class</code> 与 <code>style</code> 会落在这个元素上。</td>
      </tr>
      <tr>
        <td><code>focus()</code> / <code>blur()</code></td>
        <td><code>() =&gt; void</code></td>
        <td>把焦点移入或移出面板。</td>
      </tr>
    </tbody>
  </table>
</div>

## BottomSheetSwitcher

多步流程共用一个对话框。当前页用 `v-model:active-sheet` 指向子级 `BottomSheet` 的 `sheetId`。换页时遮罩留着，上一张会短暂留在下面并对齐高度。关掉时把 `activeSheet` 设为 `null`。

<div class="component-api-table" role="region" aria-label="BottomSheetSwitcher 属性" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>activeSheet</code></td><td><code>string | null</code></td><td><code>null</code></td><td>当前那一张的 <code>sheetId</code>。用 <code>v-model:active-sheet</code> 绑定。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>当前底栏的 <code>label</code></td><td>整段流程的无障碍名。</td></tr>
      <tr><td><code>purpose</code></td><td><code>BottomSheetPurpose</code></td><td>当前底栏的 <code>purpose</code></td><td>整段流程怎么被关掉。</td></tr>
      <tr><td><code>hasScrim</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否给整段流程一块遮罩。换页时遮罩留着。</td></tr>
    </tbody>
  </table>
</div>

子级 `BottomSheet` 加上 `sheetId` 后不再自己打开对话框，由切换器决定哪一张可见。

## 原生属性

根元素是面板的 `<div>`（类名 <code>astryx-bottom-sheet</code>），它被包裹在一个固定的 <code>&lt;dialog&gt;</code> 里。

以下内容传入面板元素：

- HTML 属性。
- `aria-*` 属性（<code>aria-label</code> 与 <code>aria-labelledby</code> 例外，它们用于命名外层的对话框）。
- `data-*` 属性。
- `class`。
- `style`。
