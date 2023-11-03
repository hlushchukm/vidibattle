import { useState, useRef } from "react";
import Post from "../ui/Post";
import CommentsContainer from "./CommentsContainer";
import { usePostStore } from "../../../../store";
import { create } from "../../../../services/crud";
import NoPostsFound from "../../../../components/NoPostsFound";
import { isLoggedIn } from "../../../../services/auth";
import { useNavigate } from "react-router-dom";

interface PostContainerProps {
  feed: any[];
}

export default function PostsContainer({ feed }: PostContainerProps) {
  const [visibleComment, setVisibleComment] = useState<string | null>();
  const componentRefs = useRef<{ [key: string]: HTMLElement }>({});
  const togglePostLike = usePostStore((state) => state.togglePostLike);
  const navigate = useNavigate();

  const toggleComment = (id: string) => {
    if (visibleComment === id) {
      setVisibleComment(null);
      if (componentRefs.current[id])
        componentRefs.current[id].scrollIntoView({ behavior: "smooth" });
    } else {
      setVisibleComment(id);
    }
  };

  const likePost = (id: string, liked: boolean) => {
    if (!isLoggedIn()) return navigate("/auth");

    togglePostLike(id, liked);
    if (liked) {
      create("post/like/" + id, {}).catch((e) => {
        console.log(e);
        togglePostLike(id, false);
      });
    } else {
      create("post/unlike/" + id, {}).catch((e) => {
        console.log(e);
        togglePostLike(id, true);
      });
    }
  };

  if (feed.length === 0) {
    return <NoPostsFound showBtn={true} />;
  }

  return (
    <>
      <div className="post-area">
        {feed.map((post, i) => (
          <div
            key={i}
            ref={(el) => (componentRefs.current[post._id] = el as HTMLElement)}
          >
            <Post
              post={post}
              toggleComment={toggleComment}
              togglePostLike={likePost}
            />
            {visibleComment === post._id && <CommentsContainer post={post} />}
          </div>
        ))}
      </div>
    </>
  );
}
