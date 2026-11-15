import { describe, expect, it } from "vitest";
import { completedMonthChange } from "./transparency";

const months = (before, last, current = 9999) => [
  { jumlah: before }, { jumlah: last }, { jumlah: current },
];

describe("completedMonthChange", () => {
  it("does not show a decline when the last completed month is empty", () => {
    expect(completedMonthChange(months(100, 0), "jumlah")).toBeNull();
    expect(completedMonthChange(months(100, undefined), "jumlah")).toBeNull();
  });
  it("requires a valid comparison month", () => {
    for (const value of [0, undefined, "invalid", -10, Infinity]) {
      expect(completedMonthChange(months(value, 100), "jumlah")).toBeNull();
      expect(completedMonthChange(months(100, value), "jumlah")).toBeNull();
    }
    expect(completedMonthChange([], "jumlah")).toBeNull();
  });
  it("preserves real increases, declines and unchanged amounts, excluding the current month", () => {
    expect(completedMonthChange(months(100, 50), "jumlah")).toBe(-50);
    expect(completedMonthChange(months(100, 150), "jumlah")).toBe(50);
    expect(completedMonthChange(months(100, 100), "jumlah")).toBe(0);
  });
  it("applies the same rule to distributions", () => {
    expect(completedMonthChange([{ tersalurkan: 950000 }, { tersalurkan: 0 }, { tersalurkan: 0 }], "tersalurkan")).toBeNull();
  });
});
