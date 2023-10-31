export default function Comment({
  comment,
  showCommentInput,
  showReplies,
  type,
  toggleShowCommentInput,
  loadReplies,
}: {
  comment: any;
  showCommentInput: string;
  showReplies?: string;
  type: "comment" | "reply";
  toggleShowCommentInput: (id: string) => void;
  loadReplies?: (id: string) => void;
}) {
  return (
    <>
      <div className="list-content">
        <img src={comment.profile_img} alt="/" />
        <div>
          <h6 className="font-14 mb-1">{comment.name}</h6>
          <p className="mb-2">{comment.content}</p>
          <ul className="bottom-item">
            <li className="text-light">{comment.likes_count} Like</li>
            <li
              className="text-light"
              style={{ cursor: "pointer" }}
              onClick={() => toggleShowCommentInput(comment._id)}
            >
              {showCommentInput === comment._id ? "Cancel" : "Reply"}
            </li>
            <li className="text-light">2d days ago</li>
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
        <div className={`like-button ${comment.is_liked ? "active" : ""}`}>
          <i className="fa-regular fa-heart ms-auto"></i>
        </div>
      </div>
    </>
  );
}
