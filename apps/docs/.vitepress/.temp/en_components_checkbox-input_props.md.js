import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/checkbox-input/props.md
var __pageData = JSON.parse("{\"title\":\"Checkbox Input\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Checkbox Input\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/checkbox-input/props.md\",\"filePath\":\"en/components/checkbox-input/props.md\"}");
var _sfc_main = { name: "en/components/checkbox-input/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Properties" tabindex="0"><table><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>v-model</code></td><td><code>boolean | &#39;indeterminate&#39;</code></td><td>—</td><td>Required. The current selection.</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required. The accessible name.</td></tr><tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Native input ID. Generated when omitted.</td></tr><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39;</code></td><td><code>&#39;md&#39;</code></td><td>sm is 20px. md is 24px.</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Component width. Numbers use pixels.</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Description below the label.</td></tr><tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>Visually hides the label. Preserves its accessible name.</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Prevents changes. Excludes the field from form submission.</td></tr><tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Disabled reason. Keeps the disabled control focusable.</td></tr><tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td>false</td><td>Prevents changes. Checked fields still submit.</td></tr><tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>false</td><td>Shows loading. Blocks repeat activation.</td></tr><tr><td><code>loadingLabel</code></td><td><code>string</code></td><td><code>&#39;Loading&#39;</code></td><td>Accessible loading text.</td></tr><tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>Shows the required marker. Enables native required validation.</td></tr><tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>Shows the optional marker. Takes precedence over isRequired.</td></tr><tr><td><code>optionalLabel</code></td><td><code>string</code></td><td><code>&#39;Optional&#39;</code></td><td>Optional marker text.</td></tr><tr><td><code>requiredLabel</code></td><td><code>string</code></td><td><code>&#39;Required&#39;</code></td><td>Required marker text.</td></tr><tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>Form field name. Overrides native name.</td></tr><tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Status type, message and message ID.</td></tr><tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Decorative icon before the label.</td></tr><tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Tooltip for the information button beside the label.</td></tr><tr><td><code>changeAction</code></td><td><code>CheckboxInputChangeAction</code></td><td>—</td><td>Action after a selection change. Supports a Promise.</td></tr><tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td>false</td><td>Focuses the input after mounting.</td></tr></tbody></table></div><h2 id="status-messages" tabindex="-1">Status messages <a class="header-anchor" href="#status-messages" aria-label="Permalink to “Status messages”">​</a></h2><p><code>status</code> contains these fields:</p><ul><li><code>type</code>: <code>&#39;error&#39;</code>, <code>&#39;warning&#39;</code> or <code>&#39;success&#39;</code>.</li><li><code>message</code>: optional message text.</li><li><code>messageId</code>: optional message ID.</li></ul><p>Messages appear below the checkbox. Errors use assertive announcements. Warnings and successes use polite announcements.</p><h2 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to “Events”">​</a></h2><ul><li><code>update:modelValue(value)</code>: emits a boolean after activation.</li><li><code>change(value, event)</code>: fires after the model update.</li><li><code>actionError(error, value, event)</code>: fires when an action rejects or throws.</li></ul><p><code>event</code> is a cancelable <code>CheckboxInputChangeEvent</code>. <code>event.detail.originalEvent</code> contains the native event. Call <code>event.preventDefault()</code> in <code>change</code> to skip <code>changeAction</code>. This does not undo the model update.</p><h2 id="async-actions" tabindex="-1">Async actions <a class="header-anchor" href="#async-actions" aria-label="Permalink to “Async actions”">​</a></h2><p><code>changeAction(value, event)</code> receives the new value and component event.</p><ul><li>Returning a Promise shows the loading state.</li><li>Pending actions block repeat activation.</li><li>Explicit parent updates override the temporary selection.</li><li>Loading clears after success or failure.</li><li>Failures do not revert values written to <code>v-model</code>.</li><li>Use <code>@action-error</code> to show failure information.</li><li>Update the bound value in application code if you need a rollback.</li></ul><h2 id="native-forms" tabindex="-1">Native forms <a class="header-anchor" href="#native-forms" aria-label="Permalink to “Native forms”">​</a></h2><ul><li><code>htmlName</code> or <code>name</code> sets the field name.</li><li>Native <code>value</code> sets the submitted value. The default is <code>&#39;on&#39;</code>.</li><li><code>value</code> does not control selection. Use <code>v-model</code> for selection.</li><li>Unchecked and indeterminate fields do not submit.</li><li>Checked read-only fields submit.</li><li>Disabled fields do not submit.</li><li>Fields with a disabled reason use <code>aria-disabled</code> and have no native form owner.</li><li><code>isOptional</code> overrides <code>isRequired</code>. An explicit native <code>required</code> attribute still applies.</li></ul><p>After <code>form.reset()</code>, the component restores the current <code>v-model</code>. To clear the selection, update the bound value in the form&#39;s <code>reset</code> handler.</p><h2 id="template-references-and-attributes" tabindex="-1">Template references and attributes <a class="header-anchor" href="#template-references-and-attributes" aria-label="Permalink to “Template references and attributes”">​</a></h2><ul><li><code>element</code>: <code>HTMLInputElement | null</code>.</li><li><code>focus(options?: FocusOptions)</code>: focuses the input.</li><li><code>blur()</code>: removes input focus.</li><li><code>class</code> and <code>style</code> apply to the outer component.</li><li>Undeclared native attributes and events pass to <code>input</code>.</li><li><code>aria-labelledby</code> and <code>aria-describedby</code> merge with internal IDs.</li><li>The component owns <code>checked</code>, <code>indeterminate</code>, <code>type</code> and core ARIA states.</li></ul><h2 id="slots" tabindex="-1">Slots <a class="header-anchor" href="#slots" aria-label="Permalink to “Slots”">​</a></h2><ul><li><code>labelIcon</code>: a decorative icon before the label. Overrides the <code>labelIcon</code> prop.</li></ul><h2 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-label="Permalink to “Theme”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-checkbox</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-checkbox-accent</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#047857</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-checkbox-on-accent</span><span style="${ssrRenderStyle({
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
	})}">  --astryx-checkbox-focus</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#047857</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-checkbox-background</code>: unchecked background.</li><li><code>--astryx-checkbox-border</code>: unchecked border.</li><li><code>--astryx-checkbox-accent</code>: checked and indeterminate background.</li><li><code>--astryx-checkbox-on-accent</code>: selection mark color.</li><li><code>--astryx-checkbox-focus</code>: keyboard focus color.</li><li><code>--astryx-checkbox-disabled-background</code>: disabled unchecked background.</li><li><code>--astryx-radius-inner</code>: indicator corner radius.</li></ul><p>Neutral follows <code>color-scheme</code>. Set <code>data-astryx-color-mode=&quot;light&quot;</code> or <code>&quot;dark&quot;</code> to choose a mode.</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/checkbox-input/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
