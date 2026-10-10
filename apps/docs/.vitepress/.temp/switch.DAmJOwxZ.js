import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$1 } from "./VisuallyHidden-C7NN3VEP.DAKckTtZ.js";
import { n as _sfc_main$2 } from "./eventHandlers-DUXzBWZy.C50IdnRl.js";
import { r as useButtonTooltip } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { t as _sfc_main$3 } from "./Field-C_z-m3_N.DzPNT5mn.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, mergeModels, mergeProps, nextTick, normalizeClass, normalizeStyle, onBeforeUnmount, onMounted, onUpdated, openBlock, renderSlot, shallowRef, toDisplayString, unref, useAttrs, useId, useModel, useSSRContext, useTemplateRef, watch, withCtx } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/Switch-Hf8_xwET.js
function useSwitchAction(options) {
	const optimistic = shallowRef(null);
	const pendingCount = shallowRef(0);
	let revision = 0;
	watch(options.model, () => {
		optimistic.value = null;
	});
	function commit(value, event) {
		const current = ++revision;
		const changeEvent = new CustomEvent("change", {
			cancelable: true,
			detail: {
				value,
				originalEvent: event
			}
		});
		if (event.defaultPrevented) changeEvent.preventDefault();
		optimistic.value = value;
		options.model.value = value;
		options.emitChange(value, changeEvent);
		const action = options.changeAction();
		if (!action || changeEvent.defaultPrevented) {
			optimistic.value = null;
			return;
		}
		pendingCount.value += 1;
		const finish = () => {
			pendingCount.value -= 1;
			if (current === revision) optimistic.value = null;
		};
		try {
			const result = action(value, changeEvent);
			if (result == null) {
				finish();
				return;
			}
			Promise.resolve(result).then(finish, (error) => {
				finish();
				options.emitError(error, value, changeEvent);
			});
		} catch (error) {
			finish();
			options.emitError(error, value, changeEvent);
		}
	}
	return {
		commit,
		value: computed(() => optimistic.value ?? options.model.value),
		isPending: computed(() => pendingCount.value > 0)
	};
}
var _hoisted_1 = [
	"data-size",
	"data-status",
	"data-blocked"
];
var _hoisted_2 = { class: "astryx-switch-control" };
var _hoisted_3 = [
	"id",
	"checked",
	"disabled",
	"name",
	"form",
	"readonly",
	"aria-checked",
	"aria-labelledby",
	"aria-describedby",
	"aria-disabled",
	"aria-readonly",
	"aria-busy",
	"aria-required",
	"aria-invalid"
];
var _hoisted_4 = {
	class: "astryx-switch-track",
	"aria-hidden": "true"
};
var _hoisted_5 = {
	key: 0,
	class: "astryx-switch-spinner"
};
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxSwitch",
	inheritAttrs: false,
	__name: "Switch",
	props: /*@__PURE__*/ mergeModels({
		id: {},
		size: { default: "md" },
		isReadOnly: { type: Boolean },
		disabledMessage: {},
		status: {},
		statusVariant: { default: "detached" },
		changeAction: {},
		isLoading: { type: Boolean },
		description: {},
		width: {},
		hasAutoFocus: { type: Boolean },
		htmlName: {},
		form: {},
		loadingLabel: { default: "Loading" },
		label: {},
		isLabelHidden: { type: Boolean },
		isDisabled: { type: Boolean },
		isOptional: { type: Boolean },
		isRequired: { type: Boolean },
		labelIcon: {},
		labelTooltip: {},
		optionalLabel: {},
		requiredLabel: {}
	}, {
		"modelValue": {
			type: Boolean,
			required: true
		},
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["change", "actionError"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const model = useModel(__props, "modelValue");
		const attrs = useAttrs();
		const input = useTemplateRef("input");
		const generatedId = `astryx-switch-${useId()}`;
		const inputId = computed(() => props.id ?? generatedId);
		const disabledId = `${generatedId}-disabled`;
		const loadingId = `${generatedId}-loading`;
		const showsDisabledMessage = computed(() => !!props.isDisabled && !!props.disabledMessage?.trim());
		const tooltip = useButtonTooltip(showsDisabledMessage);
		const action = useSwitchAction({
			model,
			changeAction: () => props.changeAction,
			emitChange: (value, event) => emit("change", value, event),
			emitError: (error, value, event) => emit("actionError", error, value, event)
		});
		const busy = computed(() => !!props.isLoading || action.isPending.value);
		const blocked = computed(() => props.isDisabled || props.isReadOnly || busy.value);
		const widthStyle = computed(() => ({ width: typeof props.width === "number" ? `${props.width}px` : props.width }));
		const element = computed(() => input.value ?? null);
		function focus(options) {
			input.value?.focus(options);
		}
		function blur() {
			input.value?.blur();
		}
		__expose({
			element,
			focus,
			blur
		});
		const controlledAttrs = /* @__PURE__ */ new Set([
			"class",
			"style",
			"id",
			"type",
			"checked",
			"disabled",
			"readonly",
			"autofocus",
			"role",
			"aria-checked",
			"aria-labelledby",
			"aria-describedby",
			"aria-disabled",
			"aria-readonly",
			"aria-required",
			"aria-busy"
		]);
		function inputAttrs() {
			return Object.fromEntries(Object.entries(attrs).filter(([key]) => !controlledAttrs.has(key)));
		}
		function describedBy(fieldIds) {
			return [
				attrs["aria-describedby"],
				fieldIds,
				showsDisabledMessage.value ? disabledId : void 0,
				busy.value ? loadingId : void 0
			].filter(Boolean).join(" ") || void 0;
		}
		function syncNative() {
			if (input.value) input.value.checked = action.value.value;
		}
		function click(event) {
			if (blocked.value) {
				event.preventDefault();
				nextTick(syncNative);
			}
		}
		function change(event) {
			if (!blocked.value && input.value) action.commit(input.value.checked, event);
			nextTick(syncNative);
		}
		function reset(event) {
			if (event.target === input.value?.form) nextTick(syncNative);
		}
		function keydown(event) {
			if (event.key === "Escape") tooltip.hideImmediately();
		}
		let ownerDocument;
		onMounted(() => {
			syncNative();
			ownerDocument = input.value?.ownerDocument;
			ownerDocument?.addEventListener("reset", reset, true);
			if (props.hasAutoFocus) focus({ preventScroll: true });
		});
		onUpdated(syncNative);
		onBeforeUnmount(() => ownerDocument?.removeEventListener("reset", reset, true));
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createElementVNode("div", {
				class: normalizeClass(["astryx-switch", unref(attrs).class]),
				style: normalizeStyle([widthStyle.value, unref(attrs).style]),
				"data-size": __props.size,
				"data-status": __props.status?.type,
				"data-blocked": blocked.value || void 0
			}, [
				createElementVNode("div", {
					class: "astryx-switch-row",
					onPointerenter: _cache[2] || (_cache[2] = (...args) => unref(tooltip).onPointerEnter && unref(tooltip).onPointerEnter(...args)),
					onPointerleave: _cache[3] || (_cache[3] = (...args) => unref(tooltip).onPointerLeave && unref(tooltip).onPointerLeave(...args))
				}, [createElementVNode("span", _hoisted_2, [createElementVNode("input", mergeProps(inputAttrs(), {
					id: inputId.value,
					ref_key: "input",
					ref: input,
					class: "astryx-switch-native",
					type: "checkbox",
					role: "switch",
					checked: unref(action).value.value,
					disabled: __props.isDisabled && !showsDisabledMessage.value,
					name: __props.isDisabled ? void 0 : __props.htmlName ?? inputAttrs().name,
					form: showsDisabledMessage.value ? "" : inputAttrs().form,
					readonly: __props.isReadOnly || showsDisabledMessage.value,
					"aria-checked": unref(action).value.value,
					"aria-labelledby": [`${inputId.value}-label`, unref(attrs)["aria-labelledby"]].filter(Boolean).join(" "),
					"aria-describedby": describedBy(),
					"aria-disabled": showsDisabledMessage.value || void 0,
					"aria-readonly": __props.isReadOnly || void 0,
					"aria-busy": busy.value || void 0,
					"aria-required": __props.isRequired && !__props.isOptional || void 0,
					"aria-invalid": __props.status?.type === "error" ? true : inputAttrs()["aria-invalid"],
					onClick: click,
					onChange: change,
					onKeydown: keydown,
					onFocus: _cache[0] || (_cache[0] = (...args) => unref(tooltip).onFocus && unref(tooltip).onFocus(...args)),
					onBlur: _cache[1] || (_cache[1] = (...args) => unref(tooltip).onBlur && unref(tooltip).onBlur(...args))
				}), null, 16, _hoisted_3), createElementVNode("span", _hoisted_4, [_cache[4] || (_cache[4] = createElementVNode("span", { class: "astryx-switch-thumb" }, null, -1)), busy.value ? (openBlock(), createElementBlock("span", _hoisted_5)) : createCommentVNode("v-if", true)])]), createVNode(_sfc_main$3, {
					label: __props.label,
					"input-id": inputId.value,
					"label-id": `${inputId.value}-label`,
					description: __props.description,
					"is-label-hidden": __props.isLabelHidden,
					"is-disabled": __props.isDisabled,
					"is-optional": __props.isOptional,
					"is-required": __props.isRequired,
					"label-icon": __props.labelIcon,
					"label-tooltip": __props.labelTooltip,
					"optional-label": __props.optionalLabel,
					"required-label": __props.requiredLabel
				}, createSlots({ _: 2 }, [_ctx.$slots.labelIcon ? {
					name: "labelIcon",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "labelIcon")]),
					key: "0"
				} : void 0]), 1032, [
					"label",
					"input-id",
					"label-id",
					"description",
					"is-label-hidden",
					"is-disabled",
					"is-optional",
					"is-required",
					"label-icon",
					"label-tooltip",
					"optional-label",
					"required-label"
				])], 32),
				showsDisabledMessage.value ? (openBlock(), createBlock(_sfc_main$1, {
					key: 0,
					id: disabledId
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(__props.disabledMessage), 1)]),
					_: 1
				})) : createCommentVNode("v-if", true),
				busy.value ? (openBlock(), createBlock(_sfc_main$1, {
					key: 1,
					id: loadingId,
					role: "status"
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(__props.loadingLabel), 1)]),
					_: 1
				})) : createCommentVNode("v-if", true)
			], 14, _hoisted_1), showsDisabledMessage.value ? (openBlock(), createBlock(_sfc_main$2, {
				key: 0,
				id: `${generatedId}-tooltip`,
				anchor: input.value,
				open: unref(tooltip).isOpen.value,
				text: __props.disabledMessage ?? "",
				onPointerEnter: unref(tooltip).onTooltipPointerEnter,
				onPointerLeave: unref(tooltip).onTooltipPointerLeave
			}, null, 8, [
				"id",
				"anchor",
				"open",
				"text",
				"onPointerEnter",
				"onPointerLeave"
			])) : createCommentVNode("v-if", true)], 64);
		};
	}
});
//#endregion
//#region components/demos/switch/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		const enabled = shallowRef(true);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: enabled.value,
				"onUpdate:modelValue": ($event) => enabled.value = $event,
				label: "Notifications",
				description: "Receive email updates."
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/switch/basic.vue
var _sfc_setup$2 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/switch/basic.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/switch/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { Switch } from '@astryx-vue/core/Switch'\nimport { shallowRef } from 'vue'\n\nconst enabled = shallowRef(true)\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <Switch v-model=\"enabled\" label=\"Notifications\" description=\"Receive email updates.\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Switch } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Switch'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> enabled</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Switch</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">enabled</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Notifications\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Receive email updates.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/switch/sizes.vue?vue&type=script&setup=true&lang.ts
var sizes_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "sizes",
	__ssrInlineRender: true,
	setup(__props) {
		const sm = shallowRef(false);
		const md = shallowRef(false);
		const lg = shallowRef(false);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: sm.value,
				"onUpdate:modelValue": ($event) => sm.value = $event,
				label: "Small",
				size: "sm"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: md.value,
				"onUpdate:modelValue": ($event) => md.value = $event,
				label: "Medium",
				size: "md"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: lg.value,
				"onUpdate:modelValue": ($event) => lg.value = $event,
				label: "Large",
				size: "lg"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/switch/sizes.vue
var _sfc_setup$1 = sizes_vue_vue_type_script_setup_true_lang_default.setup;
sizes_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/switch/sizes.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var sizes_default$1 = sizes_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/switch/sizes.vue?raw&highlighted
var sizes_default = {
	"source": "<script setup lang=\"ts\">\nimport { Switch } from '@astryx-vue/core/Switch'\nimport { shallowRef } from 'vue'\n\nconst sm = shallowRef(false)\nconst md = shallowRef(false)\nconst lg = shallowRef(false)\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <Switch v-model=\"sm\" label=\"Small\" size=\"sm\" />\n    <Switch v-model=\"md\" label=\"Medium\" size=\"md\" />\n    <Switch v-model=\"lg\" label=\"Large\" size=\"lg\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Switch } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Switch'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> sm</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> md</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> lg</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Switch</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">sm</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Small\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"sm\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Switch</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">md</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Medium\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"md\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Switch</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">lg</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Large\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> size</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"lg\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/switch/states.vue?vue&type=script&setup=true&lang.ts
var states_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "states",
	__ssrInlineRender: true,
	setup(__props) {
		const disabled = shallowRef(false);
		const readOnly = shallowRef(true);
		const locked = shallowRef(false);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "input-preview-grid" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: disabled.value,
				"onUpdate:modelValue": ($event) => disabled.value = $event,
				label: "Disabled",
				"is-disabled": ""
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: readOnly.value,
				"onUpdate:modelValue": ($event) => readOnly.value = $event,
				label: "Read-only",
				"is-read-only": ""
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: locked.value,
				"onUpdate:modelValue": ($event) => locked.value = $event,
				label: "Locked",
				"is-disabled": "",
				"disabled-message": "You need the Admin role to change this."
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/switch/states.vue
var _sfc_setup = states_vue_vue_type_script_setup_true_lang_default.setup;
states_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/switch/states.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var states_default$1 = states_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/switch/states.vue?raw&highlighted
var states_default = {
	"source": "<script setup lang=\"ts\">\nimport { Switch } from '@astryx-vue/core/Switch'\nimport { shallowRef } from 'vue'\n\nconst disabled = shallowRef(false)\nconst readOnly = shallowRef(true)\nconst locked = shallowRef(false)\n<\/script>\n\n<template>\n  <div class=\"input-preview-grid\">\n    <Switch v-model=\"disabled\" label=\"Disabled\" is-disabled />\n    <Switch v-model=\"readOnly\" label=\"Read-only\" is-read-only />\n    <Switch v-model=\"locked\" label=\"Locked\" is-disabled disabled-message=\"You need the Admin role to change this.\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Switch } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Switch'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> disabled</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> readOnly</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">true</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> locked</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-grid\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Switch</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">disabled</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Disabled\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-disabled</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Switch</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">readOnly</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Read-only\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-read-only</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Switch</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">locked</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Locked\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-disabled</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> disabled-message</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"You need the Admin role to change this.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/switch/index.ts
var options = { className: "input-preview-host" };
var switchBasic = defineDemo(basic_default$1, basic_default, options);
var switchSizes = defineDemo(sizes_default$1, sizes_default, options);
var switchStates = defineDemo(states_default$1, states_default, options);
//#endregion
export { switchSizes as n, switchStates as r, switchBasic as t };
