import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/stack/props.md
var __pageData = JSON.parse("{\"title\":\"堆叠布局\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"堆叠布局\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/stack/props.md\",\"filePath\":\"zh/components/stack/props.md\"}");
var _sfc_main = { name: "components/stack/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="stack-props" tabindex="-1">Stack Props <a class="header-anchor" href="#stack-props" aria-label="Permalink to “Stack Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Stack Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>direction</code></td><td><code>&#39;horizontal&#39; | &#39;vertical&#39;</code></td><td><code>&#39;vertical&#39;</code></td><td>内容排列方向。</td></tr><tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td>—</td><td>相邻子元素的间距。</td></tr><tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>容器全部方向的内边距。</td></tr><tr><td><code>paddingInline</code></td><td><code>SpacingStep</code></td><td>—</td><td>行内轴内边距。覆盖对应的 padding。</td></tr><tr><td><code>paddingBlock</code></td><td><code>SpacingStep</code></td><td>—</td><td>块轴内边距。覆盖对应的 padding。</td></tr><tr><td><code>hAlign</code></td><td><code>StackAlignment</code></td><td>—</td><td>根据方向控制水平主轴或交叉轴对齐。</td></tr><tr><td><code>vAlign</code></td><td><code>StackAlignment</code></td><td>—</td><td>根据方向控制垂直主轴或交叉轴对齐。</td></tr><tr><td><code>justify</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>主轴对齐别名。</td></tr><tr><td><code>align</code></td><td><code>StackCrossAlignment</code></td><td>—</td><td>交叉轴对齐别名。</td></tr><tr><td><code>wrap</code></td><td><code>&#39;nowrap&#39; | &#39;wrap&#39; | &#39;wrap-reverse&#39;</code></td><td><code>&#39;nowrap&#39;</code></td><td>子元素换行方式。</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>容器宽度。数字按像素处理。</td></tr><tr><td><code>height</code></td><td><code>number | string</code></td><td>—</td><td>容器高度。数字按像素处理。</td></tr><tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>—</td><td>容器最大宽度。</td></tr><tr><td><code>minHeight</code></td><td><code>number | string</code></td><td>—</td><td>容器最小高度。</td></tr><tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>启用自动溢出滚动。</td></tr><tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>&#39;div&#39;</code></td><td>根元素或 Vue 组件。</td></tr></tbody></table></div><p><code>SpacingStep</code> 支持以下值：</p><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}"> 10</span></span></code></pre></div><h2 id="hstack-props" tabindex="-1">HStack Props <a class="header-anchor" href="#hstack-props" aria-label="Permalink to “HStack Props”">​</a></h2><p><code>HStack</code> 固定使用水平方向。</p><ul><li>组件支持 <code>Stack</code> 的通用属性。</li><li>组件不提供 <code>direction</code> 属性。</li><li>对齐规则见下表。</li></ul><div class="component-api-table" role="region" aria-label="HStack 对齐 Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>hAlign</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>水平主轴对齐方式。</td></tr><tr><td><code>vAlign</code></td><td><code>StackCrossAlignment</code></td><td><code>&#39;stretch&#39;</code></td><td>垂直交叉轴对齐方式。</td></tr></tbody></table></div><h2 id="vstack-props" tabindex="-1">VStack Props <a class="header-anchor" href="#vstack-props" aria-label="Permalink to “VStack Props”">​</a></h2><p><code>VStack</code> 固定使用垂直方向。</p><ul><li>组件支持 <code>Stack</code> 的通用属性。</li><li>组件不提供 <code>direction</code> 属性。</li><li>对齐规则见下表。</li></ul><div class="component-api-table" role="region" aria-label="VStack 对齐 Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>hAlign</code></td><td><code>StackCrossAlignment</code></td><td><code>&#39;stretch&#39;</code></td><td>水平交叉轴对齐方式。</td></tr><tr><td><code>vAlign</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>垂直主轴对齐方式。</td></tr></tbody></table></div><h2 id="stackitem-props" tabindex="-1">StackItem Props <a class="header-anchor" href="#stackitem-props" aria-label="Permalink to “StackItem Props”">​</a></h2><div class="component-api-table" role="region" aria-label="StackItem Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>size</code></td><td><code>&#39;static&#39; | &#39;fill&#39;</code></td><td><code>&#39;static&#39;</code></td><td>保持固有尺寸或填充剩余空间。</td></tr><tr><td><code>crossAlignSelf</code></td><td><code>&#39;start&#39; | &#39;center&#39; | &#39;end&#39; | &#39;stretch&#39;</code></td><td>—</td><td>覆盖当前项目的交叉轴对齐。</td></tr><tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>启用自动溢出滚动。</td></tr><tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>&#39;div&#39;</code></td><td>根元素或 Vue 组件。</td></tr></tbody></table></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><p>Stack、HStack、VStack 和 StackItem 均通过默认插槽接收内容。</p><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><p>以下内容传入根元素：</p><ul><li>HTML 属性。</li><li><code>aria-*</code> 属性。</li><li><code>data-*</code> 属性。</li><li><code>class</code>。</li><li><code>style</code>。</li><li>原生事件监听器。</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/stack/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
