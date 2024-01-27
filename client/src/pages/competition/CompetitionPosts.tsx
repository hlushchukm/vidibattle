import { useEffect, useRef, useState } from "react";
import PostsContainer from "../home/components/container/PostsContainer";
import CompetitionPostsHeader from "./components/CompetitionPostsHeader";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { usePostStore } from "../../store";
import { get } from "../../services/crud";
import BlinkingLoadingCircles from "../../components/BlinkingLoadingCircles";
import PageLoading from "../../components/PageLoading";
import ShareModal from "../../components/ShareModal";

export default function CompetitionPosts() {
  const [pageLoading, setPageLoading] = useState(true);
  const [competitionInfo, setCompetitionInfo] = useState<any>({});
  const [postsLoading, setPostsLoading] = useState(false);
  const lastDate = useRef<string | null>(null);
  const lastPostId = useRef<string | null>(null);
  const lastLikesCount = useRef<string | null>(null);
  const postsLoadingRef = useRef(true);
  const posts = usePostStore((state) => state.posts);
  const addToFeed = usePostStore((state) => state.addToFeed);
  const clearPosts = usePostStore((state) => state.clearPosts);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [currentRound, setCurrentRound] = useState<any>();

  const pageSize = 10;
  const params = useParams();

  useEffect(() => {
    getBasicInfo(params.name ?? "");

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearPosts();
    };
  }, []);

  useEffect(() => {
    if (params.number !== undefined && competitionInfo) {
      const cr = competitionInfo.rounds?.find(
        (round: any) =>
          parseInt(round?.number) === parseInt(params.number ?? "")
      );

      setCurrentRound(cr);
    }
  }, [competitionInfo]);

  const getBasicInfo = (nameInfo: string) => {
    setPageLoading(true);
    const query: any = {};
    if (queryParams.get("start_date"))
      query.start_date = queryParams.get("start_date");

    if (queryParams.get("end_date"))
      query.end_date = queryParams.get("end_date");

    get("competition/info/" + nameInfo, query)
      .then((res) => {
        setCompetitionInfo(res.data);
        getPosts(res.data._id, true);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! Couldn't load competition info"
        );
        setPageLoading(false);
      });
  };

  const getPosts = async (
    competitionId: string,
    first_time: boolean = false
  ) => {
    setPostsLoading(true);
    let payload: any = {
      pageSize,
      competitionId,
    };

    if (params.number !== undefined) {
      payload.round = params.number;
    }

    if (!first_time) {
      payload = {
        ...payload,
        lastDate: lastDate.current,
        lastPostId: lastPostId.current,
        lastLikesCount: lastLikesCount.current,
      };
    }
    return get("post/feed", payload)
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
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response?.data?.message ?? "Error while fetching posts");
        setPostsLoading(false);
        setPageLoading(false);
      });
  };

  const handleScroll = async () => {
    if (
      competitionInfo &&
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 5 &&
      !postsLoadingRef.current
    ) {
      postsLoadingRef.current = true;
      await getPosts(competitionInfo._id, currentRound?.number ?? 1);
      postsLoadingRef.current = false;
    }
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <>
      {/* TODO: show round name if it is a particular round */}
      <CompetitionPostsHeader
        text={
          params.number
            ? currentRound?.name ?? "Round " + params.number
            : "Posts"
        }
      />

      <div className="page-content min-vh-100">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <PostsContainer feed={posts} showAddBtn={false} />

            {postsLoading && <BlinkingLoadingCircles />}

            <ShareModal />
          </div>
        </div>
      </div>
    </>
  );
}
