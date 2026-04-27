import "@testing-library/jest-dom";

// Mock import.meta.env for tests before any imports
Object.defineProperty(import.meta, "env", {
  value: {
    MODE: "test",
    DEV: true,
    PROD: false,
    SSR: false,
  },
  writable: true,
});

// Mock socket.io-client
vi.mock("socket.io-client", () => ({
  io: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connected: false,
  })),
}));

// Mock axios
vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    })),
  },
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
}));
