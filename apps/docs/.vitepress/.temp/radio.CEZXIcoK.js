import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$3 } from "./Field-C_z-m3_N.DzPNT5mn.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createVNode, defineComponent, inject, mergeModels, mergeProps, normalizeStyle, openBlock, provide, renderList, renderSlot, shallowRef, toDisplayString, unref, useAttrs, useId, useModel, useSSRContext, useTemplateRef, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/Radio-CAIIygzO.js
var radioContextKey = Symbol("astryx-radio-context");
var _hoisted_1$1 = [
	"for",
	"data-disabled",
	"data-readonly"
];
var _hoisted_2 = [
	"id",
	"name",
	"value",
	"checked",
	"disabled",
	"readonly",
	"aria-describedby"
];
var _hoisted_3 = { class: "astryx-radio-content" };
var _hoisted_4 = { class: "astryx-radio-label" };
var _hoisted_5 = ["id"];
var _sfc_main$2 = /*@__PURE__*/ defineComponent({
	name: "AstryxRadio",
	__name: "Radio",
	props: {
		value: {},
		label: {},
		description: {},
		id: {},
		isDisabled: { type: Boolean },
		isReadOnly: { type: Boolean }
	},
	emits: ["change"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const attrs = useAttrs();
		const context = inject(radioContextKey, void 0);
		const generatedId = `astryx-radio-option-${useId()}`;
		const inputId = computed(() => props.id ?? generatedId);
		const name = computed(() => context?.name.value ?? attrs.name ?? inputId.value);
		const selectedValue = computed(() => context?.selectedValue.value ?? null);
		const isSelected = computed(() => selectedValue.value === props.value);
		const isDisabled = computed(() => props.isDisabled || context?.isGroupDisabled.value);
		const isReadOnly = computed(() => props.isReadOnly || context?.isGroupReadOnly.value);
		function change(event) {
			if (isDisabled.value || isReadOnly.value) return;
			if (context) context.select(props.value, event);
			else emit("change", props.value, event);
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("label", {
				for: inputId.value,
				class: "astryx-radio",
				"data-disabled": isDisabled.value || void 0,
				"data-readonly": isReadOnly.value || void 0
			}, [
				createElementVNode("input", {
					id: inputId.value,
					class: "astryx-radio-native",
					type: "radio",
					name: name.value,
					value: __props.value,
					checked: isSelected.value,
					disabled: isDisabled.value,
					readonly: isReadOnly.value,
					"aria-describedby": __props.description ? `${inputId.value}-description` : void 0,
					onChange: change
				}, null, 40, _hoisted_2),
				_cache[0] || (_cache[0] = createElementVNode("span", {
					class: "astryx-radio-indicator",
					"aria-hidden": "true"
				}, null, -1)),
				createElementVNode("span", _hoisted_3, [createElementVNode("span", _hoisted_4, toDisplayString(__props.label), 1), __props.description ? (openBlock(), createElementBlock("span", {
					key: 0,
					id: `${inputId.value}-description`,
					class: "astryx-radio-description"
				}, toDisplayString(__props.description), 9, _hoisted_5)) : createCommentVNode("v-if", true)])
			], 8, _hoisted_1$1);
		};
	}
});
var _hoisted_1 = ["aria-labelledby", "aria-describedby"];
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	name: "AstryxRadioGroup",
	__name: "RadioGroup",
	props: /*@__PURE__*/ mergeModels({
		id: {},
		name: {},
		options: {},
		status: {},
		statusVariant: { default: "detached" },
		width: {},
		isDisabled: { type: Boolean },
		isReadOnly: { type: Boolean },
		label: {},
		isLabelHidden: { type: Boolean },
		isOptional: { type: Boolean },
		isRequired: { type: Boolean },
		description: {},
		labelIcon: {},
		labelTooltip: {},
		optionalLabel: {},
		requiredLabel: {}
	}, {
		"modelValue": { required: true },
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["update:modelValue", "change"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const model = useModel(__props, "modelValue");
		const generatedName = `astryx-radio-${useId()}`;
		const groupName = computed(() => props.name ?? generatedName);
		const group = useTemplateRef("group");
		const generatedId = `astryx-radio-group-${useId()}`;
		const inputId = computed(() => props.id ?? generatedId);
		const style = computed(() => ({ "--astryx-field-width": typeof props.width === "number" ? `${props.width}px` : props.width }));
		__expose({ element: group });
		function select(value, event) {
			if (props.isDisabled || props.isReadOnly) return;
			const changeEvent = new CustomEvent("change", {
				cancelable: true,
				detail: {
					value,
					originalEvent: event
				}
			});
			if (event.defaultPrevented) changeEvent.preventDefault();
			model.value = value;
			emit("change", value, changeEvent);
		}
		provide(radioContextKey, {
			name: groupName,
			selectedValue: model,
			select,
			isGroupDisabled: computed(() => props.isDisabled ?? false),
			isGroupReadOnly: computed(() => props.isReadOnly ?? false),
			isRequired: computed(() => (props.isRequired && !props.isOptional) ?? false)
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(_sfc_main$3, {
				ref_key: "group",
				ref: group,
				class: "astryx-radio-group",
				style: normalizeStyle(style.value),
				label: __props.label,
				"input-id": inputId.value,
				"is-group-label": "",
				description: __props.description,
				width: __props.width,
				"is-label-hidden": __props.isLabelHidden,
				"is-disabled": __props.isDisabled,
				"is-optional": __props.isOptional,
				"is-required": __props.isRequired,
				"label-icon": __props.labelIcon,
				"label-tooltip": __props.labelTooltip,
				"optional-label": __props.optionalLabel,
				"required-label": __props.requiredLabel,
				status: __props.status,
				"status-variant": __props.statusVariant
			}, createSlots({
				default: withCtx((field) => [createElementVNode("div", {
					class: "astryx-radio-group-list",
					role: "radiogroup",
					"aria-labelledby": field.labelId,
					"aria-describedby": field.describedBy
				}, [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (option) => {
					return openBlock(), createBlock(_sfc_main$2, {
						key: option.value,
						value: option.value,
						label: option.label,
						description: option.description,
						"is-disabled": option.isDisabled
					}, null, 8, [
						"value",
						"label",
						"description",
						"is-disabled"
					]);
				}), 128)), renderSlot(_ctx.$slots, "default")], 8, _hoisted_1)]),
				_: 2
			}, [_ctx.$slots.labelIcon ? {
				name: "labelIcon",
				fn: withCtx(() => [renderSlot(_ctx.$slots, "labelIcon")]),
				key: "0"
			} : void 0]), 1032, [
				"style",
				"label",
				"input-id",
				"description",
				"width",
				"is-label-hidden",
				"is-disabled",
				"is-optional",
				"is-required",
				"label-icon",
				"label-tooltip",
				"optional-label",
				"required-label",
				"status",
				"status-variant"
			]);
		};
	}
});
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxRadioList",
	__name: "RadioList",
	props: /*@__PURE__*/ mergeModels({
		id: {},
		name: {},
		options: {},
		status: {},
		statusVariant: {},
		width: {},
		isDisabled: { type: Boolean },
		isReadOnly: { type: Boolean },
		label: {},
		isLabelHidden: { type: Boolean },
		isOptional: { type: Boolean },
		isRequired: { type: Boolean },
		description: {},
		labelIcon: {},
		labelTooltip: {},
		optionalLabel: {},
		requiredLabel: {}
	}, {
		"modelValue": { required: true },
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["update:modelValue", "change"], ["update:modelValue"]),
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		const model = useModel(__props, "modelValue");
		return (_ctx, _cache) => {
			return openBlock(), createBlock(_sfc_main$1, {
				modelValue: model.value,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
				label: __props.label,
				description: __props.description,
				width: __props.width,
				"is-label-hidden": __props.isLabelHidden,
				"is-disabled": __props.isDisabled,
				"is-optional": __props.isOptional,
				"is-required": __props.isRequired,
				"label-icon": __props.labelIcon,
				"label-tooltip": __props.labelTooltip,
				"optional-label": __props.optionalLabel,
				"required-label": __props.requiredLabel,
				status: __props.status,
				"status-variant": __props.statusVariant,
				name: __props.name,
				options: __props.options,
				onChange: _cache[1] || (_cache[1] = (value, event) => emit("change", value, event))
			}, createSlots({
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 2
			}, [_ctx.$slots.labelIcon ? {
				name: "labelIcon",
				fn: withCtx(() => [renderSlot(_ctx.$slots, "labelIcon")]),
				key: "0"
			} : void 0]), 1032, [
				"modelValue",
				"label",
				"description",
				"width",
				"is-label-hidden",
				"is-disabled",
				"is-optional",
				"is-required",
				"label-icon",
				"label-tooltip",
				"optional-label",
				"required-label",
				"status",
				"status-variant",
				"name",
				"options"
			]);
		};
	}
});
//#endregion
//#region components/demos/radio/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		const size = shallowRef("md");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$1), {
				modelValue: size.value,
				"onUpdate:modelValue": ($event) => size.value = $event,
				label: "Size"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(_sfc_main$2), {
							value: "sm",
							label: "Small"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$2), {
							value: "md",
							label: "Medium"
						}, null, _parent, _scopeId));
						_push(ssrRenderComponent(unref(_sfc_main$2), {
							value: "lg",
							label: "Large"
						}, null, _parent, _scopeId));
					} else return [
						createVNode(unref(_sfc_main$2), {
							value: "sm",
							label: "Small"
						}),
						createVNode(unref(_sfc_main$2), {
							value: "md",
							label: "Medium"
						}),
						createVNode(unref(_sfc_main$2), {
							value: "lg",
							label: "Large"
						})
					];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/radio/basic.vue
