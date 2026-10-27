/**
 * 日历表头用的 CLDR「独立短星期名」，从周日开始。
 *
 * 数据照抄原版 `Calendar/standaloneShortWeekdayNames.generated.ts`（Unicode CLDR 48.2.0），
 * 覆盖 `packages/core/locales` 里的每一种语言。`Intl.DateTimeFormat` 的 `short`
 * 给的是「Sun / Mon」这类上下文写法，不是日历表头用的那一套，所以单独存一份。
 */
export type StandaloneShortWeekdayNames = readonly [string, string, string, string, string, string, string]

export const standaloneShortWeekdayNamesByLocale: Readonly<Record<string, StandaloneShortWeekdayNames>> = {
  'af': ['So.', 'Ma.', 'Di.', 'Wo.', 'Do.', 'Vr.', 'Sa.'],
  'ar': ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  'ar-SA': ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  'ca': ['dg.', 'dl.', 'dt.', 'dc.', 'dj.', 'dv.', 'ds.'],
  'cs': ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
  'da': ['sø.', 'ma.', 'ti.', 'on.', 'to.', 'fr.', 'lø.'],
  'de': ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'],
  'el': ['Κυ', 'Δε', 'Τρ', 'Τε', 'Πέ', 'Πα', 'Σά'],
  'en': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  'es': ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA'],
  'fi': ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'],
  'fr': ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'],
  'he': ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'],
  'hu': ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'],
  'it': ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
  'ja': ['日', '月', '火', '水', '木', '金', '土'],
  'ko': ['일', '월', '화', '수', '목', '금', '토'],
  'nl': ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  'no': ['sø.', 'ma.', 'ti.', 'on.', 'to.', 'fr.', 'lø.'],
  'pl': ['nie', 'pon', 'wto', 'śro', 'czw', 'pią', 'sob'],
  'pt': ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'],
  'pt-PT': ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'],
  'ro': ['du.', 'lu.', 'ma.', 'mi.', 'joi', 'vi.', 'sâ.'],
  'ru': ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  'sr': ['не', 'по', 'ут', 'ср', 'че', 'пе', 'су'],
  'sv': ['sö', 'må', 'ti', 'on', 'to', 'fr', 'lö'],
  'tr': ['Pa', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
  'uk': ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  'vi': ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  'zh': ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  'zh-TW': ['日', '一', '二', '三', '四', '五', '六'],
}
