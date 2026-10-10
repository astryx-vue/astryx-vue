import { computed, createCommentVNode, createElementBlock, createElementVNode, defineComponent, inject, mergeProps, normalizeStyle, openBlock, ref, renderSlot, toDisplayString, unref } from "vue";
//#region ../../packages/core/dist/utils-C9r3UD_y.js
var AvatarGroupContext = Symbol("AvatarGroupContext");
function resolveSize(size) {
	if (typeof size === "number") return size;
	switch (size) {
		case "xsm": return 20;
		case "sm": return 24;
		case "md": return 36;
		case "lg": return 48;
		case "xl": return 128;
	}
}
//#endregion
//#region ../../packages/core/dist/Avatar-CEU50QJE.js
var _hoisted_1$1 = { class: "astryx-avatar__content" };
var _hoisted_2 = ["src"];
var _hoisted_3 = ["src"];
var _hoisted_4 = {
	key: 0,
	class: "astryx-avatar__status"
};
var INITIALS_FONT_SIZE_RATIO = .4;
var DEFAULT_ICON_RATIO = .6;
var _sfc_main$1 = /*@__PURE__*/ defineComponent({
	__name: "Avatar",
	props: {
		alt: {},
		fallbackSrc: {},
		name: {},
		size: { default: "md" },
		shape: { default: "circle" },
		src: {}
	},
	emits: ["error"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const erroredSrc = ref(void 0);
		const erroredFallbackSrc = ref(void 0);
		const avatarGroup = inject(AvatarGroupContext, void 0);
		const resolvedSize = computed(() => avatarGroup?.size.value ?? props.size);
		const resolvedShape = computed(() => avatarGroup?.shape.value ?? props.shape);
		const numericSize = computed(() => resolveSize(resolvedSize.value));
		const groupStyle = computed(() => {
			if (!avatarGroup) return {};
			return {
				marginInlineStart: `${-avatarGroup.overlap.value}px`,
				borderWidth: "2px"
			};
		});
		const rootStyle = computed(() => ({
			width: `${numericSize.value}px`,
			height: `${numericSize.value}px`
		}));
		const showImage = computed(() => props.src && erroredSrc.value !== props.src);
		const showFallbackImage = computed(() => !showImage.value && props.fallbackSrc && erroredFallbackSrc.value !== props.fallbackSrc);
		const meaningfulName = computed(() => {
			return typeof props.name === "string" && props.name.trim() !== "" ? props.name.trim() : void 0;
		});
		const meaningfulAlt = computed(() => {
			return typeof props.alt === "string" && props.alt.trim() !== "" ? props.alt.trim() : void 0;
		});
		const initials = computed(() => {
			if (!meaningfulName.value) return "";
			const words = meaningfulName.value.split(/\s+/);
			const first = words.at(0);
			const last = words.length > 1 ? words.at(-1) : void 0;
			const initial = (word) => {
				if (!word) return "";
				const match = word.match(/[\p{L}\p{N}]/u);
				return match ? match[0].toUpperCase() : "";
			};
			return `${initial(first)}${initial(last)}`;
		});
		const showInitials = computed(() => !showImage.value && !showFallbackImage.value && initials.value !== "");
		const showIcon = computed(() => !showImage.value && !showFallbackImage.value && initials.value === "");
		const accessibleName = computed(() => {
			return meaningfulAlt.value || meaningfulName.value;
		});
		const a11yProps = computed(() => {
			if (accessibleName.value) return {
				"role": "img",
				"aria-label": accessibleName.value
			};
			return {
				"role": "presentation",
				"aria-hidden": "true"
			};
		});
		function handleImageError(event) {
			if (props.src) erroredSrc.value = props.src;
			emit("error", event);
		}
		function handleFallbackError() {
			if (props.fallbackSrc) erroredFallbackSrc.value = props.fallbackSrc;
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", mergeProps({
				class: ["astryx-avatar", [`astryx-avatar--${resolvedShape.value}`, { "astryx-avatar--group-item": unref(avatarGroup) }]],
				style: [rootStyle.value, groupStyle.value]
			}, a11yProps.value), [createElementVNode("span", _hoisted_1$1, [showImage.value ? (openBlock(), createElementBlock("img", {
				key: 0,
				class: "astryx-avatar__image",
				src: __props.src,
				alt: "",
				onError: handleImageError
			}, null, 40, _hoisted_2)) : showFallbackImage.value ? (openBlock(), createElementBlock("img", {
				key: 1,
				class: "astryx-avatar__image",
				src: __props.fallbackSrc,
				alt: "",
				onError: handleFallbackError
			}, null, 40, _hoisted_3)) : showInitials.value ? (openBlock(), createElementBlock("span", {
				key: 2,
				class: "astryx-avatar__fallback astryx-avatar__fallback--initials",
				style: normalizeStyle({ fontSize: `${numericSize.value * INITIALS_FONT_SIZE_RATIO}px` })
			}, toDisplayString(initials.value), 5)) : showIcon.value ? (openBlock(), createElementBlock("span", {
				key: 3,
				class: "astryx-avatar__fallback astryx-avatar__fallback--icon",
				style: normalizeStyle({ fontSize: `${numericSize.value * DEFAULT_ICON_RATIO}px` })
			}, [renderSlot(_ctx.$slots, "default", {}, () => [_cache[0] || (_cache[0] = createElementVNode("svg", {
				viewBox: "0 0 24 24",
				fill: "currentColor",
				"aria-hidden": "true"
			}, [createElementVNode("path", { d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" })], -1))])], 4)) : createCommentVNode("v-if", true)]), _ctx.$slots.status ? (openBlock(), createElementBlock("span", _hoisted_4, [renderSlot(_ctx.$slots, "status")])) : createCommentVNode("v-if", true)], 16);
		};
	}
});
var _hoisted_1 = ["data-variant"];
var _sfc_main = /*@__PURE__*/ defineComponent({
	__name: "AvatarStatusDot",
	props: { variant: { default: "neutral" } },
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", {
				class: "astryx-avatar-status-dot",
				"data-variant": __props.variant,
				"aria-hidden": "true"
			}, null, 8, _hoisted_1);
		};
	}
});
//#endregion
export { resolveSize as i, _sfc_main$1 as n, AvatarGroupContext as r, _sfc_main as t };
