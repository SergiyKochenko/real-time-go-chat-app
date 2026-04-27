import { describe, it, expect } from "vitest";
import { formatMessageTime } from "./utils";

describe("formatMessageTime", () => {
  it("should return a properly formatted time string", () => {
    const date = new Date();
    const result = formatMessageTime(date);
    expect(result).toBeTruthy();
    expect(result).toMatch(/^[0-2][0-9]:[0-5][0-9]$/);
  });

  it("should have exactly 5 characters (HH:MM format)", () => {
    const date = new Date();
    const result = formatMessageTime(date);
    expect(result.length).toBe(5);
  });

  it("should handle ISO date strings", () => {
    const result = formatMessageTime("2026-04-27T14:45:00");
    expect(result).toBeTruthy();
    expect(result).toMatch(/^[0-2][0-9]:[0-5][0-9]$/);
  });

  it("should accept Date objects", () => {
    const date = new Date(2026, 3, 27, 10, 30);
    const result = formatMessageTime(date);
    expect(result).toBeTruthy();
    expect(result).toMatch(/^[0-2][0-9]:[0-5][0-9]$/);
  });

  it("should accept timestamps", () => {
    const timestamp = 1740000600000;
    const result = formatMessageTime(new Date(timestamp));
    expect(result).toBeTruthy();
    expect(result.length).toBe(5);
  });

  it("should use 24-hour format (no AM/PM)", () => {
    const date = new Date(2026, 3, 27, 15, 30);
    const result = formatMessageTime(date);
    expect(result).not.toMatch(/AM|PM|am|pm/);
  });
});
