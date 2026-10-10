import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/en/components/slider/props.md
var __pageData = JSON.parse("{\"title\":\"Slider\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"Slider\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"en/components/slider/props.md\",\"filePath\":\"en/components/slider/props.md\"}");
var _sfc_main = { name: "en/components/slider/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-label="Permalink to “Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Properties" tabindex="0"><table><thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><code>v-model</code></td><td><code>number | [number, number]</code></td><td>—</td><td>Required. A single value or a range.</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>Required. The slider name.</td></tr><tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Association ID prefix. Generated when omitted.</td></tr><tr><td><code>min</code></td><td><code>number</code></td><td>0</td><td>Minimum value.</td></tr><tr><td><code>max</code></td><td><code>number</code></td><td>100</td><td>Maximum value.</td></tr><tr><td><code>step</code></td><td><code>number</code></td><td>1</td><td>Increment per step. Must be greater than 0.</td></tr><tr><td><code>minStepsBetweenThumbs</code></td><td><code>number</code></td><td>0</td><td>Minimum number of steps between range thumbs.</td></tr><tr><td><code>orientation</code></td><td><code>&#39;horizontal&#39; | &#39;vertical&#39;</code></td><td>horizontal</td><td>Slider orientation.</td></tr><tr><td><code>valueDisplay</code></td><td><code>&#39;tooltip&#39; | &#39;text&#39; | &#39;none&#39;</code></td><td>tooltip</td><td>How to display values.</td></tr><tr><td><code>formatValue</code></td><td><code>(value: number) =&gt; string</code></td><td>—</td><td>Formats display values and accessible value text.</td></tr><tr><td><code>marks</code></td><td><code>SliderMark[]</code></td><td>—</td><td>Marks. Each has a value and optional label.</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Description below the label.</td></tr><tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>Hides the visual label. Preserves its accessible name.</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>Prevents changes. Excludes form values.</td></tr><tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>Disabled reason. Keeps disabled thumbs focusable.</td></tr><tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>Shows the required marker. Does not run native required validation.</td></tr><tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>Shows the optional marker. Overrides isRequired.</td></tr><tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>Required marker text.</td></tr><tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>Optional marker text.</td></tr><tr><td><code>minLabel</code></td><td><code>string</code></td><td>Minimum value</td><td>Accessible name for the lower thumb.</td></tr><tr><td><code>maxLabel</code></td><td><code>string</code></td><td>Maximum value</td><td>Accessible name for the upper thumb.</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>Field width. Numbers use pixels.</td></tr><tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>Name for hidden form values.</td></tr><tr><td><code>form</code></td><td><code>string</code></td><td>—</td><td>ID of the associated form.</td></tr><tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>Error, warning or success status.</td></tr><tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>Decorative label icon.</td></tr><tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>Information tooltip beside the label.</td></tr></tbody></table></div><h2 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-label="Permalink to “Events”">​</a></h2><ul><li><code>update:modelValue(value)</code>: updates a number or range.</li><li><code>change(value)</code>: fires when the value changes.</li><li><code>changeEnd(value)</code>: fires after a drag, pointer cancellation or keyboard adjustment.</li></ul><p>Each supported key press fires <code>changeEnd</code>. An unchanged value at a boundary does not fire <code>change</code>. Disabling the component during a drag cancels that drag. This cancellation does not fire <code>changeEnd</code>.</p><h2 id="ranges-and-steps" tabindex="-1">Ranges and steps <a class="header-anchor" href="#ranges-and-steps" aria-label="Permalink to “Ranges and steps”">​</a></h2><ul><li>Use a <code>number</code> for single-value mode.</li><li>Use <code>[number, number]</code> for range mode.</li><li>Steps are relative to <code>min</code>.</li><li>Minimum separation is <code>minStepsBetweenThumbs × step</code>.</li><li>Thumbs cannot cross.</li><li>Values outside the bounds display at the nearest bound.</li><li>Input ranges display in ascending order.</li><li>Display normalization does not update the bound model by itself.</li><li>Non-positive steps use <code>1</code>.</li><li>If <code>max</code> is below <code>min</code>, the interval collapses to <code>min</code>.</li></ul><h2 id="forms" tabindex="-1">Forms <a class="header-anchor" href="#forms" aria-label="Permalink to “Forms”">​</a></h2><ul><li>Set <code>htmlName</code> to submit one hidden field for a single value.</li><li>Ranges submit two hidden fields with the same name.</li><li>Read ranges with <code>FormData.getAll(name)</code>.</li><li>Disabled sliders do not submit values.</li><li>Native form reset does not change <code>v-model</code>.</li><li>Update the bound value in the form&#39;s <code>reset</code> handler to reset it.</li></ul><h2 id="template-references-and-attributes" tabindex="-1">Template references and attributes <a class="header-anchor" href="#template-references-and-attributes" aria-label="Permalink to “Template references and attributes”">​</a></h2><ul><li><code>element</code>: the control&#39;s <code>HTMLDivElement | null</code>.</li><li><code>focus(index = 0, options?)</code>: focuses the specified thumb.</li><li><code>blur()</code>: removes thumb focus.</li><li><code>class</code>, <code>style</code> and other attributes apply to the outer field.</li><li><code>aria-labelledby</code> and <code>aria-describedby</code> merge into each thumb.</li><li>The component owns thumb roles, values, bounds and disabled states.</li><li>The <code>labelIcon</code> slot replaces the label icon.</li></ul><h2 id="theme" tabindex="-1">Theme <a class="header-anchor" href="#theme" aria-label="Permalink to “Theme”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
		"--shiki-light": "#24292e",
		"--shiki-dark": "#e1e4e8",
		"--shiki-light-bg": "#fff",
		"--shiki-dark-bg": "#24292e"
	})}" tabindex="0" dir="ltr"><code><span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#6F42C1",
		"--shiki-dark": "#B392F0"
	})}">.my-slider</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#c13617",
		"--shiki-dark": "#FFAB70"
	})}">  --astryx-slider-accent</span><span style="${ssrRenderStyle({
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
	})}">  --astryx-slider-focus</span><span style="${ssrRenderStyle({
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
	})}">  --astryx-slider-height</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">: </span><span style="${ssrRenderStyle({
		"--shiki-light": "#005CC5",
		"--shiki-dark": "#79B8FF"
	})}">200</span><span style="${ssrRenderStyle({
		"--shiki-light": "#c62739",
		"--shiki-dark": "#F97583"
	})}">px</span><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">;</span></span>
<span class="line"><span style="${ssrRenderStyle({
		"--shiki-light": "#24292E",
		"--shiki-dark": "#E1E4E8"
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-slider-track</code>: unfilled track color.</li><li><code>--astryx-slider-accent</code>: filled track and thumb color.</li><li><code>--astryx-slider-focus</code>: keyboard focus color.</li><li><code>--astryx-slider-height</code>: vertical control height.</li></ul><p>Thumb diameter is fixed at <code>20px</code>. Track thickness is <code>4px</code>. Neutral follows the active light or dark mode.</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("en/components/slider/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
