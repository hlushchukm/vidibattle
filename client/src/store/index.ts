import { create } from "zustand";

export const useCurrentUserStore = create((set) => ({
  id: "653a5e9300ecfb67556b51aa",
  currentUser: null,
  setCurrentUser: (user: any) =>
    set(() => ({ currentUser: user, id: user._id })),
}));

export const useChatsStore = create((set) => ({
  chats: [],
  setChats: (chatsList: any[]) => set(() => ({ chats: chatsList })),
}));

export const useCurrentChatStore = create((set) => ({
  currentChat: null,
  setCurrentChat: (chat: any) => set({ currentChat: chat }),
}));
