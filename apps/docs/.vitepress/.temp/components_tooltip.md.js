import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { a as tooltipText, i as tooltipPlacements, n as tooltipControlled, t as tooltipBasic } from "./tooltip.Cxta4seC.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/tooltip/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"提示框\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"提示框\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/tooltip.md\",\"filePath\":\"zh/components/tooltip/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "components/tooltip.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="使用方法" tabindex="-1">使用方法 <a class="header-anchor" href="#使用方法" aria-label="Permalink to “使用方法”">​</a></h2><p><code>Tooltip</code> 为触发元素补充一段简短的说明文字，在鼠标悬停或键盘聚焦时出现在它旁边，适合解释图标按钮的含义、补充字段的格式要求这类轻量场景；触发元素自身的行为不受影响。最简单的用法是用 <code>content</code> 传入提示文字，并把触发元素放进默认插槽：</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { Button } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Button&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">import</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> { Tooltip } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Tooltip&#39;</span></span>
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
			})}">Tooltip</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> content</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;保存你的更改&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">    &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">Button</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> label</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;保存&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> /&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">Tooltip</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">template</span><span style="${ssrRenderStyle({
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
			_push(`</td><td>保持提示框内容简洁，纯文本建议少于 140 个字符。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>为没有可见标签的纯图标按钮和控件添加提示框。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>在提示框中放置链接或按钮这类可交互元素。应改用 HoverCard 或 Popover。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>用提示框展示用户完成任务必须看到的关键信息。</td></tr></tbody></table><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to “示例”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(tooltipBasic),
				title: "基本用法",
				description: "悬停或聚焦按钮，短暂延迟后显示提示。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(tooltipPlacements),
				title: "位置",
				description: "placement 设置提示相对触发元素的方向。空间不足时自动翻转到另一侧。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(tooltipText),
				title: "文字触发",
				description: "纯文字触发元素会变为可聚焦，并显示虚线下划线。",
				locale: "zh"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(tooltipControlled),
				title: "受控",
				description: "传入 isOpen 控制显示。按下 Escape 会发出 openChange(false)，由父组件决定是否关闭。",
				locale: "zh"
			}, null, _parent));
			_push(`<h2 id="无障碍" tabindex="-1">无障碍 <a class="header-anchor" href="#无障碍" aria-label="Permalink to “无障碍”">​</a></h2><p>提示框的气泡是一个独立的浮层，组件用 ARIA 属性把它和触发元素关联起来，屏幕阅读器既能知道触发元素多了一段补充说明，也能在气泡出现时读出里面的文字：</p><ul><li>气泡带有 <code>role=&quot;tooltip&quot;</code>，辅助技术据此把它识别为提示。</li><li>触发元素带有 <code>aria-describedby</code>，指向气泡的 <code>id</code>。</li></ul><p>提示只在鼠标悬停或键盘聚焦时出现。在显示状态下按 Escape 可以关闭非受控提示框；受控提示框此时会发出 <code>openChange(false)</code>，是否关闭由父组件决定。</p><p>也正因为提示转瞬即隐，用户很容易错过，触摸设备上也未必能触发，所以不要把用户完成任务必须看到的关键信息只放在提示框里。</p></div>`);
		};
	}
});
//#endregion
//#region docs/zh/components/tooltip/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/tooltip/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var tooltip_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, tooltip_default as default };
