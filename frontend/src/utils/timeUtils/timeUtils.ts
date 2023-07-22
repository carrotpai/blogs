import { addDays, differenceInDays, format, formatDistance } from "date-fns";
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";

export const getRelativeTime = (date: Date) => {
	const now = new Date();
	const interval = Math.abs(differenceInDays(date, now));
	if (interval >= 2) {
		return format(date, "d MMMM, yyyy");
	} else {
		return formatDistance(date, now, { addSuffix: true });
	}
};

export const toLocalTime = (date: string) => {
	const localTime = utcToZonedTime(date, "UTC");
	return new Date(localTime);
};
