import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/divider/props.md
var __pageData = JSON.parse("{\"title\":\"Divider\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Divider\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/divider/props.md\",\"filePath\":\"en/components/divider/props.md\"}");
var _sfc_main = { name: "en/components/divider/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="divider-props" tabindex="-1">Divider Props <a class="header-anchor" href="#divider-props" aria-label="Permalink to “Divider Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Divider props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>orientation</code></td><td><code>&#39;horizontal&#39; | &#39;vertical&#39;</code></td><td><code>&#39;horizontal&#39;</code></td><td>Orientation of the divider.</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Text centered on the divider. Also used as the accessible name.</td></tr><tr><td><code>variant</code></td><td><code>&#39;subtle&#39; | &#39;strong&#39;</code></td><td><code>&#39;subtle&#39;</code></td><td>Line weight. strong uses the emphasized border color.</td></tr><tr><td><code>isFullBleed</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Extend to the container edges with negative margins.</td></tr></tbody></table></div><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><ul><li><code>label</code>: rich content in the middle of the divider. Replaces the <code>label</code> prop text.</li></ul><h2 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-label="Permalink to “Theme”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-divider</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-divider-color-subtle</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#00000014</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-divider-color-subtle</code>: color of the <code>subtle</code> line.</li><li><code>--astryx-divider-color-strong</code>: color of the <code>strong</code> line.</li><li><code>--astryx-divider-label-color</code>: label text color.</li><li><code>--astryx-border-width</code>: line thickness.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/divider/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
