import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { i as cardVariants, n as cardElevation, r as cardPadding, t as cardBasic } from "./card.CBgvL628.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/card/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"卡片\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"卡片\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/card.md\",\"filePath\":\"zh/components/card/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "components/card.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="使用方法" tabindex="-1">使用方法 <a class="header-anchor" href="#使用方法" aria-label="Permalink to “使用方法”">​</a></h2><p><code>Card</code> 是一块带边框、带背景和圆角的容器，用来把一组内容圈成一个可以独立对待的整体。它的职责只有外观和空间：背景、边框、圆角、内边距，以及把这个内边距告诉需要向外延伸的子元素。</p><p>卡片不是默认的排版工具。页面上的大多数内容分组并不需要容器，间距和对齐本身就能形成分组；只有当一个条目需要清晰的交互边界，或者需要在一行、一个网格里与同类条目并排比较时，才值得用卡片。一个好用的判断是问自己：“这一块我能单独把它排序、删除或拿走吗？”如果答案是能，它是卡片；如果答案是不能，它只是页面的一段，用标题加 <code>Stack</code> 就够了。</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { Card } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Card&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">import</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> { Heading } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Heading&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">import</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> { VStack } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Stack&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">import</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> { Text } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/Text&#39;</span></span>
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
			})}">Card</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">    &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">VStack</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> :</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">gap</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">2</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">      &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">Heading</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> :</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">level</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">3</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">        Weekly report</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">      &lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">Heading</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">      &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">Text</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> color</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;secondary&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">        Your team closed 24 issues this week.</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">      &lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">Text</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">    &lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">VStack</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">Card</span><span style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><p><code>padding</code> 使用间距比例（0、0.5、1、1.5、2、3、4、5、6、8、10），作用于四边。省略它时，卡片用的是主题的卡片内边距，而不是某个固定步进值；也就是说，传一个步进值意味着你要覆盖主题，而不是复述默认值。</p><p><code>variant</code> 决定背景：<code>default</code> 是标准的卡片表面并带一条可见的描边，<code>transparent</code> 既没有背景也没有描边（只用来做分组，不增加视觉重量），<code>muted</code> 使用弱化的背景色。其余十个名字是分类用的色相：<code>blue</code>、<code>cyan</code>、<code>gray</code>、<code>green</code>、<code>orange</code>、<code>pink</code>、<code>purple</code>、<code>red</code>、<code>teal</code>、<code>yellow</code>。只有 <code>default</code> 会画描边，而且描边画在内边距之内——它的宽度会从每一侧的内边距里减去，所以“描边 + 内边距”的总内缩仍然等于那个间距步进值，有边框的卡片和没有边框的卡片里，内容的坐标是一致的。</p><p><code>elevation</code> 是静止时的阴影深度，可取 <code>none</code>、<code>low</code>、<code>med</code>、<code>high</code>。只有在卡片确实需要浮在周围内容之上时才抬升它；一个铺满列表的界面里每张卡片都带阴影，就失去了层次的意义。</p><p><code>width</code>、<code>height</code>、<code>maxWidth</code>、<code>minHeight</code> 控制尺寸，数字按像素解释，字符串按原样使用。卡片在弹性行或网格轨道里会让位给轨道：它有一个为零的最小宽度，所以一行或一条 <code>1fr</code> 轨道不会被一张卡片里的长内容撑宽。同时卡片用 <code>overflow: clip</code> 裁掉自己装不下的内容，而不是变成滚动容器——那样会让卡片内部的粘性元素粘到卡片上，也会让溢出的卡片变成一个没有名字的键盘停靠点。因此，无法换行的长文本（长 ID、哈希、URL）请交给 <code>Text</code> 的 <code>maxLines</code> 去截断，宽内容（表格、代码）请让它自己带滚动区域。给卡片一个固定的 <code>height</code> 时行为会变：这张卡片就是你为内容指定的视口，内容在卡片内部滚动。</p><p>卡片还会在根元素上发布 <code>--container-padding-inline-start</code>、<code>--container-padding-inline-end</code>、<code>--container-padding-block-start</code>、<code>--container-padding-block-end</code>。需要向外延伸到卡片边缘的子元素（例如 <code>isFullBleed</code> 的 <code>Divider</code>）读取这几个变量来抵消内边距，所以它不需要知道卡片用了多少 padding。</p><h2 id="最佳实践" tabindex="-1">最佳实践 <a class="header-anchor" href="#最佳实践" aria-label="Permalink to “最佳实践”">​</a></h2><table tabindex="0"><thead><tr><th>指引</th><th>实践</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>先问“这一块能单独排序或删除吗”。能，才是卡片；不能，就只是页面的一段，用标题加 <code>Stack</code> 或 <code>Section</code>。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>用卡片承载离散的条目：一个用户、一条通知、一个指标、网格里的一个商品，每张卡片对应一个“东西”。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>让同一组卡片的 <code>padding</code> 保持一致，这样它们在网格或列表里才会对齐。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>长 ID、哈希、URL 用 <code>Text</code> 的 <code>maxLines=&quot;1&quot;</code> 截断；表格、代码这类宽内容放进它自己的滚动区域。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`推荐`);
					else return [createTextVNode("推荐")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>只在卡片需要浮在内容之上时设置 <code>elevation</code>。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>把卡片当成默认的视觉分组手段。标题加 <code>Stack</code> 的间距就能建立层次，铺满描边只会让页面变吵。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>把页面区域包进卡片。“通用设置”“通知偏好”这类表单分组属于页面区域，不是卡片。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>在卡片里再放卡片。层次应该靠间距和分隔线压平，而不是叠盒子。</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`避免`);
					else return [createTextVNode("避免")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>用颜色变体表达状态。状态请交给 <code>Banner</code> 或 <code>Badge</code>，彩色卡片只用来分类。</td></tr></tbody></table><h2 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to “示例”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(cardBasic),
				description: "一张典型的卡片：标题、说明文字、分隔线，以及底部的操作按钮。",
				locale: "zh",
				title: "基础用法"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(cardVariants),
				description: "三种表面变体加上十个分类色相。只有 default 带描边，transparent 只做分组，muted 用于弱化的卡片。",
				locale: "zh",
				title: "背景变体"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(cardElevation),
				description: "四档静止阴影。只有卡片确实需要浮在周围内容之上时才抬升它。",
				locale: "zh",
				title: "阴影深度"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(cardPadding),
				description: "同一个步进值作用于四边。虚线框是卡片内容，它与卡片边缘之间的距离就是内边距。",
				locale: "zh",
				title: "内边距"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region docs/zh/components/card/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/card/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var card_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, card_default as default };
