import { useState, useEffect, useRef } from "react";
import CommentInput from "../ui/CommentInput";
import Comment from "../ui/Comment";
import BlinkingLoadingCircles from "../../../../components/BlinkingLoadingCircles";
import { get } from "../../../../services/crud";
import { useCommentsStore } from "../../../../store";

export default function CommentsContainer({ post }: { post: any }) {
  const [commentText, setCommentText] = useState("");
  const [showRepliesFor, setShowRepliesFor] = useState("");
  const [showCommentInputFor, setShowCommentInputFor] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const componentRefs = useRef<{ [key: string]: HTMLLIElement }>({});
  const lastDate = useRef<string | null>(null);
  const lastCommentId = useRef<string | null>(null);
  const lastReplyDate = useRef<string | null>(null);
  const lastReplyId = useRef<string | null>(null);
  const comments = useCommentsStore((state) => state.comments);
  const addToComments = useCommentsStore((state) => state.addToComments);
  const clearComments = useCommentsStore((state) => state.clearComments);
  const setReplies = useCommentsStore((state) => state.setReplies);

  useEffect(() => {
    fetchComments();

    return () => {
      clearComments();
    };
  }, []);

  const sendComment = (e: any) => {
    e.preventDefault();
    if (commentText.length > 0) {
      setCommentText("");
      setShowCommentInputFor("");
    }
  };

  const fetchComments = () => {
    setCommentsLoading(true);
    get("comment/get/" + post._id, {
      pageSize: 10,
      lastDate: lastDate.current,
      lastCommentId: lastCommentId.current,
      comment_for: "post",
    })
      .then((res) => {
        addToComments([...res.data]);
        lastDate.current = res.lastDate;
        lastCommentId.current = res.lastCommentId;
        setCommentsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setCommentsLoading(false);
      });
  };

  const loadReplies = (id: string) => {
    // TODO: when loading replies, if it has already been loaded, show that instead of sending a new request
    // TODO: hide 'show more' buttons if there are no more comments/replies
    if (showRepliesFor !== id) {
      fetchReplies(id);
    }
    toggleShowButton(id);
  };

  const fetchReplies = (id: string) => {
    setReplyLoading(true);
    get("comment/get/" + id, {
      pageSize: 5,
      lastDate: lastReplyDate.current,
      lastCommentId: lastReplyId.current,
      comment_for: "comment",
    })
      .then((res) => {
        setReplies([...res.data], id);
        lastReplyDate.current = res.lastDate;
        lastReplyId.current = res.lastCommentId;
        setReplyLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setReplyLoading(false);
      });

    setTimeout(() => setReplyLoading(false), 5000);
  };

  const toggleShowButton = (id: string) => {
    if (showRepliesFor === id) {
      setShowRepliesFor("");
    } else {
      setShowRepliesFor(id);
    }
  };

  const toggleShowCommentInput = (id: string) => {
    if (showCommentInputFor === id) {
      setShowCommentInputFor("");
    } else {
      setShowCommentInputFor(id);
    }
  };

  // display no comments if no comments are found
  if (comments.length === 0 && !commentsLoading) {
    return (
      <div className="card bg-light p-3">
        <h6 className="text-muted">No Comments</h6>
        <div className="divider border-secondary mt-1"></div>
        <CommentInput
          commentText={commentText}
          onChange={setCommentText}
          onSubmit={sendComment}
        />
      </div>
    );
  }

  return (
    <div className="card bg-light p-3">
      <h6 className="">Comments</h6>
      <div className="divider border-secondary mt-1"></div>

      <ul className="dz-comments-list">
        {comments.map((comment: any, i: number) => (
          <div>
            <li
              key={i}
              ref={(el) =>
                (componentRefs.current[comment._id] = el as HTMLLIElement)
              }
            >
              <Comment
                comment={comment}
                showCommentInput={showCommentInputFor}
                showReplies={showRepliesFor}
                toggleShowCommentInput={toggleShowCommentInput}
                loadReplies={loadReplies}
                type="comment"
              />
            </li>
            {showCommentInputFor === comment._id && (
              <li>
                <CommentInput
                  commentText={commentText}
                  onChange={setCommentText}
                  onSubmit={sendComment}
                />
              </li>
            )}
            {showRepliesFor === comment._id &&
              comment.comments?.map((reply: any, i: number) => (
                <div key={i}>
                  <li className="parent-list">
                    <Comment
                      comment={reply}
                      showCommentInput={showCommentInputFor}
                      toggleShowCommentInput={toggleShowCommentInput}
                      type="reply"
                    />
                  </li>
                  {showCommentInputFor === reply._id && (
                    <li className="parent-list">
                      <CommentInput
                        commentText={commentText}
                        onChange={setCommentText}
                        onSubmit={sendComment}
                      />
                    </li>
                  )}
                </div>
              ))}

            {showRepliesFor === comment._id && !replyLoading && (
              <li
                className="parent-list small"
                style={{ cursor: "pointer" }}
                onClick={() => fetchReplies(comment._id)}
              >
                <i className="fa fa-refresh me-2" aria-hidden="true"></i>
                <span>Show more replies</span>
              </li>
            )}
            {showRepliesFor === comment._id && replyLoading && (
              <BlinkingLoadingCircles />
            )}
          </div>
        ))}

        {!commentsLoading && (
          <li
            className="small"
            style={{ cursor: "pointer" }}
            onClick={() => fetchComments()}
          >
            <i className="fa fa-refresh me-2" aria-hidden="true"></i>
            <span>Show more comments</span>
          </li>
        )}
        {commentsLoading && <BlinkingLoadingCircles />}
      </ul>
    </div>
  );
}
