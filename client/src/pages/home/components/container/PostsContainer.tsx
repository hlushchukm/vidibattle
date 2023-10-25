import Post from "../ui/Post";

interface PostContainerProps {
  feed: any[];
}

export default function PostsContainer({ feed }: PostContainerProps) {
  return (
    <>
      <div className="post-area">
        {feed.map((post, i) => (
          <Post key={i} post={post} />
        ))}
      </div>
    </>
  );
}
