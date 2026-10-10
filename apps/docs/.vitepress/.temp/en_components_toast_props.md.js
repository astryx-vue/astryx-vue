import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/toast/props.md
var __pageData = JSON.parse("{\"title\":\"Toast\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Toast\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/toast/props.md\",\"filePath\":\"en/components/toast/props.md\"}");
var _sfc_main = { name: "en/components/toast/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="toast-props" tabindex="-1">Toast Props <a class="header-anchor" href="#toast-props" aria-label="Permalink to “Toast Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Toast Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>type</code></td><td><code>ToastType</code></td><td><code>&#39;info&#39;</code></td><td>Visual type. Optional: info, success, warning, error.</td></tr><tr><td><code>body</code></td><td><code>string</code></td><td>-</td><td>Toast message text.</td></tr><tr><td><code>autoClose</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether the toast auto-dismisses.</td></tr><tr><td><code>duration</code></td><td><code>number</code></td><td><code>5000</code></td><td>Auto-dismiss duration in milliseconds.</td></tr></tbody></table></div><h2 id="toast-events" tabindex="-1">Toast Events <a class="header-anchor" href="#toast-events" aria-label="Permalink to “Toast Events”">​</a></h2><div class="component-api-table" role="region" aria-label="Toast Events" tabindex="0"><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>close</code></td><td>Emitted when the toast is dismissed.</td></tr></tbody></table></div><h2 id="toast-slots" tabindex="-1">Toast Slots <a class="header-anchor" href="#toast-slots" aria-label="Permalink to “Toast Slots”">​</a></h2><div class="component-api-table" role="region" aria-label="Toast Slots" tabindex="0"><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>default</code></td><td>Custom toast content. Defaults to <code>body</code>.</td></tr></tbody></table></div><h2 id="toastviewport-props" tabindex="-1">ToastViewport Props <a class="header-anchor" href="#toastviewport-props" aria-label="Permalink to “ToastViewport Props”">​</a></h2><div class="component-api-table" role="region" aria-label="ToastViewport Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>placement</code></td><td><code>ToastPlacement</code></td><td><code>&#39;bottom-center&#39;</code></td><td>Position of the toast stack in the viewport. Optional: top-start, top-center, top-end, bottom-start, bottom-center, bottom-end.</td></tr></tbody></table></div><h2 id="usetoast" tabindex="-1">useToast <a class="header-anchor" href="#usetoast" aria-label="Permalink to “useToast”">​</a></h2><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">const</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> toast</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> =</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> useToast</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">()</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">const</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> dismiss</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> =</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> toast</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">({ body: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&#39;Hello&#39;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">, type: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&#39;info&#39;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">, duration: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">3000</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> })</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#62687b",
		"--shiki-dark": "#818e99"
	})}">// dismiss manually</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">dismiss</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">()</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#62687b",
		"--shiki-dark": "#818e99"
	})}">// dismiss all</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">toast.</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">clear</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">()</span></span></code></pre></div></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/toast/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
