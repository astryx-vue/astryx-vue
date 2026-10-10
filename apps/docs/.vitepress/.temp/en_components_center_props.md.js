import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/center/props.md
var __pageData = JSON.parse("{\"title\":\"Center\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Center\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/center/props.md\",\"filePath\":\"en/components/center/props.md\"}");
var _sfc_main = { name: "en/components/center/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Center Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>axis</code></td><td><code>&#39;both&#39; | &#39;horizontal&#39; | &#39;vertical&#39;</code></td><td><code>&#39;both&#39;</code></td><td>Which axis to center. both centers the main and the cross axis, horizontal centers the inline direction only, and vertical centers the block direction only. A single-axis value ends up on flex alignment, so outside horizontal writing it follows the flex main and cross axes.</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Container width. Numbers are interpreted as pixels, strings pass through as CSS values.</td></tr><tr><td><code>height</code></td><td><code>number | string</code></td><td>—</td><td>Container height. Numbers are interpreted as pixels. Vertical centering needs height to distribute, so the default both and vertical usually use it.</td></tr><tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>—</td><td>Maximum container width. Numbers are interpreted as pixels.</td></tr><tr><td><code>minHeight</code></td><td><code>number | string</code></td><td>—</td><td>Minimum container height. Numbers are interpreted as pixels.</td></tr><tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>Inner padding on all four edges, using the Astryx spacing scale.</td></tr><tr><td><code>paddingInline</code></td><td><code>SpacingStep</code></td><td>—</td><td>Inline-axis padding; overrides padding on that axis.</td></tr><tr><td><code>paddingInlineStart</code></td><td><code>SpacingStep</code></td><td>—</td><td>Inline-start padding; overrides that edge only, and takes precedence over paddingInline and padding. The physical edge follows writing mode and direction.</td></tr><tr><td><code>paddingInlineEnd</code></td><td><code>SpacingStep</code></td><td>—</td><td>Inline-end padding; overrides that edge only, and takes precedence over paddingInline and padding. The physical edge follows writing mode and direction.</td></tr><tr><td><code>paddingBlock</code></td><td><code>SpacingStep</code></td><td>—</td><td>Block-axis padding; overrides padding on that axis.</td></tr><tr><td><code>paddingBlockStart</code></td><td><code>SpacingStep</code></td><td>—</td><td>Block-start padding; overrides that edge only, and takes precedence over paddingBlock and padding. The physical edge follows writing mode.</td></tr><tr><td><code>paddingBlockEnd</code></td><td><code>SpacingStep</code></td><td>—</td><td>Block-end padding; overrides that edge only, and takes precedence over paddingBlock and padding. The physical edge follows writing mode.</td></tr><tr><td><code>isInline</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Render as inline-flex, so the container stays in a line of text. Useful for centering small elements such as icons and badges.</td></tr></tbody></table></div><p><code>SpacingStep</code> accepts these values:</p><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}"> 10</span></span></code></pre></div><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><div class="component-api-table" role="region" aria-label="Center Slots" tabindex="0"><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>default</code></td><td>The content to center. It is centered as one block: Center adds no space between several children and changes none of their semantics, colors, or reading order.</td></tr></tbody></table></div><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><p>The root element is a <code>&lt;div&gt;</code>.</p><p>The following go to the root element:</p><ul><li>HTML attributes.</li><li><code>aria-*</code> attributes.</li><li><code>data-*</code> attributes.</li><li><code>class</code>.</li><li><code>style</code>.</li><li>Native event listeners.</li></ul><p><code>Center</code> writes its own <code>data-axis</code> on the root element to reflect the axis in effect; a <code>data-axis</code> passed in by a consumer does not replace it.</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/center/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
