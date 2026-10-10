import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { a as moreMenuTriggers, i as moreMenuSizes, n as moreMenuOverview, r as moreMenuSections, t as moreMenuBasic } from "./more-menu.DYHmlBsQ.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/more-menu/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"更多菜单\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"更多菜单\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/more-menu.md\",\"filePath\":\"zh/components/more-menu/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "components/more-menu.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="使用方法" tabindex="-1">使用方法 <a class="header-anchor" href="#使用方法" aria-label="Permalink to “使用方法”">​</a></h2><p><code>MoreMenu</code> 是一个以 <code>⋯</code> 图标为触发器的溢出菜单，用来收纳那些不需要一直显示的操作：表格行、卡片标题、工具栏的次要动作。触发器本身只是一个纯图标按钮，动作都在它展开的菜单里。</p><p>菜单的内容由 <code>items</code> 数组描述。普通项就是一次操作，<code>type: &#39;divider&#39;</code> 是一条分隔线，<code>type: &#39;section&#39;</code> 是一个带标题的分组：</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { MoreMenu } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/MoreMenu&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">const</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> items</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}"> =</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> [</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  { label: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&#39;Rename&#39;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">, </span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">onClick</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: () </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">=&gt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> rename</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">() },</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  { label: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&#39;Duplicate&#39;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">, </span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">onClick</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: () </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">=&gt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> duplicate</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">() },</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  { type: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&#39;divider&#39;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> },</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  { label: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&#39;Move to trash&#39;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">, variant: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&#39;destructive&#39;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">, </span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">onClick</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: () </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">=&gt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> remove</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">() },</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">]</span></span>
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
			})}">MoreMenu</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> :</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">items</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">items</span><span style="${ssrRenderStyle({
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
			})}">&quot;File actions&quot;</span><span style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><p>触发器只有图标，所以 <code>label</code> 就是它的无障碍名称，同时也是菜单本身的名字，以及悬停时的提示文字。默认值 <code>More options</code> 在大多数界面里都够用；当菜单里装的是特定对象的操作时，换成更具体的说法（例如“项目操作”）会更好。想换掉三点图标，用 <code>icon</code> 插槽。</p><p>菜单打开的瞬间，焦点落在哪里取决于你是用什么方式打开的：键盘打开（在触发器上按 <code>Enter</code>、<code>Space</code>、<code>ArrowDown</code>、<code>ArrowUp</code>）落在第一项或最后一项上；鼠标点击打开则挂在菜单容器上，不预先高亮任何一行，避免看起来像是已经选中了什么。打开之后 <code>ArrowDown</code> 和 <code>ArrowUp</code> 在各项之间移动并首尾相接，<code>Home</code> 和 <code>End</code> 跳到首尾，输入字母会跳转到以该字母开头的下一项，<code>Enter</code> 和 <code>Space</code> 执行当前项，<code>Escape</code> 关闭并把焦点交回触发器，<code>Tab</code> 关闭菜单后让浏览器继续往后移动焦点。禁用项会被跳过，也不会进入键盘路径。</p><p>鼠标的按下与抬起是被区分的：按住鼠标时高亮跟着指针走，抬起的落点决定执行哪一项；如果抬起时指针在菜单之外，菜单就关闭。触摸设备上的行为不同——手指松开不会关闭菜单，因为高亮正在跟着手指移动，只有点中某一项、点中触发器或按下 <code>Escape</code> 才算结束。点开菜单时用的如果是鼠标，菜单与触发器之间的距离和方向由 <code>placement</code> 与 <code>alignment</code> 决定，空间不足时会自动翻到另一侧；溢出菜单通常希望 <code>alignment=&quot;end&quot;</code>，让菜单和触发器的尾部对齐。</p><p><code>presentation</code> 决定动作以什么形态出现：<code>popover</code>（默认）是锚定在触发器旁边的浮层；<code>bottom-sheet</code> 是从底部弹出的模态面板，适合手指操作；<code>adaptive</code> 在“主指针为粗略指针且宽度不超过 768px”时用底部面板，其余情况用浮层。底部面板里子菜单不是飞出的小面板，而是就地换一个视图，面板中间的标题会跟着变成该子菜单的名字，左上角出现返回按钮，<code>Escape</code> 先退出子菜单再关闭整个面板。</p><p>打开状态既可以由组件自己管理，也可以由你管理。传入 <code>isMenuOpen</code> 就进入受控模式，配合 <code>v-model:isMenuOpen</code> 使用；<code>openChange</code> 在每次请求打开或关闭时触发。</p><h2 id="最佳实践" tabindex="-1">最佳实践 <a class="header-anchor" href="#最佳实践" aria-label="Permalink to “最佳实践”">​</a></h2><table tabindex="0"><thead><tr><th>指引</th><th>实践</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>只用来收纳次要操作。主要动作应该直接出现在界面上，藏进菜单会让人找不到。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>项目多的时候用分隔线或分组整理：破坏性操作单独放在最后，并设为 <code>variant=&quot;destructive&quot;</code>。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>给每行图标都补上 <code>description</code>，让“导出”和“发布”这类相近的动作一眼能分清。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>触发器位于表格行或工具栏末尾时，用 <code>alignment=&quot;end&quot;</code> 让菜单与触发器的尾部对齐，避免菜单盖住内容。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>移动端为主的界面用 <code>presentation=&quot;adaptive&quot;</code>，手指能直接够到底部面板上的操作。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>把名称写得含糊，例如“更多”里再放一个“更多”。触发器需要一个能说清用途的 <code>label</code>。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>一次塞进十几个动作。超过一屏时用户要点开、滚动、再挑选，代价已经高于直接把操作摆出来。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>依赖菜单是否打开来保存数据或做导航。菜单是一个临时的浮层，状态应写在你的数据里。</td></tr></tbody></table><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to “示例”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(moreMenuOverview),
				description: "把菜单表面打开来看：动作、分隔线，以及排在最后的破坏性操作。",
				locale: "zh",
				title: "菜单表面"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(moreMenuSizes),
				description: "行密度跟着菜单尺寸走：sm、md、lg 用的是和列表项同一套密度步进，所以三档一眼能分辨。",
				locale: "zh",
				title: "尺寸"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(moreMenuBasic),
				description: "一个真实可用的触发器。用鼠标点击或用 Enter 打开，选中一项后结果会显示在下方。",
				locale: "zh",
				title: "基本用法"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(moreMenuSections),
				description: "带标题的分组把相关动作聚在一起；每一行还可以带图标、说明和快捷键提示。",
				locale: "zh",
				title: "分组与说明"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(moreMenuTriggers),
				description: "触发器沿用按钮的尺寸与变体，可以被禁用，可以换成自定义图标，也可以改用自适应呈现。",
				locale: "zh",
				title: "触发器形态"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region docs/zh/components/more-menu/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/more-menu/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var more_menu_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, more_menu_default as default };
