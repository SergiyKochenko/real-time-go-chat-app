import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "black", 
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));