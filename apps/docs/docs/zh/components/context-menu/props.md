---
layout: component-docs
title: 上下文菜单
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ContextMenu Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>items</code></td>
        <td><code>ContextMenuOption[]</code></td>
        <td>-</td>
        <td>数据驱动的菜单内容。元素可以是动作条目、分隔线 <code>{ type: 'divider' }</code> 或分组 <code>{ type: 'section', title, items }</code>；条目自带 <code>items</code> 时变成子菜单。省略时使用 <code>content</code> 插槽。</td>
      </tr>
      <tr>
        <td><code>menuWidth</code></td>
        <td><code>number | string</code></td>
        <td><code>undefined</code></td>
        <td>菜单面板宽度。数字按像素处理。不设置时面板至少 160px 并随内容伸缩；无论哪种方式都不会超出视口。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'sm' | 'md' | 'lg'</code></td>
        <td><code>'md'</code></td>
        <td>条目密度，只改变上下内边距。字体、圆角与面板样式在各档一致。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td><code>'Context menu'</code></td>
        <td>菜单的无障碍名称，作为面板的 <code>aria-label</code> 在打开时被朗读。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>为真时不拦截右键、不打开菜单，原生浏览器菜单照常出现；已经打开的菜单会被关闭。</td>
      </tr>
      <tr>
        <td><code>triggerAs</code></td>
        <td><code>'div' | 'span'</code></td>
        <td><code>'div'</code></td>
        <td>触发器渲染成块级 <code>div</code> 还是行内 <code>span</code>。行文中的词需要上下文菜单时用 <code>span</code>。</td>
      </tr>
      <tr>
        <td><code>v-model:isOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>受控的开关状态。绑定后组件完全跟随这个值；不绑定时组件自己管理状态，右键、菜单键或长按都会打开它。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="ContextMenu Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>触发器区域：在这块内容上点右键就会打开菜单。</td>
      </tr>
      <tr>
        <td><code>content</code></td>
        <td>复合模式的菜单内容，用 <code>ContextMenuItem</code>、<code>ContextMenuDivider</code>、<code>ContextMenuGroup</code>、<code>ContextMenuSubMenu</code> 组合。给出 <code>items</code> 时忽略该插槽。</td>
      </tr>
    </tbody>
  </table>
</div>

## 事件与模板引用

<div class="component-api-table" role="region" aria-label="ContextMenu Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>签名</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>openChange</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>菜单打开或关闭时触发，先于焦点移动。</td>
      </tr>
      <tr>
        <td><code>select</code></td>
        <td><code>(item: ContextMenuItemData, event: MouseEvent) =&gt; void</code></td>
        <td>数据驱动模式下某个条目被激活时触发，包含被激活的条目和触发它的那次点击。子菜单里的条目同样会冒泡到这里。</td>
      </tr>
      <tr>
        <td><code>update:isOpen</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>由 <code>v-model:isOpen</code> 自动监听，一般不需要手动处理。</td>
      </tr>
      <tr>
        <td><code>element</code></td>
        <td><code>HTMLElement | null</code></td>
        <td>触发器元素，通过模板引用暴露。</td>
      </tr>
      <tr>
        <td><code>open()</code></td>
        <td><code>() =&gt; void</code></td>
        <td>在触发器左上角打开菜单，用于没有指针事件的调用方。</td>
      </tr>
      <tr>
        <td><code>close()</code></td>
        <td><code>() =&gt; void</code></td>
        <td>关闭菜单并把焦点交还给打开前的元素。</td>
      </tr>
      <tr>
        <td><code>focus()</code> / <code>blur()</code></td>
        <td><code>() =&gt; void</code></td>
        <td>聚焦或失焦触发器元素。</td>
      </tr>
    </tbody>
  </table>
</div>

## 子组件

复合模式与数据模式共用同一批行组件，行样式、键盘行为和主题变量完全一致。

