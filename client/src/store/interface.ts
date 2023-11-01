export interface PostState {
  posts: any[];
  setPosts: (posts: PostState["posts"]) => void;
  addToFeed: (posts: PostState["posts"]) => void;
  togglePostLike: (id: string, liked: boolean) => void;
  clearPosts: () => void;
}
