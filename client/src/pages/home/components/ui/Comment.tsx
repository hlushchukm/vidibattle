import { formatResourceURL, handleProfileImageError } from "../../../../services/asset-paths";
import { formatNumber } from "../../../../services/number-formatting";
import timeAgo from "../../../../services/timeAndDate";
import { getName } from "../../../../services/utils";

export default function Comment({
  comment,
  showCommentInput,
  showReplies,
  type,
  toggleShowCommentInput,
  likeStatusChange,
  loadReplies,
}: {
  comment: any;
  showCommentInput: string;
  showReplies?: string;
  type: "comment" | "reply";
  toggleShowCommentInput: (id: string) => void;
  likeStatusChange: (id: string, isLike: boolean) => void;
  loadReplies?: (id: string) => void;
}) {
  return (
    <>
      <div className="list-content">
        <img
          src={formatResourceURL(comment?.author?.profile_img)}
          onError={handleProfileImageError}
          alt="/"
        />
        <div>
          <h6 className="font-14 mb-1">{getName(comment?.author)}</h6>
          <p className="mb-2">{comment.content}</p>
          <ul className="bottom-item">
            <li className="text-light">
              {formatNumber(comment.likes_count)} Likes
            </li>
            <li
              className="text-light"
              style={{ cursor: "pointer" }}
              onClick={() => toggleShowCommentInput(comment._id)}
            >
              {showCommentInput === comment._id ? "Cancel" : "Reply"}
            </li>
            <li className="text-light">{timeAgo(comment.createdAt)}</li>
          </ul>
          {type === "comment" && comment.has_reply && (
            <div
              className="text-light py-1 small text-secondary-hover"
              style={{
                cursor: "pointer",
              }}
              onClick={() => (loadReplies ? loadReplies(comment._id) : null)}
            >
              {showReplies !== comment._id && (
                <span>
                  <span className="me-1">Show replies</span>
                  <i className="fa fa-angle-down" aria-hidden="true"></i>
                </span>
              )}
              {showReplies === comment._id && (
                <span>
                  <span className="me-1">Hide replies</span>
                  <i className="fa fa-angle-up" aria-hidden="true"></i>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="ms-auto">
        {/* TODO: like/unlike animation */}
        <div
          onClick={() => likeStatusChange(comment._id, !comment.is_liked)}
          className={`like-button ${comment.is_liked ? "active" : ""}`}
          style={{ cursor: "pointer" }}
        >
          <i className="fa-regular fa-heart ms-auto"></i>
        </div>
      </div>
    </>
  );
}
