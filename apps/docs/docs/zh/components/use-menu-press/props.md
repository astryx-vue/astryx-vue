---
layout: component-docs
title: useMenuPress
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useMenuPress 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>MenuPressOptions</code></td>
        <td>—</td>
        <td>配置对象。必填。</td>
      </tr>
      <tr>
        <td><code>options.menuRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>带 <code>role="menu"</code> 的菜单根，也就是按压要从哪些行里挑的表面。必填。</td>
      </tr>
      <tr>
        <td><code>options.isEnabled</code></td>
        <td><code>MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>true</code></td>
        <td>这套按压模型当前是否生效，每次按下时读。传菜单的打开状态即可。</td>
      </tr>
      <tr>
        <td><code>options.onDismiss</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>鼠标在菜单外松开、且什么都没执行时调用：关闭菜单。手指在菜单外松开则让菜单继续开着，那种情况不会调用它。</td>
      </tr>
      <tr>
        <td><code>options.itemSelector</code></td>
        <td><code>string</code></td>
        <td>可用的 <code>[role="menuitem"]</code>、<code>menuitemradio</code>、<code>menuitemcheckbox</code></td>
        <td>只匹配可用行的选择器。指针压在菜单里别的东西上（分割线、标题、禁用行）就什么都不挑。挑出来的行仍然得落在 <code>[role="menu"]</code> 边界内。</td>
      </tr>
      <tr>
        <td><code>options.triggerRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>—</td>
        <td>打开菜单的那个控件：按压可以从它开始。</td>
      </tr>
      <tr>
        <td><code>options.onTriggerPress</code></td>
        <td><code>(pointerType: MenuPressPointerType) =&gt; boolean</code></td>
        <td>—</td>
        <td>鼠标按下了触发器，或者手指在触发器上按满了 <code>longPressDelayMs</code>：在按住的指针下面打开菜单，并返回是否打开了。这一次按压其实是关掉已开的菜单时返回 false。</td>
      </tr>
      <tr>
        <td><code>options.onHighlight</code></td>
        <td><code>(row: HTMLElement | null) =&gt; void</code></td>
        <td>—</td>
        <td>挪动高亮。不传就把 DOM 焦点用 <code>preventScroll</code> 挪到那一行。靠 <code>aria-activedescendant</code> 表示高亮的列表自己传。</td>
      </tr>
      <tr>
        <td><code>options.onActivate</code></td>
        <td><code>(row: HTMLElement, release: PointerEvent) =&gt; void</code></td>
        <td>—</td>
        <td>执行松开时指针下面的那一行。不传就替它派发一次 click，带上松开时的按钮和修饰键。</td>
      </tr>
      <tr>
        <td><code>options.getScroller</code></td>
        <td><code>() =&gt; HTMLElement | null</code></td>
        <td>溢出的菜单根</td>
        <td>按住时指针停在上下边缘 24 像素内要自动滚动的元素。返回 null 表示不滚。</td>
      </tr>
      <tr>
        <td><code>options.hitTest</code></td>
        <td><code>(x: number, y: number) =&gt; Element | null</code></td>
        <td><code>document.elementFromPoint</code></td>
        <td>按视口坐标找元素。手指的事件一直发给它落下的元素，所以靠坐标判断现在在哪一行。测试里用来替换。</td>
      </tr>
      <tr>
        <td><code>options.longPressDelayMs</code></td>
        <td><code>number</code></td>
        <td><code>500</code></td>
        <td>手指在触发器上要按多久，菜单才在手指下面打开。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useMenuPress 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>menuProps</code></td>
        <td><code>{ onPointerdown, 'data-astryx-menu-press': '' }</code></td>
        <td>摊到菜单根上（<code>v-bind="press.menuProps"</code>）。接下从根内开始的按压，并在根上标记「这里用了这套按压模型」。</td>
      </tr>
      <tr>
        <td><code>onPointerDown</code></td>
        <td><code>(event: PointerEvent) =&gt; void</code></td>
        <td>和 <code>menuProps.onPointerdown</code> 是同一个函数，单独拿出来。不好摊对象时直接绑到菜单根的 <code>pointerdown</code> 上。</td>
      </tr>
      <tr>
        <td><code>triggerProps</code></td>
        <td><code>{ onPointerdown, onContextmenu }</code></td>
        <td>摊到触发器上：主键一按下就打开菜单；手指按满延时之后，手指还按着的时候打开。右键不碰，它自己的 <code>contextmenu</code> 照旧能用。<code>contextmenu</code> 那个只挡掉手指长按时浏览器自带的菜单，鼠标右键仍然交给应用。</td>
      </tr>
      <tr>
        <td><code>isTriggerClickFromPress</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>到达触发器的这次 click 是不是就是刚按下它的那一次手势。那次按压已经开或关过菜单了，所以这次 click 不能再切换、也不能再打开。</td>
      </tr>
      <tr>
        <td><code>cancel</code></td>
        <td><code>() =&gt; void</code></td>
        <td>结束正在进行的这次手势，什么都不执行。菜单在手势中途关掉时用。</td>
      </tr>
    </tbody>
  </table>
</div>

模块还导出：

- `resetMenuPress()`：清掉已经布好的「吞掉多余 click」。表面在 hook 自己的拆卸之外被移除时调用它，测试里也用得上。
- `isMenuPressActivation()`：按压模型派发的那次行激活正在同步进行时为 true。把激活转交给里面链接的行用它分清这是模型的 click 还是浏览器多出来的那个。
- `MENU_PRESS_MARKER`：菜单根上的标记属性名。
- `menuPressStep`、`MENU_PRESS_SETTLE_MS` 和相关类型：不碰 DOM 的纯状态机。打开菜单的那次按压，只有指针进过菜单、或者按满 300 毫秒，松开时才执行下面那一行；否则菜单留着、什么都不执行。
