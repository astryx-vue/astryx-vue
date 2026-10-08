---
layout: component-docs
title: 切换按钮
outline: false
footer: false
---

## ToggleButton Props

<div class="component-api-table" role="region" aria-label="ToggleButton Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>必需</td>
        <td>按钮的无障碍名称。有默认插槽内容时它是无障碍名称，纯图标模式下同时是 <code>aria-label</code>；两者都没有时它是可见文字。</td>
      </tr>
      <tr>
        <td><code>isPressed</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否处于按下状态，用 <code>v-model:is-pressed</code> 绑定。不绑定该属性时按钮自己管理按下状态，初始为未按下。放入 ToggleButtonGroup 后由分组接管，该属性失效。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'sm' | 'md' | 'lg'</code></td>
        <td><code>'md'</code></td>
        <td>按钮尺寸。留空时沿用所在分组的 size，分组也没有则回退到 <code>md</code>。</td>
      </tr>
      <tr>
        <td><code>elevation</code></td>
        <td><code>'none' | 'low' | 'med' | 'high'</code></td>
        <td><code>'none'</code></td>
        <td>静止状态下的阴影强度，用于悬浮样式的切换按钮，取值与 Button 一致。放入分组后每个成员仍保留自己的阴影。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否禁用。分组的 isDisabled 会禁用全部成员；成员自己禁用自己时，启用中的分组不会把它重新启用。带 tooltip 时改用 <code>aria-disabled</code>，按钮仍可获得焦点以读出禁用原因。</td>
      </tr>
      <tr>
        <td><code>isLoading</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否显示加载状态。同时设置 <code>aria-busy</code>，内容隐藏并显示转圈指示。</td>
      </tr>
      <tr>
        <td><code>isIconOnly</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>渲染为正方形纯图标按钮，用 label 作为无障碍名称，不渲染标签文字和占位元素。</td>
      </tr>
      <tr>
        <td><code>pressedChangeAction</code></td>
        <td><code>(isPressed: boolean) =&gt; void | Promise&lt;void&gt;</code></td>
        <td>-</td>
        <td>由接口或路由支撑的切换动作。在 <code>pressedChange</code> 之后执行，除非该回调阻止了默认行为；执行期间按钮显示下一个状态和加载指示，并允许再次点击来反转尚未完成的选择。分组中带 value 的成员会忽略它。</td>
      </tr>
      <tr>
        <td><code>tooltip</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>悬停和键盘聚焦时显示的文字提示，纯图标按钮常用它补足含义。</td>
      </tr>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>在 ToggleButtonGroup 中标识自己的值，分组用它判断按下状态；独立使用时不参与表单提交。</td>
      </tr>
    </tbody>
  </table>
</div>

## ToggleButtonGroup Props

<div class="component-api-table" role="region" aria-label="ToggleButtonGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>必需</td>
        <td>分组的无障碍名称，渲染为 <code>role="group"</code> 容器上的 <code>aria-label</code>。</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>'single' | 'multiple'</code></td>
        <td><code>'single'</code></td>
        <td>选择模式。<code>single</code> 只允许一个成员按下，再次点击当前项会取消选择；<code>multiple</code> 允许多个成员同时按下。</td>
      </tr>
      <tr>
        <td><code>value</code></td>
        <td><code>string | null | string[]</code></td>
        <td><code>null</code></td>
        <td>当前选中的值，用 <code>v-model:value</code> 绑定。单选模式是字符串或 <code>null</code>，多选模式是字符串数组（默认空数组）。</td>
      </tr>
      <tr>
        <td><code>orientation</code></td>
        <td><code>'horizontal' | 'vertical'</code></td>
        <td><code>'horizontal'</code></td>
        <td>成员的排列方向。垂直时成员拉伸为整行宽度。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'sm' | 'md' | 'lg'</code></td>
        <td><code>'md'</code></td>
        <td>成员继承的默认尺寸，成员自己设置 <code>size</code> 时以成员为准。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否禁用全部成员。成员自己设置 <code>isDisabled</code> 时同样保持禁用。</td>
      </tr>
    </tbody>
  </table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="ToggleButton Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>载荷</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>pressedChange</code></td>
        <td><code>(isPressed: boolean, event: MouseEvent)</code></td>
        <td>点击要求切换到的状态和原始的点击事件。在回调里调用 <code>event.preventDefault()</code> 表示这次切换由你处理，组件不改写状态，也跳过 <code>pressedChangeAction</code>。</td>
      </tr>
      <tr>
        <td><code>update:isPressed</code></td>
        <td><code>(isPressed: boolean)</code></td>
        <td>供 <code>v-model:is-pressed</code> 使用。回调阻止默认行为时不会发出。</td>
      </tr>
      <tr>
        <td><code>click</code></td>
        <td><code>(event: MouseEvent)</code></td>
        <td>透传的点击事件，在切换请求之后发出。按钮被禁用时不会发出。</td>
      </tr>
      <tr>
        <td><code>change</code></td>
        <td><code>(value: string | null | string[])</code></td>
        <td>分组的选择结果：单选模式是字符串或 <code>null</code>，多选模式是数组。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="ToggleButton Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>可见内容，会取代 label 作为可见文字，无障碍名称仍然取自 label。留空时渲染 label。</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td>标签前的装饰图标；纯图标模式下它是唯一内容。把图标类放进一个有尺寸的元素，例如 <code>&lt;span class="i-carbon-filter" style="width: 16px; height: 16px" /&gt;</code>，以匹配按钮的图标盒子。</td>
      </tr>
      <tr>
        <td><code>pressedIcon</code></td>
        <td>按下时显示的图标，通常换成一枚实心图标。留空时退回 <code>icon</code>。图形的颜色由元素自己决定，所以要传入已经着色的元素，例如 <code>&lt;span class="i-carbon-stop-filled" style="color: var(--astryx-icon-error-foreground)" /&gt;</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

ToggleButtonGroup 通过默认插槽接收 ToggleButton：

<div class="component-api-table" role="region" aria-label="ToggleButtonGroup Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>组内的 ToggleButton 成员，每个成员都需要自己的 <code>value</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 键盘

| 按键 | 行为 |
| --- | --- |
| `Tab` | 依次聚焦每一个可用的切换按钮；分组不会把成员合并成单个 tab 停靠点。 |
| `Enter` / `Space` | 切换当前焦点所在的按钮，与点击等价。 |

分组本身不拦截方向键：每个成员都是独立的 tab 停靠点，`Tab` 逐个经过，方向键不会在成员之间移动焦点（这一点与 `ButtonGroup` 不同）。禁用的成员会被跳过，带 tooltip 的禁用成员仍可获得焦点以便读出禁用原因。

## 模板引用

`ToggleButton` 公开以下内容：

- `element`：`HTMLButtonElement | HTMLAnchorElement | HTMLElement | null`。
- `focus(options?: FocusOptions)`：聚焦按钮。
- `blur()`：移除按钮焦点。

## 原生属性

根元素为 `<button type="button">`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。

`aria-pressed` 由组件根据按下状态设置，`data-pressed`、`data-variant="ghost"` 和 `data-size` 供主题选择器使用，不要覆盖。`aria-label` 在纯图标模式下取自 `label`。
