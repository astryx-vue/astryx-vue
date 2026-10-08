---
layout: component-docs
title: 更多菜单
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="MoreMenu Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>items</code></td>
        <td><code>MoreMenuOption[]</code></td>
        <td>-</td>
        <td>菜单内容：动作（<code>MoreMenuItem</code>）、分隔线（<code>{ type: 'divider' }</code>）和分组（<code>{ type: 'section', title, items }</code>）。必填。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td><code>'More options'</code></td>
        <td>触发按钮的无障碍名称，同时也是菜单本身的名字和悬停时的提示文字。</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>ButtonVariant</code></td>
        <td><code>'ghost'</code></td>
        <td>触发按钮的视觉变体：primary、secondary、ghost、destructive。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>ButtonSize</code></td>
        <td><code>'md'</code></td>
        <td>触发按钮的尺寸：sm、md、lg。菜单里每一行的密度跟随这个值。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否禁用触发按钮。禁用后按钮变暗、宣告为禁用状态，点击与键盘都不再打开菜单。</td>
      </tr>
      <tr>
        <td><code>placement</code></td>
        <td><code>'above' | 'below' | 'start' | 'end'</code></td>
        <td><code>'below'</code></td>
        <td>浮层相对触发器的位置。方向是逻辑的：start 与 end 依据菜单自身的书写方向解析，RTL 下自动镜像。空间不足时翻到相反方向。</td>
      </tr>
      <tr>
        <td><code>alignment</code></td>
        <td><code>'start' | 'center' | 'end'</code></td>
        <td><code>'start'</code></td>
        <td>沿放置轴的对齐方式。溢出菜单通常用 end，让菜单与触发器的尾部边缘对齐。</td>
      </tr>
      <tr>
        <td><code>presentation</code></td>
        <td><code>'popover' | 'bottom-sheet' | 'adaptive'</code></td>
        <td><code>'popover'</code></td>
        <td>动作的呈现形态。popover 是锚定在触发器旁的浮层；bottom-sheet 是底部的模态面板；adaptive 在主指针为粗略指针且宽度不超过 768px 时使用底部面板，其余情况使用浮层。</td>
      </tr>
      <tr>
        <td><code>isMenuOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>受控的打开状态，配合 <code>v-model:isMenuOpen</code> 使用。不传时由组件自己管理状态。</td>
      </tr>
      <tr>
        <td><code>isInline</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>把菜单表面就地渲染，而不是移动到文档顶部。表面于是按普通文档流排布、不做视口定位。用于文档预览，以及不允许浮层脱离容器的场景。</td>
      </tr>
    </tbody>
  </table>
</div>

### MoreMenuItem

`items` 里的动作项可以带以下字段：

<div class="component-api-table" role="region" aria-label="MoreMenu Item" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>这一行的主要文字。必填。</td>
      </tr>
      <tr>
        <td><code>id</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>行在该层级内的稳定标识。不传时按位置匹配；当 <code>items</code> 会重排、过滤或增长时传入，行才能在数组变化时保住自己的 DOM 节点与键盘焦点。</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string | Component</code></td>
        <td>-</td>
        <td>显示在文字之前的图标：一个 CSS 图标类（例如 UnoCSS 的 <code>i-carbon-copy</code>，也可以是你自己的类名），或一个绘制 SVG 的组件。astryx-vue 不自带图标。</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>文字下方的一行说明，用来区分相近的动作。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>这一行是否不可用。禁用行变暗、宣告为禁用，并被方向键与输入跳转跳过。</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'default' | 'destructive'</code></td>
        <td><code>'default'</code></td>
        <td>destructive 用错误色绘制文字、说明与图标，用于删除这类危险操作。</td>
      </tr>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>这一行跳转的地址。给出后该行是一个真正的链接，因此带修饰键的点击和中键点击保持浏览器原本的含义（例如新标签页打开）。</td>
      </tr>
      <tr>
        <td><code>target</code></td>
        <td><code>'_blank' | '_self'</code></td>
        <td>-</td>
        <td>链接的打开位置，仅在给出 <code>href</code> 时使用。</td>
      </tr>
      <tr>
        <td><code>rel</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>链接关系。当 <code>target</code> 为 <code>_blank</code> 时会自动补上 <code>noopener noreferrer</code>。</td>
      </tr>
      <tr>
        <td><code>endContent</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>行尾的附加内容，例如快捷键提示。</td>
      </tr>
      <tr>
        <td><code>hasCloseOnSelect</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>激活这一行后是否关闭菜单。把结果报告在行自身上的操作（例如复制后变成“已复制”）可以设为 false。</td>
      </tr>
      <tr>
        <td><code>items</code></td>
        <td><code>MoreMenuOption[]</code></td>
        <td>-</td>
        <td>子菜单。给出后这一行变成子菜单入口：指针布局上向侧边展开，底部面板里换成该子菜单自己的视图。</td>
      </tr>
      <tr>
        <td><code>onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>-</td>
        <td>这一行的动作。链接行会在浏览器跳转之前执行；带修饰键的点击交给浏览器，因此不会执行。</td>
      </tr>
    </tbody>
  </table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="MoreMenu Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>参数</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>openChange</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>请求打开或关闭时触发。非受控用法下它报告变化；受控用法下它是更新绑定状态的请求。</td>
      </tr>
      <tr>
        <td><code>update:isMenuOpen</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>受控模式下 <code>v-model:isMenuOpen</code> 的更新事件。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="MoreMenu Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>icon</code></td>
        <td>触发器的图案，替换默认的三点图标。触发器始终是纯图标按钮，无障碍名称来自 <code>label</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 暴露的方法

<div class="component-api-table" role="region" aria-label="MoreMenu Exposed" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>element</code></td>
        <td><code>HTMLElement | null</code></td>
        <td>触发按钮的 DOM 元素。</td>
      </tr>
      <tr>
        <td><code>focus</code></td>
        <td><code>(options?: FocusOptions) =&gt; void</code></td>
        <td>把焦点移到触发按钮上。</td>
      </tr>
      <tr>
        <td><code>blur</code></td>
        <td><code>() =&gt; void</code></td>
        <td>移除触发按钮上的焦点。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

根元素为 `<span>`，触发按钮是它内部的 `<button>`。

传入组件的 `class`、`style`、`data-*` 等属性会透传到根元素上。触发按钮的无障碍名称取 `label`，它的 `aria-expanded`、`aria-haspopup` 与 `aria-controls` 由组件按打开状态与呈现形态自行维护。

打开时，菜单表面会移动到文档末尾（`<body>` 之下）作为浮层呈现；设置 `is-inline` 可以让它留在原地。
