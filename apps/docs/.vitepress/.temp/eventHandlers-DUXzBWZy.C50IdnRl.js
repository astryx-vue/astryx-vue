import { Teleport, createBlock, createCommentVNode, createElementBlock, defineComponent, nextTick, normalizeStyle, onBeforeUnmount, onMounted, openBlock, shallowRef, toDisplayString, useTemplateRef, vShow, watch, withDirectives } from "vue";
//#region ../../packages/core/dist/ButtonTooltip-nWWrth8j.js
var _hoisted_1 = ["id"];
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "ButtonTooltip",
	__name: "ButtonTooltip",
	props: {
		anchor: {},
		id: {},
		open: { type: Boolean },
		text: {}
	},
	emits: ["pointerEnter", "pointerLeave"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const isMounted = shallowRef(false);
		const tooltip = useTemplateRef("tooltip");
		const tooltipStyle = shallowRef({
			left: "0px",
			top: "0px",
			visibility: "hidden"
		});
		let isListening = false;
		function updatePosition() {
			const anchor = props.anchor;
			const element = tooltip.value;
			if (anchor == null || element == null || typeof window === "undefined") return;
			const anchorRect = anchor.getBoundingClientRect();
			const tooltipRect = element.getBoundingClientRect();
			const gap = 8;
			const viewportGap = 8;
			const centeredLeft = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;
			const maxLeft = Math.max(viewportGap, window.innerWidth - tooltipRect.width - viewportGap);
			const left = Math.min(Math.max(centeredLeft, viewportGap), maxLeft);
			const above = anchorRect.top - tooltipRect.height - gap;
			const top = above >= viewportGap ? above : Math.min(anchorRect.bottom + gap, window.innerHeight - tooltipRect.height - viewportGap);
			tooltipStyle.value = {
				left: `${Math.round(left)}px`,
				top: `${Math.round(Math.max(viewportGap, top))}px`,
				visibility: "visible"
			};
		}
		__expose({ updatePosition });
		function startListening() {
			if (isListening || typeof window === "undefined") return;
			window.addEventListener("resize", updatePosition);
			window.addEventListener("scroll", updatePosition, true);
			isListening = true;
		}
		function stopListening() {
			if (!isListening || typeof window === "undefined") return;
			window.removeEventListener("resize", updatePosition);
			window.removeEventListener("scroll", updatePosition, true);
			isListening = false;
		}
		watch(() => [props.anchor, props.open], async ([, open]) => {
			if (!open) {
				stopListening();
				return;
			}
			tooltipStyle.value = {
				left: "0px",
				top: "0px",
				visibility: "hidden"
			};
			await nextTick();
			updatePosition();
			startListening();
		}, { flush: "post" });
		onMounted(() => {
			isMounted.value = true;
		});
		onBeforeUnmount(stopListening);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Teleport, { to: "body" }, [isMounted.value ? withDirectives((openBlock(), createElementBlock("div", {
				key: 0,
				id: __props.id,
				ref_key: "tooltip",
				ref: tooltip,
				class: "astryx-button-tooltip",
				role: "tooltip",
				style: normalizeStyle(tooltipStyle.value),
				onPointerenter: _cache[0] || (_cache[0] = ($event) => emit("pointerEnter")),
				onPointerleave: _cache[1] || (_cache[1] = ($event) => emit("pointerLeave"))
			}, toDisplayString(__props.text), 45, _hoisted_1)), [[vShow, __props.open]]) : createCommentVNode("v-if", true)]);
		};
	}
});
//#endregion
//#region ../../packages/core/dist/eventHandlers-DUXzBWZy.js
function invokeNativeEventHandler(handler, event) {
	if (Array.isArray(handler)) {
		for (const item of handler) invokeNativeEventHandler(item, event);
		return;
	}
	if (typeof handler === "function") handler(event);
}
//#endregion
export { _sfc_main as n, invokeNativeEventHandler as t };
