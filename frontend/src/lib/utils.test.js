import { describe, it, expect } from "vitest";
import { formatMessageTime } from "./utils";

describe("formatMessageTime", () => {
  it("should format a valid date correctly", () => {
    const date = new Date("2026-04-27T10:30:00");
    const result = formatMessageTime(date);
    expect(result).toMatch(/10:30/);
  });

  it("should handle ISO date strings", () => {
    const result = formatMessageTime("2026-04-27T14:45:00");
    expect(result).toMatch(/14:45/);
  });

  it("should return a valid time format in 24-hour format", () => {
    const date = new Date("2026-04-27T09:15:00");
    const result = formatMessageTime(date);
    expect(result).toMatch(/^[0-2][0-9]:[0-5][0-9]$/);
  });

  it("should handle midnight correctly", () => {
    const date = new Date("2026-04-27T00:00:00");
    const result = formatMessageTime(date);
    expect(result).toBe("00:00");
  });

  it("should handle noon correctly", () => {
    const date = new Date("2026-04-27T12:00:00");
    const result = formatMessageTime(date);
    expect(result).toBe("12:00");
  });

  it("should handle different date formats", () => {
    const timestamp = 1740000600000;
    const result = formatMessageTime(new Date(timestamp));
    expect(result).toBeTruthy();
    expect(result.length).toBe(5);
  });
});
