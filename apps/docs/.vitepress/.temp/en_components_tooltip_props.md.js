import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/tooltip/props.md
var __pageData = JSON.parse("{\"title\":\"Tooltip\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Tooltip\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/tooltip/props.md\",\"filePath\":\"en/components/tooltip/props.md\"}");
var _sfc_main = { name: "en/components/tooltip/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="tooltip-props" tabindex="-1">Tooltip Props <a class="header-anchor" href="#tooltip-props" aria-label="Permalink to “Tooltip Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Tooltip props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>content</code></td><td><code>string</code></td><td>—</td><td>Tooltip text. Use the <code>content</code> slot for rich content.</td></tr><tr><td><code>placement</code></td><td><code>&#39;above&#39; | &#39;below&#39; | &#39;start&#39; | &#39;end&#39;</code></td><td><code>&#39;above&#39;</code></td><td>Side of the trigger. Flips when there is no room.</td></tr><tr><td><code>alignment</code></td><td><code>&#39;start&#39; | &#39;center&#39; | &#39;end&#39;</code></td><td><code>&#39;center&#39;</code></td><td>Alignment along the placement axis.</td></tr><tr><td><code>delay</code></td><td><code>number</code></td><td><code>200</code></td><td>Milliseconds before showing on hover.</td></tr><tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>0</code></td><td>Milliseconds before hiding. 0 uses a 100ms bridge so the pointer can reach the bubble.</td></tr><tr><td><code>focusTrigger</code></td><td><code>&#39;auto&#39; | &#39;always&#39; | &#39;never&#39;</code></td><td><code>&#39;auto&#39;</code></td><td>Whether focus shows the tooltip. auto listens only when the trigger is focusable.</td></tr><tr><td><code>touchTrigger</code></td><td><code>&#39;auto&#39; | &#39;tap&#39; | &#39;none&#39;</code></td><td><code>&#39;auto&#39;</code></td><td>Tap behavior on touch. auto skips buttons, links, and form controls.</td></tr><tr><td><code>isEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Disables hover and focus triggers when false.</td></tr><tr><td><code>hasHoverIndication</code></td><td><code>&#39;auto&#39; | boolean</code></td><td><code>&#39;auto&#39;</code></td><td>Dashed underline on a text-only trigger. auto applies it only to text.</td></tr><tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>Controlled visibility. Hover and focus are ignored when set.</td></tr><tr><td><code>isDefaultOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show on mount.</td></tr></tbody></table></div><h2 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to “Events”">​</a></h2><ul><li><code>openChange(isOpen: boolean)</code>: fires when the tooltip shows or hides. With <code>isOpen</code>, it fires with <code>false</code> on Escape and the parent decides whether to close.</li></ul><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><ul><li><code>default</code>: the trigger.</li><li><code>content</code>: rich tooltip content. Replaces the <code>content</code> prop text.</li></ul><h2 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-label="Permalink to “Theme”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-tooltip</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-tooltip-background</span><span style="${ssrRenderStyle({
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
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-tooltip-foreground</span><span style="${ssrRenderStyle({
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
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-tooltip-background</code>: bubble background.</li><li><code>--astryx-tooltip-foreground</code>: bubble text color.</li><li><code>--astryx-tooltip-indication-color</code>: dashed underline color.</li><li><code>--astryx-tooltip-z-index</code>: stacking order of the bubble.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/tooltip/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
