import { computed, createBlock, createCommentVNode, createElementBlock, defineComponent, inject, mergeProps, normalizeClass, openBlock, renderSlot, resolveDynamicComponent, toValue } from "vue";
//#region ../../packages/core/dist/Icon-B6qNgBP9.js
/**
* The size an owning component supplies to the icons in its slots.
*
* The value is stored as given, so a caller can pass a ref or a computed and
* keep the default in step with its own props.
*/
var ICON_DEFAULT_SIZE_KEY = Symbol("astryx-icon-default-size");
/**
* The size inherited from the nearest owner, or `undefined` when there is none.
*/
function useIconDefaultSize() {
	const inherited = inject(ICON_DEFAULT_SIZE_KEY, void 0);
	return computed(() => inherited == null ? void 0 : toValue(inherited));
}
/**
* The artwork kept for the components' own chrome. Applications bring their own
* icons; this list only has to cover what astryx-vue draws itself.
*/
var ICON_GLYPHS = [
	"chevronDown",
	"chevronLeft",
	"chevronRight",
	"check",
	"moreHorizontal",
	"copy"
];
function isIconGlyph(value) {
	return ICON_GLYPHS.includes(value);
}
/** The CSS-safe form of a name, used as the `astryx-icon--<slug>` class. */
function iconGlyphSlug(name) {
	return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/:/g, "-").toLowerCase();
}
var _hoisted_1 = ["data-color", "data-size"];
var _sfc_main = /*@__PURE__*/ defineComponent({
	name: "AstryxIcon",
	__name: "Icon",
	props: {
		icon: {},
		color: { default: "inherit" },
		size: {},
		label: {}
	},
	setup(__props) {
		const props = __props;
		const inheritedSize = useIconDefaultSize();
		const resolvedSize = computed(() => props.size ?? inheritedSize.value ?? "md");
		const glyphSlug = computed(() => typeof props.icon === "string" && isIconGlyph(props.icon) ? iconGlyphSlug(props.icon) : void 0);
		const providedClass = computed(() => typeof props.icon === "string" && !isIconGlyph(props.icon) ? props.icon : void 0);
		const iconComponent = computed(() => props.icon != null && typeof props.icon !== "string" ? props.icon : void 0);
		const a11yAttrs = computed(() => {
			const label = props.label;
			return label != null && label !== "" ? {
				"role": "img",
				"aria-label": label
			} : { "aria-hidden": "true" };
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", mergeProps(a11yAttrs.value, {
				class: ["astryx-icon", providedClass.value],
				"data-color": __props.color,
				"data-size": resolvedSize.value
			}), [glyphSlug.value ? (openBlock(), createElementBlock("span", {
				key: 0,
				class: normalizeClass(["astryx-icon__glyph", `astryx-icon--${glyphSlug.value}`])
			}, null, 2)) : iconComponent.value ? (openBlock(), createBlock(resolveDynamicComponent(iconComponent.value), { key: 1 })) : !providedClass.value ? renderSlot(_ctx.$slots, "default", {}, void 0, void 0, 2) : createCommentVNode("v-if", true)], 16, _hoisted_1);
		};
	}
});
//#endregion
export { _sfc_main as t };
