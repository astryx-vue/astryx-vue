import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/banner/props.md
var __pageData = JSON.parse("{\"title\":\"Banner\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Banner\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/banner/props.md\",\"filePath\":\"en/components/banner/props.md\"}");
var _sfc_main = { name: "en/components/banner/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Properties" tabindex="0"><table><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>status</code></td><td><code>&#39;info&#39; | &#39;success&#39; | &#39;warning&#39; | &#39;error&#39;</code></td><td>—</td><td>Required. Message status.</td></tr><tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>Required. Message title.</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Supporting text below the title.</td></tr><tr><td><code>icon</code></td><td><code>Component</code></td><td>—</td><td>Custom decorative icon.</td></tr><tr><td><code>isDismissable</code></td><td><code>boolean</code></td><td>false</td><td>Shows the dismiss button. Dismissal hides the component.</td></tr><tr><td><code>dismissLabel</code></td><td><code>string</code></td><td>Dismiss {title}</td><td>Accessible name for the dismiss button.</td></tr><tr><td><code>container</code></td><td><code>&#39;card&#39; | &#39;section&#39;</code></td><td>card</td><td>card has rounded corners. section has square corners.</td></tr><tr><td><code>elevation</code></td><td><code>&#39;none&#39; | &#39;low&#39; | &#39;med&#39; | &#39;high&#39;</code></td><td>none</td><td>Shadow depth for the whole banner.</td></tr><tr><td><code>collapsible</code></td><td><code>boolean</code></td><td>true</td><td>Whether detail content can collapse.</td></tr><tr><td><code>defaultIsOpen</code></td><td><code>boolean</code></td><td>false</td><td>Initial expansion when isOpen is not bound.</td></tr><tr><td><code>v-model:isOpen</code></td><td><code>boolean</code></td><td>—</td><td>Controls expansion from the parent.</td></tr><tr><td><code>expandLabel</code></td><td><code>string</code></td><td>Expand details</td><td>Accessible name for the expand button.</td></tr><tr><td><code>collapseLabel</code></td><td><code>string</code></td><td>Collapse details</td><td>Accessible name for the collapse button.</td></tr></tbody></table></div><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><ul><li>Default: details below the header.</li><li><code>title</code>: replaces the visible title. The <code>title</code> prop remains required.</li><li><code>description</code>: replaces the supporting text.</li><li><code>icon</code>: replaces the decorative status icon.</li><li><code>end</code>: action buttons at the end of the header.</li></ul><p>Title, description and detail slots accept block content.</p><h2 id="expanding-and-collapsing" tabindex="-1">Expanding and collapsing <a class="header-anchor" href="#expanding-and-collapsing" aria-label="Permalink to “Expanding and collapsing”">​</a></h2><ul><li>Detail content enables the expand button.</li><li>Details start collapsed by default.</li><li><code>defaultIsOpen</code> sets the initial state only.</li><li><code>v-model:isOpen</code> controls the current state.</li><li><code>collapsible</code> set to <code>false</code> keeps details visible.</li><li>Collapsing unmounts the details.</li><li>If a parent closes focused details, focus returns to the expand button.</li></ul><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}">Banner</span><span style="${ssrRenderStyle({
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
	})}">open</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> status</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">=</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;info&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> title</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">=</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;Configuration changes&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">  &lt;p&gt;Review the updated settings before continuing.&lt;/p&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">&lt;/</span><span style="${ssrRenderStyle({
		"--shiki-light": "#11782a",
		"--shiki-dark": "#85E89D"
	})}">Banner</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">&gt;</span></span></code></pre></div><h2 id="dismissal" tabindex="-1">Dismissal <a class="header-anchor" href="#dismissal" aria-label="Permalink to “Dismissal”">​</a></h2><ul><li><code>isDismissable</code> shows a dismiss button.</li><li>Clicking it hides the component.</li><li>The component emits <code>dismiss</code>.</li><li>Dismissal tries to restore focus to the element used before entering the banner.</li><li>Remount the component or change its <code>key</code> to show it again.</li></ul><h2 id="events-and-template-references" tabindex="-1">Events and template references <a class="header-anchor" href="#events-and-template-references" aria-label="Permalink to “Events and template references”">​</a></h2><ul><li><code>update:isOpen(value)</code>: requests an expansion change.</li><li><code>dismiss()</code>: dismisses the banner.</li><li><code>element</code>: the root <code>HTMLDivElement | null</code>. It becomes <code>null</code> after dismissal.</li></ul><h2 id="localization" tabindex="-1">Localization <a class="header-anchor" href="#localization" aria-label="Permalink to “Localization”">​</a></h2><p>Provide translated control labels:</p><ul><li><code>dismissLabel</code>: dismiss button.</li><li><code>expandLabel</code>: expand button.</li><li><code>collapseLabel</code>: collapse button.</li></ul><h2 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-label="Permalink to “Theme”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-banner</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-banner-info-background</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#ecfdf5</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-banner-info-foreground</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#065f46</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-banner-info-background</code>: information background.</li><li><code>--astryx-banner-info-foreground</code>: information text and icon.</li><li><code>--astryx-banner-success-background</code>: success background.</li><li><code>--astryx-banner-success-foreground</code>: success text and icon.</li><li><code>--astryx-banner-warning-background</code>: warning background.</li><li><code>--astryx-banner-warning-foreground</code>: warning text and icon.</li><li><code>--astryx-banner-error-background</code>: error background.</li><li><code>--astryx-banner-error-foreground</code>: error text and icon.</li><li><code>--astryx-banner-content-background</code>: detail background.</li><li><code>--astryx-banner-border</code>: detail border.</li><li><code>--astryx-radius-container</code>: card corner radius.</li></ul><p>Neutral follows the active light or dark mode.</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/banner/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
