import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/text-area/props.md
var __pageData = JSON.parse("{\"title\":\"Text Area\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Text Area\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/text-area/props.md\",\"filePath\":\"en/components/text-area/props.md\"}");
var _sfc_main = { name: "en/components/text-area/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Props list" tabindex="0"><table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>v-model</code></td><td><code>string</code></td><td>—</td><td>Required. Text content.</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required. Field name.</td></tr><tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Prefix for associated IDs. Auto-generated when omitted.</td></tr><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39; | &#39;lg&#39;</code></td><td>md</td><td>Text area height.</td></tr><tr><td><code>rows</code></td><td><code>number</code></td><td>—</td><td>Native textarea rows.</td></tr><tr><td><code>cols</code></td><td><code>number</code></td><td>—</td><td>Native textarea cols.</td></tr><tr><td><code>minlength</code></td><td><code>number | string</code></td><td>—</td><td>Native textarea minlength.</td></tr><tr><td><code>maxlength</code></td><td><code>number | string</code></td><td>—</td><td>Native textarea maxlength.</td></tr><tr><td><code>wrap</code></td><td><code>&#39;soft&#39; | &#39;hard&#39;</code></td><td>soft</td><td>Native textarea wrap.</td></tr><tr><td><code>resize</code></td><td><code>&#39;none&#39; | &#39;both&#39; | &#39;horizontal&#39; | &#39;vertical&#39;</code></td><td>vertical</td><td>Native textarea resize. Vertical dragging is enabled by default.</td></tr><tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>Placeholder text.</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Description below the label.</td></tr><tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>Hide the visual label. Keep the accessible name.</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Prevent edits. Do not submit the form value.</td></tr><tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Reason for disabling. The disabled text area stays focusable when provided.</td></tr><tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td>false</td><td>Prevent edits. Include the value in form submission.</td></tr><tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>Show a required description. Does not run native required validation.</td></tr><tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>Show an optional description. Takes precedence over isRequired.</td></tr><tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>Required description text.</td></tr><tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>Optional description text.</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Width of the whole field. Numbers are treated as px.</td></tr><tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>Native textarea name.</td></tr><tr><td><code>form</code></td><td><code>string</code></td><td>—</td><td>ID of the associated form.</td></tr><tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Error, warning, or success status.</td></tr><tr><td><code>statusVariant</code></td><td><code>&#39;attached&#39; | &#39;detached&#39; | &#39;tooltip&#39;</code></td><td>detached</td><td>How the status message is displayed. Text area defaults to below the control.</td></tr><tr><td><code>changeAction</code></td><td><code>(value: string, event) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>Action to run after content changes.</td></tr><tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>false</td><td>Show a loading indicator.</td></tr><tr><td><code>hasClear</code></td><td><code>boolean</code></td><td>false</td><td>Show a clear button.</td></tr><tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td>false</td><td>Focus on mount.</td></tr><tr><td><code>clearLabel</code></td><td><code>string</code></td><td>—</td><td>Accessible label for the clear button.</td></tr><tr><td><code>loadingLabel</code></td><td><code>string</code></td><td>Loading</td><td>Accessible label for the loading indicator.</td></tr><tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Decorative icon before the label.</td></tr><tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Info tooltip beside the label.</td></tr></tbody></table></div><h2 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to “Events”">​</a></h2><ul><li><code>update:modelValue(value)</code>：update text content.</li><li><code>change(value, event)</code>：fired when content changes.</li><li><code>clear(event)</code>：fired when the clear button is clicked.</li><li><code>enter(event)</code>：fired on Enter. Shift + Enter does not fire it.</li><li><code>keydown(event)</code>：fired on any key press.</li><li><code>actionError(error, value, event)</code>：fired when changeAction throws.</li></ul><p>When content changes, <code>update:modelValue</code> and <code>change</code> fire before <code>changeAction</code>. Cancelling the <code>change</code> event prevents <code>changeAction</code> from running.</p><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><ul><li><code>class</code>, <code>style</code>, and other attributes are applied to the field wrapper.</li><li><code>aria-labelledby</code> and <code>aria-describedby</code> are merged into the native textarea.</li><li>The component manages <code>disabled</code>, <code>readonly</code>, and <code>aria-invalid</code>.</li><li>The <code>icon</code> slot shows a decorative icon on the left.</li><li>The <code>end</code> slot shows extra content on the right.</li><li>The <code>labelIcon</code> slot replaces the icon before the label.</li></ul><h2 id="theming" tabindex="-1">Theming <a class="header-anchor" href="#theming" aria-label="Permalink to “Theming”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-text-area</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-text-area-min-height-md</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">120</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">px</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-text-area-min-height-sm</code>: minimum height for the sm size.</li><li><code>--astryx-text-area-min-height-md</code>: minimum height for the md size.</li><li><code>--astryx-text-area-min-height-lg</code>: minimum height for the lg size.</li></ul><p>Other color and border variables are shared with TextInput. Neutral adapts to light and dark modes.</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/text-area/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
