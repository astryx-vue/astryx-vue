import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/hover-card/props.md
var __pageData = JSON.parse("{\"title\":\"悬浮卡片\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"悬浮卡片\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/hover-card/props.md\",\"filePath\":\"zh/components/hover-card/props.md\"}");
var _sfc_main = { name: "components/hover-card/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to “属性”">​</a></h2><div class="component-api-table" role="region" aria-label="HoverCard 属性" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>content</code></td><td><code>string</code></td><td><code>&#39;&#39;</code></td><td>卡片的纯文本内容。需要富内容时改用 <code>content</code> 插槽。</td></tr><tr><td><code>placement</code></td><td><code>&#39;above&#39; | &#39;below&#39; | &#39;start&#39; | &#39;end&#39;</code></td><td><code>&#39;above&#39;</code></td><td>卡片相对触发元素的方向。所选方向空间不足时自动翻转到相反方向。</td></tr><tr><td><code>alignment</code></td><td><code>&#39;start&#39; | &#39;center&#39; | &#39;end&#39;</code></td><td><code>&#39;center&#39;</code></td><td>卡片沿位置方向的对齐方式。</td></tr><tr><td><code>delay</code></td><td><code>number</code></td><td><code>300</code></td><td>悬停后显示前的等待时间（毫秒）。</td></tr><tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>200</code></td><td>指针或焦点离开后隐藏前的等待时间（毫秒）。指针在这段时间内移入卡片会取消隐藏。</td></tr><tr><td><code>focusTrigger</code></td><td><code>&#39;auto&#39; | &#39;always&#39; | &#39;never&#39;</code></td><td><code>&#39;auto&#39;</code></td><td>聚焦时是否打开卡片：auto 仅在触发元素本身可聚焦时监听，always 始终监听，never 从不监听。</td></tr><tr><td><code>touchTrigger</code></td><td><code>&#39;auto&#39; | &#39;tap&#39; | &#39;none&#39;</code></td><td><code>&#39;auto&#39;</code></td><td>触摸设备上轻点触发元素的行为：auto 时本身不执行操作的触发元素轻点即打开，按钮和链接保留自己的轻点；tap 总是打开；none 不打开。轻点打开的卡片在卡片外轻点即关闭。</td></tr><tr><td><code>isEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否启用悬停与聚焦触发。为 false 时已打开的卡片也会关闭。</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>卡片弹出层的无障碍名称。提供时卡片以具名的 <code>role=&quot;dialog&quot;</code> 暴露，省略时为 <code>role=&quot;group&quot;</code>。</td></tr><tr><td><code>hasHoverIndication</code></td><td><code>&#39;auto&#39; | boolean</code></td><td><code>&#39;auto&#39;</code></td><td>是否在触发元素上显示虚线底划线。auto 时仅对纯文字触发元素生效。</td></tr><tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>受控显示状态。设置后悬停与聚焦不再触发卡片。</td></tr><tr><td><code>isDefaultOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否在挂载时就显示卡片。仅在未设置 isOpen 时生效。</td></tr></tbody></table></div><h2 id="事件" tabindex="-1">事件 <a class="header-anchor" href="#事件" aria-label="Permalink to “事件”">​</a></h2><ul><li><code>openChange(isOpen: boolean)</code>：卡片显示或隐藏时触发。受控模式下按 Escape 会发出 <code>false</code>，由父组件决定是否关闭。</li></ul><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><div class="component-api-table" role="region" aria-label="HoverCard 插槽" tabindex="0"><table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody><tr><td><code>default</code></td><td>触发元素。纯文字内容会获得虚线下划线并变为可聚焦；元素内容作为触发元素接收事件与 ARIA 属性。</td></tr><tr><td><code>content</code></td><td>卡片内容，支持任意富内容。提供时替代 <code>content</code> 属性。</td></tr></tbody></table></div><h2 id="方法" tabindex="-1">方法 <a class="header-anchor" href="#方法" aria-label="Permalink to “方法”">​</a></h2><ul><li><code>show()</code>：立即显示卡片，跳过悬停延迟。</li><li><code>hide()</code>：立即隐藏卡片。</li><li><code>element</code>：卡片浮层元素，或尚未挂载时的 <code>null</code>。</li></ul><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><p>组件渲染为片段：触发元素包裹层 <code>&lt;span class=&quot;astryx-hover-card__trigger&quot;&gt;</code>，加上一个传送到 <code>body</code> 的浮层。传入的属性会落到包裹层上，浮层不接收属性。</p><ul><li>HTML 属性、<code>aria-*</code> 属性、<code>data-*</code> 属性、<code>class</code>、<code>style</code> 都会落到包裹层。</li><li>包裹层在元素作为触发元素时是 <code>display: contents</code> 的透明盒子，在纯文字触发元素时是 <code>display: inline</code> 的触发元素本身。因此布局相关的属性请直接写在触发元素上，纯文字触发元素则可以直接写在组件上。</li><li>组件自己管理的 <code>aria-haspopup</code>、<code>aria-controls</code>、<code>aria-expanded</code>、<code>aria-describedby</code> 写在真正的触发元素上，并在卸载时恢复原值。</li></ul><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-hover-card</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-hover-card-background</span><span style="${ssrRenderStyle({
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
	})}">  --astryx-hover-card-foreground</span><span style="${ssrRenderStyle({
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
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-hover-card-background</code>：卡片背景色。</li><li><code>--astryx-hover-card-foreground</code>：卡片文字颜色。</li><li><code>--astryx-hover-card-shadow</code>：卡片阴影。</li><li><code>--astryx-hover-card-radius</code>：卡片圆角，默认继承 <code>--astryx-radius-container</code>。</li><li><code>--astryx-hover-card-indication-color</code>：虚线下划线颜色。</li><li><code>--astryx-hover-card-z-index</code>：卡片的层叠顺序。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/hover-card/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
