import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/divider/props.md
var __pageData = JSON.parse("{\"title\":\"分隔线\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"分隔线\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/divider/props.md\",\"filePath\":\"zh/components/divider/props.md\"}");
var _sfc_main = { name: "components/divider/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to “属性”">​</a></h2><div class="component-api-table" role="region" aria-label="Divider 属性" tabindex="0"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>orientation</code></td><td><code>&#39;horizontal&#39; | &#39;vertical&#39;</code></td><td><code>&#39;horizontal&#39;</code></td><td>分隔线的方向，垂直分隔线适合放在固定高度的行内。</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>显示在分隔线中间的文字，同时作为分隔线的无障碍名称。</td></tr><tr><td><code>variant</code></td><td><code>&#39;subtle&#39; | &#39;strong&#39;</code></td><td><code>&#39;subtle&#39;</code></td><td>线条的视觉强弱，strong 使用强调边框色，适合需要明显边界的场景。</td></tr><tr><td><code>isFullBleed</code></td><td><code>boolean</code></td><td><code>false</code></td><td>为 true 时，分隔线会越过容器内边距，延伸到容器边缘。</td></tr></tbody></table></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><ul><li><code>label</code>：分隔线中间的富文本内容，会替代 <code>label</code> 属性的纯文字。</li></ul><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-divider</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-divider-color-subtle</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#00000014</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-divider-color-subtle</code>：<code>subtle</code> 线条颜色。</li><li><code>--astryx-divider-color-strong</code>：<code>strong</code> 线条颜色。</li><li><code>--astryx-divider-label-color</code>：文字颜色。</li><li><code>--astryx-border-width</code>：线条粗细。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/divider/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
