import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/popover/props.md
var __pageData = JSON.parse("{\"title\":\"弹出层\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"弹出层\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/popover/props.md\",\"filePath\":\"zh/components/popover/props.md\"}");
var _sfc_main = { name: "components/popover/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to “属性”">​</a></h2><div class="component-api-table" role="region" aria-label="Popover 属性" tabindex="0"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>placement</code></td><td><code>&#39;above&#39; | &#39;below&#39; | &#39;start&#39; | &#39;end&#39;</code></td><td><code>&#39;below&#39;</code></td><td>浮层相对触发元素的方向。所选方向空间不足时会自动翻转。</td></tr><tr><td><code>alignment</code></td><td><code>&#39;start&#39; | &#39;center&#39; | &#39;end&#39;</code></td><td><code>&#39;start&#39;</code></td><td>浮层沿位置方向的对齐方式：靠起始端、居中或靠末端。</td></tr><tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>受控显示状态。未设置时，开合由触发元素自行管理。</td></tr><tr><td><code>isEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否启用。为 false 时触发元素无法打开浮层。</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>触发元素宽度</td><td>浮层宽度，数字单位为像素。未设置时最小与触发元素等宽，最大为 320px，且不超出视口。</td></tr><tr><td><code>padding</code></td><td><code>0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10</code></td><td><code>3</code></td><td>浮层内边距，取值对应 <code>--astryx-spacing-*</code> 令牌。</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>浮层作为对话框时的无障碍名称，<code>role</code> 为 <code>dialog</code> 时应提供。</td></tr><tr><td><code>role</code></td><td><code>&#39;dialog&#39; | &#39;none&#39;</code></td><td><code>&#39;dialog&#39;</code></td><td>浮层的语义角色：包含交互内容时使用 <code>dialog</code>；内容自带角色（例如菜单）时使用 <code>none</code>。</td></tr><tr><td><code>isModal</code></td><td><code>boolean</code></td><td><code>true</code></td><td>浮层打开期间将 Tab 焦点限制在浮层内。仅对 <code>dialog</code> 角色生效。</td></tr><tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否显示关闭按钮。关闭按钮在获得焦点前保持视觉隐藏。</td></tr><tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td><code>&#39;Close&#39;</code></td><td>关闭按钮的文字，同时作为它的无障碍名称。</td></tr><tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>true</code></td><td>打开时是否把焦点移入浮层。仅对 <code>dialog</code> 角色生效。</td></tr><tr><td><code>hasLightDismiss</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否允许点击浮层与触发元素以外的区域来关闭。</td></tr><tr><td><code>hasEscapeDismiss</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否允许按下 Escape 关闭浮层。</td></tr></tbody></table></div><h2 id="事件" tabindex="-1">事件 <a class="header-anchor" href="#事件" aria-label="Permalink to “事件”">​</a></h2><ul><li><code>openChange(isOpen: boolean)</code>：浮层打开或关闭时触发，包括用户主动关闭。</li></ul><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><ul><li><code>default</code>：触发元素。请使用 <code>button</code> 或带有 <code>role=&quot;button&quot;</code> 的元素。</li><li><code>content</code>：浮层内容。</li></ul><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-popover</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-popover-background</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#fff</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-popover-foreground</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#000</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-popover-background</code>：浮层背景色。</li><li><code>--astryx-popover-foreground</code>：浮层文字颜色。</li><li><code>--astryx-popover-shadow</code>：浮层阴影。</li><li><code>--astryx-popover-z-index</code>：浮层的层叠顺序。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/popover/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
