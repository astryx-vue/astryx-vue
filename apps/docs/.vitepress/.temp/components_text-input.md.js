import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { a as textInputSizes, i as textInputSearch, n as textInputBasic, o as textInputStates, r as textInputPassword, s as textInputValidation, t as textInputAsync } from "./text-input.B8olMcNe.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/text-input/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"文本输入框\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"文本输入框\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/text-input.md\",\"filePath\":\"zh/components/text-input/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "components/text-input.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="使用方法" tabindex="-1">使用方法 <a class="header-anchor" href="#使用方法" aria-label="Permalink to “使用方法”">​</a></h2><p><code>TextInput</code> 用于输入邮箱、姓名、搜索词等单行文本。标签、说明与校验消息由内置的 <code>Field</code> 自动关联，通过 <code>v-model</code> 管理输入值即可：</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { TextInput } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/TextInput&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">import</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> { shallowRef } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">const</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> email</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}"> =</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> shallowRef</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">(</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&#39;&#39;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">)</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">script</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">template</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">TextInput</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> v-model</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">email</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> label</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;邮箱&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> type</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;email&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> auto-complete</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;email&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> /&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">template</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span></code></pre></div><p>自定义控件可使用 <a href="/components/field">Field</a>。主题在应用入口引入一次：</p><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> &#39;@astryx-vue/themes/neutral.css&#39;</span></span></code></pre></div><h2 id="最佳实践" tabindex="-1">最佳实践 <a class="header-anchor" href="#最佳实践" aria-label="Permalink to “最佳实践”">​</a></h2><table tabindex="0"><thead><tr><th>指引</th><th>实践</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>必须提供可见的标签，让用户知道该字段的用途。只有上下文已经明确时才隐藏标签，例如带放大镜图标的搜索框。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>使用带消息的校验状态，说明出了什么问题。“邮箱必须包含 @” 比仅把边框变红更清楚。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>输入框尺寸要与预期内容长度相符，让用户判断该输入多少内容。邮编用 small，姓名用 medium，URL 用 large。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>为搜索和筛选输入框添加清除按钮，让用户无需全选文字即可快速重置。</td></tr></tbody></table><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to “示例”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(textInputBasic),
				title: "基本输入",
				description: "标签、说明与输入值放在同一个字段中，使用 v-model 管理值。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(textInputSizes),
				title: "尺寸",
				description: "输入框提供三档尺寸。标签和说明的字号保持固定。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(textInputSearch),
				title: "搜索与清除",
				description: "隐藏标签时仍保留无障碍名称。中文输入法提交候选词时不会触发 enter。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(textInputPassword),
				title: "密码与尾部插槽",
				description: "通过 end 插槽加入显示密码按钮，组件保留原生 password 类型。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(textInputStates),
				title: "禁用与只读",
				description: "禁用字段不参与提交。只读字段仍可聚焦、复制和提交。禁用原因可通过焦点发现。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(textInputValidation),
				title: "校验状态",
				description: "三种状态均有图标。错误、警告和成功文字支持紧贴、分离或提示布局。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(textInputAsync),
				title: "异步保存与失败重试",
				description: "修改内容时显示加载状态。输入 fail 可触发保存失败。再次修改内容可重试。示例忽略过期结果。",
				locale: "zh"
			}, null, _parent));
			_push(`<h2 id="无障碍" tabindex="-1">无障碍 <a class="header-anchor" href="#无障碍" aria-label="Permalink to “无障碍”">​</a></h2><p><code>label</code> 是必填项。屏幕阅读器靠它说明这个字段是做什么的；<code>placeholder</code> 只在输入框为空时可见，用户一开始输入就消失，不能用它代替标签。</p><p>标签、说明和状态消息由组件通过 ARIA 属性串联起来，辅助技术能把它们当成一个整体读出：</p><ul><li><code>description</code> 与 <code>status.message</code> 关联到 <code>aria-describedby</code>。</li><li>出错时自动设置 <code>aria-invalid</code>。</li><li>字段必填时自动设置 <code>aria-required</code>。</li></ul><p><code>isRequired</code> 负责显示必填提示并设置 ARIA 状态。如果还需要浏览器原生的必填校验——例如依赖表单提交来拦截未填写的字段——再额外传入 <code>required</code>。</p><h2 id="中文输入法" tabindex="-1">中文输入法 <a class="header-anchor" href="#中文输入法" aria-label="Permalink to “中文输入法”">​</a></h2><p>拼音、注音这类输入法在用户敲下字母时，文字还处在候选状态，选定候选词之后才算真正输入完成。组件会区分「正在组合」和「已经输入」，避免把半成品当成最终值：</p><ul><li>候选词尚未确定时，组件不更新 <code>v-model</code>，输入框里显示的仍是组合中的文字。</li><li><code>compositionend</code> 触发后，也就是用户选定候选词的那一刻，组件才把最终文字同步到 <code>v-model</code>。</li><li>用 Enter 选定候选词不会触发 <code>enter</code> 事件；用户再次按下 Enter 提交表单时，<code>enter</code> 才正常触发。</li></ul><p>这样，依赖 <code>v-model</code> 的校验和提交逻辑就不会在用户输入到一半时被提前打断。</p></div>`);
		};
	}
});
//#endregion
//#region docs/zh/components/text-input/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/text-input/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var text_input_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, text_input_default as default };
