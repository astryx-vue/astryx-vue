import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { i as stackVStack, n as stackHStack, r as stackItem, t as stackDirections } from "./stack.DcO91TxY.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/stack/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"堆叠布局\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"堆叠布局\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/stack.md\",\"filePath\":\"zh/components/stack/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "components/stack.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="使用方法" tabindex="-1">使用方法 <a class="header-anchor" href="#使用方法" aria-label="Permalink to “使用方法”">​</a></h2><p><code>Stack</code> 系列组件用一套间距令牌管理一维布局：<code>Stack</code> 通过 <code>direction</code> 切换排列方向，<code>HStack</code>、<code>VStack</code> 分别固定水平与垂直方向，<code>StackItem</code> 负责子项的尺寸分配。需要沿同一方向排列多个元素、并保持间距一致时使用它们。</p><p>在应用入口引入主题：</p><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">import</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/themes/neutral.css&#39;</span></span></code></pre></div><p>组件按需要从独立入口导入，结构样式会随组件自动加载：</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}">script</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> setup</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> lang</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;ts&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">import</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> { HStack, Stack, StackItem, VStack } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Stack&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">script</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span></code></pre></div><h2 id="最佳实践" tabindex="-1">最佳实践 <a class="header-anchor" href="#最佳实践" aria-label="Permalink to “最佳实践”">​</a></h2><table tabindex="0"><thead><tr><th>指引</th><th>实践</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>用 <code>gap</code> 属性控制项目间距，而不是给子元素手动添加外边距，间距更容易保持一致。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>希望某个项目拉伸并填满剩余空间时，给它包一层 <code>size=&quot;fill&quot;</code> 的 <code>StackItem</code>，其余项目仍保持固有尺寸。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>为了换行而嵌套堆叠布局，优先给 <code>Stack</code> 设置 <code>wrap=&quot;wrap&quot;</code> 让项目自动换行，结构会更扁平。</td></tr></tbody></table><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to “示例”">​</a></h2><p>下面覆盖常见的方向与空间分配配置。</p>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(stackDirections),
				description: "direction 决定子元素的排列方向：horizontal 从左到右，vertical 从上到下，Stack 默认为 vertical。",
				locale: "zh",
				title: "Stack — 方向"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(stackHStack),
				description: "HStack 固定使用水平方向，等价于 direction 为 horizontal 的 Stack，写导航栏、按钮组等横向排列时更直白。",
				locale: "zh",
				title: "HStack — 基础"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(stackVStack),
				description: "VStack 固定使用垂直方向，等价于 direction 为 vertical 的 Stack，表单、列表等纵向排列可以直接使用。",
				locale: "zh",
				title: "VStack — 基础"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(stackItem),
				description: "StackItem 默认为 static，保持子项固有尺寸；设为 fill 时子项拉伸并占据堆叠容器中的剩余空间。",
				locale: "zh",
				title: "StackItem — 尺寸"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region docs/zh/components/stack/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/stack/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var stack_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, stack_default as default };
