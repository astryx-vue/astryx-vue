import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/hover-card/props.md
var __pageData = JSON.parse("{\"title\":\"Hover Card\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Hover Card\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/hover-card/props.md\",\"filePath\":\"en/components/hover-card/props.md\"}");
var _sfc_main = { name: "en/components/hover-card/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="hovercard-props" tabindex="-1">HoverCard Props <a class="header-anchor" href="#hovercard-props" aria-label="Permalink to “HoverCard Props”">​</a></h2><div class="component-api-table" role="region" aria-label="HoverCard props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>content</code></td><td><code>string</code></td><td><code>&#39;&#39;</code></td><td>Plain-text card content. Use the <code>content</code> slot for rich content.</td></tr><tr><td><code>placement</code></td><td><code>&#39;above&#39; | &#39;below&#39; | &#39;start&#39; | &#39;end&#39;</code></td><td><code>&#39;above&#39;</code></td><td>Side of the trigger. The card flips to the opposite side when there is no room.</td></tr><tr><td><code>alignment</code></td><td><code>&#39;start&#39; | &#39;center&#39; | &#39;end&#39;</code></td><td><code>&#39;center&#39;</code></td><td>Alignment along the placement axis.</td></tr><tr><td><code>delay</code></td><td><code>number</code></td><td><code>300</code></td><td>Milliseconds before showing on hover.</td></tr><tr><td><code>hideDelay</code></td><td><code>number</code></td><td><code>200</code></td><td>Milliseconds before hiding. The pointer entering the card within this window cancels the hide.</td></tr><tr><td><code>focusTrigger</code></td><td><code>&#39;auto&#39; | &#39;always&#39; | &#39;never&#39;</code></td><td><code>&#39;auto&#39;</code></td><td>Whether focus opens the card. auto listens only when the trigger is itself focusable.</td></tr><tr><td><code>touchTrigger</code></td><td><code>&#39;auto&#39; | &#39;tap&#39; | &#39;none&#39;</code></td><td><code>&#39;auto&#39;</code></td><td>Tap behavior on touch. auto opens on a trigger that performs no action of its own and leaves the tap to buttons and links; tap always opens; none never opens. A tap-opened card closes on a tap outside.</td></tr><tr><td><code>isEnabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Enables the hover and focus triggers. Setting it to false also closes an open card.</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Accessible name for the card. With it the card is a named <code>role=&quot;dialog&quot;</code>; without it, a <code>role=&quot;group&quot;</code>.</td></tr><tr><td><code>hasHoverIndication</code></td><td><code>&#39;auto&#39; | boolean</code></td><td><code>&#39;auto&#39;</code></td><td>Dashed underline on the trigger. auto applies it only to a text-only trigger.</td></tr><tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>Controlled visibility. Hover and focus are ignored when set.</td></tr><tr><td><code>isDefaultOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Show the card on mount. Only applies when <code>isOpen</code> is unset.</td></tr></tbody></table></div><h2 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to “Events”">​</a></h2><ul><li><code>openChange(isOpen: boolean)</code>: fires when the card shows or hides. In the controlled mode, Escape emits <code>false</code> and the parent decides whether to close.</li></ul><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><div class="component-api-table" role="region" aria-label="HoverCard slots" tabindex="0"><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>default</code></td><td>The trigger. Plain text gains a dashed underline and becomes focusable; an element becomes the trigger that receives the events and ARIA attributes.</td></tr><tr><td><code>content</code></td><td>The card content, rich markup included. Replaces the <code>content</code> prop.</td></tr></tbody></table></div><h2 id="methods" tabindex="-1">Methods <a class="header-anchor" href="#methods" aria-label="Permalink to “Methods”">​</a></h2><ul><li><code>show()</code>: shows the card immediately, skipping the hover delay.</li><li><code>hide()</code>: hides the card immediately.</li><li><code>element</code>: the card layer element, or <code>null</code> before it mounts.</li></ul><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><p>The component renders a fragment: a trigger wrapper <code>&lt;span class=&quot;astryx-hover-card__trigger&quot;&gt;</code> plus a layer teleported to <code>body</code>. Attributes land on the wrapper; the layer receives none.</p><ul><li>HTML attributes, <code>aria-*</code>, <code>data-*</code>, <code>class</code>, and <code>style</code> all go to the wrapper.</li><li>The wrapper is a <code>display: contents</code> box when the trigger is an element, and the trigger itself, <code>display: inline</code>, when the trigger is plain text. Put layout attributes on the trigger element directly; on a text trigger you can put them on the component.</li><li>The <code>aria-haspopup</code>, <code>aria-controls</code>, <code>aria-expanded</code>, and <code>aria-describedby</code> the component manages are written onto the real trigger element and restored to their previous values when it unmounts.</li></ul><h2 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-label="Permalink to “Theme”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-hover-card</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-hover-card-background</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#fff</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-hover-card-foreground</span><span style="${ssrRenderStyle({
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
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-hover-card-background</code>: card background.</li><li><code>--astryx-hover-card-foreground</code>: card text color.</li><li><code>--astryx-hover-card-shadow</code>: card elevation.</li><li><code>--astryx-hover-card-radius</code>: card radius, defaulting to <code>--astryx-radius-container</code>.</li><li><code>--astryx-hover-card-indication-color</code>: dashed underline color.</li><li><code>--astryx-hover-card-z-index</code>: stacking order of the card.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/hover-card/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
