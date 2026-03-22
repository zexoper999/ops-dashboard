import { create } from "zustand";

interface OrderStore {
  selectedOrderId: string | null;
  isPanelOpen: boolean;
  openPanel: (id: string) => void;
  closePanel: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  selectedOrderId: null,
  isPanelOpen: false,
  openPanel: (id) => set({ selectedOrderId: id, isPanelOpen: true }),
  closePanel: () => set({ selectedOrderId: null, isPanelOpen: false }),
}));
