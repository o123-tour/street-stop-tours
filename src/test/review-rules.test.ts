import { describe, expect, it } from "vitest";
import { canReview } from "@/lib/review-rules";

describe("reviews only after the tour", () => {
  it("blocks a review before the tour starts", () => {
    expect(canReview("2026-11-07", "19:00", new Date("2026-11-07T18:59:00Z"))).toBe(false);
  });
  it("allows a review once the tour has happened", () => {
    expect(canReview("2026-11-07", "19:00", new Date("2026-11-08T10:00:00Z"))).toBe(true);
  });
});
