import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/toast/props.md
var __pageData = JSON.parse("{\"title\":\"轻提示\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"轻提示\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/toast/props.md\",\"filePath\":\"zh/components/toast/props.md\"}");
var _sfc_main = { name: "components/toast/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="toast-props" tabindex="-1">Toast Props <a class="header-anchor" href="#toast-props" aria-label="Permalink to “Toast Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Toast Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>type</code></td><td><code>ToastType</code></td><td><code>&#39;info&#39;</code></td><td>提示的类型，可选 info、success、warning、error；error 类型会自动应用 <code>role=&quot;alert&quot;</code>。</td></tr><tr><td><code>body</code></td><td><code>string</code></td><td>-</td><td>提示的正文文本，默认渲染在提示内容区。</td></tr><tr><td><code>autoClose</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否在 <code>duration</code> 之后自动关闭。</td></tr><tr><td><code>duration</code></td><td><code>number</code></td><td><code>5000</code></td><td>自动关闭前的停留时长，单位毫秒。</td></tr></tbody></table></div><h2 id="toast-事件" tabindex="-1">Toast 事件 <a class="header-anchor" href="#toast-事件" aria-label="Permalink to “Toast 事件”">​</a></h2><div class="component-api-table" role="region" aria-label="Toast 事件" tabindex="0"><table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody><tr><td><code>close</code></td><td>提示关闭时触发，无论是自动关闭还是手动关闭。</td></tr></tbody></table></div><h2 id="toast-slots" tabindex="-1">Toast Slots <a class="header-anchor" href="#toast-slots" aria-label="Permalink to “Toast Slots”">​</a></h2><div class="component-api-table" role="region" aria-label="Toast Slots" tabindex="0"><table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody><tr><td><code>default</code></td><td>自定义提示的内容区域，未提供时默认显示 <code>body</code> 文本。</td></tr></tbody></table></div><h2 id="toastviewport-props" tabindex="-1">ToastViewport Props <a class="header-anchor" href="#toastviewport-props" aria-label="Permalink to “ToastViewport Props”">​</a></h2><div class="component-api-table" role="region" aria-label="ToastViewport Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>placement</code></td><td><code>ToastPlacement</code></td><td><code>&#39;bottom-center&#39;</code></td><td>提示在屏幕上的弹出位置，可选 top-start、top-center、top-end、bottom-start、bottom-center、bottom-end。</td></tr></tbody></table></div><h2 id="usetoast" tabindex="-1">useToast <a class="header-anchor" href="#usetoast" aria-label="Permalink to “useToast”">​</a></h2><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">const</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> toast</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> =</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> useToast</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">()</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">const</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> dismiss</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> =</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> toast</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">({ body: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&#39;Hello&#39;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">, type: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&#39;info&#39;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">, duration: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">3000</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> })</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#62687b",
		"--shiki-dark": "#818e99"
	})}">// 手动关闭</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">dismiss</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">()</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#62687b",
		"--shiki-dark": "#818e99"
	})}">// 关闭全部</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">toast.</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">clear</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">()</span></span></code></pre></div></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/toast/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
