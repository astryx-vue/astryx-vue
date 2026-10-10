import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/spinner/props.md
var __pageData = JSON.parse("{\"title\":\"Spinner\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Spinner\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/spinner/props.md\",\"filePath\":\"en/components/spinner/props.md\"}");
var _sfc_main = { name: "en/components/spinner/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="spinner-props" tabindex="-1">Spinner Props <a class="header-anchor" href="#spinner-props" aria-label="Permalink to “Spinner Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Spinner props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39; | &#39;lg&#39; | &#39;xl&#39;</code></td><td><code>&#39;md&#39;</code></td><td>Ring diameter: 10px, 14px, 18px, or 28px.</td></tr><tr><td><code>shade</code></td><td><code>&#39;default&#39; | &#39;subtle&#39; | &#39;onMedia&#39; | &#39;inherit&#39;</code></td><td><code>&#39;default&#39;</code></td><td>Color shade for light backgrounds, dark backgrounds, or inherited text color.</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Text shown below the spinner. Also used as the accessible name.</td></tr></tbody></table></div><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><ul><li><code>label</code>: rich content below the spinner. Replaces the <code>label</code> prop text. The default accessible name is <code>Loading</code>.</li></ul><h2 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-label="Permalink to “Theme”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-spinner-diameter-{sm|md|lg|xl}</code>: ring diameter per size.</li><li><code>--astryx-spinner-stroke-width-{sm|md|lg|xl}</code>: stroke width per size.</li><li><code>--astryx-spinner-arc-fraction</code>: fraction of the ring covered by the moving arc.</li><li><code>--astryx-spinner-color-accent</code>: arc color for the <code>default</code> shade.</li><li><code>--astryx-spinner-color-subtle</code>: arc color for the <code>subtle</code> shade.</li><li><code>--astryx-spinner-color-track</code>: track color for the <code>default</code> and <code>subtle</code> shades.</li><li><code>--astryx-spinner-color-on-dark</code>: arc and track color for the <code>onMedia</code> shade.</li><li><code>--astryx-spinner-group-gap</code>: space between the ring and the label.</li><li><code>--astryx-spinner-label-color</code>: label text color.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/spinner/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
