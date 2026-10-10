import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/dialog/props.md
var __pageData = JSON.parse("{\"title\":\"Dialog\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Dialog\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/dialog/props.md\",\"filePath\":\"en/components/dialog/props.md\"}");
var _sfc_main = { name: "en/components/dialog/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="dialog-props" tabindex="-1">Dialog Props <a class="header-anchor" href="#dialog-props" aria-label="Permalink to “Dialog Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Dialog props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>Whether the dialog is open. Required.</td></tr><tr><td><code>isInline</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Renders content in normal flow without the modal dialog, backdrop, or focus behavior. For documentation previews only.</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td><code>400</code></td><td>Preferred width. Numbers are pixels. Clamped to the viewport on narrow screens. Ignored by <code>fullscreen</code>.</td></tr><tr><td><code>maxHeight</code></td><td><code>number | string</code></td><td><code>&#39;75vh&#39;</code></td><td>Maximum height. Numbers are pixels. Ignored by <code>fullscreen</code>.</td></tr><tr><td><code>position</code></td><td><code>DialogPosition</code></td><td>Centered</td><td>Static offsets: <code>top</code>, <code>bottom</code>, <code>start</code>, <code>end</code>. Logical <code>start</code> and <code>end</code> mirror under RTL. Ignored by <code>fullscreen</code>.</td></tr><tr><td><code>variant</code></td><td><code>&#39;standard&#39; | &#39;fullscreen&#39;</code></td><td><code>&#39;standard&#39;</code></td><td>Standard dialog or a dialog that fills the viewport.</td></tr><tr><td><code>purpose</code></td><td><code>&#39;required&#39; | &#39;form&#39; | &#39;info&#39;</code></td><td><code>&#39;info&#39;</code></td><td><code>required</code> disables Escape and backdrop dismissal. <code>form</code> allows Escape only. <code>info</code> allows both.</td></tr><tr><td><code>padding</code></td><td><code>0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10</code></td><td>Theme default (16px)</td><td>Inner padding, mapped to the <code>--astryx-spacing-*</code> tokens.</td></tr></tbody></table></div><h2 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to “Events”">​</a></h2><ul><li><code>openChange(isOpen: boolean)</code>: fires with <code>false</code> when the user requests dismissal through Escape or a backdrop click, depending on <code>purpose</code>. The parent sets <code>isOpen</code> to close.</li></ul><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><ul><li><code>default</code>: dialog content. Usually a <code>DialogHeader</code> followed by body content and actions.</li></ul><h2 id="dialogheader-props" tabindex="-1">DialogHeader Props <a class="header-anchor" href="#dialogheader-props" aria-label="Permalink to “DialogHeader Props”">​</a></h2><div class="component-api-table" role="region" aria-label="DialogHeader props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>Dialog title. Receives default focus on open and names the dialog. Required.</td></tr><tr><td><code>subtitle</code></td><td><code>string</code></td><td>—</td><td>Secondary text below the title. Not rendered when empty.</td></tr><tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Shows a close button that emits <code>openChange(false)</code>.</td></tr><tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td><code>&#39;Close&#39;</code></td><td>Accessible name of the close button.</td></tr></tbody></table></div><h2 id="dialogheader-events-and-slots" tabindex="-1">DialogHeader Events and Slots <a class="header-anchor" href="#dialogheader-events-and-slots" aria-label="Permalink to “DialogHeader Events and Slots”">​</a></h2><ul><li><code>openChange(isOpen: boolean)</code>: fires with <code>false</code> from the close button.</li><li><code>startContent</code>: content before the title, such as a back button.</li><li><code>endContent</code>: content after the title, before the close button.</li></ul><h2 id="useimperativedialog" tabindex="-1">useImperativeDialog <a class="header-anchor" href="#useimperativedialog" aria-label="Permalink to “useImperativeDialog”">​</a></h2><ul><li><code>show(content, options?)</code>: opens the dialog with content. Options merge with the defaults passed to the hook.</li><li><code>hide()</code>: closes the dialog.</li><li><code>isOpen</code>: readonly ref of the open state.</li><li><code>Host</code>: component to render once in the template.</li></ul><h2 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-label="Permalink to “Theme”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-dialog</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-dialog-background</span><span style="${ssrRenderStyle({
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
	})}">  --astryx-dialog-foreground</span><span style="${ssrRenderStyle({
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
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-dialog-background</code>: surface color.</li><li><code>--astryx-dialog-foreground</code>: text color.</li><li><code>--astryx-dialog-overlay</code>: backdrop color.</li><li><code>--astryx-dialog-shadow</code>: surface shadow.</li><li><code>--astryx-dialog-padding</code>: default inner padding when the <code>padding</code> prop is not set.</li><li><code>--astryx-dialog-title-color</code>: header title color.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/dialog/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
