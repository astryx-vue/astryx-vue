import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/dialog/props.md
var __pageData = JSON.parse("{\"title\":\"对话框\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"对话框\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/dialog/props.md\",\"filePath\":\"zh/components/dialog/props.md\"}");
var _sfc_main = { name: "components/dialog/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to “属性”">​</a></h2><div class="component-api-table" role="region" aria-label="Dialog 属性" tabindex="0"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>对话框是否打开。该属性必填。</td></tr><tr><td><code>isInline</code></td><td><code>boolean</code></td><td><code>false</code></td><td>以普通文档流渲染内容，不使用 <code>&lt;dialog&gt;</code>、遮罩与模态行为，仅用于文档预览。</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td><code>400</code></td><td>首选宽度，数字单位为像素，字符串原样使用。窄屏时夹取到视口内，全屏变体忽略此项。</td></tr><tr><td><code>maxHeight</code></td><td><code>number | string</code></td><td><code>&#39;75vh&#39;</code></td><td>最大高度，数字单位为像素，字符串原样使用。全屏变体忽略此项。</td></tr><tr><td><code>position</code></td><td><code>DialogPosition</code></td><td>居中</td><td>对话框的静态偏移，支持 <code>top</code>、<code>bottom</code>、<code>start</code>、<code>end</code>，未设置时居中。逻辑属性 <code>start</code> 与 <code>end</code> 在 RTL 下自动镜像，全屏变体忽略此项。</td></tr><tr><td><code>variant</code></td><td><code>&#39;standard&#39; | &#39;fullscreen&#39;</code></td><td><code>&#39;standard&#39;</code></td><td>对话框变体：standard 为标准对话框，fullscreen 占满整个视口。</td></tr><tr><td><code>purpose</code></td><td><code>&#39;required&#39; | &#39;form&#39; | &#39;info&#39;</code></td><td><code>&#39;info&#39;</code></td><td>允许的关闭方式：<code>required</code> 禁用 Escape 与点击遮罩，必须由用户响应；<code>form</code> 仅允许 Escape；<code>info</code> 两者都允许。</td></tr><tr><td><code>padding</code></td><td><code>0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10</code></td><td>主题默认值（16px）</td><td>对话框内边距，取值对应 <code>--astryx-spacing-*</code> 令牌。</td></tr></tbody></table></div><h2 id="事件" tabindex="-1">事件 <a class="header-anchor" href="#事件" aria-label="Permalink to “事件”">​</a></h2><ul><li><code>openChange(isOpen: boolean)</code>：用户通过 Escape 或点击遮罩请求关闭时以 <code>false</code> 触发，是否触发取决于 <code>purpose</code>。父组件通过设置 <code>isOpen</code> 来关闭。</li></ul><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><ul><li><code>default</code>：对话框内容。通常为 <code>DialogHeader</code>，之后是正文与操作区。</li></ul><h2 id="dialogheader-属性" tabindex="-1">DialogHeader 属性 <a class="header-anchor" href="#dialogheader-属性" aria-label="Permalink to “DialogHeader 属性”">​</a></h2><div class="component-api-table" role="region" aria-label="DialogHeader 属性" tabindex="0"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>对话框标题。打开时获得默认焦点，并为对话框命名。必填。</td></tr><tr><td><code>subtitle</code></td><td><code>string</code></td><td>—</td><td>标题下方的次要文字。为空时不渲染。</td></tr><tr><td><code>hasCloseButton</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示关闭按钮，点击时发出 <code>openChange(false)</code>。</td></tr><tr><td><code>closeButtonLabel</code></td><td><code>string</code></td><td><code>&#39;Close&#39;</code></td><td>关闭按钮的无障碍名称。</td></tr></tbody></table></div><h2 id="dialogheader-事件与插槽" tabindex="-1">DialogHeader 事件与插槽 <a class="header-anchor" href="#dialogheader-事件与插槽" aria-label="Permalink to “DialogHeader 事件与插槽”">​</a></h2><ul><li><code>openChange(isOpen: boolean)</code>：点击关闭按钮时以 <code>false</code> 触发。</li><li><code>startContent</code>：标题之前的内容，例如返回按钮。</li><li><code>endContent</code>：标题之后、关闭按钮之前的内容。</li></ul><h2 id="useimperativedialog" tabindex="-1">useImperativeDialog <a class="header-anchor" href="#useimperativedialog" aria-label="Permalink to “useImperativeDialog”">​</a></h2><ul><li><code>show(content, options?)</code>：以给定内容打开对话框。选项与传给 Hook 的默认选项合并。</li><li><code>hide()</code>：关闭对话框。</li><li><code>isOpen</code>：只读的打开状态。</li><li><code>Host</code>：在模板中渲染一次的组件。</li></ul><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-dialog-background</code>：表面颜色。</li><li><code>--astryx-dialog-foreground</code>：文字颜色。</li><li><code>--astryx-dialog-overlay</code>：遮罩颜色。</li><li><code>--astryx-dialog-shadow</code>：表面阴影。</li><li><code>--astryx-dialog-padding</code>：未设置 <code>padding</code> 属性时的默认内边距。</li><li><code>--astryx-dialog-title-color</code>：标题颜色。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/dialog/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
