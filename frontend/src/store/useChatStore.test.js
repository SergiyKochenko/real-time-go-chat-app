import { describe, it, expect, beforeEach, vi } from "vitest";
import { useChatStore } from "./useChatStore";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

vi.mock("../lib/axios");
vi.mock("react-hot-toast");

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.setState({
      messages: [],
      users: [],
      selectedUser: null,
      isUserLoading: false,
      isMessageLoading: false,
    });
    vi.clearAllMocks();
  });

  describe("getUsers", () => {
    it("should set isUserLoading during fetch", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: [] });

      const getUsersPromise = useChatStore.getState().getUsers();
      expect(useChatStore.getState().isUserLoading).toBe(true);

      await getUsersPromise;

      expect(useChatStore.getState().isUserLoading).toBe(false);
    });

    it("should set users on successful fetch", async () => {
      const mockUsers = [
        { _id: "1", fullName: "User 1", email: "user1@example.com" },
        { _id: "2", fullName: "User 2", email: "user2@example.com" },
      ];
      axiosInstance.get.mockResolvedValueOnce({ data: mockUsers });

      await useChatStore.getState().getUsers();

      expect(useChatStore.getState().users).toEqual(mockUsers);
    });

    it("should show error toast on fetch failure", async () => {
      const error = new Error("Fetch failed");
      error.response = { data: { message: "Server error" } };
      axiosInstance.get.mockRejectedValueOnce(error);

      await useChatStore.getState().getUsers();

      expect(toast.error).toHaveBeenCalledWith("Server error");
      expect(useChatStore.getState().isUserLoading).toBe(false);
    });

    it("should call correct endpoint", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: [] });

      await useChatStore.getState().getUsers();

      expect(axiosInstance.get).toHaveBeenCalledWith("/messages/users");
    });
  });

  describe("getMessages", () => {
    it("should set isMessageLoading during fetch", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: [] });

      const getMessagesPromise = useChatStore.getState().getMessages("userId123");
      expect(useChatStore.getState().isMessageLoading).toBe(true);

      await getMessagesPromise;

      expect(useChatStore.getState().isMessageLoading).toBe(false);
    });

    it("should set messages on successful fetch", async () => {
      const mockMessages = [
        { _id: "1", senderId: "123", text: "Hello", createdAt: new Date() },
        { _id: "2", senderId: "456", text: "Hi", createdAt: new Date() },
      ];
      axiosInstance.get.mockResolvedValueOnce({ data: mockMessages });

      await useChatStore.getState().getMessages("userId123");

      expect(useChatStore.getState().messages).toEqual(mockMessages);
    });

    it("should show error toast on fetch failure", async () => {
      const error = new Error("Fetch failed");
      error.response = { data: { message: "Messages not found" } };
      axiosInstance.get.mockRejectedValueOnce(error);

      await useChatStore.getState().getMessages("userId123");

      expect(toast.error).toHaveBeenCalledWith("Messages not found");
      expect(useChatStore.getState().isMessageLoading).toBe(false);
    });

    it("should call correct endpoint with userId", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: [] });
      const userId = "user123";

      await useChatStore.getState().getMessages(userId);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/messages/${userId}`);
    });
  });

  describe("sendMessage", () => {
    it("should add new message to messages array", async () => {
      const selectedUser = { _id: "user2" };
      const messageData = { text: "Hello" };
      const newMessage = { _id: "msg1", ...messageData, senderId: "user1" };
      
      useChatStore.setState({ selectedUser, messages: [] });
      axiosInstance.post.mockResolvedValueOnce({ data: newMessage });

      await useChatStore.getState().sendMessage(messageData);

      expect(useChatStore.getState().messages).toEqual([newMessage]);
    });

    it("should append message to existing messages", async () => {
      const existingMessages = [{ _id: "1", text: "Old message" }];
      const selectedUser = { _id: "user2" };
      const messageData = { text: "New message" };
      const newMessage = { _id: "2", ...messageData };

      useChatStore.setState({ selectedUser, messages: existingMessages });
      axiosInstance.post.mockResolvedValueOnce({ data: newMessage });

      await useChatStore.getState().sendMessage(messageData);

      expect(useChatStore.getState().messages).toEqual([...existingMessages, newMessage]);
    });

    it("should show error toast on send failure", async () => {
      const selectedUser = { _id: "user2" };
      useChatStore.setState({ selectedUser });
      const error = new Error("Send failed");
      error.response = { data: { message: "Message too long" } };
      axiosInstance.post.mockRejectedValueOnce(error);

      await useChatStore.getState().sendMessage({ text: "Test" });

      expect(toast.error).toHaveBeenCalledWith("Message too long");
    });

    it("should call correct endpoint with selected user", async () => {
      const selectedUser = { _id: "user123" };
      const messageData = { text: "Hello" };
      
      useChatStore.setState({ selectedUser });
      axiosInstance.post.mockResolvedValueOnce({ data: {} });

      await useChatStore.getState().sendMessage(messageData);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
    });
  });

  describe("subscribeToMessages", () => {
    it("should not subscribe if no selected user", () => {
      useChatStore.setState({ selectedUser: null });
      const mockSocket = { on: vi.fn() };
      useAuthStore.setState({ socket: mockSocket });

      useChatStore.getState().subscribeToMessages();

      expect(mockSocket.on).not.toHaveBeenCalled();
    });

    it("should listen to newMessage event", () => {
      const selectedUser = { _id: "user2" };
      useChatStore.setState({ selectedUser });
      const mockSocket = { on: vi.fn() };
      useAuthStore.setState({ socket: mockSocket });

      useChatStore.getState().subscribeToMessages();

      expect(mockSocket.on).toHaveBeenCalledWith("newMessage", expect.any(Function));
    });

    it("should add new message from selected user", () => {
      const selectedUser = { _id: "user2" };
      const existingMessages = [{ _id: "1", text: "Old" }];
      useChatStore.setState({ selectedUser, messages: existingMessages });
      
      const mockSocket = { on: vi.fn() };
      useAuthStore.setState({ socket: mockSocket });

      useChatStore.getState().subscribeToMessages();

      const newMessageCallback = mockSocket.on.mock.calls[0][1];
      const newMessage = { _id: "2", text: "New", senderId: "user2" };
      newMessageCallback(newMessage);

      expect(useChatStore.getState().messages).toEqual([...existingMessages, newMessage]);
    });

    it("should not add message from different user", () => {
      const selectedUser = { _id: "user2" };
      const existingMessages = [{ _id: "1", text: "Old" }];
      useChatStore.setState({ selectedUser, messages: existingMessages });
      
      const mockSocket = { on: vi.fn() };
      useAuthStore.setState({ socket: mockSocket });

      useChatStore.getState().subscribeToMessages();

      const newMessageCallback = mockSocket.on.mock.calls[0][1];
      const messageFromOtherUser = { _id: "2", text: "New", senderId: "user3" };
      newMessageCallback(messageFromOtherUser);

      expect(useChatStore.getState().messages).toEqual(existingMessages);
    });
  });

  describe("unsubscribeFromMessages", () => {
    it("should unsubscribe from newMessage event", () => {
      const mockSocket = { off: vi.fn() };
      useAuthStore.setState({ socket: mockSocket });

      useChatStore.getState().unsubscribeFromMessages();

      expect(mockSocket.off).toHaveBeenCalledWith("newMessage");
    });
  });

  describe("setSelectedUser", () => {
    it("should set selected user", () => {
      const user = { _id: "123", fullName: "Test User" };

      useChatStore.getState().setSelectedUser(user);

      expect(useChatStore.getState().selectedUser).toEqual(user);
    });

    it("should allow setting selected user to null", () => {
      useChatStore.setState({ selectedUser: { _id: "123" } });

      useChatStore.getState().setSelectedUser(null);

      expect(useChatStore.getState().selectedUser).toBeNull();
    });
  });
});
