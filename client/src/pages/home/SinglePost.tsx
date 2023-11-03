import { useEffect, useState } from "react";
import SinglePostHeader from "./components/SinglePostHeader";
import { useParams } from "react-router-dom";
import PageLoading from "../../components/PageLoading";
import { get } from "../../services/crud";
import PostsContainer from "./components/container/PostsContainer";
import { usePostStore } from "../../store";
import ShareModal from "../../components/ShareModal";

export default function SinglePost() {
  const posts = usePostStore((state) => state.posts);
  const addToFeed = usePostStore((state) => state.addToFeed);
  const clearPosts = usePostStore((state) => state.clearPosts);
  const [pageLoading, setPageLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    fetchPost();

    return () => {
      clearPosts();
    };
  }, []);

  const fetchPost = () => {
    get("post/" + params.id)
      .then((res) => {
        addToFeed([res.data]);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setPageLoading(false);
      });
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <SinglePostHeader />

      <div className="page-content min-vh-100">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <PostsContainer feed={posts} />
          </div>
        </div>
      </div>

      <ShareModal />
    </>
  );
}
