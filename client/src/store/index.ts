import { create } from "zustand";
import { getUserId } from "../services/auth";
import {
  BgdImgState,
  CommentState,
  PostState,
  ReportState,
  ShareState,
} from "./interface";
import { randomizePosts } from "../services/posts";

export const useCurrentUserStore = create((set) => ({
  id: getUserId(),
  currentUser: null,
  setCurrentUser: (user: any) =>
    set(() => ({ currentUser: user, id: user._id })),
  setCurrentUserId: (id: any) => set(() => ({ id: id })),
}));

export const useBgdImgStore = create<BgdImgState>((set) => ({
  url: "",
  setImage: (url: string) => set({ url }),
}));

// export const useChatsStore = create((set) => ({
//   chats: [],
//   setChats: (chatsList: any[]) => set(() => ({ chats: chatsList })),
// }));

export const useChatReceiverStore = create((set) => ({
  receiver: null,
  setReceiver: (user: any) => set({ receiver: user }),
}));

export const useShareStore = create<ShareState>((set) => ({
  post: {},
  setPostToShare: (post: any) => set({ post }),
}));

export const useReportStore = create<ReportState>((set) => ({
  post: {},
  setPostToReport: (post: any) => set({ post }),
}));

export const usePostStore = create<PostState>((set) => ({
  posts: [],

  setPosts: (posts: PostState["posts"]) => set({ posts: [...posts] }),

  addToFeed: (posts: PostState["posts"]) =>
    set((state) => {
      const randomized = randomizePosts(posts);
      return { posts: [...state.posts, ...randomized] };
    }),

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

  incrementCommentsCount: (id: string) =>
    set((state) => {
      const postsCopy = state.posts.map((post) => {
        if (post._id === id) {
          if (post.comments_count) post.comments_count++;
          else post.comments_count = 1;
        }
        return post;
      });

      return { posts: postsCopy };
    }),

  decrementCommentsCount: (id: string) =>
    set((state) => {
      const postsCopy = state.posts.map((post) => {
        if (post._id === id) {
          if (post.comments_count) post.comments_count--;
          else post.comments_count = 0;
        }
        return post;
      });

      return { posts: postsCopy };
    }),

  clearPosts: () => set({ posts: [] }),
}));

export const useCommentsStore = create<CommentState>((set) => ({
  comments: [],
  commentsHash: {},

  setComments: (newComments: CommentState["comments"]) =>
    set((state) => {
      const { comments, commentsHash } = buildCommentsHash(
        newComments,
        state.comments,
        state.commentsHash
      );
      return { comments, commentsHash };
    }),

  addToComments: (newComments: CommentState["comments"]) =>
    set((state) => {
      const { comments, commentsHash } = buildCommentsHash(
        newComments,
        state.comments,
        state.commentsHash
      );
      return { comments, commentsHash };
    }),

  addNewComment: (comment: any) =>
    set((state) => {
      if (!state.commentsHash[comment._id]) {
        return {
          comments: [comment, ...state.comments],
          commentsHash: { ...state.commentsHash, [comment._id]: true },
        };
      } else {
        return { comments: state.comments, commentsHash: state.commentsHash };
      }
    }),

  setReplies: (replies: CommentState["comments"], parent_id: string) =>
    set((state) => {
      const { uniqueComments, updatedHash } = getUniqueComments(
        replies,
        state.commentsHash
      );
      const commentsCopy = state.comments.map((comment) => {
        if (comment._id === parent_id) {
          if (comment.comments && comment.comments.length > 0) {
            comment.comments.push(...uniqueComments);
          } else {
            comment.comments = [...uniqueComments];
          }
          comment.has_reply = true;
        }
        return comment;
      });

      return { comments: commentsCopy, commentsHash: updatedHash };
    }),

  toggleCommentLike: (
    id: string,
    comment_for: "post" | "comment",
    isLike?: boolean,
    parentId?: string
  ) =>
    set((state) => {
      let updatedComments: any = [];
      if (comment_for === "post") {
        updatedComments = state.comments.map((comment) => {
          if (comment._id === id) {
            comment.is_liked =
              isLike !== undefined ? isLike : !comment.is_liked;

            comment.likes_count = comment.is_liked
              ? comment.likes_count + 1
              : comment.likes_count - 1;
          }
          return comment;
        });
      } else {
        updatedComments = state.comments.map((comment) => {
          if (comment._id === parentId) {
            comment.comments = comment.comments.map((reply: any) => {
              if (reply._id === id) {
                reply.is_liked =
                  isLike !== undefined ? isLike : !reply.is_liked;

                reply.likes_count = reply.is_liked
                  ? reply.likes_count + 1
                  : reply.likes_count - 1;
              }
              return reply;
            });
          }
          return comment;
        });
      }

      return { comments: updatedComments };
    }),

  clearComments: () => set({ comments: [], commentsHash: {} }),
}));

// maintain a commenthash so that comments don't get duplicated
function buildCommentsHash(
  comments: CommentState["comments"],
  oldComments: CommentState["comments"],
  oldHash: CommentState["commentsHash"]
): {
  comments: CommentState["comments"];
  commentsHash: CommentState["commentsHash"];
} {
  let hash: CommentState["commentsHash"] = { ...oldHash };
  let newComments: CommentState["comments"] = [...oldComments];

  comments.map((comment) => {
    if (!hash[comment._id]) {
      hash[comment._id] = true;
      newComments.push(comment);
    }
  });

  return { comments: newComments, commentsHash: hash };
}

function getUniqueComments(
  newComments: CommentState["comments"],
  oldCommentsHash: CommentState["commentsHash"]
): {
  uniqueComments: CommentState["comments"];
  updatedHash: CommentState["commentsHash"];
} {
  const updatedHash: CommentState["commentsHash"] = { ...oldCommentsHash };
  const uniqueComments: CommentState["comments"] = [];

  newComments.map((c) => {
    if (!updatedHash[c._id]) {
      updatedHash[c._id] = true;
      uniqueComments.push(c);
    }
  });

  return { uniqueComments, updatedHash };
}
