import { create } from "zustand";

interface MemberStore {
  // 슬라이드 패널 상태
  selectedMemberId: string | null;
  isPanelOpen: boolean;

  // 액션
  openPanel: (id: string) => void;
  closePanel: () => void;
}

export const useMemberStore = create<MemberStore>((set) => ({
  selectedMemberId: null,
  isPanelOpen: false,

  openPanel: (id) => set({ selectedMemberId: id, isPanelOpen: true }),
  closePanel: () => set({ selectedMemberId: null, isPanelOpen: false }),
}));
