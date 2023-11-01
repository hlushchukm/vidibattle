import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoading from "../../components/PageLoading";
import FollowersHeader from "./components/FollowersHeader";
import "./follower.style.css";
import NavLinks from "./components/container/NavLinks";
import UsersList from "./components/container/UsersList";

export default function Followers() {
  const [pageLoading, setPageLoading] = useState(true);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [currentTab, setCurrentTab] = useState<"following" | "followers">(
    "following"
  );
  const pagesContainerRef = useRef<HTMLElement>();
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);
  const [followingCount, setFollowingCount] = useState(5);
  const [followingList, setFollowingList] = useState([1, 2, 3, 4, 5]);
  const [followersCount, setFollowersCount] = useState(8);
  const [followersList, setFollowersList] = useState([1, 2, 3, 4, 5, 6, 7, 8]);

  useEffect(() => {
    setPageLoading(false);
    if (queryParams.get("following") === "true") {
      setCurrentTab("following");
    } else if (queryParams.get("followers") === "true") {
      setCurrentTab("followers");
    }
  }, []);

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
            followersCount={followersCount}
            followingCount={followingCount}
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
                    <UsersList listType={currentTab} users={followingList} />
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
                    <UsersList listType={currentTab} users={followersList} />
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
