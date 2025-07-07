import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chatapp-theme") || "dark", // Default to dark theme
  setTheme: (newTheme) => {
    set({ theme: newTheme });
    localStorage.setItem("chatapp-theme", newTheme);
  },
}));
