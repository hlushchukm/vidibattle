import { useNavigate } from "react-router-dom";
import timeAgo from "../../../../services/timeAndDate";
import { useReportStore, useShareStore } from "../../../../store";
import { formatNumber } from "../../../../services/number-formatting";
import {
  formatResourceURL,
  handleProfileImageError,
} from "../../../../services/asset-paths";
import { getUserId, isLoggedIn } from "../../../../services/auth";
import { CSSProperties, useEffect, useRef, useState } from "react";

export default function Post({
  post,
  toggleComment,
  togglePostLike,
}: {
  post: any;
  toggleComment: (id: string) => void;
  togglePostLike: (id: string, liked: boolean) => void;
}) {
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const navigate = useNavigate();
  const setPostToShare = useShareStore((state) => state.setPostToShare);
  const setPostToReport = useReportStore((state) => state.setPostToReport);
  const postImageRef = useRef<HTMLImageElement | null>(null);
  const stickerContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // detect is video is visible in the window
    if (videoRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVideoVisible(entry.isIntersecting);
        },
        { rootMargin: "-300px" }
      );
      observer.observe(videoRef.current);

      return () => observer.disconnect();
    }
  }, [videoRef]);

  useEffect(() => {
    // if video is scrolled out of view, then pause it
    if (!isVideoVisible && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isVideoVisible]);

  const getStickerStyle = (position: string): CSSProperties => {
    switch (position) {
      case "top-right":
        return {
          position: "absolute",
          top: 0,
          right: 0,
          maxWidth: "20%",
          maxHeight: "50%",
        };
      case "bottom-left":
        return {
          position: "absolute",
          bottom: 0,
          left: 0,
          maxWidth: "20%",
        };
      case "bottom-right":
        return {
          position: "absolute",
          bottom: 0,
          right: 0,
          maxWidth: "20%",
        };
      case "top":
      case "bottom":
        return {
          // width: postImageRef.current?.width ?? 600,
          height: postImageRef.current?.width
            ? (postImageRef.current.width ?? 0) * 0.1
            : 100,
          overflowY: "hidden",
        };
      case "top-left":
      default:
        return {
          position: "absolute",
          top: 0,
          left: 0,
          maxWidth: "20%",
          maxHeight: "50%",
        };
    }
  };

  const putStickerOnTop = () => {
    // Insert the sticker container dev before the post image
    postImageRef.current?.parentNode?.insertBefore(
      stickerContainerRef.current as HTMLDivElement,
      postImageRef.current
    );
  };

  return (
    <>
      <div className="post-card">
        <div className="top-meta">
          <div className="d-flex justify-content-between align-items-start">
            <a
              onClick={() => navigate("/profile/" + post.author.username)}
              className="media media-40"
              style={{ cursor: "pointer" }}
            >
              <img
                className="rounded"
                src={formatResourceURL(post.author?.profile_img)}
                onError={handleProfileImageError}
                alt="/"
              />
            </a>
            <div className="meta-content ms-3">
              <h6 className="title mb-0">
                <a
                  onClick={() => navigate("/profile/" + post.author.username)}
                  style={{ cursor: "pointer" }}
                >
                  {post.author?.first_name + " " + post.author?.last_name}
                </a>
              </h6>
              <ul className="meta-list">
                <li>@{post.author?.username}</li>
                <li>{timeAgo(post.createdAt)}</li>
                {/* {post.author?.address?.country && (
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
                    {post.author?.address?.country}
                    {(post.authro?.address?.state ||
                      post.author?.address?.city) && (
                      <>
                        {post.author?.address?.city
                          ? ", " + post.author?.address.city
                          : post.author?.address?.state
                          ? ", " + post.author?.address?.state
                          : ""}
                      </>
                    )}
                  </li>
                )} */}
              </ul>
            </div>
          </div>
          {isLoggedIn() && (
            <div className="d-flex gap-2 justify-content-center align-items-center">
              <a
                onClick={() => setPostToShare(post)}
                style={{ cursor: "pointer" }}
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
              {post.author?._id !== getUserId() && (
                <div className="dropdown">
                  <a
                    onClick={() => setPostToReport(post)}
                    style={{ cursor: "pointer" }}
                    className="item-content item-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fa fa-bars" aria-hidden="true"></i>
                  </a>
                  <div className="dropdown-menu">
                    <a
                      className="dropdown-item text-primary"
                      style={{ cursor: "pointer" }}
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasBottomModal"
                      aria-controls="offcanvasBottom"
                    >
                      <i className="fa fa-ban me-2"></i>
                      <span>Report Post</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* {post.competition && (
          <p>
            <span
              className=""
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(
                  "/competition/info/" +
                    post.competition.name +
                    "?start_date=" +
                    post.competition.start_date +
                    "&end_date=" +
                    post.competition.end_date
                )
              }
            >
              <span className="me-1">Competition:</span>
              <span className="me-2 text-secondary fw-bold">
                {post.competition.name},
              </span>
              <span className="me-1">Round:</span>
              <span className="me-2 text-secondary fw-bold">{post.round}</span>
            </span>
          </p>
        )} */}
        <p className="text-black" style={{ overflowWrap: "break-word" }}>
          {post.caption}
        </p>
        <div className="dz-media">
          {post.media?.[0]?.type === "image" && (
            <div style={{ position: "relative", width: "fit-content" }}>
              <img
                style={{
                  width: "auto",
                  maxWidth: "100%",
                  height: "auto",
                  minHeight: "200px",
                  maxHeight: "600px",
                  objectFit: "contain",
                }}
                src={formatResourceURL(post.media?.[0]?.filename)}
                alt="/"
                ref={(el) => (postImageRef.current = el)}
              />
              {/* sticker */}
              {post.competition &&
                post.competition.has_sticker &&
                post.sticker && (
                  <div
                    style={getStickerStyle(post.sticker.position)}
                    ref={(el) => (stickerContainerRef.current = el)}
                    onLoad={() => {
                      post.sticker.position === "top"
                        ? putStickerOnTop()
                        : null;
                    }}
                  >
                    <img
                      style={{ borderRadius: 0 }}
                      src={formatResourceURL(post.sticker.image)}
                    />
                  </div>
                )}
            </div>
          )}
          {post.media?.[0]?.type === "video" && (
            <video
              poster={
                post.media?.[0]?.thumbnail?.filename
                  ? formatResourceURL(post.media?.[0]?.thumbnail?.filename)
                  : undefined
              }
              id="videoPlayer"
              style={{
                width: "auto",
                maxWidth: "100%",
                height: "auto",
                minHeight: "200px",
                maxHeight: "600px",
                objectFit: "contain",
              }}
              controls
              ref={videoRef}
            >
              <source
                src={formatResourceURL(post.media?.[0]?.filename)}
                type={post.media?.[0]?.contentType}
              />
            </video>
          )}
          {/* <img src="/assets/images/post/pic1.png" alt="/" /> */}
          {(!post.competition ||
            (post.competition && post.competition.status !== "scheduled")) && (
            <div className="post-meta-btn">
              <ul>
                <li>
                  <a
                    onClick={() =>
                      togglePostLike(post._id, !(post?.likes?.length > 0))
                    }
                    className={`action-btn bg-primary ${
                      post?.likes?.length > 0 ? "active" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa-regular fa-heart fill-icon"></i>
                    <i className="fa-solid fa-heart fill-icon-2"></i>
                    <h6 className="font-14 mb-0 ms-2" id="value1">
                      {formatNumber(post.likes_count ?? 0)}
                    </h6>
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => toggleComment(post._id)}
                    className="action-btn bg-secondary"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa-solid fa-comment fill-icon"></i>
                    <h6 className="font-14 mb-0 ms-2">
                      {formatNumber(post.comments_count ?? 0)}
                    </h6>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
