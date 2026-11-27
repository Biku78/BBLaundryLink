import { describe, expect, it } from "vitest";
import { estimateLaundry } from "./estimateLaundry";
import { samplePartners } from "../data/samplePartners";

describe("sample laundry estimates", () => {
  it("chooses the lowest wash rate and calculates four kg", () => {
    expect(estimateLaundry(samplePartners, "Wash & Fold", 4)).toMatchObject({
      partner: { id: "smartwash" },
      rate: 45,
      unit: "kg",
      total: 180,
      expressFee: 0,
    });
  });
  it("adds an itemized 30 percent express surcharge", () => {
    expect(
      estimateLaundry(samplePartners, "Wash & Fold", 4, true),
    ).toMatchObject({ subtotal: 180, expressFee: 54, total: 234 });
  });
  it("uses piece-based rates for ironing rather than kg", () => {
    expect(estimateLaundry(samplePartners, "Ironing", 4)).toMatchObject({
      rate: 20,
      unit: "piece",
      total: 80,
    });
  });
  it("uses pair-based rates for shoe care", () => {
    expect(estimateLaundry(samplePartners, "Shoe Care", 2)).toMatchObject({
      rate: 149,
      unit: "pair",
      total: 298,
    });
  });
  it("uses service-specific dry cleaning rates", () => {
    expect(estimateLaundry(samplePartners, "Dry Cleaning", 2)).toMatchObject({
      rate: 100,
      total: 200,
    });
  });
  it.each([0, 16, -1, 2.5, NaN])("rejects invalid quantity %s", (quantity) => {
    expect(() =>
      estimateLaundry(samplePartners, "Wash & Fold", quantity),
    ).toThrow(RangeError);
  });
  it("rejects unknown services", () =>
    expect(() => estimateLaundry(samplePartners, "Unknown", 1)).toThrow(
      RangeError,
    ));
  it("handles no matching partner", () =>
    expect(estimateLaundry([], "Wash & Fold", 1)).toBeNull());
  it("provides a real image path for every sample partner", () => {
    expect(samplePartners).toHaveLength(6);
    expect(
      samplePartners.every(
        (partner) =>
          partner.image.startsWith("/images/") &&
          partner.image.endsWith(".webp"),
      ),
    ).toBe(true);
  });
});
