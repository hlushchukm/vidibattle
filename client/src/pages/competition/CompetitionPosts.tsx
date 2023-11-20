import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../services/crud";
import { toast } from "react-toastify";
import PostsContainer from "../home/components/container/PostsContainer";
import CompetitionPostsHeader from "./components/CompetitionPostsHeader";
import ShareModal from "../../components/ShareModal";
import BlinkingLoadingCircles from "../../components/BlinkingLoadingCircles";

export default function Competition() {
  const [posts, setPosts] = useState<any[]>([]);
  const [competitionId, setCompetitionId] = useState<string>();
  const lastDate = useRef<string | null>(null);
  const lastPostId = useRef<string | null>(null);
  const postsLoading = useRef(false);

  const pageSize = 10;
  const params = useParams();

  useEffect(() => {
    setCompetitionId(params.id);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (competitionId) getPosts(competitionId);
  }, [competitionId]);

  const getPosts = async (competitionId: string) => {
    postsLoading.current = true;
    get("post/feed", {
      pageSize,
      lastDate,
      lastPostId,
      competitionId,
    })
      .then((res) => {
        setPosts((s) => [...s, ...res.data]);
        lastDate.current = res.lastDate;
        lastPostId.current = res.lastPostId;
        postsLoading.current = false;
      })
      .catch((e) => {
        console.log(e);
        postsLoading.current = false;
        toast.error(e.response?.data?.message ?? "Error while fetching posts");
      });
  };

  const handleScroll = async () => {
    if (
      params.id &&
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 5 &&
      !postsLoading.current
    ) {
      postsLoading.current = true;
      await getPosts(params.id);
      postsLoading.current = false;
    }
  };

  return (
    <>
      <CompetitionPostsHeader />

      <div className="page-content min-vh-100">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <PostsContainer feed={posts} />
          </div>

          {postsLoading && <BlinkingLoadingCircles />}
        </div>
      </div>

      <ShareModal />
    </>
  );
}
