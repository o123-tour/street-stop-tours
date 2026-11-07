import { describe, expect, it } from "vitest";
import { canBook, closedDaysNote, isoFor, timesForDay, tourDates, totalPrice } from "@/lib/schedule";

describe("Dickens tour schedule", () => {
  it("closes enquiries exactly four hours before each London tour start", () => {
    expect(canBook(11, 7, "19:00", new Date("2026-11-07T14:59:59.999Z"))).toBe(true);
    expect(canBook(11, 7, "19:00", new Date("2026-11-07T15:00:00Z"))).toBe(false);
    expect(canBook(11, 7, "19:00", new Date("2026-11-07T16:00:00Z"))).toBe(false);
    expect(canBook(11, 7, "21:00", new Date("2026-11-07T16:00:00Z"))).toBe(true);
    expect(canBook(11, 14, "20:00", new Date("2026-11-14T16:00:00Z"))).toBe(false);
    expect(canBook(11, 14, "22:00", new Date("2026-11-14T17:59:59Z"))).toBe(true);
    expect(canBook(12, 1, "19:00", new Date("2026-12-01T15:00:00Z"))).toBe(false);
    expect(canBook(12, 1, "21:00", new Date("2026-12-01T17:00:00Z"))).toBe(false);
    expect(canBook(12, 24, "19:00", new Date("2026-12-01T00:00:00Z"))).toBe(false);
    expect(canBook(11, 7, "19:00", new Date("2026-11-08T00:00:00Z"))).toBe(false);
  });
  it("runs 7pm and 9pm on normal November days from the 7th", () => {
    expect(timesForDay(11, 7)).toEqual(["19:00", "21:00"]);
  });
  it("has no November tours before the 7th", () => {
    expect(timesForDay(11, 6)).toEqual([]);
  });
  it("moves both November tours an hour later on the 14th, 15th, 17th, 22nd and 29th", () => {
    for (const d of [14, 15, 17, 22, 29]) expect(timesForDay(11, d)).toEqual(["20:00", "22:00"]);
  });
  it("cancels all November tours on the 28th", () => {
    expect(timesForDay(11, 28)).toEqual([]);
  });
  it("runs 7pm and 9pm every December night from the 1st", () => {
    expect(timesForDay(12, 1)).toEqual(["19:00", "21:00"]);
    expect(timesForDay(12, 31)).toEqual(["19:00", "21:00"]);
  });
  it("has no December tours on the 24th, 25th or 26th", () => {
    for (const d of [24, 25, 26]) expect(timesForDay(12, d)).toEqual([]);
  });
  it("has no late December nights", () => {
    expect(timesForDay(12, 14)).toEqual(["19:00", "21:00"]);
  });
  it("offers 28 bookable December dates", () => {
    expect(tourDates().filter((d) => d.month === 12 && d.times.length > 0)).toHaveLength(28);
  });
  it("builds December dates as 2026-12-05", () => {
    expect(isoFor(12, 5)).toBe("2026-12-05");
  });
  it("says which December days are closed", () => {
    expect(closedDaysNote(12)).toBe("No tours on 24, 25 and 26 December.");
  });
  it("charges £20 per person", () => {
    expect(totalPrice(3)).toBe(60);
  });
});
