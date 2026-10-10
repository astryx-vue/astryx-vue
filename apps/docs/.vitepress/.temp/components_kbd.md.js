import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { n as kbdKeyNames, r as kbdModifiers, t as kbdBasic } from "./kbd.BnYqzceS.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/kbd/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"快捷键\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"快捷键\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/kbd.md\",\"filePath\":\"zh/components/kbd/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "components/kbd.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="使用方法" tabindex="-1">使用方法 <a class="header-anchor" href="#使用方法" aria-label="Permalink to “使用方法”">​</a></h2><p><code>Kbd</code> 把一段键盘快捷键画成一组按键徽章，例如 <code>⌘K</code>、<code>⇧↵</code>。它常出现在菜单项、工具提示和帮助文字里，让你在说明某个操作时顺带告诉用户它的快捷方式，而不必用一句“先按住 Command 再按 K”来描述。</p><p>快捷键用字符串传入，按键之间用 <code>+</code> 分隔：</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { Kbd } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Kbd&#39;</span></span>
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
			})}">Kbd</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> keys</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;mod+k&quot;</span><span style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><p>每个分段都会得到一枚独立的徽章，所以 <code>mod+k</code> 会画出两枚按键。分段周围的空格会被忽略，大小写也不敏感，<code>mod + K</code> 和 <code>mod+k</code> 完全等价；无法识别的分段会原样转成大写，例如 <code>f1</code> 显示为 <code>F1</code>。</p><p><code>mod</code> 是唯一会随平台变化的按键：在 Apple 平台上它显示为 <code>⌘</code>，在其他平台上显示为 <code>Ctrl</code>。因此描述跨平台快捷键时优先写 <code>mod</code>，只有快捷键确实固定在某一侧修饰键上时才写 <code>ctrl</code>。其余具名按键都有固定的字形：</p><table tabindex="0"><thead><tr><th>写法</th><th>显示</th></tr></thead><tbody><tr><td><code>mod</code></td><td><code>⌘</code>（Apple 平台）/ <code>Ctrl</code>（其他平台）</td></tr><tr><td><code>ctrl</code></td><td><code>⌃</code></td></tr><tr><td><code>alt</code></td><td><code>⌥</code></td></tr><tr><td><code>shift</code></td><td><code>⇧</code></td></tr><tr><td><code>enter</code></td><td><code>↵</code></td></tr><tr><td><code>backspace</code></td><td><code>⌫</code></td></tr><tr><td><code>tab</code></td><td><code>⇥</code></td></tr><tr><td><code>escape</code></td><td><code>Esc</code></td></tr><tr><td><code>up</code> / <code>down</code> / <code>left</code> / <code>right</code></td><td><code>↑</code> <code>↓</code> <code>←</code> <code>→</code></td></tr><tr><td><code>plus</code></td><td><code>+</code></td></tr></tbody></table><p><code>esc</code> 是 <code>escape</code> 的别名，<code>return</code> 是 <code>enter</code> 的别名，两者的渲染和朗读完全一致。由于 <code>+</code> 本身是分隔符，要表示加号键请写 <code>plus</code>，例如 <code>shift+plus</code>。</p><p>对屏幕阅读器来说，整组按键是一个名为 “Command + K” 的整体，徽章里的图形字符不会被逐个朗读——<code>⌘</code>、<code>⇧</code> 这类字形读出来没有意义，所以组件改用 <code>Command</code>、<code>Shift</code> 这样的词来描述这组快捷键。这也意味着 <code>Kbd</code> 只负责提示，它不会真的监听键盘，快捷键本身需要在产品里真正实现。</p><h2 id="最佳实践" tabindex="-1">最佳实践 <a class="header-anchor" href="#最佳实践" aria-label="Permalink to “最佳实践”">​</a></h2><table tabindex="0"><thead><tr><th>指引</th><th>实践</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>把快捷键放在它触发的操作旁边：菜单项右侧、工具提示里，或紧跟在说明文字之后。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>用 <code>mod</code> 而不是 <code>ctrl</code> 或 <code>cmd</code> 描述跨平台快捷键，让 macOS 用户看到 <code>⌘</code>，其他用户看到 <code>Ctrl</code>。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>只提示已经实现、并且在当前上下文里真的能按下的快捷键。错误的提示比没有提示更让人受挫。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>快捷键的写法与产品文档、设置页保持一致，避免同一个操作出现两种写法。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>把 <code>Kbd</code> 当作发现操作的唯一途径。快捷键是可见控件的补充，不是替代品。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>在一个界面里堆满快捷键提示。这类提示属于次要信息，出现得太频繁就会盖过正文。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>为了省事手写 <code>⌘</code>、<code>⇧</code> 等字符代替组件。手写的字符不会随平台切换，屏幕阅读器也读不出它们的含义。</td></tr></tbody></table><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to “示例”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(kbdBasic),
				description: "把快捷键放在它触发的操作旁边：标签在左，按键徽章在右，用户一眼就能把两者对应起来。",
				locale: "zh",
				title: "快捷键列表"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(kbdModifiers),
				description: "mod 在 macOS 上显示为 ⌘，在其他平台显示为 Ctrl；ctrl、alt、shift 等修饰键各有固定字形，plus 用来表示加号键本身。",
				locale: "zh",
				title: "修饰键与组合键"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(kbdKeyNames),
				description: "组件认识的全部按键写法，以及它们各自画出的字形。esc 与 return 分别是 escape 和 enter 的别名。",
				locale: "zh",
				title: "按键名称"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region docs/zh/components/kbd/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/kbd/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var kbd_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, kbd_default as default };
