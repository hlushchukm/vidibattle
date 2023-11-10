import { env } from "../env";

export const defaultThumbnail = "/assets/images/default-thumbnail.png";
export const defaultPost = "/assets/images/default-post.png";
export const defaultUser = "/assets/images/default-user.png";

export const handleProfileImageError = (event: any) => {
  event.target.src = defaultUser;
};

export const handlePostImageError = (event: any) => {
  event.target.src = defaultPost;
};

export const formatResourceURL = (filename: string) => {
  return `${env.VITE_API_URL}/media/` + filename;
};
