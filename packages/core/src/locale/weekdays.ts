/**
 * 日历表头用的星期名（CLDR），从周日开始。
 *
 * 数据照抄原版 `Calendar/weekdayHeaderNames.generated.ts`（Unicode CLDR 48.2.0），
 * 覆盖 `packages/core/locales` 里的每一种语言。各语言的写法不统一（英语是 Sun / Mon，
 * 德语是 So / Mo），`Intl` 给不出同一套，所以单独存一份。
 */
export type StandaloneShortWeekdayNames = readonly [string, string, string, string, string, string, string]

export const standaloneShortWeekdayNamesByLocale: Readonly<Record<string, StandaloneShortWeekdayNames>> = {
  'af': ['So.', 'Ma.', 'Di.', 'Wo.', 'Do.', 'Vr.', 'Sa.'],
  'ar': ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  'ar-SA': ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  'ca': ['dg.', 'dl.', 'dt.', 'dc.', 'dj.', 'dv.', 'ds.'],
  'cs': ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
  'da': ['sø.', 'ma.', 'ti.', 'on.', 'to.', 'fr.', 'lø.'],
  'de': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  'el': ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ'],
  'en': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  'es': ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  'fi': ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'],
  'fr': ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  'he': ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'],
  'hu': ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'],
  'it': ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
  'ja': ['日', '月', '火', '水', '木', '金', '土'],
  'ko': ['일', '월', '화', '수', '목', '금', '토'],
  'nl': ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  'no': ['søn.', 'man.', 'tir.', 'ons.', 'tor.', 'fre.', 'lør.'],
  'pl': ['nie', 'pon', 'wto', 'śro', 'czw', 'pią', 'sob'],
  'pt': ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'],
  'pt-PT': ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'],
  'ro': ['dum.', 'lun.', 'mar.', 'mie.', 'joi', 'vin.', 'sâm.'],
  'ru': ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  'sr': ['нед', 'пон', 'уто', 'сре', 'чет', 'пет', 'суб'],
  'sv': ['sön', 'mån', 'tis', 'ons', 'tors', 'fre', 'lör'],
  'tr': ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  'uk': ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  'vi': ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  'zh': ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  'zh-TW': ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
}
