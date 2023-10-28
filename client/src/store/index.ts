import { create } from "zustand";
import { getUserId } from "../services/auth";

export const useCurrentUserStore = create((set) => ({
  id: getUserId(),
  currentUser: null,
  setCurrentUser: (user: any) =>
    set(() => ({ currentUser: user, id: user._id })),
  setCurrentUserId: (id: any) => set(() => ({ id: id })),
}));

export const useChatsStore = create((set) => ({
  chats: [],
  setChats: (chatsList: any[]) => set(() => ({ chats: chatsList })),
}));

export const useCurrentChatStore = create((set) => ({
  currentChat: null,
  setCurrentChat: (chat: any) => set({ currentChat: chat }),
}));
