import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { FieldLabelProps, FieldLabelSlots, FieldStatusInput } from '../Field/types.js'

export type SliderValue = number | [number, number]
export type SliderOrientation = 'horizontal' | 'vertical'
export type SliderValueDisplay = 'tooltip' | 'text' | 'none'
export interface SliderMark { value: number, label?: string }

export interface SliderProps<T extends SliderValue = SliderValue> extends Omit<FieldLabelProps, 'inputId' | 'labelId' | 'descriptionId' | 'isGroupLabel'>, FieldPartStylingProps {
  modelValue: T
  id?: string
  min?: number
  max?: number
  step?: number
  minStepsBetweenThumbs?: number
  orientation?: SliderOrientation
  valueDisplay?: SliderValueDisplay
  formatValue?: (value: number) => string
  marks?: SliderMark[]
  width?: number | string
  htmlName?: string
  form?: string
  status?: FieldStatusInput
  disabledMessage?: string
  minLabel?: string
  maxLabel?: string
}

export interface SliderEmits<T extends SliderValue = SliderValue> {
  change: [value: T]
  changeEnd: [value: T]
}
export interface SliderSlots extends FieldLabelSlots {}
