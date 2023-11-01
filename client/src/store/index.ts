import { create } from "zustand";
import { getUserId } from "../services/auth";
import { CommentState, PostState } from "./interface";

export const useCurrentUserStore = create((set) => ({
  id: getUserId(),
  currentUser: null,
  setCurrentUser: (user: any) =>
    set(() => ({ currentUser: user, id: user._id })),
  setCurrentUserId: (id: any) => set(() => ({ id: id })),
}));

// export const useChatsStore = create((set) => ({
//   chats: [],
//   setChats: (chatsList: any[]) => set(() => ({ chats: chatsList })),
// }));

export const useCurrentChatStore = create((set) => ({
  currentChat: null,
  setCurrentChat: (chat: any) => set({ currentChat: chat }),
}));

export const usePostStore = create<PostState>((set) => ({
  posts: [],

  setPosts: (posts: PostState["posts"]) => set({ posts: [...posts] }),

  addToFeed: (posts: PostState["posts"]) =>
    set((state) => ({ posts: [...state.posts, ...posts] })),

  togglePostLike: (id: string, liked: boolean) =>
    set((state) => {
      const postsCopy = state.posts.map((p) => {
        if (p._id === id) {
          p.likes_count = liked ? p.likes_count + 1 : p.likes_count - 1;
          p.likes = liked ? [id] : [];
        }
        return p;
      });

      return { posts: postsCopy };
    }),

  clearPosts: () => set({ posts: [] }),
}));

export const useCommentsStore = create<CommentState>((set) => ({
  comments: [],

  setComments: (comments: CommentState["comments"]) =>
    set({ comments: [...comments] }),

  addToComments: (comments: CommentState["comments"]) =>
    set((state) => ({ comments: [...state.comments, ...comments] })),

  setReplies: (replies: CommentState["comments"], parent_id: string) =>
    set((state) => {
      const commentsCopy = state.comments.map((comment) => {
        console.log(comment.id, parent_id);
        if (comment._id === parent_id) {
          if (comment.comments && comment.comments.length > 0) {
            comment.comments.push(...replies);
          } else {
            comment.comments = [...replies];
          }
        }
        return comment;
      });

      return { comments: commentsCopy };
    }),

  clearComments: () => set({ comments: [] }),
}));
