import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/grid/props.md
var __pageData = JSON.parse("{\"title\":\"网格布局\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"网格布局\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/grid/props.md\",\"filePath\":\"zh/components/grid/props.md\"}");
var _sfc_main = { name: "components/grid/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="grid-props" tabindex="-1">Grid Props <a class="header-anchor" href="#grid-props" aria-label="Permalink to “Grid Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Grid Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>columns</code></td><td><code>number | GridResponsiveColumns</code></td><td>-</td><td>列配置。传数字是固定列数，每一列等宽；传对象 <code>{ minWidth, max?, repeat? }</code> 是响应式列，按可用宽度自动决定列数。缺失、为 0 或为负数时回退为单列。</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>-</td><td>容器宽度。数字按像素处理，字符串原样使用。</td></tr><tr><td><code>height</code></td><td><code>number | string</code></td><td>-</td><td>容器高度。数字按像素处理，字符串原样使用。</td></tr><tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>-</td><td>容器最大宽度。数字按像素处理，字符串原样使用。</td></tr><tr><td><code>minHeight</code></td><td><code>number | string</code></td><td>-</td><td>容器最小高度。数字按像素处理，字符串原样使用。</td></tr><tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td>-</td><td>行列间距，使用 Astryx 的间距刻度。</td></tr><tr><td><code>rowGap</code></td><td><code>SpacingStep</code></td><td>-</td><td>行间距，覆盖同一方向上的 <code>gap</code>。</td></tr><tr><td><code>columnGap</code></td><td><code>SpacingStep</code></td><td>-</td><td>列间距，覆盖同一方向上的 <code>gap</code>。在响应式列计算列数上限时，它也优先于 <code>gap</code>。</td></tr><tr><td><code>rowHeight</code></td><td><code>number</code></td><td>-</td><td>隐式行高，单位为像素（<code>grid-auto-rows</code>）。配合 <code>GridSpan</code> 的 <code>rows</code> 使用。</td></tr><tr><td><code>align</code></td><td><code>GridAlignment</code></td><td><code>&#39;stretch&#39;</code></td><td>项目在行内的垂直对齐（<code>align-items</code>），可选 start、center、end、stretch。</td></tr><tr><td><code>justify</code></td><td><code>GridAlignment</code></td><td><code>&#39;stretch&#39;</code></td><td>项目在同一行内的水平对齐（<code>justify-items</code>），可选 start、center、end、stretch。</td></tr></tbody></table></div><p><code>GridResponsiveColumns</code> 的形状如下：</p><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}">}</span></span></code></pre></div><p><code>SpacingStep</code> 支持以下值：</p><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}"> 10</span></span></code></pre></div><h2 id="grid-span-props" tabindex="-1">Grid Span Props <a class="header-anchor" href="#grid-span-props" aria-label="Permalink to “Grid Span Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Grid Span Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>columns</code></td><td><code>number | &#39;full&#39;</code></td><td>-</td><td>跨越的列数。<code>&#39;full&#39;</code> 渲染为 <code>grid-column: 1 / -1</code>，跨越整行，与列数无关。</td></tr><tr><td><code>rows</code></td><td><code>number</code></td><td>-</td><td>跨越的行数，渲染为 <code>grid-row: span N</code>。</td></tr></tbody></table></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><div class="component-api-table" role="region" aria-label="Grid Slots" tabindex="0"><table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody><tr><td><code>default</code></td><td>要排布的项目。直接放子元素，或放 <code>GridSpan</code> 来改变其中一项的跨列、跨行行为。</td></tr></tbody></table></div><p><code>GridSpan</code> 同样只有一个默认插槽：</p><div class="component-api-table" role="region" aria-label="Grid Span Slots" tabindex="0"><table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody><tr><td><code>default</code></td><td>跨列项目的具体内容。</td></tr></tbody></table></div><h2 id="css-变量" tabindex="-1">CSS 变量 <a class="header-anchor" href="#css-变量" aria-label="Permalink to “CSS 变量”">​</a></h2><p><code>Grid</code> 在根元素上写入以下变量。它们是内部实现，但可以被主题或应用覆盖：</p><div class="component-api-table" role="region" aria-label="Grid CSS Variables" tabindex="0"><table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody><tr><td><code>--astryx-grid-template-columns</code></td><td>计算出的列模板。写在变量上而不是内联的 <code>grid-template-columns</code>，因此媒体查询里的覆盖仍然有效。</td></tr><tr><td><code>--astryx-grid-auto-rows</code></td><td><code>rowHeight</code> 转换出的隐式行高。</td></tr><tr><td><code>--astryx-grid-gap</code></td><td><code>gap</code> 对应的间距令牌，行、列共用。</td></tr><tr><td><code>--astryx-grid-row-gap</code></td><td><code>rowGap</code> 对应的间距令牌，覆盖 <code>--astryx-grid-gap</code>。</td></tr><tr><td><code>--astryx-grid-column-gap</code></td><td><code>columnGap</code> 对应的间距令牌，覆盖 <code>--astryx-grid-gap</code>。</td></tr><tr><td><code>--astryx-grid-default-gap</code></td><td>主题令牌，在没有传入任何间距属性时作为默认间距。Neutral 主题取 <code>--astryx-spacing-0</code>，也就是不留间距。</td></tr></tbody></table></div><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><p><code>Grid</code> 与 <code>GridSpan</code> 的根元素都是 <code>&lt;div&gt;</code>。</p><p>以下内容传入根元素：</p><ul><li>HTML 属性。</li><li><code>aria-*</code> 属性。</li><li><code>data-*</code> 属性。</li><li><code>class</code>。</li><li><code>style</code>。</li></ul><p><code>class</code> 会与组件自身的类名合并。<code>style</code> 与尺寸属性（<code>width</code>、<code>height</code>、<code>maxWidth</code>、<code>minHeight</code>）同时出现时，尺寸属性优先；<code>GridSpan</code> 的 <code>columns</code>、<code>rows</code> 同理。</p><p><code>Grid</code> 还额外写入 <code>data-columns</code>（仅在 <code>columns</code> 为数字时）、<code>data-gap</code>、<code>data-row-gap</code>、<code>data-column-gap</code>、<code>data-align</code>、<code>data-justify</code>，供主题按属性选择。</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/grid/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
