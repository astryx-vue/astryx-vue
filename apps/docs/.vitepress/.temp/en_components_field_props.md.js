import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/field/props.md
var __pageData = JSON.parse("{\"title\":\"Field\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Field\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/field/props.md\",\"filePath\":\"en/components/field/props.md\"}");
var _sfc_main = { name: "en/components/field/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="field-props" tabindex="-1">Field Props <a class="header-anchor" href="#field-props" aria-label="Permalink to “Field Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Field Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>label</code></td><td><code>string</code></td><td>Required</td><td>Visible label. Still names the control when visually hidden.</td></tr><tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>Visually hides the label and description without removing accessible associations.</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Helper text between the label and control.</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Disabled state. Field/FieldLabel only style the label. Consumers disable their custom control.</td></tr><tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>Shows an optional indicator and takes precedence over isRequired.</td></tr><tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>Shows a required indicator; TextInput also sets aria-required.</td></tr><tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Vue icon component before the label. The labelIcon slot takes precedence.</td></tr><tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Info button beside the label, available on hover, keyboard focus and click.</td></tr><tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>Localized optional indicator.</td></tr><tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>Localized required indicator.</td></tr><tr><td><code>inputId</code></td><td><code>string</code></td><td>Required</td><td>ID of the labeled control. Must match the control id.</td></tr><tr><td><code>labelId</code></td><td><code>string</code></td><td>{inputId}-label</td><td>Label element ID, also used with aria-labelledby for groups.</td></tr><tr><td><code>descriptionId</code></td><td><code>string</code></td><td>{inputId}-description</td><td>Description ID, referenced by aria-describedby.</td></tr><tr><td><code>isGroupLabel</code></td><td><code>boolean</code></td><td>false</td><td>Uses a span to label groups such as radiogroup instead of a single-control label.</td></tr><tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Status type, optional message and custom messageId.</td></tr><tr><td><code>statusVariant</code></td><td><code>&#39;attached&#39; | &#39;detached&#39; | &#39;tooltip&#39;</code></td><td>attached</td><td>Tooltip hides the inline message but retains its description and announcement. The control supplies its own tooltip button.</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>auto</td><td>Whole-field width. Numbers become pixels.</td></tr></tbody></table></div><h2 id="fieldlabel-props" tabindex="-1">FieldLabel Props <a class="header-anchor" href="#fieldlabel-props" aria-label="Permalink to “FieldLabel Props”">​</a></h2><div class="component-api-table" role="region" aria-label="FieldLabel Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>label</code></td><td><code>string</code></td><td>Required</td><td>Visible label. Still names the control when visually hidden.</td></tr><tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>Visually hides the label and description without removing accessible associations.</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Helper text between the label and control.</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Disabled state. Field/FieldLabel only style the label. Consumers disable their custom control.</td></tr><tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>Shows an optional indicator and takes precedence over isRequired.</td></tr><tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>Shows a required indicator; TextInput also sets aria-required.</td></tr><tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Vue icon component before the label. The labelIcon slot takes precedence.</td></tr><tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Info button beside the label, available on hover, keyboard focus and click.</td></tr><tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>Localized optional indicator.</td></tr><tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>Localized required indicator.</td></tr><tr><td><code>inputId</code></td><td><code>string</code></td><td>Required</td><td>ID of the labeled control. Must match the control id.</td></tr><tr><td><code>labelId</code></td><td><code>string</code></td><td>{inputId}-label</td><td>Label element ID, also used with aria-labelledby for groups.</td></tr><tr><td><code>descriptionId</code></td><td><code>string</code></td><td>{inputId}-description</td><td>Description ID, referenced by aria-describedby.</td></tr><tr><td><code>isGroupLabel</code></td><td><code>boolean</code></td><td>false</td><td>Uses a span to label groups such as radiogroup instead of a single-control label.</td></tr></tbody></table></div><h2 id="fieldstatus-props" tabindex="-1">FieldStatus Props <a class="header-anchor" href="#fieldstatus-props" aria-label="Permalink to “FieldStatus Props”">​</a></h2><div class="component-api-table" role="region" aria-label="FieldStatus Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>type</code></td><td><code>&#39;error&#39; | &#39;warning&#39; | &#39;success&#39;</code></td><td>Required</td><td>Status meaning and color.</td></tr><tr><td><code>message</code></td><td><code>string</code></td><td>Required</td><td>Status text. An empty string hides the message box.</td></tr><tr><td><code>variant</code></td><td><code>&#39;attached&#39; | &#39;detached&#39;</code></td><td>attached</td><td>Attached overlaps a bordered control. Detached suits sliders, switches and similar controls.</td></tr><tr><td><code>isVisuallyHidden</code></td><td><code>boolean</code></td><td>false</td><td>Keeps only the accessible description and announcement when the control supplies its own tooltip.</td></tr></tbody></table></div><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><p>Field requires a default slot receiving the following properties:</p><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">interface</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> FieldSlotProps</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  inputId</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> string</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  labelId</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> string</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  descriptionId</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">?:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> string</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  statusId</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">?:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> string</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  describedBy</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">?:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> string</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>Field</code> and <code>FieldLabel</code> provide a <code>labelIcon</code> slot.</li><li>The <code>labelIcon</code> slot overrides the matching prop.</li><li>The icon is decorative.</li><li><code>FieldStatus</code> has no slots. Pass its text through <code>message</code>.</li></ul><h2 id="status-messages" tabindex="-1">Status messages <a class="header-anchor" href="#status-messages" aria-label="Permalink to “Status messages”">​</a></h2><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">interface</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> FieldStatusInput</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  type</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &#39;error&#39;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &#39;warning&#39;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> |</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &#39;success&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  message</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">?:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> string</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  messageId</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">?:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> string</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><h3 id="announcements" tabindex="-1">Announcements <a class="header-anchor" href="#announcements" aria-label="Permalink to “Announcements”">​</a></h3><ul><li><code>error</code> uses an <code>aria-live=&quot;assertive&quot;</code> region.</li><li><code>warning</code> uses an <code>aria-live=&quot;polite&quot;</code> region.</li><li><code>success</code> uses an <code>aria-live=&quot;polite&quot;</code> region.</li><li>When the message changes, the component announces it again.</li><li>An empty message clears the announcement region.</li><li>The visual message does not duplicate <code>aria-live</code>.</li></ul><h3 id="message-layout" tabindex="-1">Message layout <a class="header-anchor" href="#message-layout" aria-label="Permalink to “Message layout”">​</a></h3><ul><li><code>attached</code>: joins the message to the control. Place it beneath a bordered control inside <code>Field</code>.</li><li><code>detached</code>: separates the message from the control. The message includes a status icon.</li><li><code>Field</code> in <code>tooltip</code> mode: hidden text remains available for descriptions and announcements. The inner control supplies the tooltip button.</li></ul><p>For a standalone <code>FieldStatus</code>, use <code>detached</code>.</p><h2 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to “Events”">​</a></h2><p>These three components declare no custom events.</p><h2 id="template-refs" tabindex="-1">Template refs <a class="header-anchor" href="#template-refs" aria-label="Permalink to “Template refs”">​</a></h2><p>Each component exposes <code>element</code>:</p><table tabindex="0"><thead><tr><th>Component</th><th>Element</th></tr></thead><tbody><tr><td><code>Field</code></td><td>The field&#39;s root <code>div</code>.</td></tr><tr><td><code>FieldLabel</code></td><td>The label element or group <code>span</code>.</td></tr><tr><td><code>FieldStatus</code></td><td>The visual message element.</td></tr></tbody></table><p>Before mounting, <code>element</code> is <code>null</code>. Without a message, <code>FieldStatus.element</code> is <code>null</code>.</p><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><table tabindex="0"><thead><tr><th>Component</th><th>Attribute target</th></tr></thead><tbody><tr><td><code>Field</code></td><td>The field root.</td></tr><tr><td><code>FieldLabel</code></td><td>The label group.</td></tr><tr><td><code>FieldStatus</code></td><td>The message element.</td></tr></tbody></table><p>Pass these directly to the inner control:</p><ul><li><code>name</code>.</li><li><code>required</code>.</li><li><code>disabled</code>.</li><li>Control event listeners.</li></ul><h2 id="imports" tabindex="-1">Imports <a class="header-anchor" href="#imports" aria-label="Permalink to “Imports”">​</a></h2><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">import</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> type</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> { FieldProps, FieldSlotProps, FieldStatusInput } </span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">from</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &#39;@astryx-vue/core/Field&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">import</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> { Field, FieldLabel, FieldStatus } </span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">from</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &#39;@astryx-vue/core/Field&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">import</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}"> &#39;@astryx-vue/themes/neutral.css&#39;</span></span></code></pre></div><h2 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-label="Permalink to “Theme”">​</a></h2><ul><li><code>--astryx-spacing-1</code>: spacing between field contents.</li><li><code>--astryx-spacing-2</code>: padding for detached status messages.</li><li><code>--astryx-radius-element</code>: status message corner radius.</li><li><code>--astryx-color-text-secondary</code>: supporting text color.</li><li><code>--astryx-text-label-size</code>: label font size.</li><li><code>--astryx-text-supporting-size</code>: description and status message font size.</li></ul><p>Status colors use the <code>TextInput</code> variables. See <a href="/en/components/text-input/props#validation-states">TextInput validation states</a> for the complete list.</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/field/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
