import { useNavigate } from "react-router-dom";
import { env } from "../../../../env";
import timeAgo from "../../../../services/timeAndDate";
import { useReportStore, useShareStore } from "../../../../store";
import { formatNumber } from "../../../../services/number-formatting";
import { handleProfileImageError } from "../../../../services/asset-paths";

export default function Post({
  post,
  toggleComment,
  togglePostLike,
}: {
  post: any;
  toggleComment: (id: string) => void;
  togglePostLike: (id: string, liked: boolean) => void;
}) {
  const navigate = useNavigate();
  const setPostToShare = useShareStore((state) => state.setPostToShare);
  const setPostToReport = useReportStore((state) => state.setPostToReport);

  return (
    <>
      <div className="post-card">
        <div className="top-meta">
          <div className="d-flex justify-content-between align-items-start">
            <a
              onClick={() => navigate("/profile/" + post.author._id)}
              className="media media-40"
              style={{ cursor: "pointer" }}
            >
              <img
                className="rounded"
                src={post.author?.profile_img}
                onError={handleProfileImageError}
                alt="/"
              />
            </a>
            <div className="meta-content ms-3">
              <h6 className="title mb-0">
                <a
                  onClick={() => navigate("/profile/" + post.author._id)}
                  style={{ cursor: "pointer" }}
                >
                  {post.author?.first_name + " " + post.author?.last_name}
                </a>
              </h6>
              <ul className="meta-list">
                <li>{timeAgo(post.createdAt)}</li>
              </ul>
            </div>
          </div>
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
          </div>
        </div>
        <p className="text-black">{post.caption}</p>
        <div className="dz-media">
          {post.media?.[0]?.type === "image" && (
            <img
              style={{
                width: "auto",
                maxWidth: "100%",
                height: "auto",
                minHeight: "200px",
                maxHeight: "600px",
                objectFit: "contain",
              }}
              src={`${env.VITE_API_URL}/media/${post.media?.[0]?.filename}`}
              alt="/"
            />
          )}
          {post.media?.[0]?.type === "video" && (
            <video
              poster={
                post.media?.[0]?.thumbnail?.filename
                  ? `${env.VITE_API_URL}/media/${post.media?.[0]?.thumbnail?.filename}`
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
            >
              <source
                src={`${env.VITE_API_URL}/media/${post.media?.[0]?.filename}`}
                type={post.media?.[0]?.contentType}
              />
            </video>
          )}
          {/* <img src="/assets/images/post/pic1.png" alt="/" /> */}
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
        </div>
      </div>
    </>
  );
}
