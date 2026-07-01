import { create } from "zustand";

interface ToastState {
  text: string;
  type: "success" | "error";
  showToast: (text: string, type?: "success" | "error") => void;
  hideToast: () => void;
}

interface SidebarState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

type UIStore = ToastState & SidebarState;

export const useUIStore = create<UIStore>((set) => {
  let toastTimeout: NodeJS.Timeout | null = null;

  return {
    // Toast State
    text: "",
    type: "success",
    showToast: (text, type = "success") => {
      if (toastTimeout) clearTimeout(toastTimeout);
      set({ text, type });
      toastTimeout = setTimeout(() => {
        set({ text: "", type: "success" });
      }, 4000);
    },
    hideToast: () => {
      if (toastTimeout) clearTimeout(toastTimeout);
      set({ text: "", type: "success" });
    },

    // Sidebar State
    isSidebarOpen: false,
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    closeSidebar: () => set({ isSidebarOpen: false }),
  };
});
