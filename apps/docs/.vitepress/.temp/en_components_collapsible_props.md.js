import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/collapsible/props.md
var __pageData = JSON.parse("{\"title\":\"Collapsible\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Collapsible\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/collapsible/props.md\",\"filePath\":\"en/components/collapsible/props.md\"}");
var _sfc_main = { name: "en/components/collapsible/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Collapsible Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>trigger</code></td><td><code>string</code></td><td>-</td><td>Plain-text label for the trigger. Use the <code>trigger</code> slot instead when the label needs a heading, an icon, or extra controls; the slot replaces this prop.</td></tr><tr><td><code>v-model:isOpen</code></td><td><code>boolean</code></td><td>-</td><td>Controlled open state. While bound, the component renders exactly this value and a click only requests an update; leave it unbound to let the component manage its own state.</td></tr><tr><td><code>defaultIsOpen</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Whether the content starts expanded while <code>isOpen</code> is unbound.</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Dims the trigger, marks it <code>aria-disabled</code>, and takes it out of the tab order. Clicks no longer toggle the content, and content that is already open stays open.</td></tr><tr><td><code>chevronPosition</code></td><td><code>CollapsibleChevronPosition</code></td><td><code>&#39;end&#39;</code></td><td>Logical position of the disclosure chevron. <code>end</code> (default) follows the label, pointing down while collapsed and up while expanded; <code>start</code> leads the label, pointing into the content while collapsed (mirrored under RTL) and down while expanded.</td></tr></tbody></table></div><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><div class="component-api-table" role="region" aria-label="Collapsible Slots" tabindex="0"><table><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody><tr><td><code>default</code></td><td>The content hidden while collapsed and revealed while expanded.</td></tr><tr><td><code>trigger</code></td><td>The trigger label. Accepts headings, icons, and other markup, and replaces the <code>trigger</code> prop.</td></tr></tbody></table></div><h2 id="events-and-template-ref" tabindex="-1">Events and template ref <a class="header-anchor" href="#events-and-template-ref" aria-label="Permalink to “Events and template ref”">​</a></h2><div class="component-api-table" role="region" aria-label="Collapsible Events" tabindex="0"><table><thead><tr><th>Name</th><th>Signature</th><th>Description</th></tr></thead><tbody><tr><td><code>openChange</code></td><td><code>(isOpen: boolean) =&gt; void</code></td><td>Emitted when the trigger asks for a new open state. In uncontrolled usage it reports the change; in controlled usage it is the request to update the bound value.</td></tr><tr><td><code>update:isOpen</code></td><td><code>(isOpen: boolean) =&gt; void</code></td><td>Listened to automatically by <code>v-model:isOpen</code>; you rarely handle it yourself.</td></tr><tr><td><code>element</code></td><td><code>HTMLDivElement | null</code></td><td>The root element, exposed through a template ref.</td></tr></tbody></table></div><h2 id="theming" tabindex="-1">Theming <a class="header-anchor" href="#theming" aria-label="Permalink to “Theming”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-collapsible</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-collapsible-trigger-foreground</span><span style="${ssrRenderStyle({
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
	})}">  --astryx-collapsible-content-foreground</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#525252</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-collapsible-trigger-foreground</code>: trigger label color.</li><li><code>--astryx-collapsible-content-foreground</code>: content text color.</li><li><code>--astryx-collapsible-pressed-overlay</code>: overlay painted on the trigger while it is held down, and only then.</li><li><code>--astryx-collapsible-focus</code>: keyboard focus outline color.</li><li><code>--astryx-spacing-1</code>, <code>--astryx-text-large-size</code>, <code>--astryx-text-body-size</code>: the padding and both type sizes reuse the global tokens.</li></ul><p>The neutral theme adapts to light and dark mode on its own.</p><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><p>The root element is a <code>&lt;div&gt;</code>.</p><p>The following go to the root element:</p><ul><li>HTML attributes.</li><li><code>aria-*</code> attributes.</li><li><code>data-*</code> attributes.</li><li><code>class</code>.</li><li><code>style</code>.</li></ul><p>The trigger is a <code>&lt;button type=&quot;button&quot;&gt;</code> inside the root element; its <code>aria-expanded</code>, <code>aria-controls</code>, <code>aria-disabled</code>, and <code>tabindex</code> are maintained by the component. Disabling never sets the native <code>disabled</code> attribute, so assistive technology keeps perceiving the trigger.</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/collapsible/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
