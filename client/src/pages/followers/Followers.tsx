import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import PageLoading from "../../components/PageLoading";
import FollowersHeader from "./components/FollowersHeader";
import "./follower.style.css";
import NavLinks from "./components/container/NavLinks";
import UsersList from "./components/container/UsersList";
import { getUserId } from "../../services/auth";
import { create, get } from "../../services/crud";

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

  const fetchFollowersAndFollowing = (id: string) => {
    get("user/followers-following/" + id)
      .then((res) => {
        setApiData(res.data);
        setPageLoading(false);
        console.log(res);
      })
      .catch((e) => {
        setPageLoading(false);
        console.log(e);
      });
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

  const toggleFollow = (id: string, action: "follow" | "unfollow") => {
    const originalCopy = JSON.stringify(data);
    const apiDataCopy = { ...data };

    apiDataCopy.following = apiDataCopy?.following?.map((followed: any) => {
      if (followed._id === id) {
        followed.unfollowed = !followed.unfollowed;
      }
      return followed;
    });
    apiDataCopy.following_count =
      action === "follow"
        ? apiDataCopy.following_count + 1
        : apiDataCopy.following_count - 1;

    setApiData({ ...apiDataCopy });

    create("user/" + action + "/" + id, {})
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
        setApiData(JSON.parse(originalCopy));
      });
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <FollowersHeader />

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
