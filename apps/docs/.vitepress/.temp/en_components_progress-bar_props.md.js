import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/progress-bar/props.md
var __pageData = JSON.parse("{\"title\":\"Progress Bar\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Progress Bar\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/progress-bar/props.md\",\"filePath\":\"en/components/progress-bar/props.md\"}");
var _sfc_main = { name: "en/components/progress-bar/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="progressbar-props" tabindex="-1">ProgressBar Props <a class="header-anchor" href="#progressbar-props" aria-label="Permalink to “ProgressBar Props”">​</a></h2><div class="component-api-table" role="region" aria-label="ProgressBar props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>value</code></td><td><code>number</code></td><td>—</td><td>Required. Current value.</td></tr><tr><td><code>min</code></td><td><code>number</code></td><td><code>0</code></td><td>Minimum value.</td></tr><tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>Maximum value.</td></tr><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39; | &#39;lg&#39;</code></td><td><code>&#39;md&#39;</code></td><td>Track height.</td></tr><tr><td><code>variant</code></td><td><code>&#39;neutral&#39; | &#39;success&#39; | &#39;warning&#39; | &#39;error&#39; | &#39;info&#39;</code></td><td><code>&#39;neutral&#39;</code></td><td>Fill color.</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Progress bar label. Used as the accessible name.</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Supplementary description.</td></tr><tr><td><code>isIndeterminate</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Indeterminate state. Shows a looping animation and removes aria-valuenow.</td></tr><tr><td><code>showValue</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show the percentage next to the label.</td></tr><tr><td><code>valueText</code></td><td><code>string</code></td><td>—</td><td>Custom aria-valuetext and display text. Overrides the default percentage.</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Component width. Numbers are treated as px.</td></tr></tbody></table></div><h2 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-label="Permalink to “Theme”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-progress-bar</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-progress-bar-track-background</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#e5e5e5</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-progress-bar-fill-background</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#171717</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-progress-bar-track-background</code>: track background.</li><li><code>--astryx-progress-bar-fill-background</code>: default fill color.</li><li><code>--astryx-progress-bar-track-height</code>: default track height.</li><li><code>--astryx-progress-bar-track-height-sm</code>: sm track height.</li><li><code>--astryx-progress-bar-track-height-lg</code>: lg track height.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/progress-bar/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
