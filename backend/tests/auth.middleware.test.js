import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockReq, createMockRes } from "./helpers/mock-http.js";

const { verifyMock, findByIdMock } = vi.hoisted(() => ({
  verifyMock: vi.fn(),
  findByIdMock: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: verifyMock,
  },
}));

vi.mock("../src/models/user.model.js", () => ({
  default: {
    findById: findByIdMock,
  },
}));

import authMiddleware, { protectRoute } from "../src/middleware/auth.middleware.js";

describe("protectRoute middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "secret";
  });

  it("returns 401 when token is missing", async () => {
    const req = createMockReq({ cookies: {} });
    const res = createMockRes();
    const next = vi.fn();

    await protectRoute(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized - No Token Provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when decoded token is invalid", async () => {
    verifyMock.mockReturnValue(null);

    const req = createMockReq({ cookies: { jwt: "bad" } });
    const res = createMockRes();
    const next = vi.fn();

    await protectRoute(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ message: "Unauthorized - Invalid Token" });
  });

  it("returns 404 when user does not exist", async () => {
    verifyMock.mockReturnValue({ userId: "u1" });
    findByIdMock.mockReturnValue({
      select: vi.fn().mockResolvedValue(null),
    });

    const req = createMockReq({ cookies: { jwt: "token" } });
    const res = createMockRes();
    const next = vi.fn();

    await protectRoute(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "User Not Found" });
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches user and calls next for valid token", async () => {
    verifyMock.mockReturnValue({ userId: "u1" });
    const user = { _id: "u1", fullName: "Test" };
    findByIdMock.mockReturnValue({
      select: vi.fn().mockResolvedValue(user),
    });

    const req = createMockReq({ cookies: { jwt: "good" } });
    const res = createMockRes();
    const next = vi.fn();

    await protectRoute(req, res, next);

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalledOnce();
  });

  it("returns 500 when verify throws", async () => {
    verifyMock.mockImplementation(() => {
      throw new Error("broken");
    });

    const req = createMockReq({ cookies: { jwt: "good" } });
    const res = createMockRes();
    const next = vi.fn();

    await protectRoute(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ message: "Internal server error" });
    expect(next).not.toHaveBeenCalled();
  });

  it("default middleware calls next", () => {
    const req = createMockReq();
    const res = createMockRes();
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });
});
