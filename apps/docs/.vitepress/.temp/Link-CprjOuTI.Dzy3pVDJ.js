import { computed, createCommentVNode, createElementBlock, defineComponent, normalizeClass, openBlock, renderSlot, withModifiers } from "vue";
//#region ../../packages/core/dist/Link-CprjOuTI.js
var _hoisted_1 = [
	"href",
	"target",
	"rel",
	"download"
];
var _hoisted_2 = {
	key: 0,
	class: "astryx-link__external",
	"aria-hidden": "true"
};
var _hoisted_3 = ["disabled"];
var _sfc_main = /*@__PURE__*/ defineComponent({
	__name: "Link",
	props: {
		href: {},
		isExternalLink: {
			type: Boolean,
			default: false
		},
		hasUnderline: {
			type: Boolean,
			default: false
		},
		color: { default: "accent" },
		isDisabled: {
			type: Boolean,
			default: false
		},
		target: {},
		rel: {},
		download: { type: [String, Boolean] }
	},
	emits: ["click"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const computedTarget = computed(() => {
			return props.isExternalLink ? "_blank" : props.target;
		});
		const computedRel = computed(() => {
			const parts = new Set((props.rel ?? "").split(" ").filter(Boolean));
			if (props.isExternalLink || computedTarget.value === "_blank") {
				parts.add("noopener");
				parts.add("noreferrer");
			}
			return parts.size > 0 ? Array.from(parts).join(" ") : void 0;
		});
		const classes = computed(() => [
			"astryx-link",
			`astryx-link--color-${props.color}`,
			props.hasUnderline && "astryx-link--underlined",
			props.isDisabled && "astryx-link--disabled",
			props.isExternalLink && "astryx-link--external"
		]);
		function handleClick(event) {
			if (props.isDisabled) {
				event.preventDefault();
				return;
			}
			emit("click", event);
		}
		return (_ctx, _cache) => {
			return __props.href && !__props.isDisabled ? (openBlock(), createElementBlock("a", {
				key: 0,
				class: normalizeClass(["astryx-link", classes.value]),
				href: __props.href,
				target: computedTarget.value,
				rel: computedRel.value,
				download: __props.download,
				onClick: handleClick
			}, [renderSlot(_ctx.$slots, "default"), __props.isExternalLink ? (openBlock(), createElementBlock("span", _hoisted_2, "↗")) : createCommentVNode("v-if", true)], 10, _hoisted_1)) : __props.href && __props.isDisabled ? (openBlock(), createElementBlock("a", {
				key: 1,
				class: normalizeClass(["astryx-link", classes.value]),
				role: "link",
				"aria-disabled": "true",
				onClick: _cache[0] || (_cache[0] = withModifiers(() => {}, ["prevent"]))
			}, [renderSlot(_ctx.$slots, "default")], 2)) : (openBlock(), createElementBlock("button", {
				key: 2,
				type: "button",
				class: normalizeClass(["astryx-link", classes.value]),
				disabled: __props.isDisabled,
				onClick: handleClick
			}, [renderSlot(_ctx.$slots, "default")], 10, _hoisted_3));
		};
	}
});
//#endregion
export { _sfc_main as t };