var _sfc_setup$2 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/radio/basic.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/radio/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { Radio, RadioGroup } from '@astryx-vue/core/Radio'\nimport { shallowRef } from 'vue'\n\nconst size = shallowRef('md')\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <RadioGroup v-model=\"size\" label=\"Size\">\n      <Radio value=\"sm\" label=\"Small\" />\n      <Radio value=\"md\" label=\"Medium\" />\n      <Radio value=\"lg\" label=\"Large\" />\n    </RadioGroup>\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Radio, RadioGroup } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Radio'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> size</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'md'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">RadioGroup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">size</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Size\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Radio</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Small\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Radio</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"md\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Medium\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Radio</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"lg\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Large\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">RadioGroup</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/radio/list.vue?vue&type=script&setup=true&lang.ts
var list_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "list",
	__ssrInlineRender: true,
	setup(__props) {
		const plan = shallowRef("team");
		const options = [
			{
				value: "free",
				label: "Free",
				description: "For personal projects."
			},
			{
				value: "team",
				label: "Team",
				description: "For small teams."
			},
			{
				value: "enterprise",
				label: "Enterprise",
				description: "For organizations."
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: plan.value,
				"onUpdate:modelValue": ($event) => plan.value = $event,
				label: "Plan",
				options
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/radio/list.vue
var _sfc_setup$1 = list_vue_vue_type_script_setup_true_lang_default.setup;
list_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/radio/list.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var list_default$1 = list_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/radio/list.vue?raw&highlighted
var list_default = {
	"source": "<script setup lang=\"ts\">\nimport { RadioList } from '@astryx-vue/core/Radio'\nimport { shallowRef } from 'vue'\n\nconst plan = shallowRef('team')\nconst options = [\n  { value: 'free', label: 'Free', description: 'For personal projects.' },\n  { value: 'team', label: 'Team', description: 'For small teams.' },\n  { value: 'enterprise', label: 'Enterprise', description: 'For organizations.' },\n]\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <RadioList v-model=\"plan\" label=\"Plan\" :options=\"options\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { RadioList } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Radio'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> plan</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'team'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> options</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { value: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'free'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Free'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, description: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'For personal projects.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { value: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'team'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Team'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, description: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'For small teams.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  { value: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'enterprise'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Enterprise'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, description: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'For organizations.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> },</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">RadioList</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">plan</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Plan\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">options</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">options</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/radio/states.vue?vue&type=script&setup=true&lang.ts
var states_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "states",
	__ssrInlineRender: true,
	setup(__props) {
		const selected = shallowRef("b");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$1), {
				modelValue: selected.value,
				"onUpdate:modelValue": ($event) => selected.value = $event,
				label: "Disabled option",
				options: [{
					value: "a",
					label: "Available"
				}, {
					value: "b",
					label: "Unavailable",
					isDisabled: true
				}]
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/radio/states.vue
var _sfc_setup = states_vue_vue_type_script_setup_true_lang_default.setup;
states_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/radio/states.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var states_default$1 = states_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/radio/states.vue?raw&highlighted
var states_default = {
	"source": "<script setup lang=\"ts\">\nimport { RadioGroup } from '@astryx-vue/core/Radio'\nimport { shallowRef } from 'vue'\n\nconst selected = shallowRef('b')\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <RadioGroup v-model=\"selected\" label=\"Disabled option\" :options=\"[{ value: 'a', label: 'Available' }, { value: 'b', label: 'Unavailable', isDisabled: true }]\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { RadioGroup } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Radio'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> selected</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'b'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">RadioGroup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">selected</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Disabled option\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">options</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">[{ value: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'a'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Available'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }, { value: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'b'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Unavailable'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, isDisabled: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }]</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/radio/index.ts
var options = { className: "input-preview-host" };
var radioBasic = defineDemo(basic_default$1, basic_default, options);
var radioList = defineDemo(list_default$1, list_default, options);
var radioStates = defineDemo(states_default$1, states_default, options);
//#endregion
export { radioList as n, radioStates as r, radioBasic as t };
