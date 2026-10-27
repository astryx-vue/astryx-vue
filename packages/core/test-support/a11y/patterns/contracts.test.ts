// 三个模式契约的自测：每条期望在合格夹具上通过、在拿掉结果的夹具上失败。
import { describe } from 'vitest'
import { describeContract } from '../self-test'
import { BUTTON_PATTERN } from './button'
import { BUTTON_FIXTURES } from './button.fixtures'
import { CHECKBOX_PATTERN } from './checkbox'
import { CHECKBOX_FIXTURES } from './checkbox.fixtures'
import { SWITCH_PATTERN } from './switch'
import { SWITCH_FIXTURES } from './switch.fixtures'

describe('button', () => describeContract(BUTTON_PATTERN, BUTTON_FIXTURES))
describe('checkbox', () => describeContract(CHECKBOX_PATTERN, CHECKBOX_FIXTURES))
describe('switch', () => describeContract(SWITCH_PATTERN, SWITCH_FIXTURES))
