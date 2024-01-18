export interface PostState {
  posts: any[];
  setPosts: (posts: PostState["posts"]) => void;
  addToFeed: (posts: PostState["posts"]) => void;
  togglePostLike: (id: string, liked: boolean) => void;
  incrementCommentsCount: (id: string) => void;
  decrementCommentsCount: (id: string) => void;
  clearPosts: () => void;
}

export interface CommentState {
  comments: any[];
  commentsHash: { [key: string]: true };
  setComments: (comments: CommentState["comments"]) => void;
  addToComments: (comments: CommentState["comments"]) => void;
  addNewComment: (comments: any) => void;
  setReplies: (replies: CommentState["comments"], parent_id: string) => void;
  toggleCommentLike: (
    id: string,
    comment_for: "post" | "comment",
    isLike: boolean,
    parentId?: string
  ) => void;
  clearComments: () => void;
}

export interface ShareState {
  post: any;
  setPostToShare: (post: any) => void;
}

export interface ReportState {
  post: any;
  setPostToReport: (post: any) => void;
}


export interface BgdImgState {
  url: string;
  setImage: (url: string) => void;
  
}