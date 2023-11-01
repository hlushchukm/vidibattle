import TopNavBarWrapper from "../../components/TopNavBarWrapper";

export default function Profile() {
  return (
    <>
      <TopNavBarWrapper>
        <div className="left-content">
          <a href="javascript:void(0);" className="back-btn">
            <i className="fa-solid fa-arrow-left"></i>
          </a>
          <h4 className="title mb-0">User Profile</h4>
        </div>
        <div className="mid-content"></div>
        <div className="right-content"></div>
      </TopNavBarWrapper>

      {/* Page Content */}
      <div className="page-content">
        <div className="container profile-area">
          <div className="profile">
            {/* Profile icon for small screens */}
            <div className="d-xs-block d-sm-none mb-4">
              <div
                className="upload-box"
                style={{
                  width: "96px",
                  height: "96px",
                  borderRadius: "20px",
                  background:
                    "linear-gradient(180deg, #FE9063 0%, #704FFE 100%)",
                  padding: "2px",
                  position: "relative",
                }}
              >
                <img
                  style={{
                    width: "80px",
                    minWidth: "80px",
                    height: "80px",
                    boxSizing: "content-box",
                    borderRadius: "18px",
                    border: "6px solid #FEF3ED",
                  }}
                  src="/assets/images/stories/pic2.png"
                  alt="/"
                />
                <a
                  href="edit-profile.html"
                  className="upload-btn"
                  style={{
                    position: "absolute",
                    bottom: "-5px",
                    left: "-5px",
                    width: "35px",
                    height: "35px",
                    backgroundColor: "var(--primary)",
                    borderRadius: "var(--border-radius-base)",
                    textAlign: "center",
                    lineHeight: "35px",
                    boxShadow: "0px 9px 10px 0px rgba(254, 144, 99, 0.35)",
                    color: "#fff",
                  }}
                >
                  <i className="fa-solid fa-pencil"></i>
                </a>
              </div>
            </div>

            <div className="main-profile">
              <div className="left-content">
                <h5 className="mt-1">Brian Harahap</h5>
                <div className="info pe-sm-5 text-justify">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do sum sit ematons ectetur adipiscing elit, sed do sum sit
                    emat 😎.
                  </p>
                </div>
              </div>
              {/* Profile icon for large screens */}
              <div className="right-content d-none d-sm-block">
                <div className="upload-box">
                  <img src="/assets/images/stories/pic2.png" alt="/" />
                  <a href="edit-profile.html" className="upload-btn">
                    <i className="fa-solid fa-pencil"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Following and message button */}
            <ul className="list-button">
              <li>
                {/* TODO: change to follow/unfollow button */}
                <a href="javascript:void(0);">Following</a>
              </li>
              <li>
                <a href="messages-detail.html">Message</a>
              </li>
              <li>
                <a href="javascript:void(0);">
                  <i className="fa fa-ban" aria-hidden="true"></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="contant-section">
            <div className="social-bar">
              <ul>
                <li className="active">
                  <a href="javascript:void(0);">
                    <h4>52</h4>
                    <span>Post</span>
                  </a>
                </li>
                <li>
                  <a href="social-friends.html">
                    <h4>250</h4>
                    <span>Following</span>
                  </a>
                </li>
                <li>
                  <a href="social-friends.html">
                    <h4>4.5k</h4>
                    <span>Followers</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="title-bar my-2">
              <h6 className="mb-0">My Posts</h6>
              <div className="dz-tab style-2">
                <ul className="nav nav-tabs" id="myTab3" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="home-tab3"
                      data-bs-toggle="tab"
                      data-bs-target="#home-tab-pane3"
                      type="button"
                      role="tab"
                      aria-controls="home-tab-pane"
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
                      className="nav-link"
                      id="profile-tab3"
                      data-bs-toggle="tab"
                      data-bs-target="#profile-tab-pane3"
                      type="button"
                      role="tab"
                      aria-controls="profile-tab-pane"
                      aria-selected="false"
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
            <div className="tab-content" id="myTabContent3">
              <div
                className="tab-pane fade show active"
                id="home-tab-pane3"
                role="tabpanel"
                aria-labelledby="home-tab"
                tabIndex={0}
              >
                <div className="dz-lightgallery style-2" id="lightgallery">
                  <a
                    className="gallery-box"
                    href="/assets/images/post/pic1.png"
                  >
                    <img src="/assets/images/post/pic1.png" alt="image" />
                  </a>
                  <a
                    className="gallery-box"
                    href="/assets/images/post/pic2.png"
                  >
                    <img src="/assets/images/post/pic2.png" alt="image" />
                  </a>
                  <a
                    className="gallery-box"
                    href="/assets/images/post/pic3.png"
                  >
                    <img src="/assets/images/post/pic3.png" alt="image" />
                  </a>
                  <a
                    className="gallery-box"
                    href="/assets/images/post/pic4.png"
                  >
                    <img src="/assets/images/post/pic4.png" alt="image" />
                  </a>
                  <a
                    className="gallery-box"
                    href="/assets/images/post/pic5.png"
                  >
                    <img src="/assets/images/post/pic5.png" alt="image" />
                  </a>
                  <a
                    className="gallery-box"
                    href="/assets/images/post/pic6.png"
                  >
                    <img src="/assets/images/post/pic6.png" alt="image" />
                  </a>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="profile-tab-pane3"
                role="tabpanel"
                aria-labelledby="profile-tab"
                tabIndex={0}
              >
                <div className="dz-lightgallery" id="lightgallery-2">
                  <a
                    className="gallery-box"
                    href="/assets/images/post/pic4.png"
                  >
                    <img src="/assets/images/post/pic4.png" alt="image" />
                  </a>
                  <a
                    className="gallery-box"
                    href="/assets/images/post/pic3.png"
                  >
                    <img src="/assets/images/post/pic3.png" alt="image" />
                  </a>
                  <a
                    className="gallery-box"
                    href="/assets/images/post/pic2.png"
                  >
                    <img src="/assets/images/post/pic2.png" alt="image" />
                  </a>
                  <a
                    className="gallery-box"
                    href="/assets/images/post/pic1.png"
                  >
                    <img src="/assets/images/post/pic1.png" alt="image" />
                  </a>
                  <a
                    className="gallery-box"
                    href="/assets/images/post/pic9.png"
                  >
                    <img src="/assets/images/post/pic9.png" alt="image" />
                  </a>
                  <a
                    className="gallery-box"
                    href="/assets/images/post/pic12.png"
                  >
                    <img src="/assets/images/post/pic12.png" alt="image" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Content End*/}
    </>
  );
}
