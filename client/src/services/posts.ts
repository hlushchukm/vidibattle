export const randomizePosts = (posts: any[]): any[] => {
  return posts.sort(() => (Math.random() > 0.5 ? 1 : -1));
};
