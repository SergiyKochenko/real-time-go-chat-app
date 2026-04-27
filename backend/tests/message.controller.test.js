import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockReq, createMockRes } from "./helpers/mock-http.js";

const {
  findUsersMock,
  findMessagesMock,
  uploadMock,
  getReceiverSocketIdMock,
  emitMock,
  toMock,
  MessageCtor,
} = vi.hoisted(() => {
  const emit = vi.fn();
  const to = vi.fn(() => ({ emit }));
  const messageCtor = vi.fn(function (data) {
    Object.assign(this, data);
    this.save = vi.fn().mockResolvedValue(this);
  });
  const findMessages = vi.fn();
  messageCtor.find = findMessages;

  return {
    findUsersMock: vi.fn(),
    findMessagesMock: findMessages,
    uploadMock: vi.fn(),
    getReceiverSocketIdMock: vi.fn(),
    emitMock: emit,
    toMock: to,
    MessageCtor: messageCtor,
  };
});

vi.mock("../src/models/user.model.js", () => ({
  default: {
    find: findUsersMock,
  },
}));

vi.mock("../src/models/message.model.js", () => ({
  default: MessageCtor,
}));

vi.mock("../src/lib/cloudinary.js", () => ({
  default: {
    uploader: {
      upload: uploadMock,
    },
  },
}));

vi.mock("../src/lib/socket.js", () => ({
  getReceiverSocketId: getReceiverSocketIdMock,
  io: {
    to: toMock,
  },
}));

import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../src/controllers/message.controller.js";

describe("message controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getUsersForSidebar returns filtered users", async () => {
    findUsersMock.mockReturnValue({
      select: vi.fn().mockResolvedValue([{ _id: "u2" }]),
    });

    const req = createMockReq({ user: { _id: "u1" } });
    const res = createMockRes();

    await getUsersForSidebar(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ _id: "u2" }]);
  });

  it("getMessages returns conversation messages", async () => {
    findMessagesMock.mockResolvedValue([{ text: "hello" }]);

    const req = createMockReq({ params: { id: "u2" }, user: { _id: "u1" } });
    const res = createMockRes();

    await getMessages(req, res);

    expect(findMessagesMock).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ text: "hello" }]);
  });

  it("sendMessage stores plain-text message", async () => {
    getReceiverSocketIdMock.mockReturnValue(null);

    const req = createMockReq({
      params: { id: "u2" },
      user: { _id: "u1" },
      body: { text: "hi" },
    });
    const res = createMockRes();

    await sendMessage(req, res);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(expect.objectContaining({ text: "hi", receiverId: "u2" }));
    expect(toMock).not.toHaveBeenCalled();
  });

  it("sendMessage uploads image and emits socket event", async () => {
    uploadMock.mockResolvedValue({ secure_url: "https://img" });
    getReceiverSocketIdMock.mockReturnValue("socket-1");

    const req = createMockReq({
      params: { id: "u2" },
      user: { _id: "u1" },
      body: { text: "hi", image: "base64" },
    });
    const res = createMockRes();

    await sendMessage(req, res);

    expect(uploadMock).toHaveBeenCalledWith("base64");
    expect(toMock).toHaveBeenCalledWith("socket-1");
    expect(emitMock).toHaveBeenCalledWith("newMessage", expect.any(Object));
    expect(res.statusCode).toBe(201);
  });

  it("returns 500 when sendMessage throws", async () => {
    uploadMock.mockImplementation(() => {
      throw new Error("upload failed");
    });

    const req = createMockReq({
      params: { id: "u2" },
      user: { _id: "u1" },
      body: { text: "hi", image: "base64" },
    });
    const res = createMockRes();

    await sendMessage(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });

  it("getUsersForSidebar returns 500 when query fails", async () => {
    findUsersMock.mockImplementation(() => {
      throw new Error("query failed");
    });

    const req = createMockReq({ user: { _id: "u1" } });
    const res = createMockRes();

    await getUsersForSidebar(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });

  it("getMessages returns 500 when query fails", async () => {
    findMessagesMock.mockRejectedValue(new Error("query failed"));

    const req = createMockReq({ params: { id: "u2" }, user: { _id: "u1" } });
    const res = createMockRes();

    await getMessages(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Internal server error" });
  });
});
