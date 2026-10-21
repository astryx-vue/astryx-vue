---
layout: component-docs
title: 下拉菜单
outline: false
footer: false
---

## Props

### DropdownMenu

<div class="component-api-table" role="region" aria-label="DropdownMenu Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>button</code></td>
        <td><code>DropdownMenuButtonProps</code></td>
        <td>随当前语言，英文 <code>{ label: 'Menu' }</code>，中文按钮文案是「菜单」</td>
        <td>触发按钮的属性，等同于 <code>Button</code> 的属性（其中 <code>clickAction</code> 除外，避免和菜单抢同一次点击）。<code>size</code> 会同时决定菜单行的高度。</td>
      </tr>
      <tr>
        <td><code>items</code></td>
        <td><code>DropdownMenuOption[]</code></td>
        <td>-</td>
        <td>数据式菜单内容。每条可以是一条动作、一条分隔线、一个分组、一条勾选行（<code>type: 'checkbox'</code>，用 <code>checked</code> 和 <code>onChange</code>），或一组单选（<code>type: 'radio'</code>，用 <code>value</code>、<code>label</code>、<code>items</code> 和 <code>onChange</code>）。与默认插槽互斥，同时给出时以 <code>items</code> 为准。</td>
      </tr>
      <tr>
        <td><code>isMenuOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>受控的展开状态，配 <code>v-model:is-menu-open</code> 使用。留空时菜单自己管理开关。挂载时即为 <code>true</code> 不会移动焦点。</td>
      </tr>
      <tr>
        <td><code>menuWidth</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>菜单的最小宽度。长度值可以随内容变宽；<code>max-content</code> 之类的固有尺寸关键字则作为首选宽度。所有写法都会受视口限制。留空时与触发按钮齐平，并封顶在 320px。</td>
      </tr>
      <tr>
        <td><code>menuMaxHeight</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>菜单的最大高度，单位为像素，用于必须放下所有行的菜单。它会抬高默认的 300px 上限，但视口仍然限住实际高度。</td>
      </tr>
      <tr>
        <td><code>placement</code></td>
        <td><code>'above' | 'below' | 'start' | 'end'</code></td>
        <td><code>'below'</code></td>
        <td>菜单相对触发按钮的位置。空间不足时自动翻到相反方向。</td>
      </tr>
      <tr>
        <td><code>alignment</code></td>
        <td><code>'start' | 'center' | 'end'</code></td>
        <td><code>'start'</code></td>
        <td>菜单沿位置方向与触发按钮的对齐方式。</td>
      </tr>
      <tr>
        <td><code>hasChevron</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>是否在触发按钮尾部显示箭头。纯图标按钮不会显示。</td>
      </tr>
    </tbody>
  </table>
</div>

### DropdownMenuItem

<div class="component-api-table" role="region" aria-label="DropdownMenuItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>行内的主要文字。需要富文本时改用 <code>label</code> 插槽。</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>标签下方的次要说明文字。需要富文本时改用 <code>description</code> 插槽。</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string | Component</code></td>
        <td>-</td>
        <td>标签前的图标：一个 CSS 图标类（例如 UnoCSS 的 <code>i-carbon-copy</code>，也可以是你自己的类名），或一个绘制 SVG 的组件。astryx-vue 不自带图标。想放任意内容时改用 <code>icon</code> 插槽。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>禁用这一行。禁用的行会被方向键和字母跳转跳过，并且不响应点击。</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'default' | 'destructive'</code></td>
        <td><code>'default'</code></td>
        <td>视觉变体。<code>destructive</code> 会把标签、说明和图标一起换成错误色，用于删除这类危险动作。悬停底色仍是共用的中性色，与其他行一致。</td>
      </tr>
      <tr>
        <td><code>hasCloseOnSelect</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>激活这一行后是否收起菜单。像“复制”这种在行内回报结果的动作可以设为 <code>false</code>。</td>
      </tr>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>这一行要跳转的地址。给出后整行就是一个带 <code>role="menuitem"</code> 的链接，所以 ⌘/Ctrl 点击和中键点击仍然保持浏览器原本的含义。</td>
      </tr>
      <tr>
        <td><code>target</code></td>
        <td><code>'_blank' | '_self'</code></td>
        <td>-</td>
        <td>链接的打开方式，仅在给出 <code>href</code> 时使用。</td>
      </tr>
      <tr>
        <td><code>rel</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>链接关系，仅在给出 <code>href</code> 时使用。<code>target="_blank"</code> 时会自动加上 <code>noopener</code> 和 <code>noreferrer</code>。</td>
      </tr>
      <tr>
        <td><code>onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>-</td>
        <td>激活这一行时调用。链接行会在浏览器跳转前调用；带修饰键的点击交给浏览器处理，不调用它。</td>
      </tr>
    </tbody>
  </table>
