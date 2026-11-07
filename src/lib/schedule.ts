// Dickens tour timetable, November & December 2026.
export const PRICE_PER_PERSON_GBP = 20;

export type TourMonth = {
  month: number; // 1-12
  year: number;
  label: string; // "November 2026"
  firstDay: number;
  lastDay: number;
  lateDays: number[]; // both tours start an hour later
  cancelledDays: number[]; // no tours at all
};

export const TOUR_MONTHS: TourMonth[] = [
  {
    month: 11,
    year: 2026,
    label: "November 2026",
    firstDay: 7,
    lastDay: 30,
    lateDays: [14, 15, 17, 22, 29],
    cancelledDays: [28],
  },
  {
    month: 12,
    year: 2026,
    label: "December 2026",
    firstDay: 1,
    lastDay: 31,
    lateDays: [],
    cancelledDays: [24, 25, 26],
  },
];

export function monthFor(month: number): TourMonth | undefined {
  return TOUR_MONTHS.find((m) => m.month === month);
}

export function timesForDay(month: number, day: number): string[] {
  const m = monthFor(month);
  if (!m || day < m.firstDay || day > m.lastDay || m.cancelledDays.includes(day)) return [];
  return m.lateDays.includes(day) ? ["20:00", "22:00"] : ["19:00", "21:00"];
}

export function isoFor(month: number, day: number): string {
  const m = monthFor(month);
  if (!m) throw new Error("Unknown tour month");
  return `${m.year}-${String(m.month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// November and December tour dates are in London standard time (UTC).
export function canBook(month: number, day: number, time: string, now: Date): boolean {
  if (!timesForDay(month, day).includes(time)) return false;
  const start = new Date(`${isoFor(month, day)}T${time}:00Z`).getTime();
  return now.getTime() < start - 4 * 60 * 60 * 1000;
}

export type TourDate = { iso: string; month: number; monthLabel: string; day: number; times: string[] };

export function tourDates(): TourDate[] {
  const out: TourDate[] = [];
  for (const m of TOUR_MONTHS) {
    for (let d = m.firstDay; d <= m.lastDay; d++) {
      out.push({ iso: isoFor(m.month, d), month: m.month, monthLabel: m.label, day: d, times: timesForDay(m.month, d) });
    }
  }
  return out;
}

export function closedDaysNote(month: number): string {
  const m = monthFor(month);
  if (!m || m.cancelledDays.length === 0) return "";
  const name = m.label.split(" ")[0]!;
  const days = m.cancelledDays;
  const list = days.length === 1 ? `${days[0]}` : `${days.slice(0, -1).join(", ")} and ${days[days.length - 1]}`;
  return `No tours on ${list} ${name}.`;
}

export function tourMonths(): { month: number; label: string; dates: TourDate[]; closedNote: string }[] {
  const all = tourDates();
  return TOUR_MONTHS.map((m) => ({
    month: m.month,
    label: m.label,
    dates: all.filter((d) => d.month === m.month),
    closedNote: closedDaysNote(m.month),
  }));
}

export function totalPrice(guests: number) {
  return guests * PRICE_PER_PERSON_GBP;
}

export function formatTime(t: string) {
  const h = Number(t.slice(0, 2));
  const hour = h > 12 ? h - 12 : h;
  return `${hour}${h >= 12 ? "pm" : "am"}`;
}
