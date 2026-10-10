import { t as defineDemo } from "./defineDemo.D8cnOFNo.js";
import { Fragment, Teleport, computed, createBlock, createCommentVNode, createElementBlock, createElementVNode, createTextVNode, createVNode, defineComponent, mergeProps, normalizeClass, onMounted, onUnmounted, openBlock, reactive, ref, renderList, renderSlot, toDisplayString, unref, useSSRContext, watch } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
//#region ../../packages/core/dist/Toast-BKXPvEMp.js
var _hoisted_1$1 = ["role", "aria-live"];
var _hoisted_2 = { class: "astryx-toast__body" };
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	__name: "Toast",
	props: {
		type: { default: "info" },
		body: {},
		autoClose: {
			type: Boolean,
			default: true
		},
		duration: { default: 5e3 },
		isExiting: {
			type: Boolean,
			default: false
		}
	},
	emits: ["close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const remaining = ref(props.duration);
		const isPaused = ref(false);
		const timer = ref(null);
		const startTime = ref(null);
		const isAlert = computed(() => props.type === "error");
		const role = computed(() => isAlert.value ? "alert" : "status");
		const ariaLive = computed(() => isAlert.value ? "assertive" : "polite");
		const classes = computed(() => [
			"astryx-toast",
			`astryx-toast--type-${props.type}`,
			{ "astryx-toast--exiting": props.isExiting }
		]);
		function startTimer() {
			if (!props.autoClose || isPaused.value) return;
			if (timer.value) clearTimeout(timer.value);
			startTime.value = Date.now();
			timer.value = setTimeout(() => {
				emit("close");
			}, remaining.value);
		}
		function pauseTimer() {
			if (!props.autoClose || isPaused.value) return;
			isPaused.value = true;
			if (timer.value) {
				clearTimeout(timer.value);
				timer.value = null;
			}
			if (startTime.value != null) {
				const elapsed = Date.now() - startTime.value;
				remaining.value = Math.max(remaining.value - elapsed, 0);
			}
		}
		function resumeTimer() {
			if (!props.autoClose || !isPaused.value) return;
			isPaused.value = false;
			startTimer();
		}
		function handleClose() {
			emit("close");
		}
		watch(() => props.isExiting, (exiting) => {
			if (!exiting || !timer.value) return;
			clearTimeout(timer.value);
			timer.value = null;
		});
		onMounted(() => {
			startTimer();
		});
		onUnmounted(() => {
			if (timer.value) clearTimeout(timer.value);
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createCommentVNode(" eslint-disable-next-line vue-a11y/no-static-element-interactions -- toast pauses auto-dismiss on hover/focus "), createElementVNode("div", {
				class: normalizeClass(classes.value),
				role: role.value,
				"aria-live": ariaLive.value,
				"aria-atomic": "true",
				onMouseenter: pauseTimer,
				onMouseleave: resumeTimer,
				onFocusin: pauseTimer,
				onFocusout: resumeTimer
			}, [createElementVNode("span", _hoisted_2, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(__props.body), 1)])]), createElementVNode("button", {
				type: "button",
				class: "astryx-toast__close",
				"aria-label": "Close",
				onClick: handleClose
			}, " × ")], 42, _hoisted_1$1)], 2112);
		};
	}
});
var idCounter = 0;
var EXIT_FALLBACK_MS = 400;
var toastStore = reactive({
	toasts: [],
	add(options) {
		const id = `astryx-toast-${++idCounter}`;
		this.toasts.push({
			id,
			type: options.type ?? "info",
			body: options.body,
			autoClose: options.autoClose ?? true,
			duration: options.duration ?? 5e3,
			isExiting: false
		});
		return id;
	},
	requestClose(id) {
		const item = this.toasts.find((t) => t.id === id);
		if (!item || item.isExiting) return;
		item.isExiting = true;
		setTimeout(() => this.finalize(id), EXIT_FALLBACK_MS);
	},
	finalize(id) {
		const index = this.toasts.findIndex((t) => t.id === id);
		if (index >= 0) this.toasts.splice(index, 1);
	},
	clear() {
		for (const id of this.toasts.map((t) => t.id)) this.requestClose(id);
	}
});
var _hoisted_1 = ["onTransitionend"];
var _sfc_main = /*@__PURE__*/ defineComponent({
	__name: "ToastViewport",
	props: { placement: { default: "bottom-center" } },
	setup(__props) {
		const props = __props;
		const isTopPlacement = computed(() => props.placement.startsWith("top"));
		const classes = computed(() => ["astryx-toast-viewport", `astryx-toast-viewport--placement-${props.placement}`]);
		const settled = reactive(/* @__PURE__ */ new Set());
		function handleRowTransitionEnd(id, event) {
			if (event.target !== event.currentTarget || event.propertyName !== "grid-template-rows") return;
			const item = toastStore.toasts.find((t) => t.id === id);
			if (!item) return;
			if (item.isExiting) toastStore.finalize(id);
			else settled.add(id);
		}
		function handleClose(id) {
			settled.delete(id);
			toastStore.requestClose(id);
		}
		watch(() => toastStore.toasts.map((t) => t.id).join(","), () => {
			const live = new Set(toastStore.toasts.map((t) => t.id));
			for (const id of [...settled]) if (!live.has(id)) settled.delete(id);
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Teleport, { to: "body" }, [createElementVNode("div", {
				class: normalizeClass(classes.value),
				"aria-live": "polite",
				"aria-atomic": "false"
			}, [(openBlock(true), createElementBlock(Fragment, null, renderList(unref(toastStore).toasts, (toast) => {
				return openBlock(), createElementBlock("div", {
					key: toast.id,
					class: normalizeClass(["astryx-toast-viewport__row", [isTopPlacement.value ? "astryx-toast-viewport__row--from-top" : "astryx-toast-viewport__row--from-bottom", { "astryx-toast-viewport__row--exiting": toast.isExiting }]]),
					onTransitionend: ($event) => handleRowTransitionEnd(toast.id, $event)
				}, [createElementVNode("div", { class: normalizeClass(["astryx-toast-viewport__clip", { "astryx-toast-viewport__clip--settled": settled.has(toast.id) }]) }, [createVNode(_sfc_main$1, {
					type: toast.type,
					body: toast.body,
					"auto-close": toast.autoClose,
					duration: toast.duration,
					"is-exiting": toast.isExiting,
					onClose: ($event) => handleClose(toast.id)
				}, null, 8, [
					"type",
					"body",
					"auto-close",
					"duration",
					"is-exiting",
					"onClose"
				])], 2)], 42, _hoisted_1);
			}), 128))], 2)]);
		};
	}
});
function useToast() {
	function show(options) {
		const id = toastStore.add(options);
		return () => toastStore.requestClose(id);
	}
	show.dismiss = (id) => toastStore.requestClose(id);
	show.clear = () => toastStore.clear();
	return show;
}
//#endregion
//#region components/demos/toast/basic.vue?vue&type=script&setup=true&lang.ts
var basic_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "basic",
	__ssrInlineRender: true,
	setup(__props) {
		useToast();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "toast-preview__row" }, _attrs))}><button class="toast-preview__trigger"> Info </button><button class="toast-preview__trigger"> Success </button><button class="toast-preview__trigger"> Error </button>`);
			_push(ssrRenderComponent(unref(_sfc_main), null, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/toast/basic.vue
var _sfc_setup$2 = basic_vue_vue_type_script_setup_true_lang_default.setup;
basic_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/toast/basic.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var basic_default$1 = basic_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/toast/basic.vue?raw&highlighted
var basic_default = {
	"source": "<script setup lang=\"ts\">\nimport { ToastViewport, useToast } from '@astryx-vue/core/Toast'\n\nconst toast = useToast()\n\nfunction showInfo() {\n  toast({ body: 'An update is available.', duration: 5000 })\n}\n\nfunction showSuccess() {\n  toast({ body: 'Changes saved.', type: 'success', duration: 5000 })\n}\n\nfunction showError() {\n  toast({ body: 'Failed to upload file.', type: 'error', duration: 5000 })\n}\n<\/script>\n\n<template>\n  <div class=\"toast-preview__row\">\n    <button class=\"toast-preview__trigger\" @click=\"showInfo\">\n      Info\n    </button>\n    <button class=\"toast-preview__trigger\" @click=\"showSuccess\">\n      Success\n    </button>\n    <button class=\"toast-preview__trigger\" @click=\"showError\">\n      Error\n    </button>\n    <ToastViewport />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ToastViewport, useToast } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Toast'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> toast</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> useToast</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">()</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> showInfo</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">() {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">  toast</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">({ body: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'An update is available.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, duration: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">5000</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> })</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> showSuccess</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">() {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">  toast</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">({ body: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Changes saved.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'success'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, duration: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">5000</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> })</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> showError</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">() {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">  toast</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">({ body: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Failed to upload file.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'error'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, duration: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">5000</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> })</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"toast-preview__row\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"toast-preview__trigger\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> @click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"showInfo\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Info</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">button</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"toast-preview__trigger\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> @click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"showSuccess\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Success</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">button</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"toast-preview__trigger\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> @click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"showError\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Error</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">button</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ToastViewport</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/toast/preview.vue?vue&type=script&setup=true&lang.ts
var preview_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "preview",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "toast-preview__stack" }, _attrs))}>`);
			_push(ssrRenderComponent(unref(_sfc_main$1), {
				body: "An update is available.",
				"auto-close": false
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main$1), {
				body: "Failed to upload file.",
				type: "error",
				"auto-close": false
			}, null, _parent));
			_push(ssrRenderComponent(unref(_sfc_main$1), {
				body: "Changes saved.",
				type: "success",
				"auto-close": false
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/toast/preview.vue
var _sfc_setup$1 = preview_vue_vue_type_script_setup_true_lang_default.setup;
preview_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/toast/preview.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var preview_default$1 = preview_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/toast/preview.vue?raw&highlighted
var preview_default = {
	"source": "<script setup lang=\"ts\">\nimport { Toast } from '@astryx-vue/core/Toast'\n<\/script>\n\n<template>\n  <div class=\"toast-preview__stack\">\n    <Toast body=\"An update is available.\" :auto-close=\"false\" />\n    <Toast body=\"Failed to upload file.\" type=\"error\" :auto-close=\"false\" />\n    <Toast body=\"Changes saved.\" type=\"success\" :auto-close=\"false\" />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { Toast } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Toast'</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"toast-preview__stack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Toast</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> body</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"An update is available.\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">auto-close</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Toast</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> body</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Failed to upload file.\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"error\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">auto-close</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">Toast</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> body</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"Changes saved.\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> type</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"success\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> :</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">auto-close</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">false</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/toast/stack.vue?vue&type=script&setup=true&lang.ts
var stack_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "stack",
	__ssrInlineRender: true,
	setup(__props) {
		useToast();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "toast-preview__row" }, _attrs))}><button class="toast-preview__trigger"> Show stack </button>`);
			_push(ssrRenderComponent(unref(_sfc_main), null, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region components/demos/toast/stack.vue
var _sfc_setup = stack_vue_vue_type_script_setup_true_lang_default.setup;
stack_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../components/demos/toast/stack.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var stack_default$1 = stack_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region components/demos/toast/stack.vue?raw&highlighted
var stack_default = {
	"source": "<script setup lang=\"ts\">\nimport { ToastViewport, useToast } from '@astryx-vue/core/Toast'\n\nconst toast = useToast()\n\nfunction showStack() {\n  toast({ body: 'An update is available.', duration: 8000 })\n  setTimeout(toast, 400, { body: 'Changes saved.', type: 'success', duration: 8000 })\n  setTimeout(toast, 800, { body: 'Storage is nearly full.', type: 'warning', duration: 8000 })\n  setTimeout(toast, 1200, { body: 'Changes could not be saved.', type: 'error', duration: 8000 })\n}\n<\/script>\n\n<template>\n  <div class=\"toast-preview__row\">\n    <button class=\"toast-preview__trigger\" @click=\"showStack\">\n      Show stack\n    </button>\n    <ToastViewport />\n  </div>\n</template>\n",
	"html": "<div class=\"language-vue\"><button title=\"Copy code\" data-copied=\"Copied\" class=\"copy\"></button><span class=\"lang\">vue</span><pre class=\"shiki shiki-themes github-light github-dark\" style=\"--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e\" tabindex=\"0\" dir=\"ltr\" v-pre=\"\"><code><span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> setup</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> lang</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"ts\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">import</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> { ToastViewport, useToast } </span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">from</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\"> '@astryx-vue/core/Toast'</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">const</span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\"> toast</span><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\"> =</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> useToast</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">()</span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#c62739;--shiki-dark:#F97583\">function</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> showStack</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">() {</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">  toast</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">({ body: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'An update is available.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, duration: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">8000</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> })</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">  setTimeout</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(toast, </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">400</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, { body: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Changes saved.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'success'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, duration: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">8000</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> })</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">  setTimeout</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(toast, </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">800</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, { body: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Storage is nearly full.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'warning'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, duration: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">8000</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> })</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\">  setTimeout</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">(toast, </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">1200</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, { body: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'Changes could not be saved.'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, type: </span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">'error'</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">, duration: </span><span style=\"--shiki-light:#005CC5;--shiki-dark:#79B8FF\">8000</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> })</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">}</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">script</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"toast-preview__row\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">button</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> class</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"toast-preview__trigger\"</span><span style=\"--shiki-light:#6F42C1;--shiki-dark:#B392F0\"> @click</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">=</span><span style=\"--shiki-light:#032F62;--shiki-dark:#9ECBFF\">\"showStack\"</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">      Show stack</span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">button</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">    &#x3C;</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">ToastViewport</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\"> /></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">  &#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">div</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span>\n<span class=\"line\"><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">&#x3C;/</span><span style=\"--shiki-light:#11782a;--shiki-dark:#85E89D\">template</span><span style=\"--shiki-light:#24292E;--shiki-dark:#E1E4E8\">></span></span></code></pre>\n</div>"
};
//#endregion
//#region components/demos/toast/index.ts
var toastBasic = defineDemo(basic_default$1, basic_default, { className: "toast-preview" });
var toastPreview = defineDemo(preview_default$1, preview_default, { className: "toast-preview" });
var toastStack = defineDemo(stack_default$1, stack_default, { className: "toast-preview" });
//#endregion
export { toastPreview as n, toastStack as r, toastBasic as t };
