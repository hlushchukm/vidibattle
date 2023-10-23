export default function Home() {
  return (
    <>
      {/* Preloader */}
      <div id="preloader">
        <div className="spinner"></div>
      </div>
      {/* Preloader end */}

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="main-bar">
            <div className="left-content">
              <h4 className="title mb-0">Home</h4>
            </div>
            <div className="mid-content"></div>
            <div className="right-content d-flex align-items-center">
              <a href="reels.html" className="bell-icon me-2">
                <svg
                  id="Layer_3"
                  height="24"
                  viewBox="0 0 22 22"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                  data-name="Layer 3"
                >
                  <g>
                    <path d="m-.0132 8v9a5.0018 5.0018 0 0 0 5 5h12a5.0018 5.0018 0 0 0 5-5v-9zm14.49 6.87-6 3.38a.9472.9472 0 0 1 -.49.13 1.0145 1.0145 0 0 1 -1-1v-6.76a1.0039 1.0039 0 0 1 1.49-.87l6 3.38a.9971.9971 0 0 1 0 1.74z" />
                    <path d="m6.0968 6h-6.11v-1a4.9909 4.9909 0 0 1 2.27-4.19l1.19 1.62z" />
                    <path d="m15.1068 6h-6.52l-2.96-4-1.44-1.93a4.2509 4.2509 0 0 1 .8-.07h5.72l1.46 2z" />
                    <path d="m21.9868 5v1h-4.4l-2.95-4-1.47-2h3.82a5.0018 5.0018 0 0 1 5 5z" />
                  </g>
                </svg>
              </a>
              <a href="notification.html" className="bell-icon me-2">
                <svg
                  width="24"
                  height="26"
                  viewBox="0 0 24 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.99863 5.94146C8.25877 4.69837 9.96789 4 11.75 4C13.5321 4 15.2412 4.69837 16.5014 5.94146C17.7615 7.18456 18.4694 8.87057 18.4694 10.6286C18.4694 13.6602 19.1264 15.5253 19.7182 16.5956C20.0157 17.1336 20.3031 17.4826 20.498 17.6854C20.5957 17.7872 20.6709 17.853 20.7136 17.8881C20.7334 17.9044 20.7462 17.9141 20.751 17.9176C21.1638 18.1996 21.3462 18.7128 21.2002 19.1883C21.0523 19.6703 20.6019 20 20.0914 20H3.40862C2.89809 20 2.44774 19.6703 2.2998 19.1883C2.15385 18.7128 2.33617 18.1996 2.74898 17.9176C2.75364 17.9144 2.75833 17.9113 2.76305 17.9082L2.7604 17.9099L2.7558 17.913L2.74949 17.9173C2.74783 17.9185 2.74697 17.9191 2.74688 17.9192C2.74681 17.9192 2.7472 17.9189 2.74803 17.9183C2.7483 17.9181 2.74862 17.9179 2.74898 17.9176C2.75375 17.9141 2.76657 17.9044 2.78642 17.8881C2.82906 17.853 2.90431 17.7872 3.00203 17.6854C3.19687 17.4826 3.48428 17.1336 3.78178 16.5956C4.37359 15.5253 5.03055 13.6602 5.03055 10.6286C5.03055 8.87056 5.73849 7.18456 6.99863 5.94146ZM2.76305 17.9082C2.76307 17.9082 2.76308 17.9081 2.7631 17.9081L2.76306 17.9082L2.76305 17.9082ZM17.6975 17.7143C17.693 17.7063 17.6886 17.6982 17.6841 17.6901C16.8857 16.2461 16.1524 13.997 16.1524 10.6286C16.1524 9.47677 15.6886 8.37215 14.863 7.55771C14.0374 6.74326 12.9176 6.28571 11.75 6.28571C10.5824 6.28571 9.46264 6.74326 8.63703 7.55771C7.81143 8.37215 7.3476 9.47677 7.3476 10.6286C7.3476 13.997 6.61433 16.2461 5.81591 17.6901C5.81144 17.6982 5.80697 17.7063 5.8025 17.7143H17.6975ZM2.7645 17.9072C2.7645 17.9072 2.7645 17.9072 2.76449 17.9072L2.76425 17.9074C2.76434 17.9073 2.76442 17.9073 2.7645 17.9072Z"
                    fill="#FE9063"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.87713 21.1933C9.47825 20.797 10.2482 21.0296 10.5969 21.7127C10.6633 21.8427 10.7586 21.9506 10.8732 22.0256C10.9878 22.1006 11.1177 22.1401 11.25 22.1401C11.3823 22.1401 11.5122 22.1006 11.6268 22.0256C11.7414 21.9506 11.8367 21.8427 11.9031 21.7127C12.2518 21.0296 13.0217 20.797 13.6229 21.1933C14.224 21.5895 14.4286 22.4646 14.0799 23.1477C13.7923 23.7111 13.3795 24.1787 12.8829 24.5038C12.3862 24.8289 11.8231 25 11.25 25C10.6769 25 10.1138 24.8289 9.61711 24.5038C9.12045 24.1787 8.70767 23.7111 8.42008 23.1477C8.07138 22.4646 8.27601 21.5895 8.87713 21.1933Z"
                    fill="#FE9063"
                  />
                  <circle
                    cx="18"
                    cy="6"
                    r="5"
                    fill="url(#paint0_linear_8_1045)"
                    stroke="#FEEADF"
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_8_1045"
                      x1="15.8934"
                      y1="-5.17647"
                      x2="23.3834"
                      y2="-3.59332"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#704FFE" />
                      <stop offset="1" stopColor="#523CAD" />
                    </linearGradient>
                  </defs>
                </svg>
              </a>
              <a href="javascript:void(0);" className="bell-icon menu-toggler">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M5,11h4c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2H5C3.9,3,3,3.9,3,5v4C3,10.1,3.9,11,5,11z" />
                  <path d="M5,21h4c1.1,0,2-0.9,2-2v-4c0-1.1-0.9-2-2-2H5c-1.1,0-2,0.9-2,2v4C3,20.1,3.9,21,5,21z" />
                  <path d="M13,5v4c0,1.1,0.9,2,2,2h4c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-4C13.9,3,13,3.9,13,5z" />
                  <path d="M15,21h4c1.1,0,2-0.9,2-2v-4c0-1.1-0.9-2-2-2h-4c-1.1,0-2,0.9-2,2v4C13,20.1,13.9,21,15,21z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>
      <div className="dark-overlay"></div>
      {/* Header End  */}

      {/* Sidebar  */}
      <div className="sidebar">
        <div className="author-box">
          <div className="dz-media">
            <img
              src="assets/images/stories/small/pic1.jpg"
              alt="author-image"
            />
          </div>
          <div className="dz-info">
            <span>Good Morning</span>
            <h5 className="name">Emilla</h5>
          </div>
        </div>
        <ul className="nav navbar-nav">
          <li className="nav-label">Main Menu</li>
          <li>
            <a className="nav-link" href="welcome.html">
              <span className="dz-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z" />
                </svg>
              </span>
              <span>Welcome</span>
            </a>
          </li>
          <li>
            <a className="nav-link" href="index.html">
              <span className="dz-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" />
                </svg>
              </span>
              <span>Home</span>
            </a>
          </li>
          <li>
            <a className="nav-link" href="pages.html">
              <span className="dz-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M12.6 18.06c-.36.28-.87.28-1.23 0l-6.15-4.78c-.36-.28-.86-.28-1.22 0-.51.4-.51 1.17 0 1.57l6.76 5.26c.72.56 1.73.56 2.46 0l6.76-5.26c.51-.4.51-1.17 0-1.57l-.01-.01c-.36-.28-.86-.28-1.22 0l-6.15 4.79zm.63-3.02l6.76-5.26c.51-.4.51-1.18 0-1.58l-6.76-5.26c-.72-.56-1.73-.56-2.46 0L4.01 8.21c-.51.4-.51 1.18 0 1.58l6.76 5.26c.72.56 1.74.56 2.46-.01z" />
                </svg>
              </span>
              <span>Pages</span>
            </a>
          </li>
          <li>
            <a className="nav-link" href="ui-components.html">
              <span className="dz-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
                </svg>
              </span>
              <span>Components</span>
            </a>
          </li>
          <li>
            <a className="nav-link" href="notification.html">
              <span className="dz-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.68-1.5-1.51-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.92 6 11v5l-1.3 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16zm-6.01 6c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zM6.77 4.73c.42-.38.43-1.03.03-1.43-.38-.38-1-.39-1.39-.02C3.7 4.84 2.52 6.96 2.14 9.34c-.09.61.38 1.16 1 1.16.48 0 .9-.35.98-.83.3-1.94 1.26-3.67 2.65-4.94zM18.6 3.28c-.4-.37-1.02-.36-1.4.02-.4.4-.38 1.04.03 1.42 1.38 1.27 2.35 3 2.65 4.94.07.48.49.83.98.83.61 0 1.09-.55.99-1.16-.38-2.37-1.55-4.48-3.25-6.05z" />
                </svg>
              </span>
              <span>Notification</span>
              <span className="badge badge-circle badge-danger">1</span>
            </a>
          </li>
          <li>
            <a className="nav-link" href="profile.html">
              <span className="dz-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z" />
                </svg>
              </span>
              <span>Profile</span>
            </a>
          </li>
          <li>
            <a className="nav-link" href="chat.html">
              <span className="dz-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10c.55 0 1 .45 1 1s-.45 1-1 1H7c-.55 0-1-.45-1-1s.45-1 1-1zm6 5H7c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm4-6H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z" />
                </svg>
              </span>
              <span>Chat</span>
              <span className="badge badge-circle badge-info">5</span>
            </a>
          </li>
          <li>
            <a className="nav-link" href="welcome.html">
              <span className="dz-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  enableBackground="new 0 0 24 24"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <g></g>
                  <g>
                    <g>
                      <path d="M5,5h6c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h6c0.55,0,1-0.45,1-1v0 c0-0.55-0.45-1-1-1H5V5z" />
                      <path d="M20.65,11.65l-2.79-2.79C17.54,8.54,17,8.76,17,9.21V11h-7c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h7v1.79 c0,0.45,0.54,0.67,0.85,0.35l2.79-2.79C20.84,12.16,20.84,11.84,20.65,11.65z" />
                    </g>
                  </g>
                </svg>
              </span>
              <span>Logout</span>
            </a>
          </li>
          <li className="nav-label">Settings</li>
          <li
            className="nav-color"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasBottom"
            aria-controls="offcanvasBottom"
          >
            <a href="javascript:void(0);" className="nav-link">
              <span className="dz-icon">
                <svg
                  className="color-plate"
                  xmlns="http://www.w3.org/2000/svg"
                  height="30px"
                  viewBox="0 0 24 24"
                  width="30px"
                  fill="#000000"
                >
                  <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
              </span>
              <span>Color Theme</span>
            </a>
          </li>
          <li>
            <div className="mode">
              <span className="dz-icon">
                <svg
                  className="dark"
                  xmlns="http://www.w3.org/2000/svg"
                  enableBackground="new 0 0 24 24"
                  height="24px"
                  viewBox="0 0 24 24"
                  width="24px"
                  fill="#000000"
                >
                  <g></g>
                  <g>
                    <g>
                      <g>
                        <path d="M11.57,2.3c2.38-0.59,4.68-0.27,6.63,0.64c0.35,0.16,0.41,0.64,0.1,0.86C15.7,5.6,14,8.6,14,12s1.7,6.4,4.3,8.2 c0.32,0.22,0.26,0.7-0.09,0.86C16.93,21.66,15.5,22,14,22c-6.05,0-10.85-5.38-9.87-11.6C4.74,6.48,7.72,3.24,11.57,2.3z" />
                      </g>
                    </g>
                  </g>
                </svg>
              </span>
              <span className="text-dark">Dark Mode</span>
              <div className="custom-switch">
                <input
                  type="checkbox"
                  className="switch-input theme-btn"
                  id="toggle-dark-menu"
                />
                <label
                  className="custom-switch-label"
                  htmlFor="toggle-dark-menu"
                ></label>
              </div>
            </div>
          </li>
        </ul>
        <div className="sidebar-bottom">
          <h6 className="name">Soziety - Social Network</h6>
          <span className="ver-info">App Version 1.0</span>
        </div>
      </div>
      {/* Sidebar End  */}

      {/* Page Content  */}
      <div className="page-content">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            {/* STORY  */}
            <div className="author-notification mb-4">
              <div className="swiper-btn-center-lr my-0">
                <div className="swiper-container categorie-swiper">
                  <div className="swiper-wrapper">
                    <div className="swiper-slide">
                      <a href="story.html" className="categore-box style-1">
                        <div className="story-bx">
                          <img
                            src="assets/images/stories/small/pic8.jpg"
                            alt="/"
                          />
                          <div className="add-box">
                            <i className="fa-solid fa-plus"></i>
                          </div>
                        </div>
                        <span className="detail">Your Story</span>
                      </a>
                    </div>
                    <div className="swiper-slide">
                      <a href="live-story.html" className="categore-box">
                        <div className="story-bx">
                          <img
                            src="assets/images/stories/small/pic1.jpg"
                            alt="/"
                          />
                          <div className="live-text">Live</div>
                        </div>
                        <span className="detail">Emilia</span>
                      </a>
                    </div>
                    <div className="swiper-slide">
                      <a href="story.html" className="categore-box">
                        <div className="story-bx">
                          <img
                            src="assets/images/stories/small/pic2.jpg"
                            alt="/"
                          />
                        </div>
                        <span className="detail">Richard</span>
                      </a>
                    </div>
                    <div className="swiper-slide">
                      <a href="story.html" className="categore-box">
                        <div className="story-bx">
                          <img
                            src="assets/images/stories/small/pic3.jpg"
                            alt="/"
                          />
                        </div>
                        <span className="detail">Jasmine</span>
                      </a>
                    </div>
                    <div className="swiper-slide">
                      <a href="story.html" className="categore-box">
                        <div className="story-bx">
                          <img
                            src="assets/images/stories/small/pic4.jpg"
                            alt="/"
                          />
                        </div>
                        <span className="detail">Lucas</span>
                      </a>
                    </div>
                    <div className="swiper-slide">
                      <a href="story.html" className="categore-box">
                        <div className="story-bx">
                          <img
                            src="assets/images/stories/small/pic5.jpg"
                            alt="/"
                          />
                        </div>
                        <span className="detail">Hendri</span>
                      </a>
                    </div>
                    <div className="swiper-slide">
                      <a href="story.html" className="categore-box">
                        <div className="story-bx">
                          <img
                            src="assets/images/stories/small/pic6.jpg"
                            alt="/"
                          />
                        </div>
                        <span className="detail">Carla</span>
                      </a>
                    </div>
                    <div className="swiper-slide">
                      <a href="live-story.html" className="categore-box">
                        <div className="story-bx">
                          <img
                            src="assets/images/stories/small/pic7.jpg"
                            alt="/"
                          />
                          <div className="live-text">Live</div>
                        </div>
                        <span className="detail">Jermy</span>
                      </a>
                    </div>
                    <div className="swiper-slide">
                      <a href="story.html" className="categore-box">
                        <div className="story-bx">
                          <img
                            src="assets/images/stories/small/pic5.jpg"
                            alt="/"
                          />
                        </div>
                        <span className="detail">Kerry</span>
                      </a>
                    </div>
                    <div className="swiper-slide">
                      <a href="story.html" className="categore-box">
                        <div className="story-bx">
                          <img
                            src="assets/images/stories/small/pic6.jpg"
                            alt="/"
                          />
                        </div>
                        <span className="detail">Perry</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* STORY  */}
            <div className="post-area">
              <div className="post-card">
                <div className="top-meta">
                  <div className="d-flex justify-content-between align-items-start">
                    <a href="user-profile.html" className="media media-40">
                      <img
                        className="rounded"
                        src="assets/images/stories/small/pic4.jpg"
                        alt="/"
                      />
                    </a>
                    <div className="meta-content ms-3">
                      <h6 className="title mb-0">
                        <a href="user-profile.html">Lucas Mokmana</a>
                      </h6>
                      <ul className="meta-list">
                        <li>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.25 5.83331C12.25 9.91665 7 13.4166 7 13.4166C7 13.4166 1.75 9.91665 1.75 5.83331C1.75 4.44093 2.30312 3.10557 3.28769 2.121C4.27226 1.13644 5.60761 0.583313 7 0.583313C8.39239 0.583313 9.72774 1.13644 10.7123 2.121C11.6969 3.10557 12.25 4.44093 12.25 5.83331Z"
                              stroke="black"
                              strokeOpacity="0.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7 7.58331C7.9665 7.58331 8.75 6.79981 8.75 5.83331C8.75 4.86681 7.9665 4.08331 7 4.08331C6.0335 4.08331 5.25 4.86681 5.25 5.83331C5.25 6.79981 6.0335 7.58331 7 7.58331Z"
                              stroke="black"
                              strokeOpacity="0.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Bangkok, Thailand
                        </li>
                        <li>2m ago</li>
                      </ul>
                    </div>
                  </div>
                  <a
                    href="javascript:void(0);"
                    className="item-content item-link"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasBottom1"
                    aria-controls="offcanvasBottom"
                  >
                    <svg
                      width="15"
                      height="14"
                      viewBox="0 0 15 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.7566 4.93237L9.60021 0.182841C9.14886 -0.23294 8.4375 0.104591 8.4375 0.750465V3.25212C3.73157 3.30959 0 4.31562 0 9.07267C0 10.9927 1.1596 12.8948 2.4414 13.8893C2.84139 14.1996 3.41145 13.8101 3.26397 13.3071C1.93553 8.77542 3.89405 7.57236 8.4375 7.50264V10.25C8.4375 10.8969 9.14942 11.2329 9.60021 10.8176L14.7566 6.06761C15.0809 5.7688 15.0814 5.23158 14.7566 4.93237Z"
                        fill="#E4BEAB"
                      />
                    </svg>
                  </a>
                </div>
                <p className="text-black">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do sum sit emat 😎😎
                </p>
                <div className="dz-media">
                  <img src="assets/images/post/pic1.png" alt="/" />
                  <div className="post-meta-btn">
                    <ul>
                      <li>
                        <a
                          href="javascript:void(0);"
                          className="action-btn bg-primary"
                        >
                          <i className="fa-regular fa-heart fill-icon"></i>
                          <i className="fa-solid fa-heart fill-icon-2"></i>
                          <h6 className="font-14 mb-0 ms-2" id="value1">
                            221
                          </h6>
                        </a>
                      </li>
                      <li>
                        <a
                          href="comment.html"
                          className="action-btn bg-secondary"
                        >
                          <i className="fa-solid fa-comment fill-icon"></i>
                          <h6 className="font-14 mb-0 ms-2">150</h6>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="post-card">
                <div className="top-meta">
                  <div className="d-flex justify-content-between align-items-start">
                    <a href="user-profile.html" className="media media-40">
                      <img
                        className="rounded"
                        src="assets/images/stories/small/pic6.jpg"
                        alt="/"
                      />
                    </a>
                    <div className="meta-content ms-3">
                      <h6 className="title mb-0">
                        <a href="user-profile.html">Hendri Lee</a>
                      </h6>
                      <ul className="meta-list">
                        <li>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.25 5.83331C12.25 9.91665 7 13.4166 7 13.4166C7 13.4166 1.75 9.91665 1.75 5.83331C1.75 4.44093 2.30312 3.10557 3.28769 2.121C4.27226 1.13644 5.60761 0.583313 7 0.583313C8.39239 0.583313 9.72774 1.13644 10.7123 2.121C11.6969 3.10557 12.25 4.44093 12.25 5.83331Z"
                              stroke="black"
                              strokeOpacity="0.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7 7.58331C7.9665 7.58331 8.75 6.79981 8.75 5.83331C8.75 4.86681 7.9665 4.08331 7 4.08331C6.0335 4.08331 5.25 4.86681 5.25 5.83331C5.25 6.79981 6.0335 7.58331 7 7.58331Z"
                              stroke="black"
                              strokeOpacity="0.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Shibuya, Japan
                        </li>
                        <li>2m ago</li>
                      </ul>
                    </div>
                  </div>
                  <a
                    href="javascript:void(0);"
                    className="item-content item-link"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasBottom1"
                    aria-controls="offcanvasBottom"
                  >
                    <svg
                      width="15"
                      height="14"
                      viewBox="0 0 15 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.7566 4.93237L9.60021 0.182841C9.14886 -0.23294 8.4375 0.104591 8.4375 0.750465V3.25212C3.73157 3.30959 0 4.31562 0 9.07267C0 10.9927 1.1596 12.8948 2.4414 13.8893C2.84139 14.1996 3.41145 13.8101 3.26397 13.3071C1.93553 8.77542 3.89405 7.57236 8.4375 7.50264V10.25C8.4375 10.8969 9.14942 11.2329 9.60021 10.8176L14.7566 6.06761C15.0809 5.7688 15.0814 5.23158 14.7566 4.93237Z"
                        fill="#E4BEAB"
                      />
                    </svg>
                  </a>
                </div>
                <p className="text-black">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do sum sit emat 😎😎
                </p>
                <div className="dz-media">
                  <img src="assets/images/post/pic2.png" alt="/" />
                  <div className="post-meta-btn">
                    <ul>
                      <li>
                        <a
                          href="javascript:void(0);"
                          className="action-btn bg-primary"
                        >
                          <i className="fa-regular fa-heart fill-icon"></i>
                          <i className="fa-solid fa-heart fill-icon-2"></i>
                          <h6 className="font-14 mb-0 ms-2" id="value1">
                            221
                          </h6>
                        </a>
                      </li>
                      <li>
                        <a
                          href="comment.html"
                          className="action-btn bg-secondary"
                        >
                          <i className="fa-solid fa-comment fill-icon"></i>
                          <h6 className="font-14 mb-0 ms-2">150</h6>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="post-card">
                <div className="top-meta">
                  <div className="d-flex justify-content-between align-items-start">
                    <a href="user-profile.html" className="media media-40">
                      <img
                        className="rounded"
                        src="assets/images/stories/small/pic2.jpg"
                        alt="/"
                      />
                    </a>
                    <div className="meta-content ms-3">
                      <h6 className="title mb-0">
                        <a href="user-profile.html">Thomas Edison</a>
                      </h6>
                      <ul className="meta-list">
                        <li>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.25 5.83331C12.25 9.91665 7 13.4166 7 13.4166C7 13.4166 1.75 9.91665 1.75 5.83331C1.75 4.44093 2.30312 3.10557 3.28769 2.121C4.27226 1.13644 5.60761 0.583313 7 0.583313C8.39239 0.583313 9.72774 1.13644 10.7123 2.121C11.6969 3.10557 12.25 4.44093 12.25 5.83331Z"
                              stroke="black"
                              strokeOpacity="0.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7 7.58331C7.9665 7.58331 8.75 6.79981 8.75 5.83331C8.75 4.86681 7.9665 4.08331 7 4.08331C6.0335 4.08331 5.25 4.86681 5.25 5.83331C5.25 6.79981 6.0335 7.58331 7 7.58331Z"
                              stroke="black"
                              strokeOpacity="0.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Bangkok, Thailand
                        </li>
                        <li>2m ago</li>
                      </ul>
                    </div>
                  </div>
                  <a
                    href="javascript:void(0);"
                    className="item-content item-link"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasBottom1"
                    aria-controls="offcanvasBottom"
                  >
                    <svg
                      width="15"
                      height="14"
                      viewBox="0 0 15 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.7566 4.93237L9.60021 0.182841C9.14886 -0.23294 8.4375 0.104591 8.4375 0.750465V3.25212C3.73157 3.30959 0 4.31562 0 9.07267C0 10.9927 1.1596 12.8948 2.4414 13.8893C2.84139 14.1996 3.41145 13.8101 3.26397 13.3071C1.93553 8.77542 3.89405 7.57236 8.4375 7.50264V10.25C8.4375 10.8969 9.14942 11.2329 9.60021 10.8176L14.7566 6.06761C15.0809 5.7688 15.0814 5.23158 14.7566 4.93237Z"
                        fill="#E4BEAB"
                      />
                    </svg>
                  </a>
                </div>
                <p className="text-black">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do sum sit emat 😎😎
                </p>
                <div className="dz-media">
                  <img src="assets/images/post/pic8.png" alt="/" />
                  <div className="post-meta-btn">
                    <ul>
                      <li>
                        <a
                          href="javascript:void(0);"
                          className="action-btn bg-primary"
                        >
                          <i className="fa-regular fa-heart fill-icon"></i>
                          <i className="fa-solid fa-heart fill-icon-2"></i>
                          <h6 className="font-14 mb-0 ms-2" id="value1">
                            221
                          </h6>
                        </a>
                      </li>
                      <li>
                        <a
                          href="comment.html"
                          className="action-btn bg-secondary"
                        >
                          <i className="fa-solid fa-comment fill-icon"></i>
                          <h6 className="font-14 mb-0 ms-2">150</h6>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Content End */}

      {/* Menubar  */}
      <div className="menubar-area">
        <div className="toolbar-inner menubar-nav">
          <a href="index.html" className="nav-link active">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              xmlns:v="https://vecta.io/nano"
            >
              <path
                d="M21.44 11.035a.75.75 0 0 1-.69.465H18.5V19a2.25 2.25 0 0 1-2.25 2.25h-3a.75.75 0 0 1-.75-.75V16a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 1-.75.75h-3A2.25 2.25 0 0 1 3.5 19v-7.5H1.25a.75.75 0 0 1-.69-.465.75.75 0 0 1 .158-.818l9.75-9.75A.75.75 0 0 1 11 .246a.75.75 0 0 1 .533.222l9.75 9.75a.75.75 0 0 1 .158.818z"
                fill="#b5b5b5"
              />
            </svg>
          </a>
          <a href="timeline.html" className="nav-link">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="#b5b5b5"
                strokeOpacity="1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="#b5b5b5"
                strokeOpacity="1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a href="create-post.html" className="nav-link add-post">
            <i className="fa-solid fa-plus"></i>
          </a>
          <a href="chat.html" className="nav-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#b5b5b5"
              viewBox="0 0 511.606 511.606"
              xmlns:v="https://vecta.io/nano"
            >
              <path d="M436.594 74.943c-99.917-99.917-261.637-99.932-361.568 0-80.348 80.347-95.531 199.817-48.029 294.96L.662 485.742c-3.423 15.056 10.071 28.556 25.133 25.133l115.839-26.335c168.429 84.092 369.846-37.653 369.846-228.812 0-68.29-26.595-132.494-74.886-180.785zM309.143 319.394h-160c-11.598 0-21-9.402-21-21s9.402-21 21-21h160c11.598 0 21 9.402 21 21s-9.402 21-21 21zm53.334-85.333H149.143c-11.598 0-21-9.402-21-21s9.402-21 21-21h213.334c11.598 0 21 9.402 21 21s-9.403 21-21 21z" />
            </svg>
          </a>
          <a href="profile.html" className="nav-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="21"
              fill="#b5b5b5"
              xmlns:v="https://vecta.io/nano"
            >
              <path d="M8 7.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 1 0 0 7.5zm7.5 9v1.5c-.002.199-.079.39-.217.532C13.61 20.455 8.57 20.5 8 20.5s-5.61-.045-7.282-1.718C.579 18.64.501 18.449.5 18.25v-1.5a7.5 7.5 0 1 1 15 0z" />
            </svg>
          </a>
        </div>
      </div>
      {/* Menubar  */}

      {/* OffCanvas-1  */}
      <div
        className="offcanvas offcanvas-bottom"
        tabIndex={-1}
        id="offcanvasBottom1"
      >
        <button
          type="button"
          className="btn-close drage-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
        <div className="offcanvas-header share-style m-0 pb-0">
          <form className="w-100">
            <input
              type="text"
              className="form-control border-0"
              placeholder="Write a message ..."
            />
          </form>
        </div>
        <div className="offcanvas-body container pb-0">
          <form>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search.."
              />
              <span className="input-group-text">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.7871 22.7761L17.9548 16.9437C19.5193 15.145 20.4665 12.7982 20.4665 10.2333C20.4665 4.58714 15.8741 0 10.2333 0C4.58714 0 0 4.59246 0 10.2333C0 15.8741 4.59246 20.4665 10.2333 20.4665C12.7982 20.4665 15.145 19.5193 16.9437 17.9548L22.7761 23.7871C22.9144 23.9255 23.1007 24 23.2816 24C23.4625 24 23.6488 23.9308 23.7871 23.7871C24.0639 23.5104 24.0639 23.0528 23.7871 22.7761ZM1.43149 10.2333C1.43149 5.38004 5.38004 1.43681 10.2279 1.43681C15.0812 1.43681 19.0244 5.38537 19.0244 10.2333C19.0244 15.0812 15.0812 19.035 10.2279 19.035C5.38004 19.035 1.43149 15.0865 1.43149 10.2333Z"
                    fill="#FE9063"
                  ></path>
                </svg>
              </span>
            </div>
          </form>
          <div className="canvas-height mt-4 dz-scroll">
            <ul className="share-list">
              <li>
                <div className="left-content">
                  <a href="user-profile.html">
                    <img src="assets/images/stories/small/pic1.jpg" alt="/" />
                  </a>
                  <a href="user-profile.html">
                    <h6 className="name">Andy Lee</h6>
                    <span className="username">mr_andy_lee</span>
                  </a>
                </div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-primary btn-sm"
                >
                  Send
                </a>
              </li>
              <li>
                <div className="left-content">
                  <a href="user-profile.html">
                    <img src="assets/images/stories/small/pic2.jpg" alt="/" />
                  </a>
                  <a href="user-profile.html">
                    <h6 className="name">Brian Harahap</h6>
                    <span className="username">brian_harahap</span>
                  </a>
                </div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-primary btn-sm"
                >
                  Send
                </a>
              </li>
              <li>
                <div className="left-content">
                  <a href="user-profile.html">
                    <img src="assets/images/stories/small/pic3.jpg" alt="/" />
                  </a>
                  <a href="user-profile.html">
                    <h6 className="name">Christian Hang</h6>
                    <span className="username">christian_Hang</span>
                  </a>
                </div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-primary btn-sm"
                >
                  Send
                </a>
              </li>
              <li>
                <div className="left-content">
                  <a href="user-profile.html">
                    <img src="assets/images/stories/small/pic4.jpg" alt="/" />
                  </a>
                  <a href="user-profile.html">
                    <h6 className="name">Chloe Mc. Jenskin</h6>
                    <span className="username">chloe_mc_jenskin</span>
                  </a>
                </div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-primary btn-sm"
                >
                  Send
                </a>
              </li>
              <li>
                <div className="left-content">
                  <a href="user-profile.html">
                    <img src="assets/images/stories/small/pic5.jpg" alt="/" />
                  </a>
                  <a href="user-profile.html">
                    <h6 className="name">David Bekam</h6>
                    <span className="username">david_bekam</span>
                  </a>
                </div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-primary btn-sm"
                >
                  Send
                </a>
              </li>
              <li>
                <div className="left-content">
                  <a href="user-profile.html">
                    <img src="assets/images/stories/small/pic6.jpg" alt="/" />
                  </a>
                  <a href="user-profile.html">
                    <h6 className="name">Donas High</h6>
                    <span className="username">donas_high</span>
                  </a>
                </div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-primary btn-sm"
                >
                  Send
                </a>
              </li>
              <li>
                <div className="left-content">
                  <a href="user-profile.html">
                    <img src="assets/images/stories/small/pic7.jpg" alt="/" />
                  </a>
                  <a href="user-profile.html">
                    <h6 className="name">Lee Comfort</h6>
                    <span className="username">lee_comfort</span>
                  </a>
                </div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-primary btn-sm"
                >
                  Send
                </a>
              </li>
              <li>
                <div className="left-content">
                  <a href="user-profile.html">
                    <img src="assets/images/stories/small/pic8.jpg" alt="/" />
                  </a>
                  <a href="user-profile.html">
                    <h6 className="name">Michel Evon</h6>
                    <span className="username">michel_evon</span>
                  </a>
                </div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-primary btn-sm"
                >
                  Send
                </a>
              </li>
              <li>
                <div className="left-content">
                  <a href="user-profile.html">
                    <img src="assets/images/stories/small/pic4.jpg" alt="/" />
                  </a>
                  <a href="user-profile.html">
                    <h6 className="name">Yatin</h6>
                    <span className="username">yatin_325</span>
                  </a>
                </div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-primary btn-sm"
                >
                  Send
                </a>
              </li>
              <li>
                <div className="left-content">
                  <a href="user-profile.html">
                    <img src="assets/images/stories/small/pic3.jpg" alt="/" />
                  </a>
                  <a href="user-profile.html">
                    <h6 className="name">Tushar</h6>
                    <span className="username">Tjangid_293</span>
                  </a>
                </div>
                <a
                  href="javascript:void(0);"
                  className="btn btn-primary btn-sm"
                >
                  Send
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* OffCanvas-1  */}

      {/* Theme Color Settings  */}
      <div
        className="offcanvas offcanvas-bottom"
        tabIndex={-1}
        id="offcanvasBottom"
      >
        <div className="offcanvas-body small">
          <ul className="theme-color-settings">
            <li>
              <input
                className="filled-in"
                id="primary_color_8"
                name="theme_color"
                type="radio"
                value="color-primary"
              />
              <label htmlFor="primary_color_8"></label>
              <span>Default</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_2"
                name="theme_color"
                type="radio"
                value="color-green"
              />
              <label htmlFor="primary_color_2"></label>
              <span>Green</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_3"
                name="theme_color"
                type="radio"
                value="color-blue"
              />
              <label htmlFor="primary_color_3"></label>
              <span>Blue</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_4"
                name="theme_color"
                type="radio"
                value="color-pink"
              />
              <label htmlFor="primary_color_4"></label>
              <span>Pink</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_5"
                name="theme_color"
                type="radio"
                value="color-yellow"
              />
              <label htmlFor="primary_color_5"></label>
              <span>Yellow</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_6"
                name="theme_color"
                type="radio"
                value="color-orange"
              />
              <label htmlFor="primary_color_6"></label>
              <span>Orange</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_7"
                name="theme_color"
                type="radio"
                value="color-purple"
              />
              <label htmlFor="primary_color_7"></label>
              <span>Purple</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_1"
                name="theme_color"
                type="radio"
                value="color-red"
              />
              <label htmlFor="primary_color_1"></label>
              <span>Red</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_9"
                name="theme_color"
                type="radio"
                value="color-lightblue"
              />
              <label htmlFor="primary_color_9"></label>
              <span>Lightblue</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_10"
                name="theme_color"
                type="radio"
                value="color-teal"
              />
              <label htmlFor="primary_color_10"></label>
              <span>Teal</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_11"
                name="theme_color"
                type="radio"
                value="color-lime"
              />
              <label htmlFor="primary_color_11"></label>
              <span>Lime</span>
            </li>
            <li>
              <input
                className="filled-in"
                id="primary_color_12"
                name="theme_color"
                type="radio"
                value="color-deeporange"
              />
              <label htmlFor="primary_color_12"></label>
              <span>Deeporange</span>
            </li>
          </ul>
        </div>
      </div>
      {/* Theme Color Settings End  */}
    </>
  );
}
