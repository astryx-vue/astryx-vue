import { t as _sfc_main } from "./Badge-Ba0EwsTj.BDO3BPRa.js";
import { i as bottomSheetTall, r as bottomSheetSnap, t as bottomSheetBasic } from "./bottom-sheet.ODiRk8HJ.js";
import { createTextVNode, defineComponent, resolveComponent, unref, useSSRContext, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/bottom-sheet/index.md?vue&type=script&setup=true&lang.ts
var __pageData = JSON.parse("{\"title\":\"Bottom Sheet\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Bottom Sheet\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/bottom-sheet.md\",\"filePath\":\"en/components/bottom-sheet/index.md\"}");
var index_md_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	name: "en/components/bottom-sheet.md",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_DemoExample = resolveComponent("DemoExample");
			_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-label="Permalink to “Usage”">​</a></h2><p><code>BottomSheet</code> rises from the bottom edge of the viewport to hold mobile-first content: filters, share targets, quick actions, and forms. The panel carries a decorative grab handle, a scrolling content area underneath, and a scrim that dims and blocks the page. It is built on the native <code>&lt;dialog&gt;</code> element, so an open sheet keeps focus inside itself, makes the rest of the page inert, and returns focus to whatever opened it when it closes.</p><p>The shortest form manages its own state and takes a name and the content:</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
			})}"> { BottomSheet } </span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">from</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}"> &#39;@astryx-vue/core/BottomSheet&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">import</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> { ref } </span><span style="${ssrRenderStyle({
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
			})}"> isOpen</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}"> =</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> ref</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">(</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">false</span><span style="${ssrRenderStyle({
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
			})}">button</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> type</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;button&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}"> @click</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">=</span><span style="${ssrRenderStyle({
				"--shiki-light": "#032F62",
				"--shiki-dark": "#9ECBFF"
			})}">&quot;isOpen = true&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">    Filters</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">button</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">BottomSheet</span><span style="${ssrRenderStyle({
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
			})}">isOpen</span><span style="${ssrRenderStyle({
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
			})}">&quot;Filters&quot;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">    &lt;</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">p</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;Filter controls go here.&lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">p</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">  &lt;/</span><span style="${ssrRenderStyle({
				"--shiki-light": "#11782a",
				"--shiki-dark": "#85E89D"
			})}">BottomSheet</span><span style="${ssrRenderStyle({
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
			})}">&gt;</span></span></code></pre></div><p><code>label</code> is required and becomes the sheet&#39;s accessible name, which a screen reader announces on entry. The panel has no built-in heading, so that name has to come from you. Whether the sheet is open is decided by <code>isOpen</code>: leave it unbound and the component owns its state, so Escape, a scrim click, and a downward swipe all close it; bind it and the component renders exactly the bound value while those gestures only emit <code>openChange(false)</code> and let the parent decide.</p><p><code>height</code> sets how tall the panel is once expanded, and it has three named budgets. <code>hug</code> fits the content up to 92% of the viewport, which suits short, bounded content. <code>capped</code> is the default at roughly 62% of the viewport, the usual choice for lists. <code>tall</code> pins the panel near full height for forms and content that keeps growing. You can also pass a number of pixels or any CSS length, such as <code>420</code> or <code>&quot;min(70vh, 30rem)&quot;</code>. Whatever the budget, content taller than the visible panel scrolls inside it instead of stretching the page.</p><p><code>snapPoints</code> lets someone drag the panel to an intermediate height rather than only fully open or closed. Each stop is the panel&#39;s visible height: a number is a viewport fraction (<code>0.5</code> is half the screen), <code>&quot;50%&quot;</code> means the same thing, and <code>&quot;320px&quot;</code> is an absolute height. The panel&#39;s own height is always the tallest stop, so <code>snap-points=&quot;[0.5]&quot;</code> reads as &quot;half a screen or all of it&quot;. A stop that is a quarter of the panel or less counts as a peek: it slides the panel partly off-screen instead of reflowing the content into a sliver, and it thins the scrim. Without <code>snapPoints</code> the sheet only opens and closes, and dragging it down still dismisses it.</p><p>A downward drag closes the sheet, and a fast upward flick expands it to the tallest stop. The scrim&#39;s depth follows the panel while it moves, and on release the sheet settles on the nearest stop. Both the handle and, once it is scrolled to the top, the content area can start a drag. Under <code>prefers-reduced-motion: reduce</code> the entrance and exit movements collapse to almost nothing, while the position and state changes still happen.</p><p><code>purpose</code> controls implicit dismissal, matching <code>Dialog</code>. The default <code>info</code> allows Escape, a scrim click, and a swipe. <code>form</code> allows Escape only, so a stray click on the scrim cannot throw away typed input. <code>required</code> blocks every implicit path and announces the sheet as an alert dialog for flows that must end through an explicit choice. When the page behind the sheet should stay usable, set <code>hasScrim</code> to <code>false</code>: the sheet then opens non-modally, the page keeps scrolling and responding to clicks, and a swipe still dismisses it. A non-modal sheet never takes focus away from the page, so Escape dismisses it while focus is inside the sheet.</p><p><code>padding</code> sets the content area&#39;s inset on the spacing scale. When omitted, the theme decides, falling back to the <code>--spacing-4</code> step (16px) on every logical edge; pass <code>0</code> for a content box flush with the panel. The content area is also a container: if its only child is a region that carries its own inset, that child escapes the padding instead of being inset twice.</p><h2 id="best-practices" tabindex="-1">Best practices <a class="header-anchor" href="#best-practices" aria-label="Permalink to “Best practices”">​</a></h2><table tabindex="0"><thead><tr><th>Guidance</th><th>Practices</th></tr></thead><tbody><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Reserve it for small screens and momentary tasks: filters, sharing, quick actions, detail previews. Rising from the bottom edge keeps content inside thumb reach.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Pick the height that fits the content: <code>hug</code> for short bounded content, <code>capped</code> for lists, <code>tall</code> for forms and content that streams in.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Use <code>purpose=&quot;form&quot;</code> to protect entered data against stray taps while keeping Escape available, and reserve <code>required</code> for flows that must end through an explicit action.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "success" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Do`);
					else return [createTextVNode("Do")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Write a <code>label</code> that says what the sheet holds. It is the only context a screen reader gets when focus moves in.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Let the sheet content run long. Break a long task into steps or move it to a full page instead.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Treat it as the default dialog on desktop. Use <code>Dialog</code> when a centered modal is what the task calls for.</td></tr><tr><td>`);
			_push(ssrRenderComponent(unref(_sfc_main), { variant: "error" }, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Don&#39;t`);
					else return [createTextVNode("Don't")];
				}),
				_: 1
			}, _parent));
			_push(`</td><td>Rely on the swipe as the only way out. Escape, a scrim click, and an explicit action button matter just as much.</td></tr></tbody></table><h2 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-label="Permalink to “Examples”">​</a></h2>`);
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(bottomSheetBasic),
				description: "A filter sheet that rises from the bottom edge, with a grab handle, a heading, and actions. Escape and the scrim close it.",
				locale: "en",
				title: "Basic"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(bottomSheetTall),
				description: "The tall budget pins the panel near full height and the list scrolls inside it, leaving the page itself its original length.",
				locale: "en",
				title: "List"
			}, null, _parent));
			_push(ssrRenderComponent(_component_DemoExample, {
				demo: unref(bottomSheetSnap),
				description: "snapPoints lets someone drag the panel to half the screen and rest there, or push it back up to full height.",
				locale: "en",
				title: "Intermediate stop"
			}, null, _parent));
			_push(`<h2 id="accessibility" tabindex="-1">Accessibility <a class="header-anchor" href="#accessibility" aria-label="Permalink to “Accessibility”">​</a></h2><p>The panel is built on the native <code>&lt;dialog&gt;</code> element. With a scrim it opens through <code>showModal()</code>, which puts it in the top layer, makes the background inert, and confines Tab to the sheet. Without a scrim it opens through <code>show()</code>, leaving the page usable. <code>label</code> names the sheet through <code>aria-label</code>, and <code>purpose=&quot;required&quot;</code> switches the role to <code>alertdialog</code>.</p><p>On open, focus lands on the first element with <code>data-autofocus</code> inside the panel, or on the panel itself when there is none. On close, focus returns to the element that was focused when the sheet opened — if it is still in the page — or to the element named by <code>finalFocusRef</code>. The handoff happens once the exit motion has finished, so focus never lands on a surface that is still sliding away.</p><p>Escape closes the sheet unless <code>purpose</code> is <code>required</code> — a modal sheet confines focus inside itself, while a non-modal one never takes focus from the page, so focus has to be inside the sheet — and an Escape pressed while an input method is composing text cancels the composition instead. Once the content area is scrolled to the top, a downward drag can close the sheet, and at the end of its content an upward drag can expand it; with a <code>purpose</code> other than <code>info</code> a drag only settles on the nearest stop and never dismisses.</p><p>While the content actually overflows, the scrolling area becomes focusable, carries <code>role=&quot;group&quot;</code>, and is named by the sheet&#39;s <code>label</code>, so a keyboard user can focus it and scroll with the arrow keys.</p><h2 id="theming" tabindex="-1">Theming <a class="header-anchor" href="#theming" aria-label="Permalink to “Theming”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#6F42C1",
				"--shiki-dark": "#B392F0"
			})}">.my-sheet</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c13617",
				"--shiki-dark": "#FFAB70"
			})}">  --astryx-bottom-sheet-background</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">#ffffff</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c13617",
				"--shiki-dark": "#FFAB70"
			})}">  --astryx-bottom-sheet-foreground</span><span style="${ssrRenderStyle({
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
			})}">  --astryx-bottom-sheet-border</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">#d4d4d4</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c13617",
				"--shiki-dark": "#FFAB70"
			})}">  --astryx-bottom-sheet-handle-background</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">#d4d4d4</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c13617",
				"--shiki-dark": "#FFAB70"
			})}">  --astryx-bottom-sheet-scrim</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">#00000080</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#c13617",
				"--shiki-dark": "#FFAB70"
			})}">  --astryx-bottom-sheet-shadow</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">: </span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">0</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> -12</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">px</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> 24</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">px</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> rgb</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">(</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">0</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> 0</span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}"> 0</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}"> / </span><span style="${ssrRenderStyle({
				"--shiki-light": "#005CC5",
				"--shiki-dark": "#79B8FF"
			})}">15</span><span style="${ssrRenderStyle({
				"--shiki-light": "#c62739",
				"--shiki-dark": "#F97583"
			})}">%</span><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">);</span></span>
<span class="line"><span style="${ssrRenderStyle({
				"--shiki-light": "#24292E",
				"--shiki-dark": "#E1E4E8"
			})}">}</span></span></code></pre></div><p>The neutral theme adapts to light and dark mode. <code>class</code> and <code>style</code> land on the panel <code>&lt;div&gt;</code>, not on the <code>&lt;dialog&gt;</code> that wraps it, so the variables above belong on the panel.</p></div>`);
		};
	}
});
//#endregion
//#region docs/en/components/bottom-sheet/index.md
var _sfc_setup = index_md_vue_type_script_setup_true_lang_default.setup;
index_md_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/bottom-sheet/index.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var bottom_sheet_default = index_md_vue_type_script_setup_true_lang_default;
//#endregion
export { __pageData, bottom_sheet_default as default };
