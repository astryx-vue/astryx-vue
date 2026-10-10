import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/text-input/props.md
var __pageData = JSON.parse("{\"title\":\"Text Input\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Text Input\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/text-input/props.md\",\"filePath\":\"en/components/text-input/props.md\"}");
var _sfc_main = { name: "en/components/text-input/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="textinput-props" tabindex="-1">TextInput Props <a class="header-anchor" href="#textinput-props" aria-label="Permalink to “TextInput Props”">​</a></h2><div class="component-api-table" role="region" aria-label="TextInput Props" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>modelValue</code></td><td><code>string</code></td><td>Required</td><td>Input value, normally bound with v-model.</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>Required</td><td>Visible label. Still names the control when visually hidden.</td></tr><tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>Visually hides the label and description without removing accessible associations.</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Helper text between the label and control.</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Disables the input. Disabled values are excluded from form submission.</td></tr><tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>Shows an optional indicator and takes precedence over isRequired.</td></tr><tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>Shows a required indicator; TextInput also sets aria-required.</td></tr><tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Vue icon component before the label. The labelIcon slot takes precedence.</td></tr><tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Info button beside the label, available on hover, keyboard focus and click.</td></tr><tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>Localized optional indicator.</td></tr><tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>Localized required indicator.</td></tr><tr><td><code>id</code></td><td><code>string</code></td><td>Generated</td><td>Native input ID. Label and description associations update together.</td></tr><tr><td><code>type</code></td><td><code>&#39;text&#39; | &#39;password&#39; | &#39;email&#39;</code></td><td>text</td><td>Single-line input type. Use a textarea for multiline content.</td></tr><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39; | &#39;lg&#39;</code></td><td>md</td><td>Neutral heights are 28, 32 and 36px respectively.</td></tr><tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td>false</td><td>Prevents editing, but remains focusable, undimmed and included in form submission.</td></tr><tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Disabled reason. Uses aria-disabled and readonly to preserve focus, while blocking edits and excluding the field from submission.</td></tr><tr><td><code>startIcon</code></td><td><code>Component</code></td><td>—</td><td>Decorative leading icon component. The icon slot takes precedence.</td></tr><tr><td><code>status</code></td><td><code>TextInputStatus</code></td><td>—</td><td>Error, warning or success, optionally with message and messageId. Error sets aria-invalid.</td></tr><tr><td><code>statusVariant</code></td><td><code>&#39;attached&#39; | &#39;detached&#39; | &#39;tooltip&#39;</code></td><td>attached</td><td>Attached, detached or an icon tooltip. All variants describe the input accessibly.</td></tr><tr><td><code>changeAction</code></td><td><code>(value: string, event: TextInputChangeEvent) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>Runs after a value change. A returned Promise automatically drives pending state.</td></tr><tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>false</td><td>External loading state, combined with pending actions without disabling editing.</td></tr><tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>Empty-value hint. Does not replace the label.</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>auto</td><td>Width of the whole field. Numbers are pixels, CSS strings are used unchanged.</td></tr><tr><td><code>hasClear</code></td><td><code>boolean</code></td><td>false</td><td>Shows a clear button for nonempty editable values and restores input focus after clearing.</td></tr><tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td>false</td><td>Focuses the native input after mounting.</td></tr><tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>Native name, taking precedence over a forwarded name and removed when disabled.</td></tr><tr><td><code>autoComplete</code></td><td><code>string</code></td><td>—</td><td>Forwarded unchanged to native autocomplete.</td></tr><tr><td><code>clearLabel</code></td><td><code>string</code></td><td>Clear {label}</td><td>Localized clear-button name.</td></tr><tr><td><code>loadingLabel</code></td><td><code>string</code></td><td>Loading</td><td>Localized loading-indicator name.</td></tr></tbody></table></div><h2 id="status-type" tabindex="-1">Status type <a class="header-anchor" href="#status-type" aria-label="Permalink to “Status type”">​</a></h2><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}"> TextInputStatus</span><span style="${ssrRenderStyle({
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
	})}">}</span></span></code></pre></div><h2 id="textinput-slots" tabindex="-1">TextInput Slots <a class="header-anchor" href="#textinput-slots" aria-label="Permalink to “TextInput Slots”">​</a></h2><div class="component-api-table" role="region" aria-label="TextInput Slots" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>icon</code></td><td><code>() =&gt; VNode[]</code></td><td>—</td><td>Decorative leading icon, overriding startIcon. Keep interactive controls out of this slot.</td></tr><tr><td><code>end</code></td><td><code>() =&gt; VNode[]</code></td><td>—</td><td>Trailing content, including buttons. Consumers provide accessible names.</td></tr><tr><td><code>labelIcon</code></td><td><code>() =&gt; VNode[]</code></td><td>—</td><td>Decorative label icon, overriding the labelIcon prop.</td></tr></tbody></table></div><h2 id="textinput-events" tabindex="-1">TextInput Events <a class="header-anchor" href="#textinput-events" aria-label="Permalink to “TextInput Events”">​</a></h2><div class="component-api-table" role="region" aria-label="TextInput Events" tabindex="0"><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>update:modelValue</code></td><td><code>value: string</code></td><td>—</td><td>v-model update, before change and changeAction.</td></tr><tr><td><code>change</code></td><td><code>value: string, event: TextInputChangeEvent</code></td><td>—</td><td>Emitted after each committed edit or clear. event.preventDefault() skips changeAction without undoing the model update.</td></tr><tr><td><code>enter</code></td><td><code>event: KeyboardEvent</code></td><td>—</td><td>Enter outside IME composition. Canceled keydown events suppress it.</td></tr><tr><td><code>keydown</code></td><td><code>event: KeyboardEvent</code></td><td>—</td><td>Native keyboard event. PreventDefault() can suppress enter.</td></tr><tr><td><code>clear</code></td><td><code>event: MouseEvent</code></td><td>—</td><td>Clear-button activation. Still emits update:modelValue and change and runs an uncanceled action.</td></tr><tr><td><code>actionError</code></td><td><code>error: unknown, value: string, event: TextInputChangeEvent</code></td><td>—</td><td>Emitted after a synchronous throw or Promise rejection. Pending is cleaned automatically.</td></tr></tbody></table></div><h2 id="textinputchangeevent" tabindex="-1">TextInputChangeEvent <a class="header-anchor" href="#textinputchangeevent" aria-label="Permalink to “TextInputChangeEvent”">​</a></h2><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">type</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> TextInputChangeEvent</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}"> =</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> CustomEvent</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">&lt;{</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  value</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}"> string</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  originalEvent</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">:</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> Event</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}&gt;</span></span></code></pre></div><ul><li>Native <code>input</code> events are usually not cancelable.</li><li><code>change</code> supplies a cancelable component event.</li><li><code>event.detail.value</code> contains the new value.</li><li><code>event.detail.originalEvent</code> contains the original event.</li><li><code>changeAction</code> and <code>actionError</code> receive the same component event.</li></ul><p>The original event type depends on the action:</p><table tabindex="0"><thead><tr><th>Action</th><th>Type</th></tr></thead><tbody><tr><td>Enter text</td><td><code>InputEvent</code></td></tr><tr><td>Confirm input method composition</td><td><code>CompositionEvent</code></td></tr><tr><td>Click the clear button</td><td><code>MouseEvent</code></td></tr></tbody></table><h2 id="async-actions" tabindex="-1">Async actions <a class="header-anchor" href="#async-actions" aria-label="Permalink to “Async actions”">​</a></h2><p><code>changeAction</code> receives the new value and component event. Returning a Promise displays a loading indicator.</p><ul><li><strong>Editing</strong>: the input remains editable while saving. Clearing the value also runs <code>changeAction</code>.</li><li><strong>Loading</strong>: <code>aria-busy</code> stays <code>true</code> while any action is unfinished. It clears after all actions settle, including rejected actions.</li><li><strong>Value updates</strong>: new values from the parent take precedence over temporary display values.</li><li><strong>Concurrent saves</strong>: cancel older requests or check request versions in your application to prevent stale results from overwriting newer values.</li><li><strong>Errors</strong>: handle <code>@action-error</code> to show a message. To roll back, update the value bound with <code>v-model</code>.</li></ul><h2 id="template-refs" tabindex="-1">Template refs <a class="header-anchor" href="#template-refs" aria-label="Permalink to “Template refs”">​</a></h2><p>Template refs expose these properties and methods:</p><ul><li><code>element: HTMLInputElement | null</code>: the native input element, or <code>null</code> before mounting.</li><li><code>focus(options?: FocusOptions)</code>: focuses the input.</li><li><code>blur()</code>: removes focus from the input.</li><li><code>select()</code>: selects all input text.</li></ul><h2 id="native-attributes" tabindex="-1">Native attributes <a class="header-anchor" href="#native-attributes" aria-label="Permalink to “Native attributes”">​</a></h2><ul><li><code>maxlength</code>, <code>minlength</code>, <code>pattern</code>, <code>required</code>, <code>form</code>, <code>aria-*</code>, <code>data-*</code> and native event listeners are forwarded to the native <code>input</code>.</li><li><code>class</code> and <code>style</code> apply to the input wrapper; <code>width</code> applies to the whole <code>Field</code>.</li><li>The component manages <code>value</code>, <code>type</code>, <code>disabled</code>, <code>readonly</code>, <code>autofocus</code> and core ARIA state. Use the corresponding component props.</li><li><code>aria-describedby</code> and <code>aria-labelledby</code> merge with the component&#39;s internal association IDs.</li></ul><h3 id="disabled-and-read-only-states" tabindex="-1">Disabled and read-only states <a class="header-anchor" href="#disabled-and-read-only-states" aria-label="Permalink to “Disabled and read-only states”">​</a></h3><ul><li><strong>Disabled without a reason</strong>: native <code>disabled</code> prevents editing, focus and submission of the field.</li><li><strong>Disabled with <code>disabledMessage</code></strong>: <code>aria-disabled</code> and <code>readonly</code> preserve focus so the reason can be discovered. The component removes <code>name</code> and blocks edits and clearing.</li><li><strong>Read-only</strong>: the input remains focusable, allows copying and is included in <code>FormData</code>.</li><li>Disabled takes precedence when both states are set.</li></ul><h2 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-label="Permalink to “Theme”">​</a></h2><p>Add a class to the component to override theme variables:</p><div class="language-vue"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}">TextInput</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> v-model</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">=</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">email</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> class</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">=</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;my-input&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}"> label</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">=</span><span style="${ssrRenderStyle({
		"--shiki-light": "#032F62",
		"--shiki-dark": "#9ECBFF"
	})}">&quot;Email&quot;</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> /&gt;</span></span></code></pre></div><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-input</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-input-focus</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">#10b981</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-radius-element</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">8</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">px</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><h3 id="appearance-and-size" tabindex="-1">Appearance and size <a class="header-anchor" href="#appearance-and-size" aria-label="Permalink to “Appearance and size”">​</a></h3><ul><li><code>--astryx-input-background</code>: input background color.</li><li><code>--astryx-input-border</code>: default border color.</li><li><code>--astryx-input-focus</code>: focus border color when no validation status is set.</li><li><code>--astryx-radius-element</code>: input corner radius.</li><li><code>--astryx-input-height-sm</code>: small height; Neutral defaults to <code>28px</code>.</li><li><code>--astryx-input-height-md</code>: medium height; Neutral defaults to <code>32px</code>.</li><li><code>--astryx-input-height-lg</code>: large height; Neutral defaults to <code>36px</code>.</li></ul><h3 id="validation-states" tabindex="-1">Validation states <a class="header-anchor" href="#validation-states" aria-label="Permalink to “Validation states”">​</a></h3><p>Each state provides three variables for the border and icon, message text, and message background:</p><ul><li><strong>Error</strong>: <code>--astryx-input-error</code>, <code>--astryx-input-error-foreground</code>, <code>--astryx-input-error-background</code>.</li><li><strong>Warning</strong>: <code>--astryx-input-warning</code>, <code>--astryx-input-warning-foreground</code>, <code>--astryx-input-warning-background</code>.</li><li><strong>Success</strong>: <code>--astryx-input-success</code>, <code>--astryx-input-success-foreground</code>, <code>--astryx-input-success-background</code>.</li></ul><p>Override status variables on a parent containing the whole field to style both the input and its status message.</p><h3 id="color-mode" tabindex="-1">Color mode <a class="header-anchor" href="#color-mode" aria-label="Permalink to “Color mode”">​</a></h3><ul><li>Neutral selects its colors from CSS <code>color-scheme</code>.</li><li>Set <code>data-astryx-color-mode=&quot;light&quot;</code> on the root element or theme container to use light mode.</li><li>Set <code>data-astryx-color-mode=&quot;dark&quot;</code> to use dark mode.</li></ul></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/text-input/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
