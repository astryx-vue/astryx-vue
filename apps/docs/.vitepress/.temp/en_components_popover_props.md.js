import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/popover/props.md
var __pageData = JSON.parse("{\"title\":\"Popover\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Popover\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/popover/props.md\",\"filePath\":\"en/components/popover/props.md\"}");
var _sfc_main = { name: "en/components/popover/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="popover-props" tabindex="-1">Popover Props <a class="header-anchor" href="#popover-props" aria-label="Permalink to “Popover Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Popover props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>placement</code></td><td><code>&#39;above&#39; | &#39;below&#39; | &#39;start&#39; | &#39;end&#39;</code></td><td><code>&#39;below&#39;</code></td><td>Side of the trigger. Flips when there is no room.</td></tr><tr><td><code>alignment</code></td><td><code>&#39;start&#39; | &#39;center&#39; | &#39;end&#39;</code></td><td><code>&#39;start&#39;</code></td><td>Alignment along the placement axis.</td></tr><tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>Controlled visibility. When unset, the trigger manages visibility.</td></tr><tr><td><code>isEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Prevents the trigger from opening the surface when false.</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>Trigger width</td><td>Surface width. Numbers are pixels. When unset, the surface is at least as wide as the trigger and at most 320px (and never wider than the viewport).</td></tr><tr><td><code>padding</code></td><td><code>0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10</code></td><td><code>3</code></td><td>Inner padding, mapped to the <code>--astryx-spacing-*</code> tokens.</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name of the dialog. Provide it when <code>role</code> is <code>dialog</code>.</td></tr><tr><td><code>role</code></td><td><code>&#39;dialog&#39; | &#39;none&#39;</code></td><td><code>&#39;dialog&#39;</code></td><td>Use <code>dialog</code> for interactive content. Use <code>none</code> when the content already has its own role.</td></tr><tr><td><code>isModal</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Keeps Tab focus inside the surface while it is open. Applies to <code>dialog</code> only.</td></tr><tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Shows a close button that is visible only when focused.</td></tr><tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td><code>&#39;Close&#39;</code></td><td>Text and accessible name of the close button.</td></tr><tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Moves focus into the surface when it opens.</td></tr><tr><td><code>hasLightDismiss</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Closes when the user presses outside the surface and the trigger.</td></tr><tr><td><code>hasEscapeDismiss</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Closes when the user presses Escape.</td></tr></tbody></table></div><h2 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to “Events”">​</a></h2><ul><li><code>openChange(isOpen: boolean)</code>: fires when the surface opens or closes, including when the user dismisses it.</li></ul><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><ul><li><code>default</code>: the trigger. Use a <code>button</code> or an element with <code>role=&quot;button&quot;</code>.</li><li><code>content</code>: the surface content.</li></ul><h2 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-label="Permalink to “Theme”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-popover-background</code>: surface background color.</li><li><code>--astryx-popover-foreground</code>: surface text color.</li><li><code>--astryx-popover-shadow</code>: surface shadow.</li><li><code>--astryx-popover-z-index</code>: stacking order of the surface.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/popover/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
