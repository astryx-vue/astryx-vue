import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/checkbox-input/props.md
var __pageData = JSON.parse("{\"title\":\"复选框\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"复选框\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/checkbox-input/props.md\",\"filePath\":\"zh/components/checkbox-input/props.md\"}");
var _sfc_main = { name: "components/checkbox-input/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to “属性”">​</a></h2><div class="component-api-table" role="region" aria-label="属性列表" tabindex="0"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>v-model</code></td><td><code>boolean | &#39;indeterminate&#39;</code></td><td>—</td><td>必需，当前的选中状态，支持布尔值与半选。</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必需，作为控件无障碍名称的文本。</td></tr><tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>原生输入元素的 ID，省略时由组件自动生成。</td></tr><tr><td><code>size</code></td><td><code>&#39;sm&#39; | &#39;md&#39;</code></td><td><code>&#39;md&#39;</code></td><td>控件尺寸，sm 为 20px，md 为 24px。</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>组件宽度，传入数字时按像素处理。</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>显示在标签下方的补充说明。</td></tr><tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>在视觉上隐藏标签和说明，但保留它们的无障碍关联。</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>禁用控件并阻止修改，禁用字段不参与表单提交。</td></tr><tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>禁用原因的说明文字；提供后，禁用控件仍保持可聚焦，原因通过提示气泡展示。</td></tr><tr><td><code>isReadOnly</code></td><td><code>boolean</code></td><td>false</td><td>只读，阻止修改；已选中的字段仍会参与表单提交。</td></tr><tr><td><code>isLoading</code></td><td><code>boolean</code></td><td>false</td><td>显示加载状态，加载期间阻止重复切换。</td></tr><tr><td><code>loadingLabel</code></td><td><code>string</code></td><td><code>&#39;Loading&#39;</code></td><td>加载状态读给屏幕阅读器的提示文本。</td></tr><tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>显示“必填”提示，并启用原生必填校验。</td></tr><tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>显示“可选”提示，优先于 <code>isRequired</code>。</td></tr><tr><td><code>optionalLabel</code></td><td><code>string</code></td><td><code>&#39;Optional&#39;</code></td><td>“可选”提示的文字。</td></tr><tr><td><code>requiredLabel</code></td><td><code>string</code></td><td><code>&#39;Required&#39;</code></td><td>“必填”提示的文字。</td></tr><tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>表单提交时的字段名，优先于原生 <code>name</code> 属性。</td></tr><tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>状态消息，包含状态类型、可选的消息文本和消息 ID。</td></tr><tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>显示在标签前的装饰图标。</td></tr><tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签旁信息按钮的提示文字。</td></tr><tr><td><code>changeAction</code></td><td><code>CheckboxInputChangeAction</code></td><td>—</td><td>选中状态变化后执行的操作，可返回 Promise 用于异步提交。</td></tr><tr><td><code>hasAutoFocus</code></td><td><code>boolean</code></td><td>false</td><td>组件挂载后自动聚焦输入元素。</td></tr></tbody></table></div><h2 id="状态消息" tabindex="-1">状态消息 <a class="header-anchor" href="#状态消息" aria-label="Permalink to “状态消息”">​</a></h2><p><code>status</code> 包含以下字段：</p><ul><li><code>type</code>：<code>&#39;error&#39;</code>、<code>&#39;warning&#39;</code> 或 <code>&#39;success&#39;</code>。</li><li><code>message</code>：可选的消息文本。</li><li><code>messageId</code>：可选的消息 ID。</li></ul><p>消息显示在复选框下方。错误使用 assertive 播报。警告和成功使用 polite 播报。</p><h2 id="事件" tabindex="-1">事件 <a class="header-anchor" href="#事件" aria-label="Permalink to “事件”">​</a></h2><ul><li><code>update:modelValue(value)</code>：用户切换后发出布尔值。</li><li><code>change(value, event)</code>：模型更新后触发。</li><li><code>actionError(error, value, event)</code>：异步操作拒绝或同步抛出错误时触发。</li></ul><p><code>event</code> 是可取消的 <code>CheckboxInputChangeEvent</code>。 <code>event.detail.originalEvent</code> 保留原生事件。 在 <code>change</code> 中调用 <code>event.preventDefault()</code> 可跳过 <code>changeAction</code>。 此操作不会撤销模型更新。</p><h2 id="异步操作" tabindex="-1">异步操作 <a class="header-anchor" href="#异步操作" aria-label="Permalink to “异步操作”">​</a></h2><p><code>changeAction(value, event)</code> 接收新值和组件事件。</p><ul><li>操作返回 Promise 时，组件显示加载状态。</li><li>操作完成前，组件阻止重复切换。</li><li>父组件的新值优先于临时显示值。</li><li>Promise 成功或失败后，组件清除加载状态。</li><li>失败时，组件不会撤销写入 <code>v-model</code> 的值。</li><li>使用 <code>@action-error</code> 显示失败信息。</li><li>需要回滚时，由业务层更新绑定值。</li></ul><h2 id="原生表单" tabindex="-1">原生表单 <a class="header-anchor" href="#原生表单" aria-label="Permalink to “原生表单”">​</a></h2><ul><li><code>htmlName</code> 或 <code>name</code> 设置字段名。</li><li>原生 <code>value</code> 设置提交值。默认值是 <code>&#39;on&#39;</code>。</li><li><code>value</code> 不控制选中状态。选中状态由 <code>v-model</code> 控制。</li><li>未选和半选字段不参与提交。</li><li>只读字段在选中时参与提交。</li><li>禁用字段不参与提交。</li><li>带禁用原因的字段使用 <code>aria-disabled</code>，并脱离原生表单。</li><li><code>isOptional</code> 优先于 <code>isRequired</code>。单独传入的原生 <code>required</code> 仍生效。</li></ul><p>原生 <code>form.reset()</code> 后，组件恢复当前 <code>v-model</code>。 需要清空选择时，在表单的 <code>reset</code> 事件中更新绑定值。</p><h2 id="模板引用与属性" tabindex="-1">模板引用与属性 <a class="header-anchor" href="#模板引用与属性" aria-label="Permalink to “模板引用与属性”">​</a></h2><ul><li><code>element</code>：<code>HTMLInputElement | null</code>。</li><li><code>focus(options?: FocusOptions)</code>：聚焦输入元素。</li><li><code>blur()</code>：移除输入焦点。</li><li><code>class</code> 和 <code>style</code> 应用于组件外层。</li><li>未声明的原生属性和事件传入 <code>input</code>。</li><li><code>aria-labelledby</code> 和 <code>aria-describedby</code> 与组件内部 ID 合并。</li><li>组件管理 <code>checked</code>、<code>indeterminate</code>、<code>type</code> 和核心 ARIA 状态。</li></ul><h2 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to “插槽”">​</a></h2><ul><li><code>labelIcon</code>：标签前的装饰图标。优先于 <code>labelIcon</code> 属性。</li></ul><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-checkbox-background</code>：未选背景。</li><li><code>--astryx-checkbox-border</code>：未选边框。</li><li><code>--astryx-checkbox-accent</code>：选中与半选背景。</li><li><code>--astryx-checkbox-on-accent</code>：选中标记颜色。</li><li><code>--astryx-checkbox-focus</code>：键盘焦点颜色。</li><li><code>--astryx-checkbox-disabled-background</code>：禁用且未选时的背景。</li><li><code>--astryx-radius-inner</code>：指示器圆角。</li></ul><p>Neutral 自动适配 <code>color-scheme</code>。 使用 <code>data-astryx-color-mode=&quot;light&quot;</code> 或 <code>&quot;dark&quot;</code> 可指定模式。</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/checkbox-input/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
