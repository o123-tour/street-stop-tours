// Dickens tour timetable, November 2026.
export const PRICE_PER_PERSON_GBP = 20;
const YEAR = 2026;
const MONTH = 11;
const FIRST_DAY = 7;
const LATE_DAYS = [14, 15, 17, 22, 29]; // both tours start an hour later
const CANCELLED_DAYS = [28];

export function timesForDay(day: number): string[] {
  if (day < FIRST_DAY || day > 30 || CANCELLED_DAYS.includes(day)) return [];
  return LATE_DAYS.includes(day) ? ["20:00", "22:00"] : ["19:00", "21:00"];
}

export function tourDates(): { iso: string; day: number; times: string[] }[] {
  const out = [];
  for (let d = FIRST_DAY; d <= 30; d++) {
    out.push({ iso: `${YEAR}-${MONTH}-${String(d).padStart(2, "0")}`, day: d, times: timesForDay(d) });
  }
  return out;
}

export function totalPrice(guests: number) {
  return guests * PRICE_PER_PERSON_GBP;
}

export function formatTime(t: string) {
  const h = Number(t.slice(0, 2));
  return `${h > 12 ? h - 12 : h}pm`;
}
