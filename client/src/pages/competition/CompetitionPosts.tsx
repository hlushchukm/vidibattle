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
import { getDate } from "../../services/timeAndDate";

export default function CompetitionPosts() {
  const [pageLoading, setPageLoading] = useState(false);
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
  const [currentRound, setCurrentRound] = useState<any>();
  const [rounds, setRounds] = useState<any>([]);

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
      getPosts(competitionId, 1);
      getBasicInfo(competitionId);
    }
  }, [competitionId]);

  const getPosts = async (competitionId: string, round: number = 1) => {
    setPostsLoading(true);
    return get("post/feed", {
      pageSize,
      lastDate: lastDate.current,
      lastPostId: lastPostId.current,
      lastLikesCount: lastLikesCount.current,
      competitionId,
      round,
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
        setRounds(res.data?.rounds ?? []);
        setCurrentRound(res.data?.rounds?.[0] ?? null);
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
      await getPosts(params.id, currentRound?.number ?? 1);
      postsLoadingRef.current = false;
    }
  };

  const onNextRoundClicked = () => {
    addToFeed([]);
    setPostsLoading(true);
    getPosts(competitionId ?? "", currentRound.number + 1);
    setCurrentRound(rounds[currentRound.number]);
  };

  const onPreviousRoundClicked = () => {
    addToFeed([]);
    setPostsLoading(true);
    getPosts(competitionId ?? "", currentRound.number - 1);
    setCurrentRound(rounds[currentRound.number - 2]);
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
              <div className="d-flex w-100 px-2 align-items-center">
                {currentRound?.number > 1 && (
                  <button
                    disabled={postsLoading}
                    onClick={onPreviousRoundClicked}
                    className="btn btn-primary light rounded-circle p-0"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="fa fa-angle-left"></i>
                  </button>
                )}
                <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                  <h3 className="text-center py-0 mb-0">
                    Round {currentRound?.number}
                  </h3>
                  <div className="d-flex py-1">
                    <span className="small text-center">
                      Minimum number of likes needed:&nbsp;
                      {currentRound?.min_likes ?? 0}
                    </span>
                  </div>
                  <div className="d-flex flex-column flex-md-row gap-1 gap-md-2">
                    {currentRound?.start_date && (
                      <span className="small text-center">
                        Start Date: {getDate(currentRound.start_date)}
                      </span>
                    )}
                    {currentRound?.end_date && (
                      <span className="small text-center">
                        End Date: {getDate(currentRound.end_date)}
                      </span>
                    )}
                  </div>
                </div>
                {currentRound?.number < competitionInfo?.rounds_count && (
                  <button
                    disabled={postsLoading}
                    onClick={onNextRoundClicked}
                    className="btn btn-primary light rounded-circle p-0"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="fa fa-angle-right"></i>
                  </button>
                )}
              </div>
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
