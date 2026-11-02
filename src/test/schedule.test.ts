import { describe, expect, it } from "vitest";
import { timesForDay, totalPrice } from "@/lib/schedule";

describe("Dickens tour schedule", () => {
  it("runs 7pm and 9pm on normal days from the 7th", () => {
    expect(timesForDay(7)).toEqual(["19:00", "21:00"]);
  });
  it("has no tours before the 7th", () => {
    expect(timesForDay(6)).toEqual([]);
  });
  it("moves both tours an hour later on the 14th, 15th, 17th, 22nd and 29th", () => {
    for (const d of [14, 15, 17, 22, 29]) expect(timesForDay(d)).toEqual(["20:00", "22:00"]);
  });
  it("cancels all tours on the 28th", () => {
    expect(timesForDay(28)).toEqual([]);
  });
  it("charges £20 per person", () => {
    expect(totalPrice(3)).toBe(60);
  });
});