<div class="component-api-table" role="region" aria-label="ContextMenu sub-components" tabindex="0">
  <table>
    <thead>
      <tr><th>组件</th><th>Props</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>ContextMenuItem</code></td>
        <td><code>icon</code>、<code>label</code>、<code>description</code>、<code>endContent</code>、<code>href</code>、<code>target</code>、<code>rel</code>、<code>isDisabled</code>、<code>hasCloseOnSelect</code>、<code>variant</code></td>
        <td>一个动作条目，渲染为 <code>role="menuitem"</code>。带 <code>href</code> 时根元素是真正的 <code>&lt;a&gt;</code>，修改键点击和中键点击保持浏览器自身的语义。插槽：<code>label</code>、<code>icon</code>、<code>description</code>、<code>endContent</code>；激活时触发 <code>click</code> 事件。</td>
      </tr>
      <tr>
        <td><code>ContextMenuDivider</code></td>
        <td><code>variant</code></td>
        <td>分组之间的分隔线，渲染为 <code>role="separator"</code>，因此不会成为方向键的一站。</td>
      </tr>
      <tr>
        <td><code>ContextMenuGroup</code></td>
        <td><code>title</code></td>
        <td>带标题的分组，渲染为 <code>role="group"</code> 并用标题作为无障碍名称。插槽：<code>default</code>。</td>
      </tr>
      <tr>
        <td><code>ContextMenuSubMenu</code></td>
        <td><code>icon</code>、<code>label</code>、<code>description</code>、<code>isDisabled</code>、<code>items</code></td>
        <td>会展开下一级菜单的条目，行上带 <code>aria-haspopup="menu"</code> 与 <code>aria-expanded</code>。<code>items</code> 用在数据模式，插槽 <code>default</code> 用在复合模式；打开或关闭时触发 <code>openChange</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 主题

```css
.my-context-menu {
  --astryx-context-menu-background: #ffffff;
  --astryx-context-menu-item-focus-background: #0536590c;
}
```

- `--astryx-context-menu-background`：面板背景。
- `--astryx-context-menu-foreground`：面板文字颜色。
- `--astryx-context-menu-shadow`：面板投影。
- `--astryx-context-menu-item-foreground`：条目文字颜色。
- `--astryx-context-menu-item-focus-background`：条目被高亮（悬停或键盘聚焦）时的背景。
- `--astryx-context-menu-item-pressed-background`：鼠标按住条目时的背景，仅在支持悬停的设备上出现。
- `--astryx-context-menu-item-description-foreground`：条目次要说明文字颜色。
- `--astryx-context-menu-item-error-foreground`：`variant="destructive"` 条目的文字与图标颜色。
- `--astryx-context-menu-section-foreground`：分组标题颜色。
- `--astryx-context-menu-block-cap`：面板最高高度，默认取 300px 与视口高度中较小者。
- `--astryx-spacing-1`、`--astryx-radius-container`、`--astryx-text-label-size`：内边距、圆角与字号沿用全局 token。

Neutral 主题自动适配明暗模式。

## 原生属性

根元素是触发器（默认 `<div>`，`triggerAs="span"` 时为 `<span>`）。

以下内容传入触发器元素：

- HTML 属性（例如 `id`、`data-*`）。
- `aria-*` 属性。

`class` 与 `style` 则作用于菜单面板：面板才是可主题化的绘制表面（对应 `astryx-context-menu` 这个 CSS 类），与上游把 `className`、`style` 交给菜单面板的做法一致。

触发器本身不携带 `role`、`aria-haspopup` 或 `aria-expanded`：它不是按钮，右键是系统级手势，菜单只在打开时以自己的 `label` 命名。菜单面板被传送到 `document.body`，因此不会继承触发器上的属性；面板自身带有 `data-size`、`data-placement`、`data-overflow`、`data-width`、`data-astryx-menu-press` 供样式与测试使用。
