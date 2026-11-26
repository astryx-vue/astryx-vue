//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/utils.ts
function mod(amount, numerator) {
	return amount - numerator * Math.floor(amount / numerator);
}
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/calendars/GregorianCalendar.ts
var EPOCH = 1721426;
function gregorianToJulianDay(era, year, month, day) {
	year = getExtendedYear(era, year);
	let y1 = year - 1;
	let monthOffset = -2;
	if (month <= 2) monthOffset = 0;
	else if (isLeapYear$2(year)) monthOffset = -1;
	return 1721425 + 365 * y1 + Math.floor(y1 / 4) - Math.floor(y1 / 100) + Math.floor(y1 / 400) + Math.floor((367 * month - 362) / 12 + monthOffset + day);
}
function isLeapYear$2(year) {
	return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function getExtendedYear(era, year) {
	return era === "BC" ? 1 - year : year;
}
function fromExtendedYear(year) {
	let era = "AD";
	if (year <= 0) {
		era = "BC";
		year = 1 - year;
	}
	return [era, year];
}
var daysInMonth = {
	standard: [
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	],
	leapyear: [
		31,
		29,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	]
};
/**
* The Gregorian calendar is the most commonly used calendar system in the world. It supports two
* eras: BC, and AD. Years always contain 12 months, and 365 or 366 days depending on whether it is
* a leap year.
*/
var GregorianCalendar = class {
	identifier = "gregory";
	fromJulianDay(jd) {
		let jd0 = jd;
		let depoch = jd0 - EPOCH;
		let quadricent = Math.floor(depoch / 146097);
		let dqc = mod(depoch, 146097);
		let cent = Math.floor(dqc / 36524);
		let dcent = mod(dqc, 36524);
		let quad = Math.floor(dcent / 1461);
		let dquad = mod(dcent, 1461);
		let yindex = Math.floor(dquad / 365);
		let [era, year] = fromExtendedYear(quadricent * 400 + cent * 100 + quad * 4 + yindex + (cent !== 4 && yindex !== 4 ? 1 : 0));
		let yearDay = jd0 - gregorianToJulianDay(era, year, 1, 1);
		let leapAdj = 2;
		if (jd0 < gregorianToJulianDay(era, year, 3, 1)) leapAdj = 0;
		else if (isLeapYear$2(year)) leapAdj = 1;
		let month = Math.floor(((yearDay + leapAdj) * 12 + 373) / 367);
		return new CalendarDate(era, year, month, jd0 - gregorianToJulianDay(era, year, month, 1) + 1);
	}
	toJulianDay(date) {
		return gregorianToJulianDay(date.era, date.year, date.month, date.day);
	}
	getDaysInMonth(date) {
		return daysInMonth[isLeapYear$2(date.year) ? "leapyear" : "standard"][date.month - 1];
	}
	getMonthsInYear(date) {
		return 12;
	}
	getDaysInYear(date) {
		return isLeapYear$2(date.year) ? 366 : 365;
	}
	getMaximumMonthsInYear() {
		return 12;
	}
	getMaximumDaysInMonth() {
		return 31;
	}
	getYearsInEra(date) {
		return 9999;
	}
	getEras() {
		return ["BC", "AD"];
	}
	isInverseEra(date) {
		return date.era === "BC";
	}
	balanceDate(date) {
		if (date.year <= 0) {
			date.era = date.era === "BC" ? "AD" : "BC";
			date.year = 1 - date.year;
		}
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/weekStartData.ts
var weekStartData = {
	"001": 1,
	AD: 1,
	AE: 6,
	AF: 6,
	AI: 1,
	AL: 1,
	AM: 1,
	AN: 1,
	AR: 1,
	AT: 1,
	AU: 1,
	AX: 1,
	AZ: 1,
	BA: 1,
	BE: 1,
	BG: 1,
	BH: 6,
	BM: 1,
	BN: 1,
	BY: 1,
	CH: 1,
	CL: 1,
	CM: 1,
	CN: 1,
	CR: 1,
	CY: 1,
	CZ: 1,
	DE: 1,
	DJ: 6,
	DK: 1,
	DZ: 6,
	EC: 1,
	EE: 1,
	EG: 6,
	ES: 1,
	FI: 1,
	FJ: 1,
	FO: 1,
	FR: 1,
	GB: 1,
	GE: 1,
	GF: 1,
	GP: 1,
	GR: 1,
	HR: 1,
	HU: 1,
	IE: 1,
	IQ: 6,
	IR: 6,
	IS: 1,
	IT: 1,
	JO: 6,
	KG: 1,
	KW: 6,
	KZ: 1,
	LB: 1,
	LI: 1,
	LK: 1,
	LT: 1,
	LU: 1,
	LV: 1,
	LY: 6,
	MC: 1,
	MD: 1,
	ME: 1,
	MK: 1,
	MN: 1,
	MQ: 1,
	MV: 5,
	MY: 1,
	NL: 1,
	NO: 1,
	NZ: 1,
	OM: 6,
	PL: 1,
	QA: 6,
	RE: 1,
	RO: 1,
	RS: 1,
	RU: 1,
	SD: 6,
	SE: 1,
	SI: 1,
	SK: 1,
	SM: 1,
	SY: 6,
	TJ: 1,
	TM: 1,
	TR: 1,
	UA: 1,
	UY: 1,
	UZ: 1,
	VA: 1,
	VN: 1,
	XK: 1
};
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/queries.ts
/** Returns whether the given dates occur on the same day, regardless of the time or calendar system. */
function isSameDay(a, b) {
	b = toCalendar(b, a.calendar);
	return a.era === b.era && a.year === b.year && a.month === b.month && a.day === b.day;
}
/**
* Returns whether the given dates occur in the same month, using the calendar system of the first
* date.
*/
function isSameMonth(a, b) {
	b = toCalendar(b, a.calendar);
	a = startOfMonth(a);
	b = startOfMonth(b);
	return a.era === b.era && a.year === b.year && a.month === b.month;
}
/**
* Returns whether the given dates occur in the same year, using the calendar system of the first
* date.
*/
function isSameYear(a, b) {
	b = toCalendar(b, a.calendar);
	a = startOfYear(a);
	b = startOfYear(b);
	return a.era === b.era && a.year === b.year;
}
/** Returns whether the given dates occur on the same day, and are of the same calendar system. */
function isEqualDay(a, b) {
	return isEqualCalendar(a.calendar, b.calendar) && isSameDay(a, b);
}
/** Returns whether the given dates occur in the same month, and are of the same calendar system. */
function isEqualMonth(a, b) {
	return isEqualCalendar(a.calendar, b.calendar) && isSameMonth(a, b);
}
/** Returns whether the given dates occur in the same year, and are of the same calendar system. */
function isEqualYear(a, b) {
	return isEqualCalendar(a.calendar, b.calendar) && isSameYear(a, b);
}
/** Returns whether two calendars are the same. */
function isEqualCalendar(a, b) {
	return a.isEqual?.(b) ?? b.isEqual?.(a) ?? a.identifier === b.identifier;
}
/** Returns whether the date is today in the given time zone. */
function isToday(date, timeZone) {
	return isSameDay(date, today(timeZone));
}
var DAY_MAP = {
	sun: 0,
	mon: 1,
	tue: 2,
	wed: 3,
	thu: 4,
	fri: 5,
	sat: 6
};
/**
* Returns the day of week for the given date and locale. Days are numbered from zero to six,
* where zero is the first day of the week in the given locale. For example, in the United States,
* the first day of the week is Sunday, but in France it is Monday.
*/
function getDayOfWeek(date, locale, firstDayOfWeek) {
	let julian = date.calendar.toJulianDay(date);
	let weekStart = firstDayOfWeek ? DAY_MAP[firstDayOfWeek] : getWeekStart(locale);
	let dayOfWeek = Math.ceil(julian + 1 - weekStart) % 7;
	if (dayOfWeek < 0) dayOfWeek += 7;
	return dayOfWeek;
}
/** Returns the current time in the given time zone. */
function now(timeZone) {
	return fromAbsolute(Date.now(), timeZone);
}
/** Returns today's date in the given time zone. */
function today(timeZone) {
	return toCalendarDate(now(timeZone));
}
function compareDate(a, b) {
	return a.calendar.toJulianDay(a) - b.calendar.toJulianDay(b);
}
function compareTime(a, b) {
	return timeToMs(a) - timeToMs(b);
}
function timeToMs(a) {
	return a.hour * 60 * 60 * 1e3 + a.minute * 60 * 1e3 + a.second * 1e3 + a.millisecond;
}
/**
* Returns the number of hours in the given date and time zone.
* Usually this is 24, but it could be 23 or 25 if the date is on a daylight saving transition.
*/
function getHoursInDay(a, timeZone) {
	let ms = toAbsolute(a, timeZone);
	return (toAbsolute(a.add({ days: 1 }), timeZone) - ms) / 36e5;
}
var localTimeZone = null;
var localTimeZoneOverride = false;
/** Returns the time zone identifier for the current user. */
function getLocalTimeZone() {
	if (localTimeZone == null) localTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
	return localTimeZone;
}
/** Sets the time zone identifier for the current user. */
function setLocalTimeZone(timeZone) {
	localTimeZoneOverride = true;
	localTimeZone = timeZone;
}
/** Resets the time zone identifier for the current user. */
function resetLocalTimeZone() {
	localTimeZoneOverride = false;
	localTimeZone = null;
}
/** Returns whether the local time zone has been explicitly overridden via `setLocalTimeZone`. */
function isLocalTimeZoneOverridden() {
	return localTimeZoneOverride;
}
function startOfMonth(date) {
	return date.subtract({ days: date.day - 1 });
}
function endOfMonth(date) {
	return date.add({ days: date.calendar.getDaysInMonth(date) - date.day });
}
function startOfYear(date) {
	return startOfMonth(date.subtract({ months: date.month - 1 }));
}
function endOfYear(date) {
	return endOfMonth(date.add({ months: date.calendar.getMonthsInYear(date) - date.month }));
}
function getMinimumMonthInYear(date) {
	if (date.calendar.getMinimumMonthInYear) return date.calendar.getMinimumMonthInYear(date);
	return 1;
}
function getMinimumDayInMonth(date) {
	if (date.calendar.getMinimumDayInMonth) return date.calendar.getMinimumDayInMonth(date);
	return 1;
}
function startOfWeek(date, locale, firstDayOfWeek) {
	let dayOfWeek = getDayOfWeek(date, locale, firstDayOfWeek);
	return date.subtract({ days: dayOfWeek });
}
function endOfWeek(date, locale, firstDayOfWeek) {
	return startOfWeek(date, locale, firstDayOfWeek).add({ days: 6 });
}
var cachedRegions = /* @__PURE__ */ new Map();
var cachedWeekInfo = /* @__PURE__ */ new Map();
function getRegion(locale) {
	if (Intl.Locale) {
		let region = cachedRegions.get(locale);
		if (!region) {
			region = new Intl.Locale(locale).maximize().region;
			if (region) cachedRegions.set(locale, region);
		}
		return region;
	}
	let part = locale.split("-")[1];
	return part === "u" ? void 0 : part;
}
function getWeekStart(locale) {
	let weekInfo = cachedWeekInfo.get(locale);
	if (!weekInfo) {
		if (Intl.Locale) {
			let localeInst = new Intl.Locale(locale);
			if ("getWeekInfo" in localeInst) {
				weekInfo = localeInst.getWeekInfo();
				if (weekInfo) {
					cachedWeekInfo.set(locale, weekInfo);
					return weekInfo.firstDay;
				}
			}
		}
		let region = getRegion(locale);
		if (locale.includes("-fw-")) {
			let day = locale.split("-fw-")[1].split("-")[0];
			if (day === "mon") weekInfo = { firstDay: 1 };
			else if (day === "tue") weekInfo = { firstDay: 2 };
			else if (day === "wed") weekInfo = { firstDay: 3 };
			else if (day === "thu") weekInfo = { firstDay: 4 };
			else if (day === "fri") weekInfo = { firstDay: 5 };
			else if (day === "sat") weekInfo = { firstDay: 6 };
			else weekInfo = { firstDay: 0 };
		} else if (locale.includes("-ca-iso8601")) weekInfo = { firstDay: 1 };
		else weekInfo = { firstDay: region ? weekStartData[region] || 0 : 0 };
		cachedWeekInfo.set(locale, weekInfo);
	}
	return weekInfo.firstDay;
}
/** Returns the number of weeks in the given month and locale. */
function getWeeksInMonth(date, locale, firstDayOfWeek) {
	let days = date.calendar.getDaysInMonth(date);
	return Math.ceil((getDayOfWeek(startOfMonth(date), locale, firstDayOfWeek) + days) / 7);
}
function minDate(a, b) {
	if (a && b) return a.compare(b) <= 0 ? a : b;
	return a || b;
}
/** Returns the greater of the two provider dates. */
function maxDate(a, b) {
	if (a && b) return a.compare(b) >= 0 ? a : b;
	return a || b;
}
var WEEKEND_DATA = {
	AF: [4, 5],
	AE: [5, 6],
	BH: [5, 6],
	DZ: [5, 6],
	EG: [5, 6],
	IL: [5, 6],
	IQ: [5, 6],
	IR: [5, 5],
	JO: [5, 6],
	KW: [5, 6],
	LY: [5, 6],
	OM: [5, 6],
	QA: [5, 6],
	SA: [5, 6],
	SD: [5, 6],
	SY: [5, 6],
	YE: [5, 6]
};
/** Returns whether the given date is on a weekend in the given locale. */
function isWeekend(date, locale) {
	let julian = date.calendar.toJulianDay(date);
	let dayOfWeek = Math.ceil(julian + 1) % 7;
	if (dayOfWeek < 0) dayOfWeek += 7;
	let [start, end] = WEEKEND_DATA[getRegion(locale)] || [6, 0];
	return dayOfWeek === start || dayOfWeek === end;
}
/** Returns whether the given date is on a weekday in the given locale. */
function isWeekday(date, locale) {
	return !isWeekend(date, locale);
}
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/conversion.ts
function epochFromDate(date) {
	date = toCalendar(date, new GregorianCalendar());
	return epochFromParts(getExtendedYear(date.era, date.year), date.month, date.day, date.hour, date.minute, date.second, date.millisecond);
}
function epochFromParts(year, month, day, hour, minute, second, millisecond) {
	let date = /* @__PURE__ */ new Date();
	date.setUTCHours(hour, minute, second, millisecond);
	date.setUTCFullYear(year, month - 1, day);
	return date.getTime();
}
function getTimeZoneOffset(ms, timeZone) {
	if (timeZone === "UTC") return 0;
	if (ms > 0 && timeZone === getLocalTimeZone() && !isLocalTimeZoneOverridden()) return new Date(ms).getTimezoneOffset() * -60 * 1e3;
	let { year, month, day, hour, minute, second } = getTimeZoneParts(ms, timeZone);
	return epochFromParts(year, month, day, hour, minute, second, 0) - Math.floor(ms / 1e3) * 1e3;
}
var formattersByTimeZone = /* @__PURE__ */ new Map();
function getTimeZoneParts(ms, timeZone) {
	let formatter = formattersByTimeZone.get(timeZone);
	if (!formatter) {
		formatter = new Intl.DateTimeFormat("en-US", {
			timeZone,
			hour12: false,
			era: "short",
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
			second: "numeric"
		});
		formattersByTimeZone.set(timeZone, formatter);
	}
	let parts = formatter.formatToParts(new Date(ms));
	let namedParts = {};
	for (let part of parts) if (part.type !== "literal") namedParts[part.type] = part.value;
	return {
		year: namedParts.era === "BC" || namedParts.era === "B" ? -namedParts.year + 1 : +namedParts.year,
		month: +namedParts.month,
		day: +namedParts.day,
		hour: namedParts.hour === "24" ? 0 : +namedParts.hour,
		minute: +namedParts.minute,
		second: +namedParts.second
	};
}
var DAYMILLIS = 864e5;
function possibleAbsolutes(date, timeZone) {
	let ms = epochFromDate(date);
	return getValidWallTimes(date, timeZone, ms - getTimeZoneOffset(ms - DAYMILLIS, timeZone), ms - getTimeZoneOffset(ms + DAYMILLIS, timeZone));
}
function getValidWallTimes(date, timeZone, earlier, later) {
	return (earlier === later ? [earlier] : [earlier, later]).filter((absolute) => isValidWallTime(date, timeZone, absolute));
}
function isValidWallTime(date, timeZone, absolute) {
	let parts = getTimeZoneParts(absolute, timeZone);
	return date.year === parts.year && date.month === parts.month && date.day === parts.day && date.hour === parts.hour && date.minute === parts.minute && date.second === parts.second;
}
function toAbsolute(date, timeZone, disambiguation = "compatible") {
	let dateTime = toCalendarDateTime(date);
	if (timeZone === "UTC") return epochFromDate(dateTime);
	if (timeZone === getLocalTimeZone() && disambiguation === "compatible" && !isLocalTimeZoneOverridden()) {
		dateTime = toCalendar(dateTime, new GregorianCalendar());
		let date = /* @__PURE__ */ new Date();
		let year = getExtendedYear(dateTime.era, dateTime.year);
		date.setFullYear(year, dateTime.month - 1, dateTime.day);
		date.setHours(dateTime.hour, dateTime.minute, dateTime.second, dateTime.millisecond);
		return date.getTime();
	}
	let ms = epochFromDate(dateTime);
	let offsetBefore = getTimeZoneOffset(ms - DAYMILLIS, timeZone);
	let offsetAfter = getTimeZoneOffset(ms + DAYMILLIS, timeZone);
	let valid = getValidWallTimes(dateTime, timeZone, ms - offsetBefore, ms - offsetAfter);
	if (valid.length === 1) return valid[0];
	if (valid.length > 1) switch (disambiguation) {
		case "compatible":
		case "earlier": return valid[0];
		case "later": return valid[valid.length - 1];
		case "reject": throw new RangeError("Multiple possible absolute times found");
	}
	switch (disambiguation) {
		case "earlier": return Math.min(ms - offsetBefore, ms - offsetAfter);
		case "compatible":
		case "later": return Math.max(ms - offsetBefore, ms - offsetAfter);
		case "reject": throw new RangeError("No such absolute time found");
	}
}
function toDate(dateTime, timeZone, disambiguation = "compatible") {
	return new Date(toAbsolute(dateTime, timeZone, disambiguation));
}
/**
* Takes a Unix epoch (milliseconds since 1970) and converts it to the provided time zone.
*/
function fromAbsolute(ms, timeZone) {
	let offset = getTimeZoneOffset(ms, timeZone);
	let date = new Date(ms + offset);
	let year = date.getUTCFullYear();
	let month = date.getUTCMonth() + 1;
	let day = date.getUTCDate();
	let hour = date.getUTCHours();
	let minute = date.getUTCMinutes();
	let second = date.getUTCSeconds();
	let millisecond = date.getUTCMilliseconds();
	return new ZonedDateTime(year < 1 ? "BC" : "AD", year < 1 ? -year + 1 : year, month, day, timeZone, offset, hour, minute, second, millisecond);
}
/**
* Takes a `Date` object and converts it to the provided time zone.
*/
function fromDate(date, timeZone) {
	return fromAbsolute(date.getTime(), timeZone);
}
/**
* Takes a `Date` object and converts it to the time zone identifier for the current user.
*/
function fromDateToLocal(date) {
	return fromDate(date, getLocalTimeZone());
}
/**
* Converts a value with date components such as a `CalendarDateTime` or `ZonedDateTime` into a
* `CalendarDate`.
*/
function toCalendarDate(dateTime) {
	return new CalendarDate(dateTime.calendar, dateTime.era, dateTime.year, dateTime.month, dateTime.day);
}
/**
* Converts a date value to a `CalendarDateTime`. An optional `Time` value can be passed to set the
* time of the resulting value, otherwise it will default to midnight.
*/
function toCalendarDateTime(date, time) {
	let hour = 0, minute = 0, second = 0, millisecond = 0;
	if ("timeZone" in date) ({hour, minute, second, millisecond} = date);
	else if ("hour" in date && !time) return date;
	if (time) ({hour, minute, second, millisecond} = time);
	return new CalendarDateTime(date.calendar, date.era, date.year, date.month, date.day, hour, minute, second, millisecond);
}
/** Extracts the time components from a value containing a date and time. */
function toTime(dateTime) {
	return new Time(dateTime.hour, dateTime.minute, dateTime.second, dateTime.millisecond);
}
/** Converts a date from one calendar system to another. */
function toCalendar(date, calendar) {
	if (isEqualCalendar(date.calendar, calendar)) return date;
	let calendarDate = calendar.fromJulianDay(date.calendar.toJulianDay(date));
	let copy = date.copy();
	copy.calendar = calendar;
	copy.era = calendarDate.era;
	copy.year = calendarDate.year;
	copy.month = calendarDate.month;
	copy.day = calendarDate.day;
	constrain(copy);
	return copy;
}
/**
* Converts a date value to a `ZonedDateTime` in the provided time zone. The `disambiguation` option
* can be set to control how values that fall on daylight saving time changes are interpreted.
*/
function toZoned(date, timeZone, disambiguation) {
	if (date instanceof ZonedDateTime) {
		if (date.timeZone === timeZone) return date;
		return toTimeZone(date, timeZone);
	}
	return fromAbsolute(toAbsolute(date, timeZone, disambiguation), timeZone);
}
function zonedToDate(date) {
	let ms = epochFromDate(date) - date.offset;
	return new Date(ms);
}
/** Converts a `ZonedDateTime` from one time zone to another. */
function toTimeZone(date, timeZone) {
	return toCalendar(fromAbsolute(epochFromDate(date) - date.offset, timeZone), date.calendar);
}
/** Converts the given `ZonedDateTime` into the user's local time zone. */
function toLocalTimeZone(date) {
	return toTimeZone(date, getLocalTimeZone());
}
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/manipulation.ts
var ONE_HOUR = 36e5;
function add(date, duration) {
	let mutableDate = date.copy();
	let days = "hour" in mutableDate ? addTimeFields(mutableDate, duration) : 0;
	addYears(mutableDate, duration.years || 0);
	if (mutableDate.calendar.balanceYearMonth) mutableDate.calendar.balanceYearMonth(mutableDate, date);
	mutableDate.month += duration.months || 0;
	balanceYearMonth(mutableDate);
	constrainMonthDay(mutableDate);
	mutableDate.day += (duration.weeks || 0) * 7;
	mutableDate.day += duration.days || 0;
	mutableDate.day += days;
	balanceDay(mutableDate);
	if (mutableDate.calendar.balanceDate) mutableDate.calendar.balanceDate(mutableDate);
	if (mutableDate.year < 1) {
		mutableDate.year = 1;
		mutableDate.month = 1;
		mutableDate.day = 1;
	}
	let maxYear = mutableDate.calendar.getYearsInEra(mutableDate);
	if (mutableDate.year > maxYear) {
		let isInverseEra = mutableDate.calendar.isInverseEra?.(mutableDate);
		mutableDate.year = maxYear;
		mutableDate.month = isInverseEra ? 1 : mutableDate.calendar.getMonthsInYear(mutableDate);
		mutableDate.day = isInverseEra ? 1 : mutableDate.calendar.getDaysInMonth(mutableDate);
	}
	if (mutableDate.month < 1) {
		mutableDate.month = 1;
		mutableDate.day = 1;
	}
	let maxMonth = mutableDate.calendar.getMonthsInYear(mutableDate);
	if (mutableDate.month > maxMonth) {
		mutableDate.month = maxMonth;
		mutableDate.day = mutableDate.calendar.getDaysInMonth(mutableDate);
	}
	mutableDate.day = Math.max(1, Math.min(mutableDate.calendar.getDaysInMonth(mutableDate), mutableDate.day));
	return mutableDate;
}
function addYears(date, years) {
	if (date.calendar.isInverseEra?.(date)) years = -years;
	date.year += years;
}
function balanceYearMonth(date) {
	while (date.month < 1) {
		addYears(date, -1);
		date.month += date.calendar.getMonthsInYear(date);
	}
	let monthsInYear = 0;
	while (date.month > (monthsInYear = date.calendar.getMonthsInYear(date))) {
		date.month -= monthsInYear;
		addYears(date, 1);
	}
}
function balanceDay(date) {
	while (date.day < 1) {
		date.month--;
		balanceYearMonth(date);
		date.day += date.calendar.getDaysInMonth(date);
	}
	while (date.day > date.calendar.getDaysInMonth(date)) {
		date.day -= date.calendar.getDaysInMonth(date);
		date.month++;
		balanceYearMonth(date);
	}
}
function constrainMonthDay(date) {
	date.month = Math.max(1, Math.min(date.calendar.getMonthsInYear(date), date.month));
	date.day = Math.max(1, Math.min(date.calendar.getDaysInMonth(date), date.day));
}
function constrain(date) {
	if (date.calendar.constrainDate) date.calendar.constrainDate(date);
	date.year = Math.max(1, Math.min(date.calendar.getYearsInEra(date), date.year));
	constrainMonthDay(date);
}
function invertDuration(duration) {
	let inverseDuration = {};
	for (let key in duration) if (typeof duration[key] === "number") inverseDuration[key] = -duration[key];
	return inverseDuration;
}
function subtract(date, duration) {
	return add(date, invertDuration(duration));
}
function set(date, fields) {
	let mutableDate = date.copy();
	if (fields.era != null) mutableDate.era = fields.era;
	if (fields.year != null) mutableDate.year = fields.year;
	if (fields.month != null) mutableDate.month = fields.month;
	if (fields.day != null) mutableDate.day = fields.day;
	constrain(mutableDate);
	return mutableDate;
}
function setTime(value, fields) {
	let mutableValue = value.copy();
	if (fields.hour != null) mutableValue.hour = fields.hour;
	if (fields.minute != null) mutableValue.minute = fields.minute;
	if (fields.second != null) mutableValue.second = fields.second;
	if (fields.millisecond != null) mutableValue.millisecond = fields.millisecond;
	constrainTime(mutableValue);
	return mutableValue;
}
function balanceTime(time) {
	time.second += Math.floor(time.millisecond / 1e3);
	time.millisecond = nonNegativeMod(time.millisecond, 1e3);
	time.minute += Math.floor(time.second / 60);
	time.second = nonNegativeMod(time.second, 60);
	time.hour += Math.floor(time.minute / 60);
	time.minute = nonNegativeMod(time.minute, 60);
	let days = Math.floor(time.hour / 24);
	time.hour = nonNegativeMod(time.hour, 24);
	return days;
}
function constrainTime(time) {
	time.millisecond = Math.max(0, Math.min(time.millisecond, 999));
	time.second = Math.max(0, Math.min(time.second, 59));
	time.minute = Math.max(0, Math.min(time.minute, 59));
	time.hour = Math.max(0, Math.min(time.hour, 23));
}
function nonNegativeMod(a, b) {
	let result = a % b;
	if (result < 0) result += b;
	return result;
}
function addTimeFields(time, duration) {
	time.hour += duration.hours || 0;
	time.minute += duration.minutes || 0;
	time.second += duration.seconds || 0;
	time.millisecond += duration.milliseconds || 0;
	return balanceTime(time);
}
function addTime(time, duration) {
	let res = time.copy();
	addTimeFields(res, duration);
	return res;
}
function subtractTime(time, duration) {
	return addTime(time, invertDuration(duration));
}
function cycleDate(value, field, amount, options) {
	let mutable = value.copy();
	switch (field) {
		case "era": {
			let eras = value.calendar.getEras();
			let eraIndex = eras.indexOf(value.era);
			if (eraIndex < 0) throw new Error("Invalid era: " + value.era);
			eraIndex = cycleValue(eraIndex, amount, 0, eras.length - 1, options?.round);
			mutable.era = eras[eraIndex];
			constrain(mutable);
			break;
		}
		case "year":
			if (mutable.calendar.isInverseEra?.(mutable)) amount = -amount;
			mutable.year = cycleValue(value.year, amount, -Infinity, 9999, options?.round);
			if (mutable.year === -Infinity) mutable.year = 1;
			if (mutable.calendar.balanceYearMonth) mutable.calendar.balanceYearMonth(mutable, value);
			break;
		case "month":
			mutable.month = cycleValue(value.month, amount, 1, value.calendar.getMonthsInYear(value), options?.round);
			break;
		case "day":
			mutable.day = cycleValue(value.day, amount, 1, value.calendar.getDaysInMonth(value), options?.round);
			break;
		default: throw new Error("Unsupported field " + field);
	}
	if (value.calendar.balanceDate) value.calendar.balanceDate(mutable);
	constrain(mutable);
	return mutable;
}
function cycleTime(value, field, amount, options) {
	let mutable = value.copy();
	switch (field) {
		case "hour": {
			let hours = value.hour;
			let min = 0;
			let max = 23;
			if (options?.hourCycle === 12) {
				let isPM = hours >= 12;
				min = isPM ? 12 : 0;
				max = isPM ? 23 : 11;
			}
			mutable.hour = cycleValue(hours, amount, min, max, options?.round);
			break;
		}
		case "minute":
			mutable.minute = cycleValue(value.minute, amount, 0, 59, options?.round);
			break;
		case "second":
			mutable.second = cycleValue(value.second, amount, 0, 59, options?.round);
			break;
		case "millisecond":
			mutable.millisecond = cycleValue(value.millisecond, amount, 0, 999, options?.round);
			break;
		default: throw new Error("Unsupported field " + field);
	}
	return mutable;
}
function cycleValue(value, amount, min, max, round = false) {
	if (round) {
		value += Math.sign(amount);
		if (value < min) value = max;
		let div = Math.abs(amount);
		if (amount > 0) value = Math.ceil(value / div) * div;
		else value = Math.floor(value / div) * div;
		if (value > max) value = min;
	} else {
		value += amount;
		if (value < min) value = max - (min - value - 1);
		else if (value > max) value = min + (value - max - 1);
	}
	return value;
}
function addZoned(dateTime, duration) {
	let ms;
	if (duration.years != null && duration.years !== 0 || duration.months != null && duration.months !== 0 || duration.weeks != null && duration.weeks !== 0 || duration.days != null && duration.days !== 0) ms = toAbsolute(add(toCalendarDateTime(dateTime), {
		years: duration.years,
		months: duration.months,
		weeks: duration.weeks,
		days: duration.days
	}), dateTime.timeZone);
	else ms = epochFromDate(dateTime) - dateTime.offset;
	ms += duration.milliseconds || 0;
	ms += (duration.seconds || 0) * 1e3;
	ms += (duration.minutes || 0) * 60 * 1e3;
	ms += (duration.hours || 0) * 60 * 60 * 1e3;
	return toCalendar(fromAbsolute(ms, dateTime.timeZone), dateTime.calendar);
}
function subtractZoned(dateTime, duration) {
	return addZoned(dateTime, invertDuration(duration));
}
function cycleZoned(dateTime, field, amount, options) {
	switch (field) {
		case "hour": {
			let min = 0;
			let max = 23;
			if (options?.hourCycle === 12) {
				let isPM = dateTime.hour >= 12;
				min = isPM ? 12 : 0;
				max = isPM ? 23 : 11;
			}
			let plainDateTime = toCalendarDateTime(dateTime);
			let minDate = toCalendar(setTime(plainDateTime, { hour: min }), new GregorianCalendar());
			let minAbsolute = [toAbsolute(minDate, dateTime.timeZone, "earlier"), toAbsolute(minDate, dateTime.timeZone, "later")].filter((ms) => fromAbsolute(ms, dateTime.timeZone).day === minDate.day)[0];
			let maxDate = toCalendar(setTime(plainDateTime, { hour: max }), new GregorianCalendar());
			let maxAbsolute = [toAbsolute(maxDate, dateTime.timeZone, "earlier"), toAbsolute(maxDate, dateTime.timeZone, "later")].filter((ms) => fromAbsolute(ms, dateTime.timeZone).day === maxDate.day).pop();
			let ms = epochFromDate(dateTime) - dateTime.offset;
			let hours = Math.floor(ms / ONE_HOUR);
			let remainder = ms % ONE_HOUR;
			ms = cycleValue(hours, amount, Math.floor(minAbsolute / ONE_HOUR), Math.floor(maxAbsolute / ONE_HOUR), options?.round) * ONE_HOUR + remainder;
			return toCalendar(fromAbsolute(ms, dateTime.timeZone), dateTime.calendar);
		}
		case "minute":
		case "second":
		case "millisecond": return cycleTime(dateTime, field, amount, options);
		case "era":
		case "year":
		case "month":
		case "day": return toCalendar(fromAbsolute(toAbsolute(cycleDate(toCalendarDateTime(dateTime), field, amount, options), dateTime.timeZone), dateTime.timeZone), dateTime.calendar);
		default: throw new Error("Unsupported field " + field);
	}
}
function setZoned(dateTime, fields, disambiguation) {
	let plainDateTime = toCalendarDateTime(dateTime);
	let res = setTime(set(plainDateTime, fields), fields);
	if (res.compare(plainDateTime) === 0) return dateTime;
	return toCalendar(fromAbsolute(toAbsolute(res, dateTime.timeZone, disambiguation), dateTime.timeZone), dateTime.calendar);
}
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/string.ts
var TIME_RE = /^(\d{2})(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/;
var DATE_RE = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})$/;
var DATE_TIME_RE = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?$/;
var ZONED_DATE_TIME_RE = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:([+-]\d{2})(?::?(\d{2}))?(?::?(\d{2}))?)?\[(.*?)\]$/;
var ABSOLUTE_RE = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})(?:T(\d{2}))?(?::(\d{2}))?(?::(\d{2}))?(\.\d+)?(?:(?:([+-]\d{2})(?::?(\d{2}))?)|Z)$/;
var DATE_TIME_DURATION_RE = /^((?<negative>-)|\+)?P((?<years>\d*)Y)?((?<months>\d*)M)?((?<weeks>\d*)W)?((?<days>\d*)D)?((?<time>T)((?<hours>\d*[.,]?\d{1,9})H)?((?<minutes>\d*[.,]?\d{1,9})M)?((?<seconds>\d*[.,]?\d{1,9})S)?)?$/;
var requiredDurationTimeGroups = [
	"hours",
	"minutes",
	"seconds"
];
var requiredDurationGroups = [
	"years",
	"months",
	"weeks",
	"days",
	...requiredDurationTimeGroups
];
/** Parses an ISO 8601 time string. */
function parseTime(value) {
	let m = value.match(TIME_RE);
	if (!m) throw new Error("Invalid ISO 8601 time string: " + value);
	return new Time(parseNumber(m[1], 0, 23), m[2] ? parseNumber(m[2], 0, 59) : 0, m[3] ? parseNumber(m[3], 0, 59) : 0, m[4] ? parseNumber(m[4], 0, Infinity) * 1e3 : 0);
}
/** Parses an ISO 8601 date string, with no time components. */
function parseDate(value) {
	let m = value.match(DATE_RE);
	if (!m) {
		if (ABSOLUTE_RE.test(value)) throw new Error(`Invalid ISO 8601 date string: ${value}. Use parseAbsolute() instead.`);
		throw new Error("Invalid ISO 8601 date string: " + value);
	}
	let date = new CalendarDate(parseNumber(m[1], 0, 9999), parseNumber(m[2], 1, 12), 1);
	date.day = parseNumber(m[3], 1, date.calendar.getDaysInMonth(date));
	return date;
}
/** Parses an ISO 8601 date and time string, with no time zone. */
function parseDateTime(value) {
	let m = value.match(DATE_TIME_RE);
	if (!m) {
		if (ABSOLUTE_RE.test(value)) throw new Error(`Invalid ISO 8601 date time string: ${value}. Use parseAbsolute() instead.`);
		throw new Error("Invalid ISO 8601 date time string: " + value);
	}
	let year = parseNumber(m[1], -9999, 9999);
	let date = new CalendarDateTime(year < 1 ? "BC" : "AD", year < 1 ? -year + 1 : year, parseNumber(m[2], 1, 12), 1, m[4] ? parseNumber(m[4], 0, 23) : 0, m[5] ? parseNumber(m[5], 0, 59) : 0, m[6] ? parseNumber(m[6], 0, 59) : 0, m[7] ? parseNumber(m[7], 0, Infinity) * 1e3 : 0);
	date.day = parseNumber(m[3], 0, date.calendar.getDaysInMonth(date));
	return date;
}
/**
* Parses an ISO 8601 date and time string with a time zone extension and optional UTC offset (e.g.
* "2021-11-07T00:45[America/Los_Angeles]" or "2021-11-07T00:45-07:00[America/Los_Angeles]").
* Ambiguous times due to daylight saving time transitions are resolved according to the
* `disambiguation` parameter.
*/
function parseZonedDateTime(value, disambiguation) {
	let m = value.match(ZONED_DATE_TIME_RE);
	if (!m) throw new Error("Invalid ISO 8601 date time string: " + value);
	let year = parseNumber(m[1], -9999, 9999);
	let date = new ZonedDateTime(year < 1 ? "BC" : "AD", year < 1 ? -year + 1 : year, parseNumber(m[2], 1, 12), 1, m[11], 0, m[4] ? parseNumber(m[4], 0, 23) : 0, m[5] ? parseNumber(m[5], 0, 59) : 0, m[6] ? parseNumber(m[6], 0, 59) : 0, m[7] ? parseNumber(m[7], 0, Infinity) * 1e3 : 0);
	date.day = parseNumber(m[3], 0, date.calendar.getDaysInMonth(date));
	let plainDateTime = toCalendarDateTime(date);
	let ms;
	if (m[8]) {
		let hourOffset = parseNumber(m[8], -23, 23);
		date.offset = Math.sign(hourOffset) * (Math.abs(hourOffset) * 60 * 60 * 1e3 + parseNumber(m[9] ?? "0", 0, 59) * 60 * 1e3 + parseNumber(m[10] ?? "0", 0, 59) * 1e3);
		ms = epochFromDate(date) - date.offset;
		if (!possibleAbsolutes(plainDateTime, date.timeZone).includes(ms)) throw new Error(`Offset ${offsetToString(date.offset)} is invalid for ${dateTimeToString(date)} in ${date.timeZone}`);
	} else ms = toAbsolute(toCalendarDateTime(plainDateTime), date.timeZone, disambiguation);
	return fromAbsolute(ms, date.timeZone);
}
/**
* Parses an ISO 8601 date and time string with a UTC offset (e.g. "2021-11-07T07:45:00Z"
* or "2021-11-07T07:45:00-07:00"). The result is converted to the provided time zone.
*/
function parseAbsolute(value, timeZone) {
	let m = value.match(ABSOLUTE_RE);
	if (!m) throw new Error("Invalid ISO 8601 date time string: " + value);
	let year = parseNumber(m[1], -9999, 9999);
	let date = new ZonedDateTime(year < 1 ? "BC" : "AD", year < 1 ? -year + 1 : year, parseNumber(m[2], 1, 12), 1, timeZone, 0, m[4] ? parseNumber(m[4], 0, 23) : 0, m[5] ? parseNumber(m[5], 0, 59) : 0, m[6] ? parseNumber(m[6], 0, 59) : 0, m[7] ? parseNumber(m[7], 0, Infinity) * 1e3 : 0);
	date.day = parseNumber(m[3], 0, date.calendar.getDaysInMonth(date));
	if (m[8]) date.offset = parseNumber(m[8], -23, 23) * 60 * 60 * 1e3 + parseNumber(m[9] ?? "0", 0, 59) * 60 * 1e3;
	return toTimeZone(date, timeZone);
}
/**
* Parses an ISO 8601 date and time string with a UTC offset (e.g. "2021-11-07T07:45:00Z"
* or "2021-11-07T07:45:00-07:00"). The result is converted to the user's local time zone.
*/
function parseAbsoluteToLocal(value) {
	return parseAbsolute(value, getLocalTimeZone());
}
function parseNumber(value, min, max) {
	let val = Number(value);
	if (val < min || val > max) throw new RangeError(`Value out of range: ${min} <= ${val} <= ${max}`);
	return val;
}
function timeToString(time) {
	return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}:${String(time.second).padStart(2, "0")}${time.millisecond ? String(time.millisecond / 1e3).slice(1) : ""}`;
}
function dateToString(date) {
	let gregorianDate = toCalendar(date, new GregorianCalendar());
	let year;
	if (gregorianDate.era === "BC") year = gregorianDate.year === 1 ? "0000" : "-" + String(Math.abs(1 - gregorianDate.year)).padStart(6, "00");
	else year = String(gregorianDate.year).padStart(4, "0");
	return `${year}-${String(gregorianDate.month).padStart(2, "0")}-${String(gregorianDate.day).padStart(2, "0")}`;
}
function dateTimeToString(date) {
	return `${dateToString(date)}T${timeToString(date)}`;
}
function offsetToString(offset) {
	let sign = Math.sign(offset) < 0 ? "-" : "+";
	offset = Math.abs(offset);
	let offsetHours = Math.floor(offset / 36e5);
	let offsetMinutes = Math.floor(offset % 36e5 / 6e4);
	let offsetSeconds = Math.floor(offset % 36e5 % 6e4 / 1e3);
	let stringOffset = `${sign}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;
	if (offsetSeconds !== 0) stringOffset += `:${String(offsetSeconds).padStart(2, "0")}`;
	return stringOffset;
}
function zonedDateTimeToString(date) {
	return `${dateTimeToString(date)}${offsetToString(date.offset)}[${date.timeZone}]`;
}
/**
* Parses an ISO 8601 duration string (e.g. "P3Y6M6W4DT12H30M5S").
*
* @param value An ISO 8601 duration string.
* @returns A DateTimeDuration object.
*/
function parseDuration(value) {
	const match = value.match(DATE_TIME_DURATION_RE);
	if (!match) throw new Error(`Invalid ISO 8601 Duration string: ${value}`);
	const parseDurationGroup = (group, isNegative) => {
		if (!group) return 0;
		try {
			return (isNegative ? -1 : 1) * Number(group.replace(",", "."));
		} catch {
			throw new Error(`Invalid ISO 8601 Duration string: ${value}`);
		}
	};
	const isNegative = !!match.groups?.negative;
	if (!requiredDurationGroups.some((group) => match.groups?.[group])) throw new Error(`Invalid ISO 8601 Duration string: ${value}`);
	if (match.groups?.time) {
		if (!requiredDurationTimeGroups.some((group) => match.groups?.[group])) throw new Error(`Invalid ISO 8601 Duration string: ${value}`);
	}
	const duration = {
		years: parseDurationGroup(match.groups?.years, isNegative),
		months: parseDurationGroup(match.groups?.months, isNegative),
		weeks: parseDurationGroup(match.groups?.weeks, isNegative),
		days: parseDurationGroup(match.groups?.days, isNegative),
		hours: parseDurationGroup(match.groups?.hours, isNegative),
		minutes: parseDurationGroup(match.groups?.minutes, isNegative),
		seconds: parseDurationGroup(match.groups?.seconds, isNegative)
	};
	if (duration.hours !== void 0 && duration.hours % 1 !== 0 && (duration.minutes || duration.seconds)) throw new Error(`Invalid ISO 8601 Duration string: ${value} - only the smallest unit can be fractional`);
	if (duration.minutes !== void 0 && duration.minutes % 1 !== 0 && duration.seconds) throw new Error(`Invalid ISO 8601 Duration string: ${value} - only the smallest unit can be fractional`);
	return duration;
}
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/CalendarDate.ts
function shiftArgs(args) {
	let calendar = typeof args[0] === "object" ? args.shift() : new GregorianCalendar();
	let era;
	if (typeof args[0] === "string") era = args.shift();
	else {
		let eras = calendar.getEras();
		era = eras[eras.length - 1];
	}
	let year = args.shift();
	let month = args.shift();
	let day = args.shift();
	return [
		calendar,
		era,
		year,
		month,
		day
	];
}
/** A CalendarDate represents a date without any time components in a specific calendar system. */
var CalendarDate = class CalendarDate {
	#type;
	/** The calendar system associated with this date, e.g. Gregorian. */
	calendar;
	/** The calendar era for this date, e.g. "BC" or "AD". */
	era;
	/** The year of this date within the era. */
	year;
	/**
	* The month number within the year. Note that some calendar systems such as Hebrew
	* may have a variable number of months per year. Therefore, month numbers may not
	* always correspond to the same month names in different years.
	*/
	month;
	/** The day number within the month. */
	day;
	constructor(...args) {
		let [calendar, era, year, month, day] = shiftArgs(args);
		this.calendar = calendar;
		this.era = era;
		this.year = year;
		this.month = month;
		this.day = day;
		constrain(this);
	}
	/** Returns a copy of this date. */
	copy() {
		if (this.era) return new CalendarDate(this.calendar, this.era, this.year, this.month, this.day);
		else return new CalendarDate(this.calendar, this.year, this.month, this.day);
	}
	/** Returns a new `CalendarDate` with the given duration added to it. */
	add(duration) {
		return add(this, duration);
	}
	/** Returns a new `CalendarDate` with the given duration subtracted from it. */
	subtract(duration) {
		return subtract(this, duration);
	}
	/**
	* Returns a new `CalendarDate` with the given fields set to the provided values. Other fields
	* will be constrained accordingly.
	*/
	set(fields) {
		return set(this, fields);
	}
	/**
	* Returns a new `CalendarDate` with the given field adjusted by a specified amount.
	* When the resulting value reaches the limits of the field, it wraps around.
	*/
	cycle(field, amount, options) {
		return cycleDate(this, field, amount, options);
	}
	/**
	* Converts the date to a native JavaScript Date object, with the time set to midnight in the
	* given time zone.
	*/
	toDate(timeZone) {
		return toDate(this, timeZone);
	}
	/** Converts the date to an ISO 8601 formatted string. */
	toString() {
		return dateToString(this);
	}
	/**
	* Compares this date with another. A negative result indicates that this date is before the given
	* one, and a positive date indicates that it is after.
	*/
	compare(b) {
		return compareDate(this, b);
	}
};
/** A Time represents a clock time without any date components. */
var Time = class Time {
	#type;
	/** The hour, numbered from 0 to 23. */
	hour;
	/** The minute in the hour. */
	minute;
	/** The second in the minute. */
	second;
	/** The millisecond in the second. */
	millisecond;
	constructor(hour = 0, minute = 0, second = 0, millisecond = 0) {
		this.hour = hour;
		this.minute = minute;
		this.second = second;
		this.millisecond = millisecond;
		constrainTime(this);
	}
	/** Returns a copy of this time. */
	copy() {
		return new Time(this.hour, this.minute, this.second, this.millisecond);
	}
	/** Returns a new `Time` with the given duration added to it. */
	add(duration) {
		return addTime(this, duration);
	}
	/** Returns a new `Time` with the given duration subtracted from it. */
	subtract(duration) {
		return subtractTime(this, duration);
	}
	/**
	* Returns a new `Time` with the given fields set to the provided values. Other fields will be
	* constrained accordingly.
	*/
	set(fields) {
		return setTime(this, fields);
	}
	/**
	* Returns a new `Time` with the given field adjusted by a specified amount.
	* When the resulting value reaches the limits of the field, it wraps around.
	*/
	cycle(field, amount, options) {
		return cycleTime(this, field, amount, options);
	}
	/** Converts the time to an ISO 8601 formatted string. */
	toString() {
		return timeToString(this);
	}
	/**
	* Compares this time with another. A negative result indicates that this time is before the given
	* one, and a positive time indicates that it is after.
	*/
	compare(b) {
		return compareTime(this, b);
	}
};
/** A CalendarDateTime represents a date and time without a time zone, in a specific calendar system. */
var CalendarDateTime = class CalendarDateTime {
	#type;
	/** The calendar system associated with this date, e.g. Gregorian. */
	calendar;
	/** The calendar era for this date, e.g. "BC" or "AD". */
	era;
	/** The year of this date within the era. */
	year;
	/**
	* The month number within the year. Note that some calendar systems such as Hebrew
	* may have a variable number of months per year. Therefore, month numbers may not
	* always correspond to the same month names in different years.
	*/
	month;
	/** The day number within the month. */
	day;
	/** The hour in the day, numbered from 0 to 23. */
	hour;
	/** The minute in the hour. */
	minute;
	/** The second in the minute. */
	second;
	/** The millisecond in the second. */
	millisecond;
	constructor(...args) {
		let [calendar, era, year, month, day] = shiftArgs(args);
		this.calendar = calendar;
		this.era = era;
		this.year = year;
		this.month = month;
		this.day = day;
		this.hour = args.shift() || 0;
		this.minute = args.shift() || 0;
		this.second = args.shift() || 0;
		this.millisecond = args.shift() || 0;
		constrain(this);
	}
	/** Returns a copy of this date. */
	copy() {
		if (this.era) return new CalendarDateTime(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
		else return new CalendarDateTime(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
	}
	/** Returns a new `CalendarDateTime` with the given duration added to it. */
	add(duration) {
		return add(this, duration);
	}
	/** Returns a new `CalendarDateTime` with the given duration subtracted from it. */
	subtract(duration) {
		return subtract(this, duration);
	}
	/**
	* Returns a new `CalendarDateTime` with the given fields set to the provided values. Other fields
	* will be constrained accordingly.
	*/
	set(fields) {
		return set(setTime(this, fields), fields);
	}
	/**
	* Returns a new `CalendarDateTime` with the given field adjusted by a specified amount.
	* When the resulting value reaches the limits of the field, it wraps around.
	*/
	cycle(field, amount, options) {
		switch (field) {
			case "era":
			case "year":
			case "month":
			case "day": return cycleDate(this, field, amount, options);
			default: return cycleTime(this, field, amount, options);
		}
	}
	/** Converts the date to a native JavaScript Date object in the given time zone. */
	toDate(timeZone, disambiguation) {
		return toDate(this, timeZone, disambiguation);
	}
	/** Converts the date to an ISO 8601 formatted string. */
	toString() {
		return dateTimeToString(this);
	}
	/**
	* Compares this date with another. A negative result indicates that this date is before the given
	* one, and a positive date indicates that it is after.
	*/
	compare(b) {
		let res = compareDate(this, b);
		if (res === 0) return compareTime(this, toCalendarDateTime(b));
		return res;
	}
};
/** A ZonedDateTime represents a date and time in a specific time zone and calendar system. */
var ZonedDateTime = class ZonedDateTime {
	#type;
	/** The calendar system associated with this date, e.g. Gregorian. */
	calendar;
	/** The calendar era for this date, e.g. "BC" or "AD". */
	era;
	/** The year of this date within the era. */
	year;
	/**
	* The month number within the year. Note that some calendar systems such as Hebrew
	* may have a variable number of months per year. Therefore, month numbers may not
	* always correspond to the same month names in different years.
	*/
	month;
	/** The day number within the month. */
	day;
	/** The hour in the day, numbered from 0 to 23. */
	hour;
	/** The minute in the hour. */
	minute;
	/** The second in the minute. */
	second;
	/** The millisecond in the second. */
	millisecond;
	/** The IANA time zone identifier that this date and time is represented in. */
	timeZone;
	/** The UTC offset for this time, in milliseconds. */
	offset;
	constructor(...args) {
		let [calendar, era, year, month, day] = shiftArgs(args);
		let timeZone = args.shift();
		let offset = args.shift();
		this.calendar = calendar;
		this.era = era;
		this.year = year;
		this.month = month;
		this.day = day;
		this.timeZone = timeZone;
		this.offset = offset;
		this.hour = args.shift() || 0;
		this.minute = args.shift() || 0;
		this.second = args.shift() || 0;
		this.millisecond = args.shift() || 0;
		constrain(this);
	}
	/** Returns a copy of this date. */
	copy() {
		if (this.era) return new ZonedDateTime(this.calendar, this.era, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
		else return new ZonedDateTime(this.calendar, this.year, this.month, this.day, this.timeZone, this.offset, this.hour, this.minute, this.second, this.millisecond);
	}
	/** Returns a new `ZonedDateTime` with the given duration added to it. */
	add(duration) {
		return addZoned(this, duration);
	}
	/** Returns a new `ZonedDateTime` with the given duration subtracted from it. */
	subtract(duration) {
		return subtractZoned(this, duration);
	}
	/**
	* Returns a new `ZonedDateTime` with the given fields set to the provided values. Other fields
	* will be constrained accordingly.
	*/
	set(fields, disambiguation) {
		return setZoned(this, fields, disambiguation);
	}
	/**
	* Returns a new `ZonedDateTime` with the given field adjusted by a specified amount.
	* When the resulting value reaches the limits of the field, it wraps around.
	*/
	cycle(field, amount, options) {
		return cycleZoned(this, field, amount, options);
	}
	/** Converts the date to a native JavaScript Date object. */
	toDate() {
		return zonedToDate(this);
	}
	/**
	* Converts the date to an ISO 8601 formatted string, including the UTC offset and time zone
	* identifier.
	*/
	toString() {
		return zonedDateTimeToString(this);
	}
	/** Converts the date to an ISO 8601 formatted string in UTC. */
	toAbsoluteString() {
		return this.toDate().toISOString();
	}
	/**
	* Compares this date with another. A negative result indicates that this date is before the given
	* one, and a positive date indicates that it is after.
	*/
	compare(b) {
		return this.toDate().getTime() - toZoned(b, this.timeZone).toDate().getTime();
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/calendars/JapaneseCalendar.ts
var ERA_START_DATES = [
	[
		1868,
		9,
		8
	],
	[
		1912,
		7,
		30
	],
	[
		1926,
		12,
		25
	],
	[
		1989,
		1,
		8
	],
	[
		2019,
		5,
		1
	]
];
var ERA_END_DATES = [
	[
		1912,
		7,
		29
	],
	[
		1926,
		12,
		24
	],
	[
		1989,
		1,
		7
	],
	[
		2019,
		4,
		30
	]
];
var ERA_ADDENDS = [
	1867,
	1911,
	1925,
	1988,
	2018
];
var ERA_NAMES = [
	"meiji",
	"taisho",
	"showa",
	"heisei",
	"reiwa"
];
function findEraFromGregorianDate(date) {
	const idx = ERA_START_DATES.findIndex(([year, month, day]) => {
		if (date.year < year) return true;
		if (date.year === year && date.month < month) return true;
		if (date.year === year && date.month === month && date.day < day) return true;
		return false;
	});
	if (idx === -1) return ERA_START_DATES.length - 1;
	if (idx === 0) return 0;
	return idx - 1;
}
function toGregorian$2(date) {
	let eraAddend = ERA_ADDENDS[ERA_NAMES.indexOf(date.era)];
	if (!eraAddend) throw new Error("Unknown era: " + date.era);
	return new CalendarDate(date.year + eraAddend, date.month, date.day);
}
/**
* The Japanese calendar is based on the Gregorian calendar, but with eras for the reign of each
* Japanese emperor. Whenever a new emperor ascends to the throne, a new era begins and the year
* starts again from 1. Note that eras before 1868 (Gregorian) are not currently supported by this
* implementation.
*/
var JapaneseCalendar = class extends GregorianCalendar {
	identifier = "japanese";
	fromJulianDay(jd) {
		let date = super.fromJulianDay(jd);
		let era = findEraFromGregorianDate(date);
		return new CalendarDate(this, ERA_NAMES[era], date.year - ERA_ADDENDS[era], date.month, date.day);
	}
	toJulianDay(date) {
		return super.toJulianDay(toGregorian$2(date));
	}
	balanceDate(date) {
		let gregorianDate = toGregorian$2(date);
		let era = findEraFromGregorianDate(gregorianDate);
		if (ERA_NAMES[era] !== date.era) {
			date.era = ERA_NAMES[era];
			date.year = gregorianDate.year - ERA_ADDENDS[era];
		}
		this.constrainDate(date);
	}
	constrainDate(date) {
		let idx = ERA_NAMES.indexOf(date.era);
		let end = ERA_END_DATES[idx];
		if (end != null) {
			let [endYear, endMonth, endDay] = end;
			let maxYear = endYear - ERA_ADDENDS[idx];
			date.year = Math.max(1, Math.min(maxYear, date.year));
			if (date.year === maxYear) {
				date.month = Math.min(endMonth, date.month);
				if (date.month === endMonth) date.day = Math.min(endDay, date.day);
			}
		}
		if (date.year === 1 && idx >= 0) {
			let [, startMonth, startDay] = ERA_START_DATES[idx];
			date.month = Math.max(startMonth, date.month);
			if (date.month === startMonth) date.day = Math.max(startDay, date.day);
		}
	}
	getEras() {
		return ERA_NAMES;
	}
	getYearsInEra(date) {
		let era = ERA_NAMES.indexOf(date.era);
		let cur = ERA_START_DATES[era];
		let next = ERA_START_DATES[era + 1];
		if (next == null) return 9999 - cur[0] + 1;
		let years = next[0] - cur[0];
		if (date.month < next[1] || date.month === next[1] && date.day < next[2]) years++;
		return years;
	}
	getDaysInMonth(date) {
		return super.getDaysInMonth(toGregorian$2(date));
	}
	getMinimumMonthInYear(date) {
		let start = getMinimums(date);
		return start ? start[1] : 1;
	}
	getMinimumDayInMonth(date) {
		let start = getMinimums(date);
		return start && date.month === start[1] ? start[2] : 1;
	}
};
function getMinimums(date) {
	if (date.year === 1) return ERA_START_DATES[ERA_NAMES.indexOf(date.era)];
}
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/calendars/BuddhistCalendar.ts
var BUDDHIST_ERA_START = -543;
/**
* The Buddhist calendar is the same as the Gregorian calendar, but counts years
* starting from the birth of Buddha in 543 BC (Gregorian). It supports only one
* era, identified as 'BE'.
*/
var BuddhistCalendar = class extends GregorianCalendar {
	identifier = "buddhist";
	fromJulianDay(jd) {
		let gregorianDate = super.fromJulianDay(jd);
		let year = getExtendedYear(gregorianDate.era, gregorianDate.year);
		return new CalendarDate(this, year - BUDDHIST_ERA_START, gregorianDate.month, gregorianDate.day);
	}
	toJulianDay(date) {
		return super.toJulianDay(toGregorian$1(date));
	}
	getEras() {
		return ["BE"];
	}
	getDaysInMonth(date) {
		return super.getDaysInMonth(toGregorian$1(date));
	}
	balanceDate() {}
};
function toGregorian$1(date) {
	let [era, year] = fromExtendedYear(date.year + BUDDHIST_ERA_START);
	return new CalendarDate(era, year, date.month, date.day);
}
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/calendars/TaiwanCalendar.ts
var TAIWAN_ERA_START = 1911;
function gregorianYear(date) {
	return date.era === "minguo" ? date.year + TAIWAN_ERA_START : 1 - date.year + TAIWAN_ERA_START;
}
function gregorianToTaiwan(year) {
	let y = year - TAIWAN_ERA_START;
	if (y > 0) return ["minguo", y];
	else return ["before_minguo", 1 - y];
}
/**
* The Taiwanese calendar is the same as the Gregorian calendar, but years
* are numbered starting from 1912 (Gregorian). Two eras are supported:
* 'before_minguo' and 'minguo'.
*/
var TaiwanCalendar = class extends GregorianCalendar {
	identifier = "roc";
	fromJulianDay(jd) {
		let date = super.fromJulianDay(jd);
		let [era, year] = gregorianToTaiwan(getExtendedYear(date.era, date.year));
		return new CalendarDate(this, era, year, date.month, date.day);
	}
	toJulianDay(date) {
		return super.toJulianDay(toGregorian(date));
	}
	getEras() {
		return ["before_minguo", "minguo"];
	}
	balanceDate(date) {
		let [era, year] = gregorianToTaiwan(gregorianYear(date));
		date.era = era;
		date.year = year;
	}
	isInverseEra(date) {
		return date.era === "before_minguo";
	}
	getDaysInMonth(date) {
		return super.getDaysInMonth(toGregorian(date));
	}
	getYearsInEra(date) {
		return date.era === "before_minguo" ? 9999 : 8088;
	}
};
function toGregorian(date) {
	let [era, year] = fromExtendedYear(gregorianYear(date));
	return new CalendarDate(era, year, date.month, date.day);
}
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/calendars/PersianCalendar.ts
var PERSIAN_EPOCH = 1948320;
var MONTH_START = [
	0,
	31,
	62,
	93,
	124,
	155,
	186,
	216,
	246,
	276,
	306,
	336
];
/**
* The Persian calendar is the main calendar used in Iran and Afghanistan. It has 12 months
* in each year, the first 6 of which have 31 days, and the next 5 have 30 days. The 12th month
* has either 29 or 30 days depending on whether it is a leap year. The Persian year starts
* around the March equinox.
*/
var PersianCalendar = class {
	identifier = "persian";
	fromJulianDay(jd) {
		let daysSinceEpoch = jd - PERSIAN_EPOCH;
		let year = 1 + Math.floor((33 * daysSinceEpoch + 3) / 12053);
		let dayOfYear = daysSinceEpoch - (365 * (year - 1) + Math.floor((8 * year + 21) / 33));
		let month = dayOfYear < 216 ? Math.floor(dayOfYear / 31) : Math.floor((dayOfYear - 6) / 30);
		let day = dayOfYear - MONTH_START[month] + 1;
		return new CalendarDate(this, year, month + 1, day);
	}
	toJulianDay(date) {
		let jd = 1948319 + 365 * (date.year - 1) + Math.floor((8 * date.year + 21) / 33);
		jd += MONTH_START[date.month - 1];
		jd += date.day;
		return jd;
	}
	getMonthsInYear() {
		return 12;
	}
	getDaysInMonth(date) {
		if (date.month <= 6) return 31;
		if (date.month <= 11) return 30;
		return mod(25 * date.year + 11, 33) < 8 ? 30 : 29;
	}
	getMaximumMonthsInYear() {
		return 12;
	}
	getMaximumDaysInMonth() {
		return 31;
	}
	getEras() {
		return ["AP"];
	}
	getYearsInEra() {
		return 9377;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/calendars/IndianCalendar.ts
var INDIAN_ERA_START = 78;
var INDIAN_YEAR_START = 80;
/**
* The Indian National Calendar is similar to the Gregorian calendar, but with
* years numbered since the Saka era in 78 AD (Gregorian). There are 12 months
* in each year, with either 30 or 31 days. Only one era identifier is supported: 'saka'.
*/
var IndianCalendar = class extends GregorianCalendar {
	identifier = "indian";
	fromJulianDay(jd) {
		let date = super.fromJulianDay(jd);
		let indianYear = date.year - INDIAN_ERA_START;
		let yDay = jd - gregorianToJulianDay(date.era, date.year, 1, 1);
		let leapMonth;
		if (yDay < INDIAN_YEAR_START) {
			indianYear--;
			leapMonth = isLeapYear$2(date.year - 1) ? 31 : 30;
			yDay += leapMonth + 155 + 90 + 10;
		} else {
			leapMonth = isLeapYear$2(date.year) ? 31 : 30;
			yDay -= INDIAN_YEAR_START;
		}
		let indianMonth;
		let indianDay;
		if (yDay < leapMonth) {
			indianMonth = 1;
			indianDay = yDay + 1;
		} else {
			let mDay = yDay - leapMonth;
			if (mDay < 155) {
				indianMonth = Math.floor(mDay / 31) + 2;
				indianDay = mDay % 31 + 1;
			} else {
				mDay -= 155;
				indianMonth = Math.floor(mDay / 30) + 7;
				indianDay = mDay % 30 + 1;
			}
		}
		return new CalendarDate(this, indianYear, indianMonth, indianDay);
	}
	toJulianDay(date) {
		let [era, year] = fromExtendedYear(date.year + INDIAN_ERA_START);
		let leapMonth;
		let jd;
		if (isLeapYear$2(year)) {
			leapMonth = 31;
			jd = gregorianToJulianDay(era, year, 3, 21);
		} else {
			leapMonth = 30;
			jd = gregorianToJulianDay(era, year, 3, 22);
		}
		if (date.month === 1) return jd + date.day - 1;
		jd += leapMonth + Math.min(date.month - 2, 5) * 31;
		if (date.month >= 8) jd += (date.month - 7) * 30;
		jd += date.day - 1;
		return jd;
	}
	getDaysInMonth(date) {
		if (date.month === 1 && isLeapYear$2(date.year + INDIAN_ERA_START)) return 31;
		if (date.month >= 2 && date.month <= 6) return 31;
		return 30;
	}
	getYearsInEra() {
		return 9919;
	}
	getEras() {
		return ["saka"];
	}
	balanceDate() {}
};
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/calendars/IslamicCalendar.ts
var CIVIL_EPOC = 1948440;
var ASTRONOMICAL_EPOC = 1948439;
var UMALQURA_YEAR_START = 1300;
var UMALQURA_YEAR_END = 1600;
var UMALQURA_START_DAYS = 460322;
function islamicToJulianDay(epoch, year, month, day) {
	return day + Math.ceil(29.5 * (month - 1)) + (year - 1) * 354 + Math.floor((3 + 11 * year) / 30) + epoch - 1;
}
function julianDayToIslamic(calendar, epoch, jd) {
	let year = Math.floor((30 * (jd - epoch) + 10646) / 10631);
	let month = Math.min(12, Math.ceil((jd - (29 + islamicToJulianDay(epoch, year, 1, 1))) / 29.5) + 1);
	return new CalendarDate(calendar, year, month, jd - islamicToJulianDay(epoch, year, month, 1) + 1);
}
function isLeapYear$1(year) {
	return (14 + 11 * year) % 30 < 11;
}
/**
* The Islamic calendar, also known as the "Hijri" calendar, is used throughout much of the Arab
* world. The civil variant uses simple arithmetic rules rather than astronomical calculations to
* approximate the traditional calendar, which is based on sighting of the crescent moon. It uses
* Friday, July 16 622 CE (Julian) as the epoch. Each year has 12 months, with either 354 or 355
* days depending on whether it is a leap year. Learn more about the available Islamic calendars
* [here](https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types).
*/
var IslamicCivilCalendar = class {
	identifier = "islamic-civil";
	fromJulianDay(jd) {
		return julianDayToIslamic(this, CIVIL_EPOC, jd);
	}
	toJulianDay(date) {
		return islamicToJulianDay(CIVIL_EPOC, date.year, date.month, date.day);
	}
	getDaysInMonth(date) {
		let length = 29 + date.month % 2;
		if (date.month === 12 && isLeapYear$1(date.year)) length++;
		return length;
	}
	getMonthsInYear() {
		return 12;
	}
	getDaysInYear(date) {
		return isLeapYear$1(date.year) ? 355 : 354;
	}
	getMaximumMonthsInYear() {
		return 12;
	}
	getMaximumDaysInMonth() {
		return 30;
	}
	getYearsInEra() {
		return 9665;
	}
	getEras() {
		return ["AH"];
	}
};
/**
* The Islamic calendar, also known as the "Hijri" calendar, is used throughout much of the Arab
* world. The tabular variant uses simple arithmetic rules rather than astronomical calculations to
* approximate the traditional calendar, which is based on sighting of the crescent moon. It uses
* Thursday, July 15 622 CE (Julian) as the epoch. Each year has 12 months, with either 354 or 355
* days depending on whether it is a leap year. Learn more about the available Islamic calendars
* [here](https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types).
*/
var IslamicTabularCalendar = class extends IslamicCivilCalendar {
	identifier = "islamic-tbla";
	fromJulianDay(jd) {
		return julianDayToIslamic(this, ASTRONOMICAL_EPOC, jd);
	}
	toJulianDay(date) {
		return islamicToJulianDay(ASTRONOMICAL_EPOC, date.year, date.month, date.day);
	}
};
var UMALQURA_DATA = "qgpUDckO1AbqBmwDrQpVBakGkgepC9QF2gpcBS0NlQZKB1QLagutBa4ETwoXBYsGpQbVCtYCWwmdBE0KJg2VDawFtgm6AlsKKwWVCsoG6Qr0AnYJtgJWCcoKpAvSC9kF3AJtCU0FpQpSC6ULtAW2CVcFlwJLBaMGUgdlC2oFqworBZUMSg2lDcoF1gpXCasESwmlClILagt1BXYCtwhbBFUFqQW0BdoJ3QRuAjYJqgpUDbIN1QXaAlsJqwRVCkkLZAtxC7QFtQpVCiUNkg7JDtQG6QprCasEkwpJDaQNsg25CroEWworBZUKKgtVC1wFvQQ9Ah0JlQpKC1oLbQW2AjsJmwRVBqkGVAdqC2wFrQpVBSkLkgupC9QF2gpaBasKlQVJB2QHqgu1BbYCVgpNDiULUgtqC60FrgIvCZcESwalBqwG1gpdBZ0ETQoWDZUNqgW1BdoCWwmtBJUFygbkBuoK9QS2AlYJqgpUC9IL2QXqAm0JrQSVCkoLpQuyBbUJ1gSXCkcFkwZJB1ULagVrCisFiwpGDaMNygXWCtsEawJLCaUKUgtpC3UFdgG3CFsCKwVlBbQF2gntBG0BtgimClINqQ3UBdoKWwmrBFMGKQdiB6kLsgW1ClUFJQuSDckO0gbpCmsFqwRVCikNVA2qDbUJugQ7CpsETQqqCtUK2gJdCV4ELgqaDFUNsga5BroEXQotBZUKUguoC7QLuQXaAloJSgukDdEO6AZqC20FNQWVBkoNqA3UDdoGWwWdAisGFQtKC5ULqgWuCi4JjwwnBZUGqgbWCl0FnQI=";
var UMALQURA_MONTHLENGTH;
var UMALQURA_YEAR_START_TABLE;
function umalquraYearStart(year) {
	return UMALQURA_START_DAYS + UMALQURA_YEAR_START_TABLE[year - UMALQURA_YEAR_START];
}
function umalquraMonthLength(year, month) {
	let idx = year - UMALQURA_YEAR_START;
	let mask = 1 << 11 - (month - 1);
	if ((UMALQURA_MONTHLENGTH[idx] & mask) === 0) return 29;
	else return 30;
}
function umalquraMonthStart(year, month) {
	let day = umalquraYearStart(year);
	for (let i = 1; i < month; i++) day += umalquraMonthLength(year, i);
	return day;
}
function umalquraYearLength(year) {
	return UMALQURA_YEAR_START_TABLE[year + 1 - UMALQURA_YEAR_START] - UMALQURA_YEAR_START_TABLE[year - UMALQURA_YEAR_START];
}
/**
* The Islamic calendar, also known as the "Hijri" calendar, is used throughout much of the Arab
* world. The Umalqura variant is primarily used in Saudi Arabia. It is a lunar calendar, based on
* astronomical calculations that predict the sighting of a crescent moon. Month and year lengths
* vary between years depending on these calculations. Learn more about the available Islamic
* calendars
* [here](https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types).
*/
var IslamicUmalquraCalendar = class extends IslamicCivilCalendar {
	identifier = "islamic-umalqura";
	constructor() {
		super();
		if (!UMALQURA_MONTHLENGTH) UMALQURA_MONTHLENGTH = new Uint16Array(Uint8Array.from(atob(UMALQURA_DATA), (c) => c.charCodeAt(0)).buffer);
		if (!UMALQURA_YEAR_START_TABLE) {
			UMALQURA_YEAR_START_TABLE = /* @__PURE__ */ new Uint32Array(301);
			let yearStart = 0;
			for (let year = UMALQURA_YEAR_START; year <= UMALQURA_YEAR_END; year++) {
				UMALQURA_YEAR_START_TABLE[year - UMALQURA_YEAR_START] = yearStart;
				for (let i = 1; i <= 12; i++) yearStart += umalquraMonthLength(year, i);
			}
		}
	}
	fromJulianDay(jd) {
		let days = jd - CIVIL_EPOC;
		let startDays = umalquraYearStart(UMALQURA_YEAR_START);
		let endDays = umalquraYearStart(UMALQURA_YEAR_END);
		if (days < startDays || days > endDays) return super.fromJulianDay(jd);
		else {
			let y = 1299;
			let m = 1;
			let d = 1;
			while (d > 0) {
				y++;
				d = days - umalquraYearStart(y) + 1;
				let yearLength = umalquraYearLength(y);
				if (d === yearLength) {
					m = 12;
					break;
				} else if (d < yearLength) {
					let monthLength = umalquraMonthLength(y, m);
					m = 1;
					while (d > monthLength) {
						d -= monthLength;
						m++;
						monthLength = umalquraMonthLength(y, m);
					}
					break;
				}
			}
			return new CalendarDate(this, y, m, days - umalquraMonthStart(y, m) + 1);
		}
	}
	toJulianDay(date) {
		if (date.year < UMALQURA_YEAR_START || date.year > UMALQURA_YEAR_END) return super.toJulianDay(date);
		return CIVIL_EPOC + umalquraMonthStart(date.year, date.month) + (date.day - 1);
	}
	getDaysInMonth(date) {
		if (date.year < UMALQURA_YEAR_START || date.year > UMALQURA_YEAR_END) return super.getDaysInMonth(date);
		return umalquraMonthLength(date.year, date.month);
	}
	getDaysInYear(date) {
		if (date.year < UMALQURA_YEAR_START || date.year > UMALQURA_YEAR_END) return super.getDaysInYear(date);
		return umalquraYearLength(date.year);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/calendars/HebrewCalendar.ts
var HEBREW_EPOCH = 347997;
var DAY_PARTS = 25920;
var MONTH_PARTS = 765433;
function isLeapYear(year) {
	return mod(year * 7 + 1, 19) < 7;
}
function hebrewDelay1(year) {
	let months = Math.floor((235 * year - 234) / 19);
	let parts = 12084 + 13753 * months;
	let day = months * 29 + Math.floor(parts / 25920);
	if (mod(3 * (day + 1), 7) < 3) day += 1;
	return day;
}
function hebrewDelay2(year) {
	let last = hebrewDelay1(year - 1);
	let present = hebrewDelay1(year);
	if (hebrewDelay1(year + 1) - present === 356) return 2;
	if (present - last === 382) return 1;
	return 0;
}
function startOfYear$1(year) {
	return hebrewDelay1(year) + hebrewDelay2(year);
}
function getDaysInYear(year) {
	return startOfYear$1(year + 1) - startOfYear$1(year);
}
function getYearType(year) {
	let yearLength = getDaysInYear(year);
	if (yearLength > 380) yearLength -= 30;
	switch (yearLength) {
		case 353: return 0;
		case 354: return 1;
		case 355: return 2;
	}
}
function getDaysInMonth$1(year, month) {
	if (month >= 6 && !isLeapYear(year)) month++;
	if (month === 4 || month === 7 || month === 9 || month === 11 || month === 13) return 29;
	let yearType = getYearType(year);
	if (month === 2) return yearType === 2 ? 30 : 29;
	if (month === 3) return yearType === 0 ? 29 : 30;
	if (month === 6) return isLeapYear(year) ? 30 : 0;
	return 30;
}
/**
* The Hebrew calendar is used in Israel and around the world by the Jewish faith.
* Years include either 12 or 13 months depending on whether it is a leap year.
* In leap years, an extra month is inserted at month 6.
*/
var HebrewCalendar = class {
	identifier = "hebrew";
	fromJulianDay(jd) {
		let d = jd - HEBREW_EPOCH;
		let m = d * DAY_PARTS / MONTH_PARTS;
		let year = Math.floor((19 * m + 234) / 235) + 1;
		let ys = startOfYear$1(year);
		let dayOfYear = Math.floor(d - ys);
		while (dayOfYear < 1) {
			year--;
			ys = startOfYear$1(year);
			dayOfYear = Math.floor(d - ys);
		}
		let month = 1;
		let monthStart = 0;
		while (monthStart < dayOfYear) {
			monthStart += getDaysInMonth$1(year, month);
			month++;
		}
		month--;
		monthStart -= getDaysInMonth$1(year, month);
		let day = dayOfYear - monthStart;
		return new CalendarDate(this, year, month, day);
	}
	toJulianDay(date) {
		let jd = startOfYear$1(date.year);
		for (let month = 1; month < date.month; month++) jd += getDaysInMonth$1(date.year, month);
		return jd + date.day + HEBREW_EPOCH;
	}
	getDaysInMonth(date) {
		return getDaysInMonth$1(date.year, date.month);
	}
	getMonthsInYear(date) {
		return isLeapYear(date.year) ? 13 : 12;
	}
	getDaysInYear(date) {
		return getDaysInYear(date.year);
	}
	getMaximumMonthsInYear() {
		return 13;
	}
	getMaximumDaysInMonth() {
		return 30;
	}
	getYearsInEra() {
		return 9999;
	}
	getEras() {
		return ["AM"];
	}
	balanceYearMonth(date, previousDate) {
		if (previousDate.year !== date.year) {
			if (isLeapYear(previousDate.year) && !isLeapYear(date.year) && previousDate.month > 6) date.month--;
			else if (!isLeapYear(previousDate.year) && isLeapYear(date.year) && previousDate.month > 6) date.month++;
		}
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/calendars/EthiopicCalendar.ts
var ETHIOPIC_EPOCH = 1723856;
var COPTIC_EPOCH = 1824665;
var AMETE_MIHRET_DELTA = 5500;
function ceToJulianDay(epoch, year, month, day) {
	return epoch + 365 * year + Math.floor(year / 4) + 30 * (month - 1) + day - 1;
}
function julianDayToCE(epoch, jd) {
	let year = Math.floor(4 * (jd - epoch) / 1461);
	if (jd >= ceToJulianDay(epoch, year + 1, 1, 1)) year++;
	let month = 1 + Math.floor((jd - ceToJulianDay(epoch, year, 1, 1)) / 30);
	let day = jd + 1 - ceToJulianDay(epoch, year, month, 1);
	return [
		year,
		month,
		day
	];
}
function getLeapDay(year) {
	return Math.floor(year % 4 / 3);
}
function getDaysInMonth(year, month) {
	if (month % 13 !== 0) return 30;
	else return getLeapDay(year) + 5;
}
/**
* The Ethiopic calendar system is the official calendar used in Ethiopia.
* It includes 12 months of 30 days each, plus 5 or 6 intercalary days depending
* on whether it is a leap year. Two eras are supported: 'AA' and 'AM'.
*/
var EthiopicCalendar = class {
	identifier = "ethiopic";
	fromJulianDay(jd) {
		let [year, month, day] = julianDayToCE(ETHIOPIC_EPOCH, jd);
		let era = "AM";
		if (year <= 0) {
			era = "AA";
			year += AMETE_MIHRET_DELTA;
		}
		return new CalendarDate(this, era, year, month, day);
	}
	toJulianDay(date) {
		let year = date.year;
		if (date.era === "AA") year -= AMETE_MIHRET_DELTA;
		return ceToJulianDay(ETHIOPIC_EPOCH, year, date.month, date.day);
	}
	getDaysInMonth(date) {
		return getDaysInMonth(date.year, date.month);
	}
	getMonthsInYear() {
		return 13;
	}
	getDaysInYear(date) {
		return 365 + getLeapDay(date.year);
	}
	getMaximumMonthsInYear() {
		return 13;
	}
	getMaximumDaysInMonth() {
		return 30;
	}
	getYearsInEra(date) {
		return date.era === "AA" ? 9999 : 9991;
	}
	getEras() {
		return ["AA", "AM"];
	}
};
/**
* The Ethiopic (Amete Alem) calendar is the same as the modern Ethiopic calendar,
* except years were measured from a different epoch. Only one era is supported: 'AA'.
*/
var EthiopicAmeteAlemCalendar = class extends EthiopicCalendar {
	identifier = "ethioaa";
	fromJulianDay(jd) {
		let [year, month, day] = julianDayToCE(ETHIOPIC_EPOCH, jd);
		year += AMETE_MIHRET_DELTA;
		return new CalendarDate(this, "AA", year, month, day);
	}
	getEras() {
		return ["AA"];
	}
	getYearsInEra() {
		return 9999;
	}
};
/**
* The Coptic calendar is similar to the Ethiopic calendar.
* It includes 12 months of 30 days each, plus 5 or 6 intercalary days depending
* on whether it is a leap year. Two eras are supported: 'BCE' and 'CE'.
*/
var CopticCalendar = class extends EthiopicCalendar {
	identifier = "coptic";
	fromJulianDay(jd) {
		let [year, month, day] = julianDayToCE(COPTIC_EPOCH, jd);
		let era = "CE";
		if (year <= 0) {
			era = "BCE";
			year = 1 - year;
		}
		return new CalendarDate(this, era, year, month, day);
	}
	toJulianDay(date) {
		let year = date.year;
		if (date.era === "BCE") year = 1 - year;
		return ceToJulianDay(COPTIC_EPOCH, year, date.month, date.day);
	}
	getDaysInMonth(date) {
		let year = date.year;
		if (date.era === "BCE") year = 1 - year;
		return getDaysInMonth(year, date.month);
	}
	isInverseEra(date) {
		return date.era === "BCE";
	}
	balanceDate(date) {
		if (date.year <= 0) {
			date.era = date.era === "BCE" ? "CE" : "BCE";
			date.year = 1 - date.year;
		}
	}
	getEras() {
		return ["BCE", "CE"];
	}
	getYearsInEra(date) {
		return date.era === "BCE" ? 9999 : 9715;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/createCalendar.ts
/** Creates a `Calendar` instance from a Unicode calendar identifier string. */
function createCalendar(name) {
	switch (name) {
		case "buddhist": return new BuddhistCalendar();
		case "ethiopic": return new EthiopicCalendar();
		case "ethioaa": return new EthiopicAmeteAlemCalendar();
		case "coptic": return new CopticCalendar();
		case "hebrew": return new HebrewCalendar();
		case "indian": return new IndianCalendar();
		case "islamic-civil": return new IslamicCivilCalendar();
		case "islamic-tbla": return new IslamicTabularCalendar();
		case "islamic-umalqura": return new IslamicUmalquraCalendar();
		case "japanese": return new JapaneseCalendar();
		case "persian": return new PersianCalendar();
		case "roc": return new TaiwanCalendar();
		default: return new GregorianCalendar();
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@internationalized+date@3.12.4/node_modules/@internationalized/date/src/DateFormatter.ts
var formatterCache = /* @__PURE__ */ new Map();
/** A wrapper around Intl.DateTimeFormat that fixes various browser bugs, and polyfills new features. */
var DateFormatter = class {
	formatter;
	options;
	resolvedHourCycle;
	constructor(locale, options = {}) {
		this.formatter = getCachedDateFormatter(locale, options);
		this.options = options;
	}
	/**
	* Formats a date as a string according to the locale and format options passed to the
	* constructor.
	*/
	format(value) {
		return this.formatter.format(value);
	}
	/** Formats a date to an array of parts such as separators, numbers, punctuation, and more. */
	formatToParts(value) {
		return this.formatter.formatToParts(value);
	}
	/** Formats a date range as a string. */
	formatRange(start, end) {
		if (typeof this.formatter.formatRange === "function") return this.formatter.formatRange(start, end);
		if (end < start) throw new RangeError("End date must be >= start date");
		return `${this.formatter.format(start)} – ${this.formatter.format(end)}`;
	}
	/** Formats a date range as an array of parts. */
	formatRangeToParts(start, end) {
		if (typeof this.formatter.formatRangeToParts === "function") return this.formatter.formatRangeToParts(start, end);
		if (end < start) throw new RangeError("End date must be >= start date");
		let startParts = this.formatter.formatToParts(start);
		let endParts = this.formatter.formatToParts(end);
		return [
			...startParts.map((p) => ({
				...p,
				source: "startRange"
			})),
			{
				type: "literal",
				value: " – ",
				source: "shared"
			},
			...endParts.map((p) => ({
				...p,
				source: "endRange"
			}))
		];
	}
	/** Returns the resolved formatting options based on the values passed to the constructor. */
	resolvedOptions() {
		let resolvedOptions = this.formatter.resolvedOptions();
		if (hasBuggyResolvedHourCycle()) {
			if (!this.resolvedHourCycle) this.resolvedHourCycle = getResolvedHourCycle(resolvedOptions.locale, this.options);
			resolvedOptions.hourCycle = this.resolvedHourCycle;
			resolvedOptions.hour12 = this.resolvedHourCycle === "h11" || this.resolvedHourCycle === "h12";
		}
		if (resolvedOptions.calendar === "ethiopic-amete-alem") resolvedOptions.calendar = "ethioaa";
		return resolvedOptions;
	}
};
var hour12Preferences = {
	true: { ja: "h11" },
	false: {}
};
function getCachedDateFormatter(locale, options = {}) {
	if (typeof options.hour12 === "boolean" && hasBuggyHour12Behavior()) {
		options = { ...options };
		let pref = hour12Preferences[String(options.hour12)][locale.split("-")[0]];
		let defaultHourCycle = options.hour12 ? "h12" : "h23";
		options.hourCycle = pref ?? defaultHourCycle;
		delete options.hour12;
	}
	let cacheKey = locale + (options ? Object.entries(options).sort((a, b) => a[0] < b[0] ? -1 : 1).join() : "");
	if (formatterCache.has(cacheKey)) return formatterCache.get(cacheKey);
	let numberFormatter = new Intl.DateTimeFormat(locale, options);
	formatterCache.set(cacheKey, numberFormatter);
	return numberFormatter;
}
var _hasBuggyHour12Behavior = null;
function hasBuggyHour12Behavior() {
	if (_hasBuggyHour12Behavior == null) _hasBuggyHour12Behavior = new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		hour12: false
	}).format(new Date(2020, 2, 3, 0)) === "24";
	return _hasBuggyHour12Behavior;
}
var _hasBuggyResolvedHourCycle = null;
function hasBuggyResolvedHourCycle() {
	if (_hasBuggyResolvedHourCycle == null) _hasBuggyResolvedHourCycle = new Intl.DateTimeFormat("fr", {
		hour: "numeric",
		hour12: false
	}).resolvedOptions().hourCycle === "h12";
	return _hasBuggyResolvedHourCycle;
}
function getResolvedHourCycle(locale, options) {
	if (!options.timeStyle && !options.hour) return;
	locale = locale.replace(/(-u-)?-nu-[a-zA-Z0-9]+/, "");
	locale += (locale.includes("-u-") ? "" : "-u") + "-nu-latn";
	let formatter = getCachedDateFormatter(locale, {
		...options,
		timeZone: void 0
	});
	let min = parseInt(formatter.formatToParts(new Date(2020, 2, 3, 0)).find((p) => p.type === "hour").value, 10);
	let max = parseInt(formatter.formatToParts(new Date(2020, 2, 3, 23)).find((p) => p.type === "hour").value, 10);
	if (min === 0 && max === 23) return "h23";
	if (min === 24 && max === 23) return "h24";
	if (min === 0 && max === 11) return "h11";
	if (min === 12 && max === 11) return "h12";
	throw new Error("Unexpected hour cycle result");
}
//#endregion
export { BuddhistCalendar, CalendarDate, CalendarDateTime, CopticCalendar, DateFormatter, EthiopicAmeteAlemCalendar, EthiopicCalendar, GregorianCalendar, HebrewCalendar, IndianCalendar, IslamicCivilCalendar, IslamicTabularCalendar, IslamicUmalquraCalendar, JapaneseCalendar, PersianCalendar, TaiwanCalendar, Time, ZonedDateTime, createCalendar, endOfMonth, endOfWeek, endOfYear, fromAbsolute, fromDate, fromDateToLocal, getDayOfWeek, getHoursInDay, getLocalTimeZone, getMinimumDayInMonth, getMinimumMonthInYear, getWeeksInMonth, isEqualCalendar, isEqualDay, isEqualMonth, isEqualYear, isSameDay, isSameMonth, isSameYear, isToday, isWeekday, isWeekend, maxDate, minDate, now, parseAbsolute, parseAbsoluteToLocal, parseDate, parseDateTime, parseDuration, parseTime, parseZonedDateTime, resetLocalTimeZone, setLocalTimeZone, startOfMonth, startOfWeek, startOfYear, toCalendar, toCalendarDate, toCalendarDateTime, toLocalTimeZone, toTime, toTimeZone, toZoned, today };
