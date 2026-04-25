import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockReq, createMockRes } from "./helpers/mock-http.js";

const {
  generateTokenMock,
  genSaltMock,
  hashMock,
  compareMock,
  uploadMock,
  MockUser,
} = vi.hoisted(() => {
  const mockUserCtor = vi.fn(function (data) {
    Object.assign(this, data);
    this._id = data?._id || "user-id";
    this.profilePic = data?.profilePic || "";
    this.save = vi.fn().mockResolvedValue(this);
  });
  mockUserCtor.findOne = vi.fn();
  mockUserCtor.findByIdAndUpdate = vi.fn();

  return {
    generateTokenMock: vi.fn(),
    genSaltMock: vi.fn(),
    hashMock: vi.fn(),
    compareMock: vi.fn(),
    uploadMock: vi.fn(),
    MockUser: mockUserCtor,
  };
});

vi.mock("../src/lib/utils.js", () => ({
  generateToken: generateTokenMock,
}));

vi.mock("bcryptjs", () => ({
  default: {
    genSalt: genSaltMock,
    hash: hashMock,
    compare: compareMock,
  },
}));

vi.mock("../src/lib/cloudinary.js", () => ({
  default: {
    uploader: {
      upload: uploadMock,
    },
  },
}));

vi.mock("../src/models/user.model.js", () => ({
  default: MockUser,
}));

import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../src/controllers/auth.controller.js";

describe("auth controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signup returns 400 when fields are missing", async () => {
    const req = createMockReq({ body: { fullName: "", email: "", password: "" } });
    const res = createMockRes();

    await signup(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Please fill all fields" });
  });

  it("signup returns 400 for short password", async () => {
    const req = createMockReq({ body: { fullName: "A", email: "a@a.com", password: "123" } });
    const res = createMockRes();

    await signup(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Password must be at least 6 characters long" });
  });

  it("signup returns 400 when email exists", async () => {
    MockUser.findOne.mockResolvedValue({ _id: "exists" });

    const req = createMockReq({
      body: { fullName: "John", email: "john@mail.com", password: "123456" },
    });
    const res = createMockRes();

    await signup(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Email already exists" });
  });

  it("signup creates user and returns 201", async () => {
    MockUser.findOne.mockResolvedValue(null);
    genSaltMock.mockResolvedValue("salt");
    hashMock.mockResolvedValue("hashed");

    const req = createMockReq({
      body: { fullName: "John", email: "john@mail.com", password: "123456" },
    });
    const res = createMockRes();

    await signup(req, res);

    expect(generateTokenMock).toHaveBeenCalled();
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        fullName: "John",
        email: "john@mail.com",
      })
    );
  });

  it("login returns 400 when user is missing", async () => {
    MockUser.findOne.mockResolvedValue(null);

    const req = createMockReq({ body: { email: "x@mail.com", password: "pass" } });
    const res = createMockRes();

    await login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Invalid credentials" });
  });

  it("login returns 400 when password is wrong", async () => {
    MockUser.findOne.mockResolvedValue({ _id: "u1", password: "hash" });
    compareMock.mockResolvedValue(false);

    const req = createMockReq({ body: { email: "x@mail.com", password: "bad" } });
    const res = createMockRes();

    await login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Invalid credentials" });
  });

  it("login returns 200 with user payload", async () => {
    MockUser.findOne.mockResolvedValue({
      _id: "u1",
      password: "hash",
      fullName: "Jane",
      email: "jane@mail.com",
      profilePic: "",
    });
    compareMock.mockResolvedValue(true);

    const req = createMockReq({ body: { email: "jane@mail.com", password: "good" } });
    const res = createMockRes();

    await login(req, res);

    expect(generateTokenMock).toHaveBeenCalledWith("u1", res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        _id: "u1",
        fullName: "Jane",
      })
    );
  });

  it("logout clears cookie", () => {
    const req = createMockReq();
    const res = createMockRes();

    logout(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.cookieArgs).toEqual(["jwt", "", { maxAge: 0 }]);
  });

  it("updateProfile returns 400 when image missing", async () => {
    const req = createMockReq({ body: {}, user: { _id: "u1" } });
    const res = createMockRes();

    await updateProfile(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Please provide a profile picture" });
  });

  it("updateProfile uploads image and updates user", async () => {
    uploadMock.mockResolvedValue({ secure_url: "https://img" });
    MockUser.findByIdAndUpdate.mockResolvedValue({ _id: "u1", profilePic: "https://img" });

    const req = createMockReq({ body: { profilePic: "base64" }, user: { _id: "u1" } });
    const res = createMockRes();

    await updateProfile(req, res);

    expect(uploadMock).toHaveBeenCalledWith("base64");
    expect(MockUser.findByIdAndUpdate).toHaveBeenCalledWith(
      "u1",
      { profilePic: "https://img" },
      { new: true }
    );
    expect(res.statusCode).toBe(200);
  });

  it("checkAuth returns current user", () => {
    const req = createMockReq({ user: { _id: "u1" } });
    const res = createMockRes();

    checkAuth(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ _id: "u1" });
  });
});
