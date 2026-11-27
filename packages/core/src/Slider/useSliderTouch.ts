/**
 * @file useSliderTouch.ts
 * @input Slider's props, its value control (useSlider) and its parts
 * @output useSliderTouch: wires UISlider's tracking (sliderTouchController.ts)
 *   to a rendered Slider for every pointer, while it is enabled
 * @position Internal to Slider. Slider's own pointer handlers then take only
 *   a mouse press on the track.
 */

import type { SliderTouchModel } from './sliderTouchMotion'
import type { SliderTouchParts } from './sliderTravel'
import type { SliderProps } from './types.js'
import type { useSlider } from './useSlider.js'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { THUMB_SIZE } from './sliderMath.js'
import { SliderTouchController } from './sliderTouchController'

interface SliderTouchOptions {
  props: Omit<SliderProps, 'modelValue'>
  control: ReturnType<typeof useSlider>
  getParts: () => SliderTouchParts | null
}

/** The controller's view of the slider: every read is fresh. */
function touchModel({ props, control }: Omit<SliderTouchOptions, 'getParts'>): SliderTouchModel {
  return {
    get min() {
      return control.min.value
    },
    get max() {
      return control.max.value
    },
    get isRange() {
      return control.values.value.length === 2
    },
    get isHorizontal() {
      return props.orientation !== 'vertical'
    },
    get isDisabled() {
      return !!props.isDisabled
    },
    thumbSize: THUMB_SIZE,
    values: control.current,
    constrain: control.constrain,
    bounds: control.currentBounds,
    change: (index, value, from) => control.setValue(index, value, from),
    press: control.hold,
    // The interaction ended: the slider takes its last value now, before the
    // parts go back to the stylesheet. Vue renders it before the next paint.
    commit: (index, value) => {
      if (value !== null)
        control.setValue(index, value)
      control.hold(null)
    },
    reportEnd: control.reportEnd,
    valueAt: control.valueAt,
    thumbFor: control.thumbFor,
  }
}

export function useSliderTouch(options: SliderTouchOptions): void {
  const controller = new SliderTouchController(touchModel(options), options.getParts)
  const { props, control } = options
  // The thumbs' recognizers attach while the slider is enabled. They detach,
  // ending any interaction silently, when it is disabled or the thumbs or
  // the orientation change.
  onMounted(() => {
    watch(
      [() => !props.isDisabled, () => control.values.value.length, () => props.orientation],
      ([isEnabled], _, onCleanup) => {
        if (isEnabled)
          onCleanup(controller.attach())
      },
      { immediate: true, flush: 'post' },
    )
  })
  onBeforeUnmount(() => controller.dispose())
}
