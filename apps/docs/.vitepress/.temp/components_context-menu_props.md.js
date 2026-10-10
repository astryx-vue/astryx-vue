import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/context-menu/props.md
var __pageData = JSON.parse("{\"title\":\"上下文菜单\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"上下文菜单\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/context-menu/props.md\",\"filePath\":\"zh/components/context-menu/props.md\"}");
var _sfc_main = { name: "components/context-menu/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="ContextMenu Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>items</code></td><td><code>ContextMenuOption[]</code></td><td>-</td><td>数据驱动的菜单内容。元素可以是动作条目、分隔线 <code>{ type: &#39;divider&#39; }</code> 或分组 <code>{ type: &#39;section&#39;, title, items }</code>；条目自带 <code>items</code> 时变成子菜单。省略时使用 <code>content</code> 插槽。</td></tr><tr><td><code>menuWidth</code></td><td><code>number | string</code></td><td><code>undefined</code></td><td>菜单面板宽度。数字按像素处理。不设置时面板至少 160px 并随内容伸缩；无论哪种方式都不会超出视口。</td></tr><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39; | &#39;lg&#39;</code></td><td><code>&#39;md&#39;</code></td><td>条目密度，只改变上下内边距。字体、圆角与面板样式在各档一致。</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td><code>&#39;Context menu&#39;</code></td><td>菜单的无障碍名称，作为面板的 <code>aria-label</code> 在打开时被朗读。</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>为真时不拦截右键、不打开菜单，原生浏览器菜单照常出现；已经打开的菜单会被关闭。</td></tr><tr><td><code>triggerAs</code></td><td><code>&#39;div&#39; | &#39;span&#39;</code></td><td><code>&#39;div&#39;</code></td><td>触发器渲染成块级 <code>div</code> 还是行内 <code>span</code>。行文中的词需要上下文菜单时用 <code>span</code>。</td></tr><tr><td><code>v-model:isOpen</code></td><td><code>boolean</code></td><td>-</td><td>受控的开关状态。绑定后组件完全跟随这个值；不绑定时组件自己管理状态，右键、菜单键或长按都会打开它。</td></tr></tbody></table></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><div class="component-api-table" role="region" aria-label="ContextMenu Slots" tabindex="0"><table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody><tr><td><code>default</code></td><td>触发器区域：在这块内容上点右键就会打开菜单。</td></tr><tr><td><code>content</code></td><td>复合模式的菜单内容，用 <code>ContextMenuItem</code>、<code>ContextMenuDivider</code>、<code>ContextMenuGroup</code>、<code>ContextMenuSubMenu</code> 组合。给出 <code>items</code> 时忽略该插槽。</td></tr></tbody></table></div><h2 id="事件与模板引用" tabindex="-1">事件与模板引用 <a class="header-anchor" href="#事件与模板引用" aria-label="Permalink to “事件与模板引用”">​</a></h2><div class="component-api-table" role="region" aria-label="ContextMenu Events" tabindex="0"><table><thead><tr><th>名称</th><th>签名</th><th>说明</th></tr></thead><tbody><tr><td><code>openChange</code></td><td><code>(isOpen: boolean) =&gt; void</code></td><td>菜单打开或关闭时触发，先于焦点移动。</td></tr><tr><td><code>select</code></td><td><code>(item: ContextMenuItemData, event: MouseEvent) =&gt; void</code></td><td>数据驱动模式下某个条目被激活时触发，包含被激活的条目和触发它的那次点击。子菜单里的条目同样会冒泡到这里。</td></tr><tr><td><code>update:isOpen</code></td><td><code>(isOpen: boolean) =&gt; void</code></td><td>由 <code>v-model:isOpen</code> 自动监听，一般不需要手动处理。</td></tr><tr><td><code>element</code></td><td><code>HTMLElement | null</code></td><td>触发器元素，通过模板引用暴露。</td></tr><tr><td><code>open()</code></td><td><code>() =&gt; void</code></td><td>在触发器左上角打开菜单，用于没有指针事件的调用方。</td></tr><tr><td><code>close()</code></td><td><code>() =&gt; void</code></td><td>关闭菜单并把焦点交还给打开前的元素。</td></tr><tr><td><code>focus()</code> / <code>blur()</code></td><td><code>() =&gt; void</code></td><td>聚焦或失焦触发器元素。</td></tr></tbody></table></div><h2 id="子组件" tabindex="-1">子组件 <a class="header-anchor" href="#子组件" aria-label="Permalink to “子组件”">​</a></h2><p>复合模式与数据模式共用同一批行组件，行样式、键盘行为和主题变量完全一致。</p><div class="component-api-table" role="region" aria-label="ContextMenu sub-components" tabindex="0"><table><thead><tr><th>组件</th><th>Props</th><th>说明</th></tr></thead><tbody><tr><td><code>ContextMenuItem</code></td><td><code>icon</code>、<code>label</code>、<code>description</code>、<code>endContent</code>、<code>href</code>、<code>target</code>、<code>rel</code>、<code>isDisabled</code>、<code>hasCloseOnSelect</code>、<code>variant</code></td><td>一个动作条目，渲染为 <code>role=&quot;menuitem&quot;</code>。带 <code>href</code> 时根元素是真正的 <code>&lt;a&gt;</code>，修改键点击和中键点击保持浏览器自身的语义。插槽：<code>label</code>、<code>icon</code>、<code>description</code>、<code>endContent</code>；激活时触发 <code>click</code> 事件。</td></tr><tr><td><code>ContextMenuDivider</code></td><td><code>variant</code></td><td>分组之间的分隔线，渲染为 <code>role=&quot;separator&quot;</code>，因此不会成为方向键的一站。</td></tr><tr><td><code>ContextMenuGroup</code></td><td><code>title</code></td><td>带标题的分组，渲染为 <code>role=&quot;group&quot;</code> 并用标题作为无障碍名称。插槽：<code>default</code>。</td></tr><tr><td><code>ContextMenuSubMenu</code></td><td><code>icon</code>、<code>label</code>、<code>description</code>、<code>isDisabled</code>、<code>items</code></td><td>会展开下一级菜单的条目，行上带 <code>aria-haspopup=&quot;menu&quot;</code> 与 <code>aria-expanded</code>。<code>items</code> 用在数据模式，插槽 <code>default</code> 用在复合模式；打开或关闭时触发 <code>openChange</code>。</td></tr></tbody></table></div><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-context-menu</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-context-menu-background</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#ffffff</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-context-menu-item-focus-background</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#0536590c</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-context-menu-background</code>：面板背景。</li><li><code>--astryx-context-menu-foreground</code>：面板文字颜色。</li><li><code>--astryx-context-menu-shadow</code>：面板投影。</li><li><code>--astryx-context-menu-item-foreground</code>：条目文字颜色。</li><li><code>--astryx-context-menu-item-focus-background</code>：条目被高亮（悬停或键盘聚焦）时的背景。</li><li><code>--astryx-context-menu-item-pressed-background</code>：鼠标按住条目时的背景，仅在支持悬停的设备上出现。</li><li><code>--astryx-context-menu-item-description-foreground</code>：条目次要说明文字颜色。</li><li><code>--astryx-context-menu-item-error-foreground</code>：<code>variant=&quot;destructive&quot;</code> 条目的文字与图标颜色。</li><li><code>--astryx-context-menu-section-foreground</code>：分组标题颜色。</li><li><code>--astryx-context-menu-block-cap</code>：面板最高高度，默认取 300px 与视口高度中较小者。</li><li><code>--astryx-spacing-1</code>、<code>--astryx-radius-container</code>、<code>--astryx-text-label-size</code>：内边距、圆角与字号沿用全局 token。</li></ul><p>Neutral 主题自动适配明暗模式。</p><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><p>根元素是触发器（默认 <code>&lt;div&gt;</code>，<code>triggerAs=&quot;span&quot;</code> 时为 <code>&lt;span&gt;</code>）。</p><p>以下内容传入触发器元素：</p><ul><li>HTML 属性（例如 <code>id</code>、<code>data-*</code>）。</li><li><code>aria-*</code> 属性。</li></ul><p><code>class</code> 与 <code>style</code> 则作用于菜单面板：面板才是可主题化的绘制表面（对应 <code>astryx-context-menu</code> 这个 CSS 类），与上游把 <code>className</code>、<code>style</code> 交给菜单面板的做法一致。</p><p>触发器本身不携带 <code>role</code>、<code>aria-haspopup</code> 或 <code>aria-expanded</code>：它不是按钮，右键是系统级手势，菜单只在打开时以自己的 <code>label</code> 命名。菜单面板被传送到 <code>document.body</code>，因此不会继承触发器上的属性；面板自身带有 <code>data-size</code>、<code>data-placement</code>、<code>data-overflow</code>、<code>data-width</code>、<code>data-astryx-menu-press</code> 供样式与测试使用。</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/context-menu/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