</div>

### DropdownMenuGroup

<div class="component-api-table" role="region" aria-label="DropdownMenuGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>title</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>分组上方的标题，同时作为这一组的无障碍名称。留空时分组没有名字。</td>
      </tr>
    </tbody>
  </table>
</div>

`DropdownMenuDivider` 没有属性，它渲染一条分隔线，因此永远不会成为方向键的一站。

### DropdownMenuCheckboxItem

<div class="component-api-table" role="region" aria-label="DropdownMenuCheckboxItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>是否选中，配合 <code>v-model</code> 使用。数据数组里对应字段是 <code>checked</code>。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>行内的主要文字。需要富文本时改用 <code>label</code> 插槽。</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>标签下方的次要说明。</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string | Component</code></td>
        <td>-</td>
        <td>标签前的图标：一个 CSS 图标类，或一个绘制图标的组件。任意内容改用 <code>icon</code> 插槽，文档示例使用内置图标组件。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>禁用这一行。行仍留在无障碍树里，方向键会跳过它，点击不会切换。</td>
      </tr>
      <tr>
        <td><code>hasCloseOnSelect</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>切换后是否收起菜单。勾选行默认保持打开。</td>
      </tr>
    </tbody>
  </table>
</div>

行的角色是 <code>menuitemcheckbox</code>，选中状态写在 <code>aria-checked</code> 上。勾选标记是装饰，不单独接收点击。

### DropdownMenuRadioGroup

<div class="component-api-table" role="region" aria-label="DropdownMenuRadioGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>当前选中的值，配合 <code>v-model</code> 使用。留空表示还没有选中。数据数组里字段名同样是 <code>value</code>。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>这一组的无障碍名称。选项会作为同一组被朗读。</td>
      </tr>
      <tr>
        <td><code>hasCloseOnSelect</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>选中一项后是否收起菜单。单选默认收起。</td>
      </tr>
    </tbody>
  </table>
</div>

### DropdownMenuRadioItem

<div class="component-api-table" role="region" aria-label="DropdownMenuRadioItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>这个选项代表的值。必须放在单选组里面，否则组件会在初始化时抛出错误。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>行内的主要文字。</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>标签下方的次要说明。</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string | Component</code></td>
        <td>-</td>
        <td>标签前的图标。任意内容改用 <code>icon</code> 插槽。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>禁用这个选项。它仍留在组里，但不能被选中。</td>
      </tr>
    </tbody>
  </table>
</div>

行的角色是 <code>menuitemradio</code>。

### DropdownMenuSubMenu

