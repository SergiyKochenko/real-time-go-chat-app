import { beforeEach, describe, expect, it, vi } from "vitest";

const { signMock } = vi.hoisted(() => ({
  signMock: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: signMock,
  },
}));

import { generateToken } from "../src/lib/utils.js";

describe("generateToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("signs token and sets secure cookie in production-like env", () => {
    process.env.NODE_ENV = "production";
    signMock.mockReturnValue("signed-token");

    const res = { cookie: vi.fn() };

    const token = generateToken("user-1", res);

    expect(token).toBe("signed-token");
    expect(signMock).toHaveBeenCalledWith(
      { userId: "user-1" },
      "test-secret",
      { expiresIn: "7d" }
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "jwt",
      "signed-token",
      expect.objectContaining({ secure: true, httpOnly: true, sameSite: "strict" })
    );
  });

  it("sets non-secure cookie in development", () => {
    process.env.NODE_ENV = "development";
    signMock.mockReturnValue("dev-token");

    const res = { cookie: vi.fn() };

    generateToken("user-2", res);

    expect(res.cookie).toHaveBeenCalledWith(
      "jwt",
      "dev-token",
      expect.objectContaining({ secure: false })
    );
  });
});
