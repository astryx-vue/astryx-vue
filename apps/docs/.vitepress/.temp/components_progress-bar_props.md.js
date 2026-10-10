import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/progress-bar/props.md
var __pageData = JSON.parse("{\"title\":\"进度条\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"进度条\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/progress-bar/props.md\",\"filePath\":\"zh/components/progress-bar/props.md\"}");
var _sfc_main = { name: "components/progress-bar/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to “属性”">​</a></h2><div class="component-api-table" role="region" aria-label="ProgressBar 属性" tabindex="0"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>value</code></td><td><code>number</code></td><td>—</td><td>必需。当前值。</td></tr><tr><td><code>min</code></td><td><code>number</code></td><td><code>0</code></td><td>最小值。</td></tr><tr><td><code>max</code></td><td><code>number</code></td><td><code>100</code></td><td>最大值。</td></tr><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39; | &#39;lg&#39;</code></td><td><code>&#39;md&#39;</code></td><td>轨道高度。</td></tr><tr><td><code>variant</code></td><td><code>&#39;neutral&#39; | &#39;success&#39; | &#39;warning&#39; | &#39;error&#39; | &#39;info&#39;</code></td><td><code>&#39;neutral&#39;</code></td><td>填充条颜色。</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>进度条标签。同时作为无障碍名称。</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>补充说明。</td></tr><tr><td><code>isIndeterminate</code></td><td><code>boolean</code></td><td><code>false</code></td><td>不确定状态。显示循环动画并移除 aria-valuenow。</td></tr><tr><td><code>showValue</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在标签旁显示百分比。</td></tr><tr><td><code>valueText</code></td><td><code>string</code></td><td>—</td><td>自定义 aria-valuetext 与显示文本。优先于默认百分比。</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>组件宽度。数字按 px 处理。</td></tr></tbody></table></div><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-progress-bar</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-progress-bar-track-background</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#e5e5e5</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-progress-bar-fill-background</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#171717</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-progress-bar-track-background</code>：轨道背景。</li><li><code>--astryx-progress-bar-fill-background</code>：默认填充颜色。</li><li><code>--astryx-progress-bar-track-height</code>：默认轨道高度。</li><li><code>--astryx-progress-bar-track-height-sm</code>：sm 轨道高度。</li><li><code>--astryx-progress-bar-track-height-lg</code>：lg 轨道高度。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/progress-bar/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