<div class="component-api-table" role="region" aria-label="DropdownMenuSubMenu Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>这一行的文字，也是下一级返回按钮里提到的父级名字。</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>标签下方的次要说明。</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string | Component</code></td>
        <td>-</td>
        <td>标签前的图标。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>禁用后这一行不能打开下一级。</td>
      </tr>
      <tr>
        <td><code>hasSpinner</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>用转圈代替行尾箭头，表示下一级还在加载。转圈是装饰，不阻止打开。</td>
      </tr>
      <tr>
        <td><code>menuWidth</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>飞出面板的宽度。数字按像素处理，作为最小宽度并限制在视口内。固有尺寸关键字则作为首选宽度。钻入时不使用。</td>
      </tr>
      <tr>
        <td><code>presentation</code></td>
        <td><code>'flyout' | 'drill-in' | 'adaptive'</code></td>
        <td><code>'adaptive'</code></td>
        <td>下一级怎么出现。旁边飞出、在原菜单里替换当前行，或在菜单打开时按是否为紧凑触控界面决定。</td>
      </tr>
    </tbody>
  </table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="DropdownMenu Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>参数</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>update:isMenuOpen</code></td>
        <td><code>boolean</code></td>
        <td>展开状态发生变化，配合 <code>v-model:is-menu-open</code> 使用。</td>
      </tr>
      <tr>
        <td><code>openChange</code></td>
        <td><code>boolean</code></td>
        <td>展开状态发生变化时触发，与 <code>update:isMenuOpen</code> 同时发出。</td>
      </tr>
      <tr>
        <td><code>click</code></td>
        <td>-</td>
        <td>触发按钮被激活时触发（打开和收起都会触发）。</td>
      </tr>
      <tr>
        <td><code>click</code>（<code>DropdownMenuItem</code>）</td>
        <td><code>MouseEvent</code></td>
        <td>这一行被激活时触发。</td>
      </tr>
      <tr>
        <td><code>update:modelValue</code> / <code>change</code>（勾选行、单选组）</td>
        <td><code>boolean</code> 或 <code>string</code></td>
        <td>选中状态变化。勾选行给出下一个布尔值，单选组给出下一个字符串。双向绑定听的是 <code>update:modelValue</code>。</td>
      </tr>
      <tr>
        <td><code>openChange</code>（<code>DropdownMenuSubMenu</code>）</td>
        <td><code>boolean</code></td>
        <td>飞出面板或钻入视图打开、关闭时触发。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="DropdownMenu Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>自己写菜单内容时使用，包括动作行、勾选行、单选组、分组、分隔线和子菜单。与 <code>items</code> 互斥。</td>
      </tr>
      <tr>
        <td><code>trigger</code></td>
        <td>自定义触发控件时使用。插槽参数包含 <code>id</code>、<code>aria-haspopup</code>、<code>aria-expanded</code>、<code>aria-controls</code>、<code>onClick</code> 和 <code>onKeyDown</code>，请整份 <code>v-bind</code> 到控件上。</td>
      </tr>
      <tr>
        <td><code>icon</code>（<code>DropdownMenuItem</code>）</td>
        <td>代替 <code>icon</code> 属性的任意起始内容。</td>
      </tr>
      <tr>
        <td><code>label</code> / <code>description</code>（<code>DropdownMenuItem</code>）</td>
        <td>代替同名属性的富文本内容。</td>
      </tr>
      <tr>
        <td><code>endContent</code>（<code>DropdownMenuItem</code>）</td>
        <td>行尾内容，例如一个 <code>Kbd</code> 快捷键提示。</td>
      </tr>
      <tr>
        <td><code>title</code> / <code>default</code>（<code>DropdownMenuGroup</code>）</td>
        <td>分组的富文本标题，以及组内的行。</td>
      </tr>
      <tr>
        <td><code>header</code></td>
        <td>菜单上方、选项之外的内容，例如筛选框。不参与字母跳转。</td>
      </tr>
      <tr>
        <td><code>footer</code></td>
        <td>菜单下方、选项之外的内容，例如新建按钮。</td>
      </tr>
      <tr>
        <td><code>icon</code> / <code>label</code> / <code>description</code> / <code>endContent</code>（勾选行、单选行）</td>
        <td>与动作行相同的富文本位置。勾选标记和单选圆点由组件自己绘制，不占用这些插槽。</td>
      </tr>
      <tr>
        <td><code>default</code>（单选组、子菜单）</td>
        <td>单选组里放单选项；子菜单里放下一级的行。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

除下表列出的属性外，其余原生属性会落到菜单浮层元素上：

- HTML 属性、<code>data-*</code> 属性。
- <code>aria-*</code> 属性。
- <code>class</code>、<code>style</code>。

菜单元素默认带一个生成的 <code>id</code>，触发按钮的 <code>aria-controls</code> 指向它。显式传入 <code>id</code> 会同时替换这个生成的 id 和 <code>aria-controls</code> 的值，两者不会脱节。传入 <code>aria-label</code> 或 <code>aria-labelledby</code> 会覆盖菜单默认的名称（默认取自触发按钮的文字，自定义触发控件时则指向控件自身）。

触发按钮上会带上 <code>aria-haspopup="menu"</code>、<code>aria-expanded</code> 和 <code>aria-controls</code>；触发按钮外层是一个用于定位的 <code>span.astryx-dropdown-menu-trigger</code>。
