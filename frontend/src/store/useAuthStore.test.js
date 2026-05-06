import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "./useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

vi.mock("../lib/axios");
vi.mock("react-hot-toast");
vi.mock("socket.io-client");

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Reset store state
    useAuthStore.setState({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      onlineUsers: [],
      socket: null,
    });
    
    // Mock io to return a socket-like object
    const mockSocket = {
      connect: vi.fn(),
      disconnect: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      connected: false,
    };
    io.mockReturnValue(mockSocket);
  });

  describe("checkAuth", () => {
    it("should set authUser on successful check", async () => {
      const mockUser = { _id: "123", email: "test@example.com" };
      axiosInstance.get.mockResolvedValueOnce({ data: mockUser });

      await useAuthStore.getState().checkAuth();

      expect(useAuthStore.getState().isCheckingAuth).toBe(false);
    });

    it("should set isCheckingAuth to false on failure", async () => {
      axiosInstance.get.mockRejectedValueOnce(new Error("Network error"));

      await useAuthStore.getState().checkAuth();

      expect(useAuthStore.getState().authUser).toBeNull();
      expect(useAuthStore.getState().isCheckingAuth).toBe(false);
    });

    it("should call checkAuth endpoint", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: {} });

      await useAuthStore.getState().checkAuth();

      expect(axiosInstance.get).toHaveBeenCalledWith("/auth/check");
    });
  });

  describe("signup", () => {
    it("should set isSigningUp during signup", async () => {
      const signupData = { email: "test@example.com", password: "123456" };
      const mockUser = { _id: "123", ...signupData };
      axiosInstance.post.mockResolvedValueOnce({ data: mockUser });

      const signupPromise = useAuthStore.getState().signup(signupData);
      expect(useAuthStore.getState().isSigningUp).toBe(true);

      await signupPromise;

      expect(useAuthStore.getState().isSigningUp).toBe(false);
    });

    it("should call signup endpoint", async () => {
      const signupData = { email: "test@example.com", password: "123456" };
      const mockUser = { _id: "123", ...signupData };
      axiosInstance.post.mockResolvedValueOnce({ data: mockUser });

      await useAuthStore.getState().signup(signupData);

      expect(axiosInstance.post).toHaveBeenCalledWith("/auth/signup", signupData);
    });

    it("should show success toast on successful signup", async () => {
      const signupData = { email: "test@example.com", password: "123456" };
      const mockUser = { _id: "123", ...signupData };
      axiosInstance.post.mockResolvedValueOnce({ data: mockUser });

      await useAuthStore.getState().signup(signupData);

      expect(toast.success).toHaveBeenCalledWith("Account created successfully!");
    });

    it("should show error toast on signup failure", async () => {
      const signupData = { email: "test@example.com", password: "123456" };
      const error = new Error("Signup failed");
      error.response = { data: { message: "User already exists" } };
      axiosInstance.post.mockRejectedValueOnce(error);

      await useAuthStore.getState().signup(signupData);

      expect(toast.error).toHaveBeenCalledWith("User already exists");
      expect(useAuthStore.getState().isSigningUp).toBe(false);
    });
  });

  describe("login", () => {
    it("should set isLoggingIn during login", async () => {
      const loginData = { email: "test@example.com", password: "123456" };
      const mockUser = { _id: "123", email: "test@example.com" };
      axiosInstance.post.mockResolvedValueOnce({ data: mockUser });

      const loginPromise = useAuthStore.getState().login(loginData);
      expect(useAuthStore.getState().isLoggingIn).toBe(true);

      await loginPromise;

      expect(useAuthStore.getState().isLoggingIn).toBe(false);
    });

    it("should call login endpoint", async () => {
      const loginData = { email: "test@example.com", password: "123456" };
      const mockUser = { _id: "123", email: "test@example.com" };
      axiosInstance.post.mockResolvedValueOnce({ data: mockUser });

      await useAuthStore.getState().login(loginData);

      expect(axiosInstance.post).toHaveBeenCalledWith("/auth/login", loginData);
    });

    it("should show success toast on successful login", async () => {
      const loginData = { email: "test@example.com", password: "123456" };
      const mockUser = { _id: "123", email: "test@example.com" };
      axiosInstance.post.mockResolvedValueOnce({ data: mockUser });

      await useAuthStore.getState().login(loginData);

      expect(toast.success).toHaveBeenCalledWith("Logged in successfully!");
    });

    it("should show error toast on login failure", async () => {
      const loginData = { email: "test@example.com", password: "wrong" };
      const error = new Error("Login failed");
      error.response = { data: { message: "Invalid credentials" } };
      axiosInstance.post.mockRejectedValueOnce(error);

      await useAuthStore.getState().login(loginData);

      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
      expect(useAuthStore.getState().isLoggingIn).toBe(false);
    });
  });

  describe("logout", () => {
    it("should clear authUser on logout", async () => {
      useAuthStore.setState({ authUser: { _id: "123" } });
      axiosInstance.post.mockResolvedValueOnce({});

      await useAuthStore.getState().logout();

      expect(useAuthStore.getState().authUser).toBeNull();
      expect(toast.success).toHaveBeenCalledWith("Logged out successfully!");
    });

    it("should show error toast on logout failure", async () => {
      useAuthStore.setState({ authUser: { _id: "123" } });
      const error = new Error("Logout failed");
      error.response = { data: { message: "Server error" } };
      axiosInstance.post.mockRejectedValueOnce(error);

      await useAuthStore.getState().logout();

      expect(toast.error).toHaveBeenCalledWith("Server error");
    });
  });

  describe("updateProfile", () => {
    it("should set isUpdatingProfile during update", async () => {
      useAuthStore.setState({ authUser: { _id: "123" } });
      const updateData = { fullName: "John Doe" };
      axiosInstance.put.mockResolvedValueOnce({ data: { _id: "123", ...updateData } });

      const updatePromise = useAuthStore.getState().updateProfile(updateData);
      expect(useAuthStore.getState().isUpdatingProfile).toBe(true);

      await updatePromise;

      expect(useAuthStore.getState().isUpdatingProfile).toBe(false);
    });

    it("should update authUser on successful profile update", async () => {
      useAuthStore.setState({ authUser: { _id: "123", fullName: "Old Name" } });
      const updateData = { fullName: "John Doe" };
      const updatedUser = { _id: "123", ...updateData };
      axiosInstance.put.mockResolvedValueOnce({ data: updatedUser });

      await useAuthStore.getState().updateProfile(updateData);

      expect(useAuthStore.getState().authUser).toEqual(updatedUser);
      expect(toast.success).toHaveBeenCalledWith("Profile updated successfully");
    });

    it("should show error toast on profile update failure", async () => {
      useAuthStore.setState({ authUser: { _id: "123" } });
      const error = new Error("Update failed");
      error.response = { data: { message: "Validation error" } };
      axiosInstance.put.mockRejectedValueOnce(error);

      await useAuthStore.getState().updateProfile({ fullName: "Test" });

      expect(toast.error).toHaveBeenCalledWith("Validation error");
      expect(useAuthStore.getState().isUpdatingProfile).toBe(false);
    });
  });

  describe("connectSocket", () => {
    it("should not connect if no authUser", () => {
      useAuthStore.setState({ authUser: null });

      useAuthStore.getState().connectSocket();

      expect(io).not.toHaveBeenCalled();
    });

    it("should not reconnect if already connected", () => {
      const mockSocket = { connected: true, connect: vi.fn() };
      useAuthStore.setState({ authUser: { _id: "123" }, socket: mockSocket });

      useAuthStore.getState().connectSocket();

      expect(io).not.toHaveBeenCalled();
    });

    it("should create socket connection with authUser", () => {
      const mockSocket = {
        connect: vi.fn(),
        on: vi.fn(),
        connected: false,
      };
      io.mockReturnValueOnce(mockSocket);
      useAuthStore.setState({ authUser: { _id: "123" } });

      useAuthStore.getState().connectSocket();

      expect(io).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          query: { userId: "123" },
        })
      );
      expect(mockSocket.connect).toHaveBeenCalled();
    });

    it("should listen to getOnlineUsers event", () => {
      const mockSocket = {
        connect: vi.fn(),
        on: vi.fn(),
        connected: false,
      };
      io.mockReturnValueOnce(mockSocket);
      useAuthStore.setState({ authUser: { _id: "123" } });

      useAuthStore.getState().connectSocket();

      expect(mockSocket.on).toHaveBeenCalledWith("getOnlineUsers", expect.any(Function));
    });
  });

  describe("disconnectSocket", () => {
    it("should disconnect socket if connected", () => {
      const mockSocket = {
        connected: true,
        disconnect: vi.fn(),
      };
      useAuthStore.setState({ socket: mockSocket });

      useAuthStore.getState().disconnectSocket();

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it("should not call disconnect if socket not connected", () => {
      const mockSocket = {
        connected: false,
        disconnect: vi.fn(),
      };
      useAuthStore.setState({ socket: mockSocket });

      useAuthStore.getState().disconnectSocket();

      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });
  });
});
