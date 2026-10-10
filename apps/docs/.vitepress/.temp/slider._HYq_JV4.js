import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { t as _sfc_main$2 } from "./VisuallyHidden-C7NN3VEP.DAKckTtZ.js";
import { n as _sfc_main$3 } from "./eventHandlers-DUXzBWZy.C50IdnRl.js";
import { r as useButtonTooltip, t as _sfc_main$4 } from "./Button-DrqeomlE.C6Pml1Bh.js";
import { t as _sfc_main$5 } from "./Field-C_z-m3_N.DzPNT5mn.js";
import { Fragment, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createSlots, createTextVNode, createVNode, defineComponent, mergeModels, mergeProps, normalizeStyle, openBlock, renderList, renderSlot, shallowRef, toDisplayString, unref, useAttrs, useId, useModel, useSSRContext, useTemplateRef, watch, withCtx, withKeys } from "vue";
import { ssrInterpolate, ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/Slider-CVPHdKHm.js
function clamp(value, min, max) {
	return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}
function precision(value) {
	const [coefficient = "", exponent = "0"] = String(value).split("e");
	return Math.max(0, (coefficient.split(".")[1]?.length ?? 0) - Number(exponent));
}
function snap(value, min, step) {
	const snapped = min + Math.round((value - min) / step) * step;
	return Number(snapped.toFixed(Math.min(20, Math.max(precision(min), precision(step)))));
}
function percent(value, min, max) {
	return max === min ? 0 : (value - min) / (max - min) * 100;
}
function position(value) {
	return `calc(${value}% + 10px - ${value / 100 * 20}px)`;
}
function add(first, second) {
	return Number((first + second).toFixed(Math.min(20, Math.max(precision(first), precision(second)))));
}
function multiply(first, second) {
	return Number((first * second).toFixed(Math.min(20, precision(first) + precision(second))));
}
var _hoisted_1$1 = [
	"id",
	"tabindex",
	"data-thumb-index",
	"data-dragging",
	"aria-valuemin",
	"aria-valuemax",
	"aria-valuenow",
	"aria-valuetext",
	"aria-orientation",
	"aria-labelledby",
	"aria-describedby",
	"aria-disabled",
	"aria-invalid"
];
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	__name: "SliderThumb",
	props: {
		id: {},
		index: {},
		value: {},
		min: {},
		max: {},
		percentage: {},
		orientation: {},
		labelledBy: {},
		describedBy: {},
		valueText: {},
		isInvalid: { type: Boolean },
		isDisabled: { type: Boolean },
		isFocusable: { type: Boolean },
		tooltipText: {},
		dragging: { type: Boolean }
	},
	emits: ["keydown"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const thumb = useTemplateRef("thumb");
		const tooltip = useTemplateRef("tooltip");
		const tabIndex = computed(() => props.isFocusable ? 0 : -1);
		const focused = shallowRef(false);
		const hovered = shallowRef(false);
		const dismissed = shallowRef(false);
		const open = computed(() => !!props.tooltipText && !props.isDisabled && !dismissed.value && (focused.value || hovered.value || props.dragging));
		const style = computed(() => props.orientation === "horizontal" ? { insetInlineStart: position(props.percentage) } : { bottom: position(props.percentage) });
		watch(() => props.dragging, () => {
			dismissed.value = false;
		});
		watch(() => [props.percentage, props.tooltipText], () => {
			tooltip.value?.updatePosition();
		}, { flush: "post" });
		function keydown(event) {
			if (event.key === "Escape") dismissed.value = true;
			emit("keydown", event);
		}
		function focus() {
			focused.value = true;
			dismissed.value = false;
		}
		function enter() {
			hovered.value = true;
			dismissed.value = false;
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [
				createCommentVNode(" eslint-disable-next-line vue-a11y/interactive-supports-focus -- The tested dynamic tabindex is always 0 or -1. "),
				createElementVNode("div", {
					id: __props.id,
					ref_key: "thumb",
					ref: thumb,
					class: "astryx-slider-thumb",
					role: "slider",
					style: normalizeStyle(style.value),
					tabindex: tabIndex.value,
					"data-thumb-index": __props.index,
					"data-dragging": __props.dragging || void 0,
					"aria-valuemin": __props.min,
					"aria-valuemax": __props.max,
					"aria-valuenow": __props.value,
					"aria-valuetext": __props.valueText,
					"aria-orientation": __props.orientation,
					"aria-labelledby": __props.labelledBy,
					"aria-describedby": __props.describedBy,
					"aria-disabled": __props.isDisabled || void 0,
					"aria-invalid": __props.isInvalid || void 0,
					onKeydown: keydown,
					onFocus: focus,
					onBlur: _cache[0] || (_cache[0] = ($event) => focused.value = false),
					onPointerenter: enter,
					onPointerleave: _cache[1] || (_cache[1] = ($event) => hovered.value = false)
				}, null, 44, _hoisted_1$1),
				__props.tooltipText ? (openBlock(), createBlock(_sfc_main$3, {
					key: 0,
					id: `${__props.id}-tooltip`,
					ref_key: "tooltip",
					ref: tooltip,
					anchor: thumb.value,
					open: open.value,
					text: __props.tooltipText,
					onPointerEnter: _cache[2] || (_cache[2] = ($event) => hovered.value = true),
					onPointerLeave: _cache[3] || (_cache[3] = ($event) => hovered.value = false)
				}, null, 8, [
					"id",
					"anchor",
					"open",
					"text"
				])) : createCommentVNode("v-if", true)
			], 64);
		};
	}
});
function useSlider(options) {
	const p = options.props;
	const min = computed(() => Number.isFinite(p.min) ? p.min : 0);
	const max = computed(() => Math.max(min.value, Number.isFinite(p.max) ? p.max : 100));
	const step = computed(() => Number.isFinite(p.step) && p.step > 0 ? p.step : 1);
	const gap = computed(() => Math.min(max.value - min.value, multiply(Math.max(0, Number.isFinite(p.minStepsBetweenThumbs) ? p.minStepsBetweenThumbs : 0), step.value)));
	const values = computed(() => {
		const model = options.model();
		if (!Array.isArray(model)) return [clamp(model, min.value, max.value)];
		const [low, high] = model.map((value) => clamp(value, min.value, max.value)).sort((a, b) => a - b);
		const upper = Math.max(high, add(min.value, gap.value));
		return [Math.min(low, add(upper, -gap.value)), upper];
	});
	const dragging = shallowRef(null);
	let pointerId = null;
	let latest;
	watch([
		() => p.isDisabled,
		() => p.orientation,
		() => Array.isArray(options.model())
	], () => {
		dragging.value = null;
		pointerId = null;
		latest = void 0;
	});
	watch(values, () => {
		latest = void 0;
	});
	function bounds(index) {
		return [index === 1 ? add(values.value[0], gap.value) : min.value, values.value.length === 2 && index === 0 ? add(values.value[1], -gap.value) : max.value];
	}
	function update(index, raw) {
		const next = [...values.value];
		const [lower, upper] = bounds(index);
		next[index] = clamp(snap(raw, min.value, step.value), lower, upper);
		const value = next.length === 2 ? [next[0], next[1]] : next[0];
		latest = value;
		if (next.some((v, i) => v !== values.value[i])) options.change(value);
		return value;
	}
	function pointerValue(event) {
		const track = options.track.value;
		const rect = track.getBoundingClientRect();
		const vertical = p.orientation === "vertical";
		const size = vertical ? rect.height : rect.width;
		const offset = vertical ? rect.bottom - event.clientY : getComputedStyle(track).direction === "rtl" ? rect.right - event.clientX : event.clientX - rect.left;
		const fraction = size > 20 ? (offset - 10) / (size - 20) : size > 0 ? offset / size : 0;
		return min.value + clamp(fraction, 0, 1) * (max.value - min.value);
	}
	function pointerDown(event) {
		if (p.isDisabled || event.defaultPrevented || event.button !== 0 || pointerId !== null || !options.track.value) return;
		const target = event.target;
		const mark = target.closest("[data-mark-value]");
		const thumb = target.closest("[data-thumb-index]");
		const raw = mark ? Number(mark.dataset.markValue) : pointerValue(event);
		const index = thumb ? Number(thumb.dataset.thumbIndex) : values.value.length === 2 && Math.abs(raw - values.value[1]) < Math.abs(raw - values.value[0]) ? 1 : 0;
		event.preventDefault();
		dragging.value = index;
		pointerId = event.pointerId;
		options.track.value.querySelectorAll("[role=\"slider\"]")[index]?.focus({ preventScroll: true });
		update(index, raw);
		options.track.value.setPointerCapture?.(event.pointerId);
	}
	function pointerMove(event) {
		if (!p.isDisabled && pointerId === event.pointerId && dragging.value !== null) update(dragging.value, pointerValue(event));
	}
	function pointerEnd(event) {
		if (pointerId !== event.pointerId || dragging.value === null) return;
		const value = latest ?? (values.value.length === 2 ? [values.value[0], values.value[1]] : values.value[0]);
		dragging.value = null;
		pointerId = null;
		latest = void 0;
		if (options.track.value?.hasPointerCapture?.(event.pointerId)) options.track.value.releasePointerCapture(event.pointerId);
		if (!p.isDisabled) options.end(value);
	}
	function keydown(index, event) {
		if (p.isDisabled || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
		const current = values.value[index];
		const rtl = p.orientation !== "vertical" && options.track.value && getComputedStyle(options.track.value).direction === "rtl";
		const offsets = {
			ArrowRight: rtl ? -1 : 1,
			ArrowLeft: rtl ? 1 : -1,
			ArrowUp: 1,
			ArrowDown: -1,
			PageUp: 10,
			PageDown: -10
		};
		let value;
		if (event.key === "Home") value = min.value;
		else if (event.key === "End") value = max.value;
		else if (event.key in offsets) value = current + offsets[event.key] * step.value;
		else return;
		event.preventDefault();
		options.end(update(index, value));
	}
	return {
		min,
		max,
		gap,
		values,
		bounds,
		dragging,
		pointerDown,
		pointerMove,
		pointerEnd,
		keydown
	};
}
var _hoisted_1 = { class: "astryx-slider-row" };
var _hoisted_2 = [
	"name",
	"value",
	"disabled",
	"form"
];
var _hoisted_3 = ["role", "aria-labelledby"];
var _hoisted_4 = ["data-mark-value", "data-filled"];
var _hoisted_5 = ["data-mark-value"];
var _hoisted_6 = {
	key: 0,
	class: "astryx-slider-value",
	"aria-hidden": "true"
};
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxSlider",
	inheritAttrs: false,
	__name: "Slider",
	props: /*@__PURE__*/ mergeModels({
		id: {},
		min: { default: 0 },
		max: { default: 100 },
		step: { default: 1 },
		minStepsBetweenThumbs: {},
		orientation: { default: "horizontal" },
		valueDisplay: { default: "tooltip" },
		formatValue: {},
		marks: {},
		width: {},
		htmlName: {},
		form: {},
		status: {},
		disabledMessage: {},
		minLabel: { default: "Minimum value" },
		maxLabel: { default: "Maximum value" },
		label: {},
		isLabelHidden: { type: Boolean },
		isDisabled: { type: Boolean },
		isOptional: { type: Boolean },
		isRequired: { type: Boolean },
		description: {},
		labelIcon: {},
		labelTooltip: {},
		optionalLabel: {},
		requiredLabel: { default: "Required" }
	}, {
		"modelValue": { required: true },
		"modelModifiers": {}
	}),
	emits: /*@__PURE__*/ mergeModels(["change", "changeEnd"], ["update:modelValue"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const model = useModel(__props, "modelValue");
		const attrs = useAttrs();
		const track = useTemplateRef("track");
		const generatedId = `astryx-slider-${useId()}`;
		const inputId = computed(() => props.id ?? generatedId);
		const control = useSlider({
			props,
			model: () => model.value,
			track,
			change: (value) => {
				model.value = value;
				emit("change", value);
			},
			end: (value) => emit("changeEnd", value)
		});
		const { min, max, values, dragging } = control;
		const isRange = computed(() => values.value.length === 2);
		const showsDisabledMessage = computed(() => !!props.isDisabled && !!props.disabledMessage?.trim());
		const tooltip = useButtonTooltip(showsDisabledMessage);
		const required = computed(() => !!props.isRequired && !props.isOptional);
		const marks = computed(() => props.marks?.filter((mark) => Number.isFinite(mark.value) && mark.value >= min.value && mark.value <= max.value) ?? []);
		const hasMarkLabels = computed(() => marks.value.some((mark) => mark.label));
		const format = (value) => props.formatValue?.(value) ?? String(value);
		const displayText = computed(() => values.value.map(format).join(" – "));
		const fillStyle = computed(() => {
			const start = isRange.value ? position(percent(values.value[0], min.value, max.value)) : "0px";
			const end = position(percent(values.value.at(-1), min.value, max.value));
			return props.orientation === "horizontal" ? {
				insetInlineStart: start,
				width: `calc(${end} - ${start})`
			} : {
				bottom: start,
				height: `calc(${end} - ${start})`
			};
		});
		function describedBy(fieldIds) {
			return [
				attrs["aria-describedby"],
				fieldIds,
				required.value ? `${inputId.value}-required` : void 0,
				showsDisabledMessage.value ? `${inputId.value}-disabled` : void 0
			].filter(Boolean).join(" ") || void 0;
		}
		function markStyle(value) {
			const offset = position(percent(value, min.value, max.value));
			return props.orientation === "horizontal" ? { insetInlineStart: offset } : { bottom: offset };
		}
		function isFilled(value) {
			return value <= values.value.at(-1) && (!isRange.value || value >= values.value[0]);
		}
		function rootAttrs() {
			return Object.fromEntries(Object.entries(attrs).filter(([key]) => !["aria-labelledby", "aria-describedby"].includes(key)));
		}
		function focus(index = 0, options) {
			track.value?.querySelectorAll("[role=\"slider\"]")[index]?.focus(options);
		}
		function blur() {
			const active = track.value?.ownerDocument.activeElement;
			if (active instanceof HTMLElement && track.value?.contains(active)) active.blur();
		}
		__expose({
			element: computed(() => track.value),
			focus,
			blur
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createVNode(_sfc_main$5, mergeProps(rootAttrs(), {
				class: "astryx-slider",
				"data-orientation": __props.orientation,
				"data-disabled": __props.isDisabled || void 0,
				"data-mark-labels": hasMarkLabels.value || void 0,
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
				"status-variant": "detached"
			}), createSlots({
				default: withCtx((field) => [
					createElementVNode("div", _hoisted_1, [
						(openBlock(true), createElementBlock(Fragment, null, renderList(unref(values), (value, index) => {
							return openBlock(), createElementBlock("input", {
								key: index,
								type: "hidden",
								name: __props.htmlName,
								value,
								disabled: __props.isDisabled,
								form: __props.form
							}, null, 8, _hoisted_2);
						}), 128)),
						createElementVNode("div", {
							ref_key: "track",
							ref: track,
							class: "astryx-slider-control",
							role: isRange.value ? "group" : void 0,
							"aria-labelledby": isRange.value ? field.labelId : void 0,
							onPointerdown: _cache[0] || (_cache[0] = (...args) => unref(control).pointerDown && unref(control).pointerDown(...args)),
							onPointermove: _cache[1] || (_cache[1] = (...args) => unref(control).pointerMove && unref(control).pointerMove(...args)),
							onPointerup: _cache[2] || (_cache[2] = (...args) => unref(control).pointerEnd && unref(control).pointerEnd(...args)),
							onPointercancel: _cache[3] || (_cache[3] = (...args) => unref(control).pointerEnd && unref(control).pointerEnd(...args)),
							onLostpointercapture: _cache[4] || (_cache[4] = (...args) => unref(control).pointerEnd && unref(control).pointerEnd(...args)),
							onPointerenter: _cache[5] || (_cache[5] = (...args) => unref(tooltip).onPointerEnter && unref(tooltip).onPointerEnter(...args)),
							onPointerleave: _cache[6] || (_cache[6] = (...args) => unref(tooltip).onPointerLeave && unref(tooltip).onPointerLeave(...args)),
							onFocusin: _cache[7] || (_cache[7] = (...args) => unref(tooltip).onTooltipPointerEnter && unref(tooltip).onTooltipPointerEnter(...args)),
							onFocusout: _cache[8] || (_cache[8] = (...args) => unref(tooltip).onBlur && unref(tooltip).onBlur(...args)),
							onKeydown: _cache[9] || (_cache[9] = withKeys((...args) => unref(tooltip).hideImmediately && unref(tooltip).hideImmediately(...args), ["esc"]))
						}, [
							_cache[10] || (_cache[10] = createElementVNode("div", {
								class: "astryx-slider-track",
								"aria-hidden": "true"
							}, null, -1)),
							createElementVNode("div", {
								class: "astryx-slider-fill",
								style: normalizeStyle(fillStyle.value),
								"aria-hidden": "true"
							}, null, 4),
							(openBlock(true), createElementBlock(Fragment, null, renderList(marks.value, (mark) => {
								return openBlock(), createElementBlock("span", {
									key: mark.value,
									class: "astryx-slider-mark",
									"data-mark-value": mark.value,
									"data-filled": isFilled(mark.value) || void 0,
									style: normalizeStyle(markStyle(mark.value)),
									"aria-hidden": "true"
								}, [mark.label ? (openBlock(), createElementBlock("span", {
									key: 0,
									class: "astryx-slider-mark-label",
									"data-mark-value": mark.value
								}, toDisplayString(mark.label), 9, _hoisted_5)) : createCommentVNode("v-if", true)], 12, _hoisted_4);
							}), 128)),
							(openBlock(true), createElementBlock(Fragment, null, renderList(unref(values), (value, index) => {
								return openBlock(), createBlock(_sfc_main$1, {
									id: `${inputId.value}-${index}`,
									key: index,
									index,
									value,
									percentage: unref(percent)(value, unref(min), unref(max)),
									min: unref(control).bounds(index)[0],
									max: unref(control).bounds(index)[1],
									orientation: __props.orientation,
									"labelled-by": [
										field.labelId,
										isRange.value ? `${inputId.value}-label-${index}` : void 0,
										unref(attrs)["aria-labelledby"]
									].filter(Boolean).join(" "),
									"described-by": describedBy(field.describedBy),
									"value-text": __props.formatValue ? format(value) : void 0,
									"is-invalid": __props.status?.type === "error",
									"is-disabled": __props.isDisabled,
									"is-focusable": !__props.isDisabled || showsDisabledMessage.value,
									dragging: unref(dragging) === index,
									"tooltip-text": __props.valueDisplay === "tooltip" ? format(value) : void 0,
									onKeydown: ($event) => unref(control).keydown(index, $event)
								}, null, 8, [
									"id",
									"index",
									"value",
									"percentage",
									"min",
									"max",
									"orientation",
									"labelled-by",
									"described-by",
									"value-text",
									"is-invalid",
									"is-disabled",
									"is-focusable",
									"dragging",
									"tooltip-text",
									"onKeydown"
								]);
							}), 128))
						], 40, _hoisted_3),
						__props.valueDisplay === "text" ? (openBlock(), createElementBlock("span", _hoisted_6, toDisplayString(displayText.value), 1)) : createCommentVNode("v-if", true)
					]),
					isRange.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createVNode(_sfc_main$2, { id: `${inputId.value}-label-0` }, {
						default: withCtx(() => [createTextVNode(toDisplayString(__props.minLabel), 1)]),
						_: 1
					}, 8, ["id"]), createVNode(_sfc_main$2, { id: `${inputId.value}-label-1` }, {
						default: withCtx(() => [createTextVNode(toDisplayString(__props.maxLabel), 1)]),
						_: 1
					}, 8, ["id"])], 64)) : createCommentVNode("v-if", true),
					required.value ? (openBlock(), createBlock(_sfc_main$2, {
						key: 1,
						id: `${inputId.value}-required`
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(__props.requiredLabel), 1)]),
						_: 1
					}, 8, ["id"])) : createCommentVNode("v-if", true),
					showsDisabledMessage.value ? (openBlock(), createBlock(_sfc_main$2, {
						key: 2,
						id: `${inputId.value}-disabled`
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(__props.disabledMessage), 1)]),
						_: 1
					}, 8, ["id"])) : createCommentVNode("v-if", true)
				]),
				_: 2
			}, [_ctx.$slots.labelIcon ? {
				name: "labelIcon",
				fn: withCtx(() => [renderSlot(_ctx.$slots, "labelIcon")]),
				key: "0"
			} : void 0]), 1040, [
				"data-orientation",
				"data-disabled",
				"data-mark-labels",
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
				"status"
			]), showsDisabledMessage.value ? (openBlock(), createBlock(_sfc_main$3, {
				key: 0,
				id: `${inputId.value}-disabled-tooltip`,
				anchor: track.value,
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
//#region components/demos/slider/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		const volume = shallowRef(65);
		const opacity = shallowRef(.75);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "slider-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: volume.value,
				"onUpdate:modelValue": ($event) => volume.value = $event,
				label: "Volume",
				description: "Adjust playback volume.",
				"format-value": (value) => `${value}%`
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: opacity.value,
				"onUpdate:modelValue": ($event) => opacity.value = $event,
				label: "Opacity",
				min: 0,
				max: 1,
				step: .05,
				"value-display": "text",
				"format-value": (value) => `${Math.round(value * 100)}%`
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/slider/basic.vue
var _sfc_setup$5 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/slider/basic.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/slider/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { Slider } from '@astryx-vue/core/Slider'\nimport { shallowRef } from 'vue'\n\nconst volume = shallowRef(65)\nconst opacity = shallowRef(0.75)\n<\/script>\n\n<template>\n  <div class=\"slider-preview-stack\">\n    <Slider v-model=\"volume\" label=\"Volume\" description=\"Adjust playback volume.\" :format-value=\"value => `${value}%`\" />\n    <Slider v-model=\"opacity\" label=\"Opacity\" :min=\"0\" :max=\"1\" :step=\"0.05\" value-display=\"text\" :format-value=\"value => `${Math.round(value * 100)}%`\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Slider } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Slider'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> volume</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">65</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> opacity</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">0.75</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"slider-preview-stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Slider</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">volume</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Volume\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Adjust playback volume.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">format-value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">value</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =></span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> `${</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">value</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">}%`\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Slider</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">opacity</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Opacity\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">min</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">0</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">max</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">1</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">step</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">0.05</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value-display</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"text\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">format-value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">value</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =></span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> `${</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">Math</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">.</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">round</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">(</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">value</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> *</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> 100</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">)</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">}%`\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/slider/directions.vue?vue&type=script&setup=true&lang.ts
var directions_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "directions",
	__ssrInlineRender: true,
	setup(__props) {
		const level = shallowRef(60);
		const rtl = shallowRef(35);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "slider-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: level.value,
				"onUpdate:modelValue": ($event) => level.value = $event,
				label: "Level",
				orientation: "vertical",
				"value-display": "text",
				"format-value": (value) => `${value}%`
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: rtl.value,
				"onUpdate:modelValue": ($event) => rtl.value = $event,
				label: "Right-to-left direction",
				dir: "rtl",
				"value-display": "text"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/slider/directions.vue
var _sfc_setup$4 = directions_vue_vue_type_script_setup_true_lang_default.setup;
directions_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/slider/directions.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var directions_default$1 = directions_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/slider/directions.vue?raw&highlighted
var directions_default = {
	"source": "<script setup lang=\"ts\">\nimport { Slider } from '@astryx-vue/core/Slider'\nimport { shallowRef } from 'vue'\n\nconst level = shallowRef(60)\nconst rtl = shallowRef(35)\n<\/script>\n\n<template>\n  <div class=\"slider-preview-stack\">\n    <Slider v-model=\"level\" label=\"Level\" orientation=\"vertical\" value-display=\"text\" :format-value=\"value => `${value}%`\" />\n    <Slider v-model=\"rtl\" label=\"Right-to-left direction\" dir=\"rtl\" value-display=\"text\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Slider } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Slider'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> level</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">60</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> rtl</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">35</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"slider-preview-stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Slider</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">level</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Level\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> orientation</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"vertical\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value-display</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"text\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">format-value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">value</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =></span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> `${</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">value</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">}%`\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Slider</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">rtl</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Right-to-left direction\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> dir</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"rtl\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value-display</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"text\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/slider/form.vue?vue&type=script&setup=true&lang.ts
var form_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "form",
	__ssrInlineRender: true,
	setup(__props) {
		const price = shallowRef([20, 80]);
		const committed = shallowRef("20 – 80");
		const submitted = shallowRef("No values submitted yet.");
		function finish(value) {
			committed.value = Array.isArray(value) ? value.join(" – ") : String(value);
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<form${ssrRenderAttrs(mergeProps({ class: "slider-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: price.value,
				"onUpdate:modelValue": ($event) => price.value = $event,
				label: "Budget",
				"html-name": "price",
				"value-display": "text",
				onChangeEnd: finish
			}, null, _parent));
			_push(`<p class="input-preview-note"> Last completed adjustment: ${ssrInterpolate(committed.value)}</p>`);
			_push(ssrRenderComponent(unref(_sfc_main$4), {
				label: "Submit values",
				type: "submit"
			}, null, _parent));
			_push(`<p class="input-preview-note" role="status">${ssrInterpolate(submitted.value)}</p></form>`);
		};
	}
});
//#endregion
//#region components/demos/slider/form.vue
var _sfc_setup$3 = form_vue_vue_type_script_setup_true_lang_default.setup;
form_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/slider/form.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var form_default$1 = form_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/slider/form.vue?raw&highlighted
var form_default = {
	"source": "<script setup lang=\"ts\">\nimport type { SliderValue } from '@astryx-vue/core/Slider'\nimport { Button } from '@astryx-vue/core/Button'\nimport { Slider } from '@astryx-vue/core/Slider'\nimport { shallowRef } from 'vue'\n\nconst price = shallowRef<[number, number]>([20, 80])\nconst committed = shallowRef('20 – 80')\nconst submitted = shallowRef('No values submitted yet.')\nfunction finish(value: SliderValue): void {\n  committed.value = Array.isArray(value) ? value.join(' – ') : String(value)\n}\nfunction submit(event: Event): void {\n  submitted.value = `price: ${new FormData(event.currentTarget as HTMLFormElement).getAll('price').join(', ')}`\n}\n<\/script>\n\n<template>\n  <form class=\"slider-preview-stack\" @submit.prevent=\"submit\">\n    <Slider v-model=\"price\" label=\"Budget\" html-name=\"price\" value-display=\"text\" @change-end=\"finish\" />\n    <p class=\"input-preview-note\">\n      Last completed adjustment: {{ committed }}\n    </p>\n    <Button label=\"Submit values\" type=\"submit\" />\n    <p class=\"input-preview-note\" role=\"status\">\n      {{ submitted }}\n    </p>\n  </form>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { SliderValue } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Slider'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Button } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Button'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Slider } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Slider'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> price</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;[</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">number</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">number</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]>([</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">20</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">80</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">])</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> committed</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'20 – 80'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> submitted</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'No values submitted yet.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> finish</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">value</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> SliderValue</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> void</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  committed.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> Array.</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">isArray</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(value) </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">?</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> value.</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">join</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">' – '</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">) </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> String</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(value)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> submit</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">event</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> Event</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> void</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  submitted.value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> `price: ${</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">new</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> FormData</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">(</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">event</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">.</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">currentTarget</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> as</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> HTMLFormElement</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">).</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">getAll</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'price'</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">).</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">join</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">(</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">', '</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">)</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">}`</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">form</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"slider-preview-stack\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> @submit.prevent</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"submit\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Slider</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">price</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Budget\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> html-name</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"price\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value-display</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"text\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> @</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">change-end</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">finish</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-note\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Last completed adjustment: {{ committed }}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Submit values\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"submit\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"input-preview-note\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> role</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"status\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      {{ submitted }}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">p</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">form</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/slider/marks.vue?vue&type=script&setup=true&lang.ts
var marks_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "marks",
	__ssrInlineRender: true,
	setup(__props) {
		const quality = shallowRef(50);
		const marks = [
			{
				value: 0,
				label: "0"
			},
			{
				value: 25,
				label: "25"
			},
			{
				value: 50,
				label: "50"
			},
			{
				value: 75,
				label: "75"
			},
			{
				value: 100,
				label: "100"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main), mergeProps({
				modelValue: quality.value,
				"onUpdate:modelValue": ($event) => quality.value = $event,
				label: "Quality",
				description: "Choose a mark or drag to adjust.",
				step: 5,
				marks,
				"value-display": "text"
			}, _attrs), null, _parent));
		};
	}
});
//#endregion
//#region components/demos/slider/marks.vue
var _sfc_setup$2 = marks_vue_vue_type_script_setup_true_lang_default.setup;
marks_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/slider/marks.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var marks_default$1 = marks_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/slider/marks.vue?raw&highlighted
var marks_default = {
	"source": "<script setup lang=\"ts\">\nimport { Slider } from '@astryx-vue/core/Slider'\nimport { shallowRef } from 'vue'\n\nconst quality = shallowRef(50)\nconst marks = [{ value: 0, label: '0' }, { value: 25, label: '25' }, { value: 50, label: '50' }, { value: 75, label: '75' }, { value: 100, label: '100' }]\n<\/script>\n\n<template>\n  <Slider v-model=\"quality\" label=\"Quality\" description=\"Choose a mark or drag to adjust.\" :step=\"5\" :marks=\"marks\" value-display=\"text\" />\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Slider } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Slider'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> quality</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">50</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> marks</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> [{ value: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">0</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'0'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }, { value: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">25</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'25'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }, { value: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">50</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'50'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }, { value: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">75</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'75'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }, { value: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">100</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, label: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'100'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }]</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Slider</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">quality</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Quality\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Choose a mark or drag to adjust.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">step</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">5</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">marks</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">marks</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value-display</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"text\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/slider/range.vue?vue&type=script&setup=true&lang.ts
var range_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "range",
	__ssrInlineRender: true,
	setup(__props) {
		const price = shallowRef([20, 80]);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(_sfc_main), mergeProps({
				modelValue: price.value,
				"onUpdate:modelValue": ($event) => price.value = $event,
				label: "Price range",
				description: "Keep at least $10 between the minimum and maximum.",
				step: 5,
				"min-steps-between-thumbs": 2,
				"value-display": "text",
				"format-value": (value) => `$${value}`
			}, _attrs), null, _parent));
		};
	}
});
//#endregion
//#region components/demos/slider/range.vue
var _sfc_setup$1 = range_vue_vue_type_script_setup_true_lang_default.setup;
range_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/slider/range.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var range_default$1 = range_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/slider/range.vue?raw&highlighted
var range_default = {
	"source": "<script setup lang=\"ts\">\nimport { Slider } from '@astryx-vue/core/Slider'\nimport { shallowRef } from 'vue'\n\nconst price = shallowRef<[number, number]>([20, 80])\n<\/script>\n\n<template>\n  <Slider v-model=\"price\" label=\"Price range\" description=\"Keep at least $10 between the minimum and maximum.\" :step=\"5\" :min-steps-between-thumbs=\"2\" value-display=\"text\" :format-value=\"value => `$${value}`\" />\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Slider } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Slider'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> price</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;[</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">number</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">number</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">]>([</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">20</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">80</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">])</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Slider</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">price</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Price range\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> description</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Keep at least $10 between the minimum and maximum.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">step</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">5</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">min-steps-between-thumbs</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">2</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value-display</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"text\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">format-value</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#c13617;--shiki-dark:#FFAB70\">value</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =></span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> `$${</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">value</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">}`\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/slider/states.vue?vue&type=script&setup=true&lang.ts
var states_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "states",
	__ssrInlineRender: true,
	setup(__props) {
		const value = shallowRef(70);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "slider-preview-stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: value.value,
				"onUpdate:modelValue": ($event) => value.value = $event,
				label: "Disabled volume",
				"is-disabled": "",
				"value-display": "text"
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: value.value,
				"onUpdate:modelValue": ($event) => value.value = $event,
				label: "Managed volume",
				"is-disabled": "",
				"disabled-message": "Volume is locked while sharing your screen."
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main), {
				modelValue: value.value,
				"onUpdate:modelValue": ($event) => value.value = $event,
				label: "Listening volume",
				"value-display": "text",
				status: value.value > 60 ? {
					type: "warning",
					message: "Lower the volume for extended listening."
				} : {
					type: "success",
					message: "Volume is within the recommended range."
				},
				"label-tooltip": "This setting controls all audio output."
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/slider/states.vue
var _sfc_setup = states_vue_vue_type_script_setup_true_lang_default.setup;
states_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/slider/states.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var states_default$1 = states_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/slider/states.vue?raw&highlighted
var states_default = {
	"source": "<script setup lang=\"ts\">\nimport { Slider } from '@astryx-vue/core/Slider'\nimport { shallowRef } from 'vue'\n\nconst value = shallowRef(70)\n<\/script>\n\n<template>\n  <div class=\"slider-preview-stack\">\n    <Slider v-model=\"value\" label=\"Disabled volume\" is-disabled value-display=\"text\" />\n    <Slider v-model=\"value\" label=\"Managed volume\" is-disabled disabled-message=\"Volume is locked while sharing your screen.\" />\n    <Slider v-model=\"value\" label=\"Listening volume\" value-display=\"text\" :status=\"value > 60 ? { type: 'warning', message: 'Lower the volume for extended listening.' } : { type: 'success', message: 'Volume is within the recommended range.' }\" label-tooltip=\"This setting controls all audio output.\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Slider } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Slider'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { shallowRef } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> 'vue'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> value</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> shallowRef</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">70</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">)</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"slider-preview-stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Slider</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">value</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Disabled volume\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-disabled</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value-display</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"text\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Slider</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">value</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Managed volume\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> is-disabled</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> disabled-message</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Volume is locked while sharing your screen.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Slider</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> v-model</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">value</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Listening volume\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> value-display</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"text\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">status</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">value </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">></span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> 60</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> ?</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'warning'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, message: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Lower the volume for extended listening.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">:</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'success'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, message: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Volume is within the recommended range.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> }</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> label-tooltip</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"This setting controls all audio output.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/slider/index.ts
var options = { className: "input-preview-host" };
var sliderBasic = defineDemo(basic_default$1, basic_default, options);
var sliderRange = defineDemo(range_default$1, range_default, options);
var sliderMarks = defineDemo(marks_default$1, marks_default, options);
var sliderStates = defineDemo(states_default$1, states_default, options);
var sliderDirections = defineDemo(directions_default$1, directions_default, options);
var sliderForm = defineDemo(form_default$1, form_default, options);
//#endregion
export { sliderRange as a, sliderMarks as i, sliderDirections as n, sliderStates as o, sliderForm as r, sliderBasic as t };
