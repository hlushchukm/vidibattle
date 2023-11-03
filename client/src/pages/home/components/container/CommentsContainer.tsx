import { useState, useEffect, useRef } from "react";
import CommentInput from "../ui/CommentInput";
import Comment from "../ui/Comment";
import BlinkingLoadingCircles from "../../../../components/BlinkingLoadingCircles";
import { create, get } from "../../../../services/crud";
import { useCommentsStore, usePostStore } from "../../../../store";
import { isLoggedIn as checkUserLoggedIn } from "../../../../services/auth";
import { useNavigate } from "react-router-dom";

export default function CommentsContainer({ post }: { post: any }) {
  const [commentText, setCommentText] = useState("");
  const [showRepliesFor, setShowRepliesFor] = useState("");
  const [showCommentInputFor, setShowCommentInputFor] = useState("");
  const [showNewCommentInput, setShowNewCommentInput] = useState(false);
  const [noMoreComments, setNoMoreComments] = useState(false);
  const [noMoreReplies, setNoMoreReplies] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  const componentRefs = useRef<{ [key: string]: HTMLLIElement }>({});
  const lastDate = useRef<string | null>(null);
  const lastCommentId = useRef<string | null>(null);
  const lastReplyDate = useRef<string | null>(null);
  const lastReplyId = useRef<string | null>(null);
  const comments = useCommentsStore((state) => state.comments);
  const addToComments = useCommentsStore((state) => state.addToComments);
  const addNewComment = useCommentsStore((state) => state.addNewComment);
  const clearComments = useCommentsStore((state) => state.clearComments);
  const setReplies = useCommentsStore((state) => state.setReplies);
  const toggleCommentLike_store = useCommentsStore(
    (state) => state.toggleCommentLike
  );
  const incrementCommentsCount = usePostStore(
    (state) => state.incrementCommentsCount
  );
  const decrementCommentsCount = usePostStore(
    (state) => state.decrementCommentsCount
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
    setIsLoggedIn(checkUserLoggedIn());

    return () => {
      clearComments();
    };
  }, []);

  const sendComment = (
    e: any,
    {
      comment_for,
      parentId,
      reply_for,
    }: {
      comment_for: "post" | "comment";
      parentId: string;
      reply_for?: "string";
    }
  ) => {
    e.preventDefault();
    if (commentText.length > 0) {
      const content = commentText;
      let payload: any = { content, comment_for, parentId };

      if (comment_for === "comment") {
        payload.reply_for = reply_for;
      }

      setSendingComment(true);
      incrementCommentsCount(post._id);
      create("comment/create", payload)
        .then((res) => {
          if (comment_for === "post") {
            addNewComment(res.data);
          } else {
            setReplies([res.data], parentId);
            if (showRepliesFor !== parentId) {
              setShowRepliesFor(parentId);
            }
          }
          setCommentText("");
          setShowCommentInputFor("");
          setSendingComment(false);
          setShowNewCommentInput(false);
        })
        .catch((e) => {
          console.log(e);
          setSendingComment(false);
          decrementCommentsCount(post._id);
        });
    }
  };

  const fetchComments = () => {
    setCommentsLoading(true);
    const pageSize = 10;
    get("comment/get/" + post._id, {
      pageSize,
      lastDate: lastDate.current,
      lastCommentId: lastCommentId.current,
      comment_for: "post",
    })
      .then((res) => {
        if (res.data.length === 0 || res.data.length < pageSize) {
          setNoMoreComments(true);
        }
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
    if (showRepliesFor !== id) {
      lastReplyDate.current = null;
      lastReplyId.current = null;
      fetchReplies(id);
      setNoMoreReplies(false);
    }
    toggleShowRepliesButton(id);
  };

  const fetchReplies = (id: string) => {
    const pageSize = 5;
    setReplyLoading(true);
    get("comment/get/" + id, {
      pageSize,
      lastDate: lastReplyDate.current,
      lastCommentId: lastReplyId.current,
      comment_for: "comment",
    })
      .then((res) => {
        if (res.data.length === 0 || res.data.length < pageSize) {
          setNoMoreReplies(true);
        }
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

  const toggleShowRepliesButton = (id: string) => {
    setShowNewCommentInput(false);
    if (showRepliesFor === id) {
      setShowRepliesFor("");
    } else {
      setShowRepliesFor(id);
    }
  };

  const toggleShowCommentInput = (id: string) => {
    if (!isLoggedIn) return navigate("/auth");

    setShowNewCommentInput(false);
    if (showCommentInputFor === id) {
      setShowCommentInputFor("");
    } else {
      setShowCommentInputFor(id);
    }
  };

  const toggleNewCommentInput = () => {
    setShowCommentInputFor("");
    setShowRepliesFor("");
    setShowNewCommentInput((s) => !s);
  };

  const toggleCommentLike = (
    id: string,
    comment_for: "comment" | "post",
    isLike: boolean,
    parentId?: string
  ) => {
    if (!isLoggedIn) return navigate("/auth");

    toggleCommentLike_store(id, comment_for, isLike, parentId);

    create("comment/" + (isLike ? "like" : "unlike") + "/" + id, {})
      .then()
      .catch((e) => {
        console.log(e);
        toggleCommentLike_store(id, comment_for, isLike, parentId);
      });
  };

  // display no comments if no comments are found
  if (comments.length === 0 && !commentsLoading) {
    return (
      <div className="card bg-light p-3">
        <h6 className="text-muted">No Comments</h6>
        <div className="divider border-secondary mt-1"></div>
        {isLoggedIn && (
          <CommentInput
            sendingComment={sendingComment}
            commentText={commentText}
            onChange={setCommentText}
            onSubmit={(e) =>
              sendComment(e, { comment_for: "post", parentId: post._id })
            }
          />
        )}
      </div>
    );
  }

  return (
    <div className="card bg-light p-3">
      <div className="d-flex align-items-center">
        <h6 className="flex-grow-1">Comments</h6>
        <a
          onClick={toggleNewCommentInput}
          className="bell-icon bg-secondary me-1"
          style={{ width: 40, height: 40, cursor: "pointer" }}
          title="write comment"
        >
          {!showNewCommentInput && (
            <i className="fa fa-plus fa-lg text-white"></i>
          )}
          {showNewCommentInput && (
            <i className="fa fa-times fa-lg text-white"></i>
          )}
        </a>
      </div>
      <div className="divider border-secondary mt-1"></div>

      {/* to add a new comment */}
      {showNewCommentInput && isLoggedIn && (
        <div className="mb-3">
          <CommentInput
            sendingComment={sendingComment}
            commentText={commentText}
            onChange={setCommentText}
            onSubmit={(e) =>
              sendComment(e, { comment_for: "post", parentId: post._id })
            }
          />
        </div>
      )}

      <ul className="dz-comments-list">
        {comments.map((comment: any, i: number) => (
          <div key={i}>
            <li
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
                likeStatusChange={(id, isLike) =>
                  toggleCommentLike(id, "post", isLike)
                }
              />
            </li>
            {showCommentInputFor === comment._id && isLoggedIn && (
              <li>
                <CommentInput
                  sendingComment={sendingComment}
                  commentText={commentText}
                  onChange={setCommentText}
                  onSubmit={(e) =>
                    sendComment(e, {
                      comment_for: "comment",
                      parentId: comment._id,
                      reply_for: comment.author?._id,
                    })
                  }
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
                      likeStatusChange={(id, isLike) =>
                        toggleCommentLike(id, "comment", isLike, comment._id)
                      }
                    />
                  </li>
                  {showCommentInputFor === reply._id && isLoggedIn && (
                    <li className="parent-list">
                      <CommentInput
                        sendingComment={sendingComment}
                        commentText={commentText}
                        onChange={setCommentText}
                        onSubmit={(e) =>
                          sendComment(e, {
                            comment_for: "comment",
                            parentId: comment._id,
                            reply_for: reply.author?._id,
                          })
                        }
                      />
                    </li>
                  )}
                </div>
              ))}

            {showRepliesFor === comment._id &&
              !replyLoading &&
              !noMoreReplies && (
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

        {!commentsLoading && !noMoreComments && (
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
