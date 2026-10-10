import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/field/props.md
var __pageData = JSON.parse("{\"title\":\"表单字段\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"表单字段\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/field/props.md\",\"filePath\":\"zh/components/field/props.md\"}");
var _sfc_main = { name: "components/field/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="field-props" tabindex="-1">Field Props <a class="header-anchor" href="#field-props" aria-label="Permalink to “Field Props”">​</a></h2><div class="component-api-table" role="region" aria-label="Field Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>字段的可见标签；即使视觉上隐藏，也仍作为控件的无障碍名称。</td></tr><tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>在视觉上隐藏标签和说明，但保留它们与控件的无障碍关联。</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>显示在标签下方、控件上方的补充说明。</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>禁用状态。Field 和 FieldLabel 只调整标签样式，控件本身由使用方禁用。</td></tr><tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>显示“可选”提示；与 <code>isRequired</code> 同时设置时优先。</td></tr><tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>显示“必填”提示；在 <code>TextInput</code> 中还会同时设置 <code>aria-required</code>。</td></tr><tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>显示在标签前的 Vue 图标组件；<code>labelIcon</code> 插槽优先于该属性。</td></tr><tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签旁的信息按钮，提示内容支持悬停、键盘聚焦和点击查看。</td></tr><tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>“可选”提示的本地化文字。</td></tr><tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>“必填”提示的本地化文字。</td></tr><tr><td><code>inputId</code></td><td><code>string</code></td><td>必需</td><td>被标记控件的 ID，必须与内部控件的 <code>id</code> 一致。</td></tr><tr><td><code>labelId</code></td><td><code>string</code></td><td>{inputId}-label</td><td>标签自身的 ID；作为分组标签时，由分组容器通过 <code>aria-labelledby</code> 引用。</td></tr><tr><td><code>descriptionId</code></td><td><code>string</code></td><td>{inputId}-description</td><td>说明文字的 ID，控件通过 <code>aria-describedby</code> 引用它。</td></tr><tr><td><code>isGroupLabel</code></td><td><code>boolean</code></td><td>false</td><td>为 <code>radiogroup</code> 等分组输出 <code>span</code> 而不是 <code>label</code>，避免把分组当作单个控件。</td></tr><tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>字段状态，包含状态类型、可选的消息文本和自定义 <code>messageId</code>。</td></tr><tr><td><code>statusVariant</code></td><td><code>&#39;attached&#39; | &#39;detached&#39; | &#39;tooltip&#39;</code></td><td>attached</td><td><code>tooltip</code> 隐藏行内消息框，但保留描述与屏幕阅读器播报，提示按钮由内部控件自行提供。</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>auto</td><td>整个字段的宽度，传入数字时按像素处理。</td></tr></tbody></table></div><h2 id="fieldlabel-props" tabindex="-1">FieldLabel Props <a class="header-anchor" href="#fieldlabel-props" aria-label="Permalink to “FieldLabel Props”">​</a></h2><div class="component-api-table" role="region" aria-label="FieldLabel Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>可见标签。隐藏时仍为控件提供名称。</td></tr><tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>视觉上隐藏标签和说明，保留无障碍关联。</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方、控件上方的补充说明。</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>禁用状态。Field/FieldLabel 只改变标签样式，控件由使用方禁用。</td></tr><tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>显示可选提示。与 isRequired 同时设置时优先。</td></tr><tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>显示必填提示。TextInput 同时设置 aria-required。</td></tr><tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>标签前的 Vue 图标组件。labelIcon 插槽优先。</td></tr><tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签旁的信息按钮，支持悬停、键盘聚焦和点击。</td></tr><tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>可选提示的本地化文字。</td></tr><tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>必填提示的本地化文字。</td></tr><tr><td><code>inputId</code></td><td><code>string</code></td><td>必需</td><td>被标记控件的 ID。必须与控件 id 相同。</td></tr><tr><td><code>labelId</code></td><td><code>string</code></td><td>{inputId}-label</td><td>标签自身 ID。分组使用 aria-labelledby 引用。</td></tr><tr><td><code>descriptionId</code></td><td><code>string</code></td><td>{inputId}-description</td><td>说明 ID。控件通过 aria-describedby 引用。</td></tr><tr><td><code>isGroupLabel</code></td><td><code>boolean</code></td><td>false</td><td>为 radiogroup 等分组输出 span，避免把分组当作单个控件。</td></tr></tbody></table></div><h2 id="fieldstatus-props" tabindex="-1">FieldStatus Props <a class="header-anchor" href="#fieldstatus-props" aria-label="Permalink to “FieldStatus Props”">​</a></h2><div class="component-api-table" role="region" aria-label="FieldStatus Props" tabindex="0"><table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>type</code></td><td><code>&#39;error&#39; | &#39;warning&#39; | &#39;success&#39;</code></td><td>必需</td><td>状态语义与配色。</td></tr><tr><td><code>message</code></td><td><code>string</code></td><td>必需</td><td>状态文字。空字符串不显示消息框。</td></tr><tr><td><code>variant</code></td><td><code>&#39;attached&#39; | &#39;detached&#39;</code></td><td>attached</td><td>attached 与有边框的控件重叠。detached 适合滑块、开关等。</td></tr><tr><td><code>isVisuallyHidden</code></td><td><code>boolean</code></td><td>false</td><td>只保留无障碍描述和播报，用于控件自行提供 tooltip 的场景。</td></tr></tbody></table></div><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><p>Field 的 default 为必需插槽，接收以下参数：</p><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}">}</span></span></code></pre></div><ul><li><code>Field</code> 和 <code>FieldLabel</code> 提供 <code>labelIcon</code> 插槽。</li><li><code>labelIcon</code> 插槽覆盖同名属性。</li><li>图标只作装饰用途。</li><li><code>FieldStatus</code> 不提供插槽。文字通过 <code>message</code> 传入。</li></ul><h2 id="状态消息" tabindex="-1">状态消息 <a class="header-anchor" href="#状态消息" aria-label="Permalink to “状态消息”">​</a></h2><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}">}</span></span></code></pre></div><h3 id="播报规则" tabindex="-1">播报规则 <a class="header-anchor" href="#播报规则" aria-label="Permalink to “播报规则”">​</a></h3><ul><li><code>error</code> 使用 <code>aria-live=&quot;assertive&quot;</code> 区域。</li><li><code>warning</code> 使用 <code>aria-live=&quot;polite&quot;</code> 区域。</li><li><code>success</code> 使用 <code>aria-live=&quot;polite&quot;</code> 区域。</li><li>消息变化时，组件重新播报消息。</li><li>消息为空时，组件清空播报区域。</li><li>视觉消息不重复设置 <code>aria-live</code>。</li></ul><h3 id="消息布局" tabindex="-1">消息布局 <a class="header-anchor" href="#消息布局" aria-label="Permalink to “消息布局”">​</a></h3><ul><li><code>attached</code>：消息紧贴控件。必须放在 <code>Field</code> 内有边框的控件下方。</li><li><code>detached</code>：消息与控件分离。消息包含状态图标。</li><li><code>Field</code> 的 <code>tooltip</code> 模式：隐藏文字仍用于描述和播报。内部控件负责提供提示按钮。</li></ul><p>独立使用 <code>FieldStatus</code> 时，使用 <code>detached</code>。</p><h2 id="事件" tabindex="-1">事件 <a class="header-anchor" href="#事件" aria-label="Permalink to “事件”">​</a></h2><p>这三个组件不声明自定义事件。</p><h2 id="模板引用" tabindex="-1">模板引用 <a class="header-anchor" href="#模板引用" aria-label="Permalink to “模板引用”">​</a></h2><p>每个组件都公开 <code>element</code>：</p><table tabindex="0"><thead><tr><th>组件</th><th>元素</th></tr></thead><tbody><tr><td><code>Field</code></td><td>字段根 <code>div</code>。</td></tr><tr><td><code>FieldLabel</code></td><td>标签元素或分组 <code>span</code>。</td></tr><tr><td><code>FieldStatus</code></td><td>视觉消息元素。</td></tr></tbody></table><p>挂载前，<code>element</code> 为 <code>null</code>。 没有消息时，<code>FieldStatus.element</code> 为 <code>null</code>。</p><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><table tabindex="0"><thead><tr><th>组件</th><th>属性接收位置</th></tr></thead><tbody><tr><td><code>Field</code></td><td>字段根元素。</td></tr><tr><td><code>FieldLabel</code></td><td>标签组。</td></tr><tr><td><code>FieldStatus</code></td><td>消息元素。</td></tr></tbody></table><p>以下内容必须直接传给内部控件：</p><ul><li><code>name</code>。</li><li><code>required</code>。</li><li><code>disabled</code>。</li><li>控件事件监听器。</li></ul><h2 id="导入" tabindex="-1">导入 <a class="header-anchor" href="#导入" aria-label="Permalink to “导入”">​</a></h2><div class="language-ts"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">ts</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}"> &#39;@astryx-vue/themes/neutral.css&#39;</span></span></code></pre></div><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><ul><li><code>--astryx-spacing-1</code>：字段内容间距。</li><li><code>--astryx-spacing-2</code>：分离状态消息的内边距。</li><li><code>--astryx-radius-element</code>：状态消息圆角。</li><li><code>--astryx-color-text-secondary</code>：辅助文字颜色。</li><li><code>--astryx-text-label-size</code>：标签字号。</li><li><code>--astryx-text-supporting-size</code>：说明与状态消息字号。</li></ul><p>状态颜色与 <code>TextInput</code> 共用变量。完整列表见 <a href="/components/text-input/props#校验状态">TextInput 校验状态</a>。</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/field/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
