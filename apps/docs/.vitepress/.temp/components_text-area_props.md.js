import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/text-area/props.md
var __pageData = JSON.parse("{\"title\":\"文本域\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"文本域\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/text-area/props.md\",\"filePath\":\"zh/components/text-area/props.md\"}");
var _sfc_main = { name: "components/text-area/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to “属性”">​</a></h2><div class="component-api-table" role="region" aria-label="属性列表" tabindex="0"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>v-model</code></td><td><code>string</code></td><td>—</td><td>必需。文本域的内容，通过 v-model 双向绑定。</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必需。字段的可见标签。</td></tr><tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>关联 ID 的前缀，省略时自动生成。</td></tr><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39; | &#39;lg&#39;</code></td><td>md</td><td>文本域的高度尺寸。</td></tr><tr><td><code>rows</code></td><td><code>number</code></td><td>—</td><td>原生 textarea 的 rows 属性。</td></tr><tr><td><code>cols</code></td><td><code>number</code></td><td>—</td><td>原生 textarea 的 cols 属性。</td></tr><tr><td><code>minlength</code></td><td><code>number | string</code></td><td>—</td><td>原生 textarea 的 minlength 属性。</td></tr><tr><td><code>maxlength</code></td><td><code>number | string</code></td><td>—</td><td>原生 textarea 的 maxlength 属性。</td></tr><tr><td><code>wrap</code></td><td><code>&#39;soft&#39; | &#39;hard&#39;</code></td><td>soft</td><td>原生 textarea 的 wrap 属性。</td></tr><tr><td><code>resize</code></td><td><code>&#39;none&#39; | &#39;both&#39; | &#39;horizontal&#39; | &#39;vertical&#39;</code></td><td>vertical</td><td>原生 resize 样式，控制可拖拽调整的方向。默认 vertical，只允许垂直拖动。</td></tr><tr><td><code>placeholder</code></td><td><code>string</code></td><td>—</td><td>输入为空时显示的占位文本，不能替代 label。</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>显示在标签下方的补充说明。</td></tr><tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>在视觉上隐藏标签，仍保留无障碍名称。</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>禁用文本域，内容不可修改，值也不会随表单提交。</td></tr><tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>说明禁用原因。设置后，被禁用的文本域仍可聚焦，以便用户查看原因。</td></tr><tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td>false</td><td>内容只读、不可修改，但值仍会随表单提交。</td></tr><tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>显示必填提示，但不会执行浏览器原生的必填校验。</td></tr><tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>显示可选提示。与 isRequired 同时设置时优先。</td></tr><tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>必填提示的显示文字，用于本地化。</td></tr><tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>可选提示的显示文字，用于本地化。</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>整个字段的宽度。数字按像素处理，CSS 字符串按原样使用。</td></tr><tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>原生 textarea 的 name 属性，优先于通过原生属性传入的 name。</td></tr><tr><td><code>form</code></td><td><code>string</code></td><td>—</td><td>原生 form 属性，通过 ID 关联所属表单。</td></tr><tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>设置字段的错误、警告或成功校验状态，可附带消息。</td></tr><tr><td><code>statusVariant</code></td><td><code>&#39;attached&#39; | &#39;detached&#39; | &#39;tooltip&#39;</code></td><td>detached</td><td>状态消息的展示方式。文本域默认为 detached，消息显示在控件下方。</td></tr><tr><td><code>changeAction</code></td><td><code>(value: string, event) =&gt; void | Promise&lt;void&gt;</code></td><td>—</td><td>内容变化后执行的动作。返回 Promise 时，组件会显示加载状态。</td></tr><tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>false</td><td>控制加载指示器的显示。</td></tr><tr><td><code>hasClear</code></td><td><code>boolean</code></td><td>false</td><td>在有内容且可编辑时显示清空按钮，点击后清空内容。</td></tr><tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td>false</td><td>组件挂载后自动聚焦文本域。</td></tr><tr><td><code>clearLabel</code></td><td><code>string</code></td><td>—</td><td>清空按钮的无障碍标签。</td></tr><tr><td><code>loadingLabel</code></td><td><code>string</code></td><td>Loading</td><td>加载指示器的无障碍标签。</td></tr><tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>显示在标签前的装饰图标。</td></tr><tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>在标签旁显示信息提示，悬停、键盘聚焦或点击都可以查看。</td></tr></tbody></table></div><h2 id="事件" tabindex="-1">事件 <a class="header-anchor" href="#事件" aria-label="Permalink to “事件”">​</a></h2><ul><li><code>update:modelValue(value)</code>：更新文本内容。</li><li><code>change(value, event)</code>：内容变化时触发。</li><li><code>clear(event)</code>：点击清空按钮时触发。</li><li><code>enter(event)</code>：按 Enter 时触发。Shift + Enter 不触发。</li><li><code>keydown(event)</code>：按键时触发。</li><li><code>actionError(error, value, event)</code>：changeAction 抛出异常时触发。</li></ul><p>内容变化时，<code>update:modelValue</code> 与 <code>change</code> 在 <code>changeAction</code> 之前触发。 取消 <code>change</code> 事件会阻止 <code>changeAction</code> 执行。</p><h2 id="原生属性" tabindex="-1">原生属性 <a class="header-anchor" href="#原生属性" aria-label="Permalink to “原生属性”">​</a></h2><ul><li><code>class</code>、<code>style</code> 和其他属性应用于字段外层。</li><li><code>aria-labelledby</code> 与 <code>aria-describedby</code> 合并到原生 textarea。</li><li>组件管理 textarea 的 <code>disabled</code>、<code>readonly</code> 与 <code>aria-invalid</code>。</li><li><code>icon</code> 插槽在文本域左侧显示装饰图标。</li><li><code>end</code> 插槽在文本域右侧显示附加内容。</li><li><code>labelIcon</code> 插槽替换标签前的图标。</li></ul><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-text-area-min-height-sm</code>：sm 尺寸最小高度。</li><li><code>--astryx-text-area-min-height-md</code>：md 尺寸最小高度。</li><li><code>--astryx-text-area-min-height-lg</code>：lg 尺寸最小高度。</li></ul><p>其他颜色与边框变量与 TextInput 共享。Neutral 自动适配明暗模式。</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/text-area/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
