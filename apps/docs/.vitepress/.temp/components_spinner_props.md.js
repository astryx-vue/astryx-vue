import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/spinner/props.md
var __pageData = JSON.parse("{\"title\":\"加载态\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"加载态\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/spinner/props.md\",\"filePath\":\"zh/components/spinner/props.md\"}");
var _sfc_main = { name: "components/spinner/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to “属性”">​</a></h2><div class="component-api-table" role="region" aria-label="Spinner 属性" tabindex="0"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39; | &#39;lg&#39; | &#39;xl&#39;</code></td><td><code>&#39;md&#39;</code></td><td>圆环的直径，sm 为 10px，md 为 14px，lg 为 18px，xl 为 28px。</td></tr><tr><td><code>shade</code></td><td><code>&#39;default&#39; | &#39;subtle&#39; | &#39;onMedia&#39; | &#39;inherit&#39;</code></td><td><code>&#39;default&#39;</code></td><td>圆环的配色层级，分别面向浅色背景、深色背景或继承周围文字颜色的场景。</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>显示在加载态下方的文字，同时作为无障碍名称供屏幕阅读器播报。</td></tr></tbody></table></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><ul><li><code>label</code>：加载态下方的富文本内容，会替代 <code>label</code> 属性的文字。未提供文字时，无障碍名称默认为 <code>Loading</code>。</li></ul><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-spinner</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-spinner-color-accent</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#0074e2</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-spinner-diameter-{sm|md|lg|xl}</code>：各尺寸的环直径。</li><li><code>--astryx-spinner-stroke-width-{sm|md|lg|xl}</code>：各尺寸的描边宽度。</li><li><code>--astryx-spinner-arc-fraction</code>：运动圆弧覆盖圆环的比例。</li><li><code>--astryx-spinner-color-accent</code>：<code>default</code> 色调的圆弧颜色。</li><li><code>--astryx-spinner-color-subtle</code>：<code>subtle</code> 色调的圆弧颜色。</li><li><code>--astryx-spinner-color-track</code>：<code>default</code> 和 <code>subtle</code> 色调的轨道颜色。</li><li><code>--astryx-spinner-color-on-dark</code>：<code>onMedia</code> 色调的圆弧与轨道颜色。</li><li><code>--astryx-spinner-group-gap</code>：圆环与文字之间的间距。</li><li><code>--astryx-spinner-label-color</code>：文字颜色。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/spinner/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
