import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../services/crud";
import { toast } from "react-toastify";
import PostsContainer from "../home/components/container/PostsContainer";
import CompetitionPostsHeader from "./components/CompetitionPostsHeader";
import ShareModal from "../../components/ShareModal";
import BlinkingLoadingCircles from "../../components/BlinkingLoadingCircles";
import CompetitionInfo from "./components/container/CompetitionInfo";
import PageLoading from "../../components/PageLoading";

export default function CompetitionPosts() {
  const [pageLoading, setPageLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [competitionInfo, setCompetitionInfo] = useState<any>({});
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
    if (competitionId) {
      getPosts(competitionId);
      getBasicInfo(competitionId);
    }
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

  const getBasicInfo = (id: string) => {
    get("competition/info/" + id)
      .then((res) => {
        setCompetitionInfo(res.data);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! Couldn't load competition info"
        );
        setPageLoading(false);
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

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <CompetitionPostsHeader />

      <div className="page-content min-vh-100">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <CompetitionInfo competition={competitionInfo} />

            <PostsContainer feed={posts} showAddBtn={false} />
          </div>

          {postsLoading && <BlinkingLoadingCircles />}
        </div>
      </div>

      <ShareModal />
    </>
  );
}
