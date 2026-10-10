import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/stack/props.md
var __pageData = JSON.parse("{\"title\":\"Stack\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Stack\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/stack/props.md\",\"filePath\":\"en/components/stack/props.md\"}");
var _sfc_main = { name: "en/components/stack/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="stack-props" tabindex="-1">Stack Props <a class="header-anchor" href="#stack-props" aria-label="Permalink to “Stack Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Stack Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>direction</code></td><td><code>&#39;horizontal&#39; | &#39;vertical&#39;</code></td><td><code>&#39;vertical&#39;</code></td><td>Direction in which children are arranged.</td></tr><tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td>—</td><td>Space between adjacent children.</td></tr><tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>Padding on every side of the container.</td></tr><tr><td><code>paddingInline</code></td><td><code>SpacingStep</code></td><td>—</td><td>Inline-axis padding. Overrides padding on this axis.</td></tr><tr><td><code>paddingBlock</code></td><td><code>SpacingStep</code></td><td>—</td><td>Block-axis padding. Overrides padding on this axis.</td></tr><tr><td><code>hAlign</code></td><td><code>StackAlignment</code></td><td>—</td><td>Controls horizontal main- or cross-axis alignment according to direction.</td></tr><tr><td><code>vAlign</code></td><td><code>StackAlignment</code></td><td>—</td><td>Controls vertical main- or cross-axis alignment according to direction.</td></tr><tr><td><code>justify</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>Alias for main-axis alignment.</td></tr><tr><td><code>align</code></td><td><code>StackCrossAlignment</code></td><td>—</td><td>Alias for cross-axis alignment.</td></tr><tr><td><code>wrap</code></td><td><code>&#39;nowrap&#39; | &#39;wrap&#39; | &#39;wrap-reverse&#39;</code></td><td><code>&#39;nowrap&#39;</code></td><td>Controls how children wrap.</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Container width. Numbers are interpreted as pixels.</td></tr><tr><td><code>height</code></td><td><code>number | string</code></td><td>—</td><td>Container height. Numbers are interpreted as pixels.</td></tr><tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>—</td><td>Maximum container width.</td></tr><tr><td><code>minHeight</code></td><td><code>number | string</code></td><td>—</td><td>Minimum container height.</td></tr><tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables automatic overflow scrolling.</td></tr><tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>&#39;div&#39;</code></td><td>Root element or Vue component.</td></tr></tbody></table></div><p><code>SpacingStep</code> accepts these values:</p><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">type</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> SpacingStep</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> =</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> 0</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> 0.5</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> 1</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> 1.5</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> 2</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> 3</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> 4</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> 5</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> 6</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> 8</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> 10</span></span></code></pre></div><h2 id="hstack-props" tabindex="-1">HStack Props <a class="header-anchor" href="#hstack-props" aria-label="Permalink to “HStack Props”">​</a></h2><p><code>HStack</code> uses a fixed horizontal direction.</p><ul><li>The component supports shared <code>Stack</code> props.</li><li>The component does not expose <code>direction</code>.</li><li>The table below defines alignment.</li></ul><div class="component-api-table" role="region" aria-label="HStack alignment Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>hAlign</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>Horizontal main-axis alignment.</td></tr><tr><td><code>vAlign</code></td><td><code>StackCrossAlignment</code></td><td><code>&#39;stretch&#39;</code></td><td>Vertical cross-axis alignment.</td></tr></tbody></table></div><h2 id="vstack-props" tabindex="-1">VStack Props <a class="header-anchor" href="#vstack-props" aria-label="Permalink to “VStack Props”">​</a></h2><p><code>VStack</code> uses a fixed vertical direction.</p><ul><li>The component supports shared <code>Stack</code> props.</li><li>The component does not expose <code>direction</code>.</li><li>The table below defines alignment.</li></ul><div class="component-api-table" role="region" aria-label="VStack alignment Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>hAlign</code></td><td><code>StackCrossAlignment</code></td><td><code>&#39;stretch&#39;</code></td><td>Horizontal cross-axis alignment.</td></tr><tr><td><code>vAlign</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>Vertical main-axis alignment.</td></tr></tbody></table></div><h2 id="stackitem-props" tabindex="-1">StackItem Props <a class="header-anchor" href="#stackitem-props" aria-label="Permalink to “StackItem Props”">​</a></h2><div class="component-api-table" role="region" aria-label="StackItem Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>size</code></td><td><code>&#39;static&#39; | &#39;fill&#39;</code></td><td><code>&#39;static&#39;</code></td><td>Keeps the intrinsic size or fills the remaining space.</td></tr><tr><td><code>crossAlignSelf</code></td><td><code>&#39;start&#39; | &#39;center&#39; | &#39;end&#39; | &#39;stretch&#39;</code></td><td>—</td><td>Overrides cross-axis alignment for this item.</td></tr><tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Enables automatic overflow scrolling.</td></tr><tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>&#39;div&#39;</code></td><td>Root element or Vue component.</td></tr></tbody></table></div><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><p>Stack, HStack, VStack, and StackItem all receive content through the default slot.</p><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><p>The root element receives:</p><ul><li>HTML attributes.</li><li><code>aria-*</code> attributes.</li><li><code>data-*</code> attributes.</li><li><code>class</code>.</li><li><code>style</code>.</li><li>Native event listeners.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/stack/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
