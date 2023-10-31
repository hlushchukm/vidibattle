import { useState, useRef } from "react";
import Post from "../ui/Post";
import CommentsContainer from "./CommentsContainer";

interface PostContainerProps {
  feed: any[];
}

export default function PostsContainer({ feed }: PostContainerProps) {
  const [visibleComment, setVisibleComment] = useState<string | null>();
  const componentRefs = useRef<{ [key: string]: HTMLElement }>({});

  const toggleComment = (id: string) => {
    if (visibleComment === id) {
      setVisibleComment(null);
      if (componentRefs.current[id])
        componentRefs.current[id].scrollIntoView({ behavior: "smooth" });
    } else {
      setVisibleComment(id);
    }
  };

  return (
    <>
      <div className="post-area">
        {feed.map((post, i) => (
          <div
            key={i}
            ref={(el) => (componentRefs.current[post._id] = el as HTMLElement)}
          >
            <Post post={post} toggleComment={toggleComment} />
            {visibleComment === post._id && <CommentsContainer />}
          </div>
        ))}
      </div>
    </>
  );
}
