export default function BasicInfo({
  isLoggedIn,
  isOwnProfile,
}: {
  isLoggedIn: boolean;
  isOwnProfile: boolean;
}) {
  return (
    <>
      <div className="profile">
        {/* Profile icon for small screens */}
        <div className="d-xs-block d-sm-none mb-4">
          <div
            className="upload-box"
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "20px",
              background: "linear-gradient(180deg, #FE9063 0%, #704FFE 100%)",
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
            {isLoggedIn && isOwnProfile && (
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
            )}
          </div>
        </div>

        <div className="main-profile">
          <div className="left-content">
            <h5 className="mt-1">Brian Harahap</h5>
            <div className="info pe-sm-5 text-justify">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                sum sit ematons ectetur adipiscing elit, sed do sum sit emat 😎.
              </p>
            </div>
          </div>
          {/* Profile icon for large screens */}
          <div className="right-content d-none d-sm-block">
            <div className="upload-box">
              <img src="/assets/images/stories/pic2.png" alt="/" />
              {isLoggedIn && isOwnProfile && (
                <a href="edit-profile.html" className="upload-btn">
                  <i className="fa-solid fa-pencil"></i>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Following and message button */}
        {isLoggedIn && !isOwnProfile && (
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
        )}
      </div>
    </>
  );
}
