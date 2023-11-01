import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoading from "../../components/PageLoading";
import FollowersHeader from "./components/FollowersHeader";
import "./follower.style.css";

export default function Followers() {
  const [pageLoading, setPageLoading] = useState(true);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [currentTab, setCurrentTab] = useState<"following" | "followers">(
    "following"
  );
  const followersTabRef = useRef<HTMLLIElement>();
  const followingTabRef = useRef<HTMLLIElement>();
  const pagesContainerRef = useRef<HTMLElement>();
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(0);

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
        setCurrentTab("following")
    } else if (swipeDistance < -20) {
        // swiped left
        setCurrentTab("followers")
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
          <ul className="links-container">
            <li
              ref={(el) => (followingTabRef.current = el as HTMLLIElement)}
              onClick={() => onNavBarClick("following")}
              className="nav-link position-relative"
            >
              <span>85 Following</span>
              <div
                className={`tab-indicator bg-primary position-absolute w-100 bottom-0 ${
                  currentTab !== "following" ? "width-none" : "slide-bar-left"
                }`}
                style={{ height: "3px" }}
              ></div>
            </li>
            <li
              ref={(el) => (followersTabRef.current = el as HTMLLIElement)}
              onClick={() => onNavBarClick("followers")}
              className="nav-link position-relative"
            >
              <span>245 Followers</span>
              <div
                className={`tab-indicator bg-primary position-absolute w-100 bottom-0  ${
                  currentTab !== "followers" ? "width-none" : "slide-bar-right"
                }`}
                style={{ height: "3px" }}
              ></div>
            </li>
          </ul>
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
                    <div className="swiper-slide">
                      <div className="contant-section style-2">
                        <div className="title-bar m-0">
                          <h6 className="mb-0">Friends - following</h6>
                          <div className="dz-tab style-2">
                            <ul
                              className="nav nav-tabs"
                              id="myTab2"
                              role="tablist"
                            >
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link"
                                  id="grid2-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#grid2"
                                  type="button"
                                  role="tab"
                                  aria-controls="grid2"
                                  aria-selected="true"
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M10 3H3V10H10V3Z"
                                      stroke="var(--primary)"
                                      strokeWidth="2"
                                      strokeOpacity="0.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M21 3H14V10H21V3Z"
                                      stroke="var(--primary)"
                                      strokeWidth="2"
                                      strokeOpacity="0.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M21 14H14V21H21V14Z"
                                      stroke="var(--primary)"
                                      strokeWidth="2"
                                      strokeOpacity="0.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M10 14H3V21H10V14Z"
                                      stroke="var(--primary)"
                                      strokeWidth="2"
                                      strokeOpacity="0.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </li>
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link active"
                                  id="list2-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#list2"
                                  type="button"
                                  role="tab"
                                  aria-controls="list2"
                                  aria-selected="true"
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M8 6H21"
                                      stroke="var(--primary)"
                                      strokeOpacity="0.5"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M8 12H21"
                                      stroke="var(--primary)"
                                      strokeOpacity="0.5"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M8 18H21"
                                      stroke="var(--primary)"
                                      strokeOpacity="0.5"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M3 6H3.01"
                                      stroke="var(--primary)"
                                      strokeOpacity="0.5"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M3 12H3.01"
                                      stroke="var(--primary)"
                                      strokeOpacity="0.5"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M3 18H3.01"
                                      stroke="var(--primary)"
                                      strokeOpacity="0.5"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="tab-content" id="myTabContent4">
                          <div
                            className="tab-pane fade"
                            id="grid2"
                            role="tabpanel"
                            aria-labelledby="grid2-tab"
                          >
                            <div className="dz-user-list row g-2">
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic1.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Andy Lee
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic2.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Brian Harahap
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic3.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Christian Hang
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic4.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Chloe Mc. Jenskin
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic5.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Chloe Mc. Jenskin
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic6.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    David Bekam
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic7.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Dons John
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic8.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Eric Leew
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic6.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Richard Sigh
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic5.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Christian Hang
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic2.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Andy Lee
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic1.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Simmilian
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade show active"
                            id="list2"
                            role="tabpanel"
                            aria-labelledby="list2-tab"
                          >
                            <div className="dz-user-list row g-3">
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic1.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Andy Lee</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic2.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Brian Harahap</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic3.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Christian Hang</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic4.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">
                                      Chloe Mc.Jenskin
                                    </span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic6.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">David Bekam</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic5.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Dons John</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic6.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Eric Leew</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic7.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Richard Sigh</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic8.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Andy Lee</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic5.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Brian Harahapc</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic4.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">David Bekam</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic3.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Jackson</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic2.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Olivis kmoris</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                    <div className="swiper-slide">
                      <div className="contant-section style-2">
                        <div className="title-bar m-0">
                          <h6 className="mb-0">Friends - followers</h6>
                          <div className="dz-tab style-2">
                            <ul
                              className="nav nav-tabs"
                              id="myTab3"
                              role="tablist"
                            >
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link"
                                  id="grid-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#grid"
                                  type="button"
                                  role="tab"
                                  aria-controls="grid"
                                  aria-selected="true"
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M10 3H3V10H10V3Z"
                                      stroke="var(--primary)"
                                      strokeWidth="2"
                                      strokeOpacity="0.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M21 3H14V10H21V3Z"
                                      stroke="var(--primary)"
                                      strokeWidth="2"
                                      strokeOpacity="0.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M21 14H14V21H21V14Z"
                                      stroke="var(--primary)"
                                      strokeWidth="2"
                                      strokeOpacity="0.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M10 14H3V21H10V14Z"
                                      stroke="var(--primary)"
                                      strokeWidth="2"
                                      strokeOpacity="0.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </li>
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link active"
                                  id="list-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#list"
                                  type="button"
                                  role="tab"
                                  aria-controls="list"
                                  aria-selected="true"
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M8 6H21"
                                      stroke="var(--primary)"
                                      strokeOpacity="0.5"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M8 12H21"
                                      stroke="var(--primary)"
                                      strokeOpacity="0.5"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M8 18H21"
                                      stroke="var(--primary)"
                                      strokeOpacity="0.5"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M3 6H3.01"
                                      stroke="var(--primary)"
                                      strokeOpacity="0.5"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M3 12H3.01"
                                      stroke="var(--primary)"
                                      strokeOpacity="0.5"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M3 18H3.01"
                                      stroke="var(--primary)"
                                      strokeOpacity="0.5"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="tab-content" id="myTab3Content">
                          <div
                            className="tab-pane fade"
                            id="grid"
                            role="tabpanel"
                            aria-labelledby="grid-tab"
                          >
                            <div className="dz-user-list row g-2">
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic1.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Andy Lee
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic2.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Brian Harahap
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic3.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Christian Hang
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic4.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Chloe Mc. Jenskin
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic5.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Chloe Mc. Jenskin
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic6.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    David Bekam
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic7.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Dons John
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic8.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Eric Leew
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic6.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Richard Sigh
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic5.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Christian Hang
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic2.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Andy Lee
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="user-grid">
                                  <a
                                    href="user-profile.html"
                                    className="media status media-60"
                                  >
                                    <img
                                      src="/assets/images/stories/small/pic1.jpg"
                                      alt="/"
                                    />
                                    <div className="active-point"></div>
                                  </a>
                                  <a href="user-profile.html" className="name">
                                    Simmilian
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade show active"
                            id="list"
                            role="tabpanel"
                            aria-labelledby="list-tab"
                          >
                            <div className="dz-user-list row g-3">
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic1.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Andy Lee</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic2.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Brian Harahap</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic3.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Christian Hang</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic4.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">
                                      Chloe Mc.Jenskin
                                    </span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic6.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">David Bekam</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic5.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Dons John</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic6.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Eric Leew</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic7.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Richard Sigh</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic8.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Andy Lee</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic5.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Brian Harahapc</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic4.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">David Bekam</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic3.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Jackson</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="user-grid style-2">
                                  <a
                                    href="user-profile.html"
                                    className="d-flex align-items-center"
                                  >
                                    <div className="media status media-50">
                                      <img
                                        src="/assets/images/stories/small/pic2.jpg"
                                        alt="/"
                                      />
                                      <div className="active-point"></div>
                                    </div>
                                    <span className="name">Olivis kmoris</span>
                                  </a>
                                  <a
                                    href="javascript:void(0);"
                                    className="follow-btn"
                                  >
                                    UNFOLLOW
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
