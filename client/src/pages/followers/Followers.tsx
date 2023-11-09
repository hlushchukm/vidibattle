import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import PageLoading from "../../components/PageLoading";
import FollowersHeader from "./components/FollowersHeader";
import "./follower.style.css";
import NavLinks from "./components/container/NavLinks";
import UsersList from "./components/container/UsersList";
import { getUserId } from "../../services/auth";
import { create, get } from "../../services/crud";
import UserNotFound from "../../components/UserNotFound";
import { getName } from "../../services/utils";
import { toast } from "react-toastify";

export default function Followers() {
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userId, setUserId] = useState("");
  const params = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [currentTab, setCurrentTab] = useState<"following" | "followers">(
    "following"
  );
  const pagesContainerRef = useRef<HTMLElement>();
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [data, setApiData] = useState<any>(null);
  const [userNotFound, setUserNotFound] = useState(false);
  const [followingHash, setFollowingHash] = useState<{
    [key: string]: boolean;
  }>({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [noMoreFollowers, setNoMoreFollowers] = useState(false);
  const [noMoreFollowing, setNoMoreFollowing] = useState(false);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followingsLoading, setFollowingsLoading] = useState(false);

  useEffect(() => {
    setLoggedIn(getUserId() !== null && getUserId() !== null);

    if (params.id && params.id !== getUserId()) {
      setIsOwnProfile(false);
      setUserId(params.id);
    } else {
      setIsOwnProfile(true);
      setUserId(getUserId() ?? "");
    }

    if (queryParams.get("following") === "true") {
      setCurrentTab("following");
    } else if (queryParams.get("followers") === "true") {
      setCurrentTab("followers");
    }
  }, []);

  useEffect(() => {
    if (userId) fetchFollowersAndFollowing(userId);
  }, [userId]);

  useEffect(() => {
    if (data && data.following) {
      const hash: { [key: string]: boolean } = {};
      data.following.map((f: any) => {
        if (!hash[f._id]) {
          hash[f._id] = f.unfollowed !== undefined ? !f.unfollowed : true;
        }
      });

      setFollowingHash(hash);
    }
  }, [data?.following]);

  const fetchFollowersAndFollowing = (id: string) => {
    get("user/followers-following/" + id, { page: 1, limit })
      .then((res) => {
        setApiData(res.data);
        setLimit(parseInt(res.limit));
        setPage(parseInt(res.page));

        if (res.data?.followers?.length < limit) {
          setNoMoreFollowers(true);
        }

        if (res.data?.following?.length < limit) {
          setNoMoreFollowing(true);
        }

        setPageLoading(false);
      })
      .catch((e) => {
        setPageLoading(false);
        console.log(e);
        if (e?.response?.status) {
          setUserNotFound(true);
        }
      });
  };

  const loadFollowers = () => {
    setFollowersLoading(true);
    get("user/followers/" + userId, { page: page + 1, limit })
      .then((res) => {
        if (res.data.length < limit) {
          setNoMoreFollowers(true);
        }
        addToFollowersList([...res.data]);
        setLimit(parseInt(res.limit));
        setPage(parseInt(res.page));
        setFollowersLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't fetch followers list"
        );
        setFollowersLoading(false);
      });
  };

  const loadFollowing = () => {
    setFollowingsLoading(true);
    get("user/following/" + userId, { page: page + 1, limit })
      .then((res) => {
        if (res.data.length < limit) {
          setNoMoreFollowing(true);
        }
        addToFollowingsList([...res.data]);
        setLimit(parseInt(res.limit));
        setPage(parseInt(res.page));
        setFollowingsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(
          e?.response?.data?.message ?? "Error! couldn't fetch followings list"
        );
        setFollowingsLoading(false);
      });
  };

  const addToFollowersList = (newFollowers: any[]) => {
    const datacopy = data;
    datacopy.followers = [...datacopy.followers, ...newFollowers];
    setApiData(datacopy);
  };

  const addToFollowingsList = (newFollowings: any[]) => {
    const datacopy = data;
    datacopy.following = [...datacopy.following, ...newFollowings];
    setApiData(datacopy);
  };

  const onNavBarClick = (slideTo: "followers" | "following") => {
    setCurrentTab(slideTo);
  };

  const handleTouchStart = (event: any) => {
    setStartX(event.touches[0].clientX);
  };

  const handleTouchMove = (event: any) => {
    setEndX(event.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const swipeDistance = endX - startX;

    if (endX == 0) {
      return;
    }

    if (swipeDistance > 20) {
      // swiped right
      setCurrentTab("following");
    } else if (swipeDistance < -20) {
      // swiped left
      setCurrentTab("followers");
    }

    setStartX(0);
    setEndX(0);
  };

  const toggleFollow = (
    id: string,
    action: "follow" | "unfollow",
    userData?: boolean
  ) => {
    const originalCopy = JSON.stringify(data);
    const apiDataCopy = { ...data };

    let found = false;
    apiDataCopy.following = apiDataCopy?.following?.map((followed: any) => {
      if (followed._id === id) {
        followed.unfollowed = !followed.unfollowed ?? true;
        found = true;
      }
      return followed;
    });

    if (!found && "follow" && userData) {
      apiDataCopy.following = [userData, ...apiDataCopy.following];
    }

    apiDataCopy.following_count =
      action === "follow"
        ? apiDataCopy.following_count + 1
        : apiDataCopy.following_count - 1;

    setApiData({ ...apiDataCopy });

    create("user/" + action + "/" + id, {}).catch((e) => {
      console.log(e);
      toast.error("Error! action failed");
      setApiData(JSON.parse(originalCopy));
    });
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  if (userNotFound) {
    return (
      <>
        <FollowersHeader />
        <UserNotFound />
      </>
    );
  }

  return (
    <>
      <FollowersHeader name={getName(data)} />

      <div className="page-content">
        <nav id="main-navigation">
          <NavLinks
            currentTab={currentTab}
            onNavBarClick={onNavBarClick}
            followersCount={data.followers_count}
            followingCount={data.following_count}
          />
        </nav>

        <div className="swiper-scrollbar"></div>

        <div className="container profile-area pt-0">
          <article id="pages-container">
            <article
              ref={(el) => (pagesContainerRef.current = el as HTMLElement)}
              id="pages-container-inner"
            >
              <div className="swiper-wrappers">
                <div
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className={`slide-container slide-right ${
                    currentTab === "following" ? "visible" : ""
                  }`}
                >
                  {currentTab === "following" && (
                    <UsersList
                      isLoggedIn={isLoggedIn}
                      isOwnProfile={isOwnProfile}
                      listType={currentTab}
                      users={data.following}
                      toggleFollow={toggleFollow}
                      followingHash={followingHash}
                      showMoreBtn={!noMoreFollowing}
                      loading={followingsLoading}
                      showMoreClicked={loadFollowing}
                    />
                  )}
                </div>
                <div
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className={`slide-container slide-left ${
                    currentTab === "followers" ? "visible" : ""
                  }`}
                >
                  {currentTab === "followers" && (
                    <UsersList
                      isLoggedIn={isLoggedIn}
                      isOwnProfile={isOwnProfile}
                      listType={currentTab}
                      users={data.followers}
                      toggleFollow={toggleFollow}
                      followingHash={followingHash}
                      showMoreBtn={!noMoreFollowers}
                      loading={followersLoading}
                      showMoreClicked={loadFollowers}
                    />
                  )}
                </div>
              </div>
            </article>
          </article>
        </div>
      </div>
    </>
  );
}
