import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/banner/props.md
var __pageData = JSON.parse("{\"title\":\"提示条\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"提示条\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/banner/props.md\",\"filePath\":\"zh/components/banner/props.md\"}");
var _sfc_main = { name: "components/banner/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to “属性”">​</a></h2><div class="component-api-table" role="region" aria-label="属性列表" tabindex="0"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>status</code></td><td><code>&#39;info&#39; | &#39;success&#39; | &#39;warning&#39; | &#39;error&#39;</code></td><td>—</td><td>必需。消息状态。</td></tr><tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>必需。消息标题。</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标题下方的说明。</td></tr><tr><td><code>icon</code></td><td><code>Component</code></td><td>—</td><td>自定义装饰图标。</td></tr><tr><td><code>isDismissable</code></td><td><code>boolean</code></td><td>false</td><td>显示关闭按钮。关闭后组件自行隐藏。</td></tr><tr><td><code>dismissLabel</code></td><td><code>string</code></td><td>Dismiss {title}</td><td>关闭按钮的无障碍名称。</td></tr><tr><td><code>container</code></td><td><code>&#39;card&#39; | &#39;section&#39;</code></td><td>card</td><td>card 使用圆角。section 使用直角。</td></tr><tr><td><code>elevation</code></td><td><code>&#39;none&#39; | &#39;low&#39; | &#39;med&#39; | &#39;high&#39;</code></td><td>none</td><td>整体阴影层级。</td></tr><tr><td><code>collapsible</code></td><td><code>boolean</code></td><td>true</td><td>默认插槽内容是否可折叠。</td></tr><tr><td><code>defaultIsOpen</code></td><td><code>boolean</code></td><td>false</td><td>未绑定 isOpen 时的初始展开状态。</td></tr><tr><td><code>v-model:isOpen</code></td><td><code>boolean</code></td><td>—</td><td>由父组件控制展开状态。</td></tr><tr><td><code>expandLabel</code></td><td><code>string</code></td><td>Expand details</td><td>展开按钮的无障碍名称。</td></tr><tr><td><code>collapseLabel</code></td><td><code>string</code></td><td>Collapse details</td><td>收起按钮的无障碍名称。</td></tr></tbody></table></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><ul><li>默认插槽：标题区域下方的详情。</li><li><code>title</code>：替换标题的视觉内容。仍需提供 <code>title</code> 属性。</li><li><code>description</code>：替换说明文本。</li><li><code>icon</code>：替换状态图标。图标仅作装饰。</li><li><code>end</code>：标题区域末尾的操作按钮。</li></ul><p>标题、说明和详情插槽可包含块级内容。</p><h2 id="展开与收起" tabindex="-1">展开与收起 <a class="header-anchor" href="#展开与收起" aria-label="Permalink to “展开与收起”">​</a></h2><ul><li>默认插槽有内容时，组件显示展开按钮。</li><li>默认从收起状态开始。</li><li><code>defaultIsOpen</code> 只设置初始状态。</li><li><code>v-model:isOpen</code> 控制当前状态。</li><li><code>collapsible</code> 为 <code>false</code> 时，详情始终显示。</li><li>收起时，详情内容卸载。</li><li>父组件收起详情时，若焦点在详情内，焦点返回展开按钮。</li></ul><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">&lt;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#11782a",
		"--shiki-dark": "#85E89D"
	})}">Banner</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> v-model</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">is-open</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">=</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">open</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> status</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">=</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;info&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> title</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">=</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;Configuration changes&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">  &lt;p&gt;Review the updated settings before continuing.&lt;/p&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">&lt;/</span><span style="${ssrRenderStyle({
		"--shiki-light": "#11782a",
		"--shiki-dark": "#85E89D"
	})}">Banner</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">&gt;</span></span></code></pre></div><h2 id="关闭" tabindex="-1">关闭 <a class="header-anchor" href="#关闭" aria-label="Permalink to “关闭”">​</a></h2><ul><li><code>isDismissable</code> 显示关闭按钮。</li><li>点击关闭后，组件自行隐藏。</li><li>组件触发 <code>dismiss</code> 事件。</li><li>关闭时，组件尝试将焦点返回进入提示前的元素。</li><li>需要再次显示时，重新挂载组件或改变 <code>key</code>。</li></ul><h2 id="事件与模板引用" tabindex="-1">事件与模板引用 <a class="header-anchor" href="#事件与模板引用" aria-label="Permalink to “事件与模板引用”">​</a></h2><ul><li><code>update:isOpen(value)</code>：请求更新展开状态。</li><li><code>dismiss()</code>：关闭提示。</li><li><code>element</code>：根元素的 <code>HTMLDivElement | null</code>。关闭后为 <code>null</code>。</li></ul><h2 id="本地化" tabindex="-1">本地化 <a class="header-anchor" href="#本地化" aria-label="Permalink to “本地化”">​</a></h2><p>中文界面可设置以下文本：</p><ul><li><code>dismissLabel=&quot;关闭提示&quot;</code>。</li><li><code>expandLabel=&quot;展开详情&quot;</code>。</li><li><code>collapseLabel=&quot;收起详情&quot;</code>。</li></ul><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-banner</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-banner-info-background</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#ecfdf5</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-banner-info-foreground</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#065f46</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-banner-info-background</code>：信息背景。</li><li><code>--astryx-banner-info-foreground</code>：信息文字和图标。</li><li><code>--astryx-banner-success-background</code>：成功背景。</li><li><code>--astryx-banner-success-foreground</code>：成功文字和图标。</li><li><code>--astryx-banner-warning-background</code>：警告背景。</li><li><code>--astryx-banner-warning-foreground</code>：警告文字和图标。</li><li><code>--astryx-banner-error-background</code>：错误背景。</li><li><code>--astryx-banner-error-foreground</code>：错误文字和图标。</li><li><code>--astryx-banner-content-background</code>：详情区域背景。</li><li><code>--astryx-banner-border</code>：详情区域边框。</li><li><code>--astryx-radius-container</code>：card 容器圆角。</li></ul><p>Neutral 自动适配明暗模式。</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/banner/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
