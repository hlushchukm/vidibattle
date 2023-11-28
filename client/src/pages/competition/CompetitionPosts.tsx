import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { create, get } from "../../services/crud";
import { toast } from "react-toastify";
import PostsContainer from "../home/components/container/PostsContainer";
import CompetitionPostsHeader from "./components/CompetitionPostsHeader";
import ShareModal from "../../components/ShareModal";
import BlinkingLoadingCircles from "../../components/BlinkingLoadingCircles";
import CompetitionInfo from "./components/container/CompetitionInfo";
import PageLoading from "../../components/PageLoading";
import { usePostStore } from "../../store";

export default function CompetitionPosts() {
  const [pageLoading, setPageLoading] = useState(true);
  const [competitionInfo, setCompetitionInfo] = useState<any>({});
  const [competitionId, setCompetitionId] = useState<string>();
  const [postsLoading, setPostsLoading] = useState(false);
  const lastDate = useRef<string | null>(null);
  const lastPostId = useRef<string | null>(null);
  const lastLikesCount = useRef<string | null>(null);
  const postsLoadingRef = useRef(true);
  const posts = usePostStore((state) => state.posts);
  const addToFeed = usePostStore((state) => state.addToFeed);
  const clearPosts = usePostStore((state) => state.clearPosts);
  const [joinLoading, setJoinLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);

  const pageSize = 10;
  const params = useParams();

  useEffect(() => {
    setCompetitionId(params.id);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearPosts();
    };
  }, []);

  useEffect(() => {
    if (competitionId) {
      getPosts(competitionId);
      getBasicInfo(competitionId);
    }
  }, [competitionId]);

  const getPosts = async (competitionId: string) => {
    setPostsLoading(true);
    return get("post/feed", {
      pageSize,
      lastDate: lastDate.current,
      lastPostId: lastPostId.current,
      lastLikesCount: lastLikesCount.current,
      competitionId,
    })
      .then((res) => {
        if (res.data.length === 0) {
          postsLoadingRef.current = false;
          window.removeEventListener("scroll", handleScroll);
        }
        addToFeed([...res.data]);
        lastDate.current = res.lastDate;
        lastPostId.current = res.lastPostId;
        lastLikesCount.current = res.lastLikesCount;
        setPostsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setPostsLoading(false);
        toast.error(e.response?.data?.message ?? "Error while fetching posts");
      });
  };

  const getBasicInfo = (id: string) => {
    setPageLoading(true);
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

  // TODO: show confirmation dialogue

  const leaveCompetition = () => {
    setLeaveLoading(true);
    create("competition/" + competitionId + "/leave", {})
      .then((res) => {
        toast.success(res.message ?? "Competition Left");
        setCompetitionInfo((i: any) => ({ ...i, competingUser: res.data }));
        setLeaveLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e.response?.data?.message ?? "Error! couldn't leave competition"
        );
        setLeaveLoading(false);
      });
  };

  const joinCompetition = () => {
    setJoinLoading(true);
    create("competition/" + competitionId + "/join", {})
      .then((res) => {
        toast.success(res.message ?? "Competition joined");
        setCompetitionInfo((i: any) => ({ ...i, competingUser: res.data }));
        setJoinLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e.response?.data?.message ?? "Error! couldn't join competition"
        );
        setJoinLoading(false);
      });
  };

  const payForCompetition = () => {
    setPayLoading(false);
  };

  const handleScroll = async () => {
    if (
      params.id &&
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 5 &&
      !postsLoadingRef.current
    ) {
      postsLoadingRef.current = true;
      await getPosts(params.id);
      postsLoadingRef.current = false;
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
            <CompetitionInfo
              competition={competitionInfo}
              joinCompetition={joinCompetition}
              payForCompetition={payForCompetition}
              leaveCompetition={leaveCompetition}
              payLoading={payLoading}
              joinLoading={joinLoading}
              leaveLoading={leaveLoading}
            />

            <div className="my-4 bg-white">
              <div className="divider border-secondary divider-dashed"></div>
              <h3 className="text-center">Posts</h3>
              <div className="divider border-secondary divider-dashed"></div>
            </div>

            <PostsContainer feed={posts} showAddBtn={false} />

            {postsLoading && <BlinkingLoadingCircles />}
          </div>
        </div>
      </div>

      <ShareModal />
    </>
  );
}
