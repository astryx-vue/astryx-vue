import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/collapsible/props.md
var __pageData = JSON.parse("{\"title\":\"折叠面板\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"折叠面板\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/collapsible/props.md\",\"filePath\":\"zh/components/collapsible/props.md\"}");
var _sfc_main = { name: "components/collapsible/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Collapsible Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>trigger</code></td><td><code>string</code></td><td>-</td><td>触发器的纯文本标签。标签需要标题、图标或其他控件时改用 <code>trigger</code> 插槽，插槽会完全替换这个属性。</td></tr><tr><td><code>v-model:isOpen</code></td><td><code>boolean</code></td><td>-</td><td>受控的展开状态。绑定后组件完全跟随这个值，点击只发出更新请求；不绑定时组件自己管理状态。</td></tr><tr><td><code>defaultIsOpen</code></td><td><code>boolean</code></td><td><code>true</code></td><td>未绑定 <code>isOpen</code> 时，初始是否展开。</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用后触发器变暗、带 <code>aria-disabled</code> 并退出 Tab 顺序，点击不再切换状态，也不会收起已经展开的内容。</td></tr><tr><td><code>chevronPosition</code></td><td><code>CollapsibleChevronPosition</code></td><td><code>&#39;end&#39;</code></td><td>指示箭头的逻辑位置。end（默认）跟在标签后面，收起时朝下、展开时朝上；start 放在标签前面，收起时指向内容一侧（RTL 下镜像），展开时朝下。</td></tr></tbody></table></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><div class="component-api-table" role="region" aria-label="Collapsible Slots" tabindex="0"><table><thead><tr><th>名称</th><th>说明</th></tr></thead><tbody><tr><td><code>default</code></td><td>收起时隐藏、展开时显示的内容。</td></tr><tr><td><code>trigger</code></td><td>触发器的标签内容，可以放标题、图标或额外的控件，用来替换 <code>trigger</code> 属性。</td></tr></tbody></table></div><h2 id="事件与模板引用" tabindex="-1">事件与模板引用 <a class="header-anchor" href="#事件与模板引用" aria-label="Permalink to “事件与模板引用”">​</a></h2><div class="component-api-table" role="region" aria-label="Collapsible Events" tabindex="0"><table><thead><tr><th>名称</th><th>签名</th><th>说明</th></tr></thead><tbody><tr><td><code>openChange</code></td><td><code>(isOpen: boolean) =&gt; void</code></td><td>触发器请求切换状态时触发。非受控用法下是状态变化的通知，受控用法下是对父组件的更新请求。</td></tr><tr><td><code>update:isOpen</code></td><td><code>(isOpen: boolean) =&gt; void</code></td><td>由 <code>v-model:isOpen</code> 自动监听，一般不需要手动处理。</td></tr><tr><td><code>element</code></td><td><code>HTMLDivElement | null</code></td><td>根元素，通过模板引用暴露。</td></tr></tbody></table></div><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-collapsible</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-collapsible-trigger-foreground</span><span style="${ssrRenderStyle({
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
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-collapsible-content-foreground</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#525252</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-collapsible-trigger-foreground</code>：触发器文字颜色。</li><li><code>--astryx-collapsible-content-foreground</code>：内容文字颜色。</li><li><code>--astryx-collapsible-pressed-overlay</code>：按住触发器时叠加的背景，仅在按下期间出现。</li><li><code>--astryx-collapsible-focus</code>：键盘聚焦时的轮廓颜色。</li><li><code>--astryx-spacing-1</code>、<code>--astryx-text-large-size</code>、<code>--astryx-text-body-size</code>：内边距与两处文字尺寸沿用全局 token。</li></ul><p>Neutral 主题自动适配明暗模式。</p><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><p>根元素为 <code>&lt;div&gt;</code>。</p><p>以下内容传入根元素：</p><ul><li>HTML 属性。</li><li><code>aria-*</code> 属性。</li><li><code>data-*</code> 属性。</li><li><code>class</code>。</li><li><code>style</code>。</li></ul><p>触发器是根元素内部的 <code>&lt;button type=&quot;button&quot;&gt;</code>，它的 <code>aria-expanded</code>、<code>aria-controls</code>、<code>aria-disabled</code> 与 <code>tabindex</code> 由组件维护。禁用时不会使用原生 <code>disabled</code>，以便触发器继续被辅助技术感知。</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/collapsible/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
