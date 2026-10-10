import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { i as codeLineNumbers, n as codeCollapsible, r as codeInline, t as codeBasic } from "./code.Cp_9Oito.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/code/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"代码\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"代码\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/code.md\",\"filePath\":\"zh/components/code/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "components/code.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="使用方法" tabindex="-1">使用方法 <a class="header-anchor" href="#使用方法" aria-label="Permalink to “使用方法”">​</a></h2><p><code>Code</code> 用来标注句子里的短技术引用，例如函数名、属性名、文件路径或者命令行参数。它渲染的是语义化的 <code>&lt;code&gt;</code> 元素，等宽字体配浅色底，长标识符会折行，而不会把整段文字撑宽。</p><p><code>CodeBlock</code> 用来展示一行或多行只读代码。它补齐了一段代码独立出现时需要的部分：带标题和语言名的头部、复制按钮、可选的行号、可选的高亮行、可选的语法着色、限高的滚动区域，以及可选的折叠控件。两个组件都从 <code>@astryx-vue/core/Code</code> 导出。</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { Code, CodeBlock } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Code&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">const</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> snippet</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}"> =</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;const total = items.length&#39;</span></span>
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
			})}">p</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;用 &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">Code</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;items.length&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">Code</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt; 统计条数。&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">p</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">CodeBlock</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> :</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">code</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">snippet</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> language</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;typescript&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> title</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;count.ts&quot;</span><span style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><p><code>language</code> 决定用哪套分词器。内置支持 <code>typescript</code>、<code>javascript</code>、<code>tsx</code>、<code>jsx</code>、<code>ts</code>、<code>js</code>、<code>json</code>、<code>html</code>、<code>xml</code>、<code>svg</code>、<code>css</code>、<code>scss</code>、<code>less</code>、<code>python</code>、<code>py</code>、<code>bash</code>、<code>sh</code>、<code>zsh</code>、<code>shell</code>、<code>php</code>、<code>hack</code>、<code>yaml</code>、<code>yml</code>、<code>markdown</code> 和 <code>md</code>。其他取值（包括 <code>plaintext</code>）都会原样显示，不做任何着色；<code>plaintext</code> 同时会隐藏语言标签，因为这个标签不提供任何信息。语言不认识不算错误：你也可以传入自己的 <code>tokenizer</code> 函数，返回带绝对偏移的 token，它只影响着色，显示和复制的文本始终是原始字符串。</p><p>标题或者可见的语言标签存在时会出现头部，复制按钮就放在头部里。两者都没有时，复制按钮会浮在代码块的右上角，所以没有头部也照样能复制。<code>hasLanguageLabel</code> 可以关掉语言标签，只留下标题。</p><p>行号默认关闭，用 <code>hasLineNumbers</code> 打开；行号栏的宽度按最大行号计算，所以代码列的起点是稳定的。<code>highlightLines</code> 接收从 1 开始的行号，把这些行加上底色以引起注意。长行不希望横向滚动时用 <code>isWrapped</code> 让它折行；用 <code>maxHeight</code> 限制高度，超出后纵向滚动，<code>0</code> 是合法取值，表示把正文收成和头部一样高。默认宽度贴着最长的一行：<code>width=&quot;fit-content&quot;</code> 会让短代码保持紧凑（有一个最小宽度下限），<code>width=&quot;100%&quot;</code> 则撑满父容器。<code>container=&quot;section&quot;</code> 会去掉边框、圆角和背景，让代码块嵌在卡片或面板里时不再多画一层底色。</p><p>较长的代码块可以折叠。设置 <code>isCollapsible</code> 之后，只要头部可见并且代码行数达到 <code>collapsibleThreshold</code>（默认 10 行），头部就会变成折叠控件。代码块初始是展开的，通过 <code>aria-expanded</code> 报告状态，通过 <code>aria-controls</code> 指向被它控制的内容区域。折叠时这块区域仍然挂载，但会被设为 <code>inert</code>：它既不在 Tab 顺序里，也不在无障碍树上，不会变成一个看不见却能被键盘碰到的地方。如果控件消失了（例如标题被移除），代码块会自己重新展开。</p><p>复制按钮写入的是 <code>code</code> 原字符串，所以读者粘贴出来的内容和源码一致，不受着色、行号或者折行影响。写入成功后控件名称变为 <code>Copied</code>，图标从复制变成对勾，同时有一个礼貌的 live region 读出同一个词；悬停提示一直保持 <code>Copy code</code>，因为真正的确认是对勾。写入被拒绝时控件保持原状，也不触发任何事件。<code>copyLabel</code>、<code>copiedLabel</code>、<code>codeLabel</code> 带着英文默认值，用来做本地化。</p><p>代码视口是一个有名字的 <code>role=&quot;group&quot;</code>，并且可以聚焦，键盘用户因此能滚动溢出的代码。复制按钮和折叠控件是并列的兄弟节点，各自有自己的无障碍名称，按下一个不会连带触发另一个。语法颜色来自 <code>--astryx-code-syntax-*</code> 这一组 token，<code>highlightMode</code> 决定着色方式：<code>auto</code> 在浏览器支持良好时使用 CSS Custom Highlight API，否则回退到 span；<code>ranges</code> 完全通过该 API 着色，代码文本里不会多出任何元素；<code>spans</code> 则把每个 token 包进一个元素。三种方式的文本、语义和复制结果完全相同。</p><h2 id="最佳实践" tabindex="-1">最佳实践 <a class="header-anchor" href="#最佳实践" aria-label="Permalink to “最佳实践”">​</a></h2><table tabindex="0"><thead><tr><th>指引</th><th>实践</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>只出现在句子里的短引用用 <code>Code</code>，能独立成立或者超过一行的代码用 <code>CodeBlock</code>。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>让 <code>language</code> 和代码内容一致，着色才准确；代码来自某个文件时给一个 <code>title</code>，读者才知道它的出处。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>行内代码出现在更大或更小的文字里时，用 <code>size=&quot;inherit&quot;</code> 让它跟随所在行的大小。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>长代码用 <code>maxHeight</code> 或者 <code>isCollapsible</code> 处理，不要再把它塞进自己的滚动容器里。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>给两行的代码打开行号。它只会增加噪音，没有人需要靠它找第几行。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>把整段说明文字放进 <code>CodeBlock</code>，或者用 <code>Code</code> 展示整个文件。每个组件只做一件事。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>指望颜色单独说明含义。着色只是把代码染上颜色，它不做解释。</td></tr></tbody></table><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to “示例”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(codeBasic),
				description: "带标题和可见语言标签的代码块，复制按钮位于头部。",
				locale: "zh",
				title: "基础用法"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(codeInline),
				description: "句子里的行内代码，次要色写法，以及在较大的文字里用 size=inherit 让它跟随字号。",
				locale: "zh",
				title: "行内代码"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(codeLineNumbers),
				description: "打开行号，行号栏按最大行号占宽；两行加了底色，把注意力引到关键处。",
				locale: "zh",
				title: "行号与高亮"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(codeCollapsible),
				description: "从头部折叠的长代码块，同时限制了最大高度，展开后纵向滚动而不是无限变高。",
				locale: "zh",
				title: "折叠与限高"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region docs/zh/components/code/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/code/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var code_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, code_default as default };
