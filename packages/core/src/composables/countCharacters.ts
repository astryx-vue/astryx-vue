/**
 * 按人眼看到的字符数，不按 UTF-16 码元数。
 * 一个 emoji、一面旗、一个带音标的字母都算一个。
 */
export { characterCount as countCharacters } from '../utils/characters.js'
