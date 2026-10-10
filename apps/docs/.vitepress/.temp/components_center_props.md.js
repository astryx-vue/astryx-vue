import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/center/props.md
var __pageData = JSON.parse("{\"title\":\"居中容器\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"居中容器\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/center/props.md\",\"filePath\":\"zh/components/center/props.md\"}");
var _sfc_main = { name: "components/center/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Center Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>axis</code></td><td><code>&#39;both&#39; | &#39;horizontal&#39; | &#39;vertical&#39;</code></td><td><code>&#39;both&#39;</code></td><td>居中哪条轴。both 同时居中主轴与交叉轴，horizontal 只居中行内方向，vertical 只居中块方向。单轴取值落在 flex 的对齐属性上，纵向书写时跟随的是 flex 主轴与交叉轴。</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>容器宽度。数字按像素处理，字符串按原样作为 CSS 值使用。</td></tr><tr><td><code>height</code></td><td><code>number | string</code></td><td>—</td><td>容器高度。数字按像素处理。垂直居中需要有可分配的高度，所以默认的 both 和 vertical 通常会用到它。</td></tr><tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>—</td><td>容器最大宽度。数字按像素处理。</td></tr><tr><td><code>minHeight</code></td><td><code>number | string</code></td><td>—</td><td>容器最小高度。数字按像素处理。</td></tr><tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>四边的内边距，使用 Astryx 间距刻度。</td></tr><tr><td><code>paddingInline</code></td><td><code>SpacingStep</code></td><td>—</td><td>行内轴内边距，覆盖该轴上的 padding。</td></tr><tr><td><code>paddingInlineStart</code></td><td><code>SpacingStep</code></td><td>—</td><td>行内起始边内边距，只覆盖这一条边，优先级高于 paddingInline 与 padding。物理边取决于书写模式和方向。</td></tr><tr><td><code>paddingInlineEnd</code></td><td><code>SpacingStep</code></td><td>—</td><td>行内结束边内边距，只覆盖这一条边，优先级高于 paddingInline 与 padding。物理边取决于书写模式和方向。</td></tr><tr><td><code>paddingBlock</code></td><td><code>SpacingStep</code></td><td>—</td><td>块轴内边距，覆盖该轴上的 padding。</td></tr><tr><td><code>paddingBlockStart</code></td><td><code>SpacingStep</code></td><td>—</td><td>块起始边内边距，只覆盖这一条边，优先级高于 paddingBlock 与 padding。物理边取决于书写模式。</td></tr><tr><td><code>paddingBlockEnd</code></td><td><code>SpacingStep</code></td><td>—</td><td>块结束边内边距，只覆盖这一条边，优先级高于 paddingBlock 与 padding。物理边取决于书写模式。</td></tr><tr><td><code>isInline</code></td><td><code>boolean</code></td><td><code>false</code></td><td>使用 inline-flex 渲染，容器因此留在文字行内，适合居中图标或角标这类小元素。</td></tr></tbody></table></div><p><code>SpacingStep</code> 支持以下值：</p><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}"> 10</span></span></code></pre></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><div class="component-api-table" role="region" aria-label="Center Slots" tabindex="0"><table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody><tr><td><code>default</code></td><td>要居中的内容。内容被当作一个整体居中，Center 不会在多个子元素之间分配间距，也不会改变它们各自的语义、颜色或阅读顺序。</td></tr></tbody></table></div><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><p>根元素为 <code>&lt;div&gt;</code>。</p><p>以下内容传入根元素：</p><ul><li>HTML 属性。</li><li><code>aria-*</code> 属性。</li><li><code>data-*</code> 属性。</li><li><code>class</code>。</li><li><code>style</code>。</li><li>原生事件监听器。</li></ul><p><code>Center</code> 会在根元素上写自己的 <code>data-axis</code>，用来反映当前生效的居中轴；消费者传入的同名 <code>data-axis</code> 不会覆盖它。</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/center/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
