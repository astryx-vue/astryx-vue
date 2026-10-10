import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/grid/props.md
var __pageData = JSON.parse("{\"title\":\"Grid\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Grid\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/grid/props.md\",\"filePath\":\"en/components/grid/props.md\"}");
var _sfc_main = { name: "en/components/grid/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="grid-props" tabindex="-1">Grid Props <a class="header-anchor" href="#grid-props" aria-label="Permalink to “Grid Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Grid Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>columns</code></td><td><code>number | GridResponsiveColumns</code></td><td>-</td><td>Column configuration. A number is a fixed count of equal-width columns; an object <code>{ minWidth, max?, repeat? }</code> creates responsive columns that reflow with the available width. A missing, zero, or negative value falls back to a single column.</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>-</td><td>Width of the container. Numbers are pixels, strings are used as they are.</td></tr><tr><td><code>height</code></td><td><code>number | string</code></td><td>-</td><td>Height of the container. Numbers are pixels, strings are used as they are.</td></tr><tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>-</td><td>Maximum width of the container. Numbers are pixels, strings are used as they are.</td></tr><tr><td><code>minHeight</code></td><td><code>number | string</code></td><td>-</td><td>Minimum height of the container. Numbers are pixels, strings are used as they are.</td></tr><tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td>-</td><td>Spacing between items on both axes, using the Astryx spacing scale.</td></tr><tr><td><code>rowGap</code></td><td><code>SpacingStep</code></td><td>-</td><td>Spacing between rows; overrides <code>gap</code> on that axis.</td></tr><tr><td><code>columnGap</code></td><td><code>SpacingStep</code></td><td>-</td><td>Spacing between columns; overrides <code>gap</code> on that axis. It also takes precedence over <code>gap</code> when the responsive column count is capped.</td></tr><tr><td><code>rowHeight</code></td><td><code>number</code></td><td>-</td><td>Height in pixels of each implicit row (<code>grid-auto-rows</code>). Use it together with <code>GridSpan</code>&#39;s <code>rows</code>.</td></tr><tr><td><code>align</code></td><td><code>GridAlignment</code></td><td><code>&#39;stretch&#39;</code></td><td>Vertical alignment of items inside their row (<code>align-items</code>): start, center, end, or stretch.</td></tr><tr><td><code>justify</code></td><td><code>GridAlignment</code></td><td><code>&#39;stretch&#39;</code></td><td>Horizontal alignment of items within their row (<code>justify-items</code>): start, center, end, or stretch.</td></tr></tbody></table></div><p><code>GridResponsiveColumns</code> has this shape:</p><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">interface</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> GridResponsiveColumns</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  minWidth</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> number</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  max</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">?:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> number</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  repeat</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">?:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &#39;fill&#39;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &#39;fit&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><p><code>SpacingStep</code> accepts these values:</p><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}"> 10</span></span></code></pre></div><h2 id="grid-span-props" tabindex="-1">Grid Span Props <a class="header-anchor" href="#grid-span-props" aria-label="Permalink to “Grid Span Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Grid Span Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>columns</code></td><td><code>number | &#39;full&#39;</code></td><td>-</td><td>Columns to span. <code>&#39;full&#39;</code> renders <code>grid-column: 1 / -1</code>, which spans the row whatever the column count is.</td></tr><tr><td><code>rows</code></td><td><code>number</code></td><td>-</td><td>Rows to span, rendered as <code>grid-row: span N</code>.</td></tr></tbody></table></div><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><div class="component-api-table" role="region" aria-label="Grid Slots" tabindex="0"><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>default</code></td><td>The items to lay out. Place children directly, or wrap one in <code>GridSpan</code> to change how many columns or rows it occupies.</td></tr></tbody></table></div><p><code>GridSpan</code> has a single default slot as well:</p><div class="component-api-table" role="region" aria-label="Grid Span Slots" tabindex="0"><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>default</code></td><td>The content of the spanning item.</td></tr></tbody></table></div><h2 id="css-variables" tabindex="-1">CSS variables <a class="header-anchor" href="#css-variables" aria-label="Permalink to “CSS variables”">​</a></h2><p><code>Grid</code> writes these variables to its root element. They are an implementation detail, but a theme or an application may override them:</p><div class="component-api-table" role="region" aria-label="Grid CSS Variables" tabindex="0"><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>--astryx-grid-template-columns</code></td><td>The computed column template. It lives in a variable rather than an inline <code>grid-template-columns</code> declaration, so a media query can still override it.</td></tr><tr><td><code>--astryx-grid-auto-rows</code></td><td>The implicit row height derived from <code>rowHeight</code>.</td></tr><tr><td><code>--astryx-grid-gap</code></td><td>The spacing token for <code>gap</code>, shared by both axes.</td></tr><tr><td><code>--astryx-grid-row-gap</code></td><td>The spacing token for <code>rowGap</code>, which overrides <code>--astryx-grid-gap</code> on the row axis.</td></tr><tr><td><code>--astryx-grid-column-gap</code></td><td>The spacing token for <code>columnGap</code>, which overrides <code>--astryx-grid-gap</code> on the column axis.</td></tr><tr><td><code>--astryx-grid-default-gap</code></td><td>A theme token used as the spacing when no gap prop is given. The neutral theme sets it to <code>--astryx-spacing-0</code>, which leaves no space between items.</td></tr></tbody></table></div><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><p><code>Grid</code> and <code>GridSpan</code> both render a <code>&lt;div&gt;</code> at the root.</p><p>The following go to the root element:</p><ul><li>HTML attributes.</li><li><code>aria-*</code> attributes.</li><li><code>data-*</code> attributes.</li><li><code>class</code>.</li><li><code>style</code>.</li></ul><p><code>class</code> is merged with the component&#39;s own classes. When <code>style</code> and the size props (<code>width</code>, <code>height</code>, <code>maxWidth</code>, <code>minHeight</code>) are both given, the props win; the same holds for <code>GridSpan</code>&#39;s <code>columns</code> and <code>rows</code>.</p><p><code>Grid</code> also writes <code>data-columns</code> (only when <code>columns</code> is a number), <code>data-gap</code>, <code>data-row-gap</code>, <code>data-column-gap</code>, <code>data-align</code>, and <code>data-justify</code>, so a theme can target it by attribute.</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/grid/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
