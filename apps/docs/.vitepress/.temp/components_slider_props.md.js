import { t as _plugin_vue_export_helper_default } from "./plugin-vue_export-helper.BOaGB7Aw.js";
import { useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
//#region docs/zh/components/slider/props.md
var __pageData = JSON.parse("{\"title\":\"滑块\",\"description\":\"\",\"frontmatter\":{\"layout\":\"component-docs\",\"title\":\"滑块\",\"outline\":false,\"footer\":false},\"headers\":[],\"relativePath\":\"components/slider/props.md\",\"filePath\":\"zh/components/slider/props.md\"}");
var _sfc_main = { name: "components/slider/props.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(_attrs)}><h2 id="属性" tabindex="-1">属性 <a class="header-anchor" href="#属性" aria-label="Permalink to “属性”">​</a></h2><div class="component-api-table" role="region" aria-label="属性列表" tabindex="0"><table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody><tr><td><code>v-model</code></td><td><code>number | [number, number]</code></td><td>—</td><td>必需。单值或区间值。</td></tr><tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>必需。滑块名称。</td></tr><tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>关联 ID 的前缀。省略时自动生成。</td></tr><tr><td><code>min</code></td><td><code>number</code></td><td>0</td><td>最小值。</td></tr><tr><td><code>max</code></td><td><code>number</code></td><td>100</td><td>最大值。</td></tr><tr><td><code>step</code></td><td><code>number</code></td><td>1</td><td>每步的增量。必须大于 0。</td></tr><tr><td><code>minStepsBetweenThumbs</code></td><td><code>number</code></td><td>0</td><td>区间两个滑块之间的最小步数。</td></tr><tr><td><code>orientation</code></td><td><code>&#39;horizontal&#39; | &#39;vertical&#39;</code></td><td>horizontal</td><td>滑动方向。</td></tr><tr><td><code>valueDisplay</code></td><td><code>&#39;tooltip&#39; | &#39;text&#39; | &#39;none&#39;</code></td><td>tooltip</td><td>数值的显示方式。</td></tr><tr><td><code>formatValue</code></td><td><code>(value: number) =&gt; string</code></td><td>—</td><td>格式化显示值和无障碍数值文本。</td></tr><tr><td><code>marks</code></td><td><code>SliderMark[]</code></td><td>—</td><td>刻度列表。每项包含 value 和可选的 label。</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签下方的说明。</td></tr><tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td>false</td><td>隐藏视觉标签。保留无障碍名称。</td></tr><tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td>false</td><td>阻止修改。不提交表单值。</td></tr><tr><td><code>disabledMessage</code></td><td><code>string</code></td><td>—</td><td>禁用原因。提供原因时，禁用滑块仍可聚焦。</td></tr><tr><td><code>isRequired</code></td><td><code>boolean</code></td><td>false</td><td>显示必填提示。不会执行原生必填校验。</td></tr><tr><td><code>isOptional</code></td><td><code>boolean</code></td><td>false</td><td>显示可选提示。优先于 isRequired。</td></tr><tr><td><code>requiredLabel</code></td><td><code>string</code></td><td>Required</td><td>必填提示文本。</td></tr><tr><td><code>optionalLabel</code></td><td><code>string</code></td><td>Optional</td><td>可选提示文本。</td></tr><tr><td><code>minLabel</code></td><td><code>string</code></td><td>Minimum value</td><td>区间下限的无障碍名称。</td></tr><tr><td><code>maxLabel</code></td><td><code>string</code></td><td>Maximum value</td><td>区间上限的无障碍名称。</td></tr><tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>整个字段的宽度。数字按 px 处理。</td></tr><tr><td><code>htmlName</code></td><td><code>string</code></td><td>—</td><td>隐藏表单字段的名称。</td></tr><tr><td><code>form</code></td><td><code>string</code></td><td>—</td><td>关联表单的 ID。</td></tr><tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>字段的错误、警告或成功状态。</td></tr><tr><td><code>labelIcon</code></td><td><code>Component</code></td><td>—</td><td>标签前的装饰图标。</td></tr><tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签旁的信息提示。</td></tr></tbody></table></div><h2 id="事件" tabindex="-1">事件 <a class="header-anchor" href="#事件" aria-label="Permalink to “事件”">​</a></h2><ul><li><code>update:modelValue(value)</code>：更新单值或区间。</li><li><code>change(value)</code>：数值改变时触发。</li><li><code>changeEnd(value)</code>：拖动结束、指针取消或键盘调整结束时触发。</li></ul><p>键盘每次有效按键都触发 <code>changeEnd</code>。 到达边界后，值不变时不触发 <code>change</code>。 拖动过程中禁用组件会中止本次拖动。 中止时不触发 <code>changeEnd</code>。</p><h2 id="区间与步长" tabindex="-1">区间与步长 <a class="header-anchor" href="#区间与步长" aria-label="Permalink to “区间与步长”">​</a></h2><ul><li>单值模式使用 <code>number</code>。</li><li>区间模式使用 <code>[number, number]</code>。</li><li>步长从 <code>min</code> 开始计算。</li><li>最小间隔为 <code>minStepsBetweenThumbs × step</code>。</li><li>两个滑块不能越过彼此。</li><li>越界的传入值按边界显示。</li><li>传入区间按从小到大显示。</li><li>组件不会因修正显示值而主动修改绑定值。</li><li>非正步长按 <code>1</code> 处理。</li><li><code>max</code> 小于 <code>min</code> 时，区间收缩到 <code>min</code>。</li></ul><h2 id="表单" tabindex="-1">表单 <a class="header-anchor" href="#表单" aria-label="Permalink to “表单”">​</a></h2><ul><li>设置 <code>htmlName</code> 后，单值提交一个隐藏字段。</li><li>区间提交两个同名隐藏字段。</li><li>使用 <code>FormData.getAll(name)</code> 读取区间。</li><li>禁用滑块不提交值。</li><li>原生表单重置不会改变 <code>v-model</code>。</li><li>需要重置值时，在表单的 <code>reset</code> 事件中更新绑定值。</li></ul><h2 id="模板引用与属性" tabindex="-1">模板引用与属性 <a class="header-anchor" href="#模板引用与属性" aria-label="Permalink to “模板引用与属性”">​</a></h2><ul><li><code>element</code>：滑动区域的 <code>HTMLDivElement | null</code>。</li><li><code>focus(index = 0, options?)</code>：聚焦指定滑块。</li><li><code>blur()</code>：移除滑块焦点。</li><li><code>class</code>、<code>style</code> 和其他属性应用于字段外层。</li><li><code>aria-labelledby</code> 和 <code>aria-describedby</code> 合并到每个滑块。</li><li>组件管理滑块的角色、当前值、边界和禁用状态。</li><li><code>labelIcon</code> 插槽替换标签图标。</li></ul><h2 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to “主题”">​</a></h2><div class="language-css"><button title="Copy code" data-copied="Copied" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark" style="${ssrRenderStyle({
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
	})}">}</span></span></code></pre></div><ul><li><code>--astryx-slider-track</code>：未选轨道颜色。</li><li><code>--astryx-slider-accent</code>：已选轨道和滑块颜色。</li><li><code>--astryx-slider-focus</code>：键盘焦点颜色。</li><li><code>--astryx-slider-height</code>：垂直滑块的高度。</li></ul><p>滑块直径固定为 <code>20px</code>。轨道厚度为 <code>4px</code>。 Neutral 自动适配明暗模式。</p></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("zh/components/slider/props.md");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var props_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { __pageData, props_default as default };
