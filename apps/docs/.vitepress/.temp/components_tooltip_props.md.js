import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/tooltip/props.md
var __pageData = JSON.parse("{\"title\":\"提示框\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"提示框\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/tooltip/props.md\",\"filePath\":\"zh/components/tooltip/props.md\"}");
var _sfc_main = { name: "components/tooltip/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to “属性”">​</a></h2><div class="component-api-table" role="region" aria-label="Tooltip 属性" tabindex="0"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>content</code></td><td><code>string</code></td><td>—</td><td>提示文字。需要展示富文本时，改用 <code>content</code> 插槽。</td></tr><tr><td><code>placement</code></td><td><code>&#39;above&#39; | &#39;below&#39; | &#39;start&#39; | &#39;end&#39;</code></td><td><code>&#39;above&#39;</code></td><td>提示相对触发元素的方向。所选方向空间不足时会自动翻转。</td></tr><tr><td><code>alignment</code></td><td><code>&#39;start&#39; | &#39;center&#39; | &#39;end&#39;</code></td><td><code>&#39;center&#39;</code></td><td>气泡沿位置方向的对齐方式：靠起始端、居中或靠末端。</td></tr><tr><td><code>delay</code></td><td><code>number</code></td><td><code>200</code></td><td>悬停或聚焦后，提示显示前的等待时间（毫秒）。</td></tr><tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>0</code></td><td>鼠标或焦点离开后，提示隐藏前的等待时间（毫秒）。为 0 时使用 100 毫秒，给鼠标移入气泡留出时间。</td></tr><tr><td><code>focusTrigger</code></td><td><code>&#39;auto&#39; | &#39;always&#39; | &#39;never&#39;</code></td><td><code>&#39;auto&#39;</code></td><td>聚焦时是否显示提示：auto 仅在触发元素本身可聚焦时监听，always 始终监听，never 从不监听。</td></tr><tr><td><code>touchTrigger</code></td><td><code>&#39;auto&#39; | &#39;tap&#39; | &#39;none&#39;</code></td><td><code>&#39;auto&#39;</code></td><td>触摸设备上点击触发元素时的行为：auto 时点击切换提示，但按钮、链接和表单控件自身的点击不触发；tap 总是切换；none 不打开。</td></tr><tr><td><code>isEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否启用提示。为 false 时禁用悬停与聚焦触发。</td></tr><tr><td><code>hasHoverIndication</code></td><td><code>&#39;auto&#39; | boolean</code></td><td><code>&#39;auto&#39;</code></td><td>是否在纯文字触发元素上显示虚线下划线。auto 时仅对纯文字触发元素生效。</td></tr><tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>受控显示状态。设置后悬停与聚焦不再触发提示。</td></tr><tr><td><code>isDefaultOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否在挂载时就显示提示。仅在未设置 isOpen 时生效。</td></tr></tbody></table></div><h2 id="事件" tabindex="-1">事件 <a class="header-anchor" href="#事件" aria-label="Permalink to “事件”">​</a></h2><ul><li><code>openChange(isOpen: boolean)</code>：提示显示或隐藏时触发。受控模式下，按 Escape 会发出 <code>false</code>，由父组件决定是否关闭。</li></ul><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><ul><li><code>default</code>：触发元素。</li><li><code>content</code>：富文本提示内容。会替代 <code>content</code> 属性的文字。</li></ul><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-tooltip-background</code>：气泡背景色。</li><li><code>--astryx-tooltip-foreground</code>：气泡文字颜色。</li><li><code>--astryx-tooltip-indication-color</code>：虚线下划线颜色。</li><li><code>--astryx-tooltip-z-index</code>：气泡的层叠顺序。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/tooltip/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
