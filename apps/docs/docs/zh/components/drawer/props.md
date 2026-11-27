---
layout: component-docs
title: 抽屉
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Drawer 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>抽屉是否打开，打开状态由调用方持有。必填。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>抽屉的无障碍名称。必填。</td></tr>
<tr><td><code>placement</code></td><td><code>'start' | 'end'</code></td><td><code>'end'</code></td><td>贴哪一边，逻辑方向，RTL 下自动镜像。退场总是从进场的那一侧滑出；打开期间改了它，下一次打开才换边。</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td><code>400</code></td><td>首选宽度，数字单位为像素，字符串原样使用。手机上至少给页面留出 56px。</td></tr>
<tr><td><code>padding</code></td><td><code>0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10</code></td><td>主题默认值（16px）</td><td>内容区内边距，取值对应 <code>--astryx-spacing-*</code> 令牌。</td></tr>
<tr><td><code>purpose</code></td><td><code>'required' | 'form' | 'info'</code></td><td><code>'info'</code></td><td>允许的关闭方式：<code>required</code> 禁用 Escape 与点击遮罩；<code>form</code> 仅允许 Escape；<code>info</code> 两者都允许。</td></tr>
<tr><td><code>hasScrim</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否带遮罩。<code>true</code> 为模态：锁住页面滚动、焦点关在面板里。<code>false</code> 为非模态：旁边的页面照常能点、能滚，Escape 照样关闭，记得放一个看得见的关闭按钮。</td></tr>
</tbody></table>
</div>

## 事件

- `openChange(isOpen: boolean)`：用户通过 Escape 或点击遮罩请求关闭时以 `false` 触发，是否触发取决于 `purpose`。父组件通过设置 `isOpen` 来关闭。

## 插槽

- `default`：抽屉主体，可滚动。通常以 `DrawerHeader` 开头。
- `footer`：底部内容，例如操作按钮。

## DrawerHeader 属性

<div class="component-api-table" role="region" aria-label="DrawerHeader 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>标题，同时为抽屉命名。必填。</td></tr>
<tr><td><code>subtitle</code></td><td><code>string</code></td><td>—</td><td>标题下方的副标题。为空且没有 <code>subtitle</code> 插槽时不渲染。</td></tr>
<tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td>有人监听 <code>openChange</code> 时显示</td><td>是否显示关闭按钮，点击时发出 <code>openChange(false)</code>。</td></tr>
<tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td>跟界面语言</td><td>关闭按钮的无障碍名称。不传时英文 Close、中文「关闭」。</td></tr>
</tbody></table>
</div>

## DrawerHeader 事件与插槽

- `openChange(isOpen: boolean)`：点击关闭按钮时以 `false` 触发。
- `title`：替换标题文字的行内内容。
- `subtitle`：副标题的行内内容。
- `startContent`：标题之前的内容，例如返回按钮。
- `endContent`：标题之后、关闭按钮之前的内容。
