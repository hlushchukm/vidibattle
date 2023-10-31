import { useState, useEffect, useRef } from "react";
import CommentInput from "../ui/CommentInput";
import Comment from "../ui/Comment";
import BlinkingLoadingCircles from "../../../../components/BlinkingLoadingCircles";

export default function CommentsContainer({ post }: { post: any }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [showRepliesFor, setShowRepliesFor] = useState("");
  const [showCommentInputFor, setShowCommentInputFor] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const componentRefs = useRef<{ [key: string]: HTMLLIElement }>({});

  useEffect(() => {
    // TODO: send request to fetch requests here
    fetchComments();
    setComments(dummyData);
  }, []);

  const dummyData = [
    {
      _id: 1,
      name: "Lucas Mokmana",
      content:
        "Awesome app i ever used. great structure, and customizable for multipurpose. 😀😀",
      likes_count: 3,
      is_liked: true,
      has_reply: true,
      profile_img: "assets/images/stories/small/pic1.jpg",
      comments: [
        {
          _id: 11,
          name: "Lucas",
          content: "Yes I am also use this.🙂",
          likes_count: 2,
          is_liked: false,
          has_reply: false,
          profile_img: "assets/images/stories/small/pic2.jpg",
        },
        {
          _id: 12,
          name: "John Doe",
          content: "Really Nice.👍",
          likes_count: 1,
          is_liked: true,
          has_reply: false,
          profile_img: "assets/images/stories/small/pic7.jpg",
        },
      ],
    },
    {
      _id: 2,
      name: "Hendri Lee",
      content: "Nice work... 😍😍",
      likes_count: 10,
      is_liked: false,
      has_reply: false,
      profile_img: "assets/images/stories/small/pic3.jpg",
    },
    {
      _id: 3,
      name: "Brian Harahap",
      content: "We will always be friends until we are so old and senile.",
      likes_count: 2,
      is_liked: false,
      has_reply: false,
      profile_img: "assets/images/stories/small/pic4.jpg",
    },
    {
      _id: 4,
      name: "Dons John",
      content: "Wow, you are flawless, intelligent, and bright.🤗🤗",
      likes_count: 6,
      is_liked: true,
      has_reply: false,
      profile_img: "assets/images/stories/small/pic5.jpg",
    },
    {
      _id: 5,
      name: "Eric Leew",
      content:
        "Finding a loving, cute, generous, caring, and intelligent pal is so hard. So, my advice to you all in the picture, never lose me.",
      likes_count: 0,
      is_liked: false,
      has_reply: true,
      profile_img: "assets/images/stories/small/pic6.jpg",
    },
  ];

  const sendComment = (e: any) => {
    e.preventDefault();
    if (commentText.length > 0) {
      setCommentText("");
      setShowCommentInputFor("");
    }
  };

  const fetchComments = () => {
    console.log("fetch more comments");
    setCommentsLoading(true);
    setTimeout(() => setCommentsLoading(false), 5000);
  };

  const loadReplies = (id: string) => {
    // TODO: when loading replies, if it has already been loaded, show that instead of sending a new request
    // TODO: hide 'show more' buttons if there are no more comments/replies
    fetchReplies(id);
    toggleShowButton(id);
  };

  const fetchReplies = (id: string) => {
    console.log(id);
    setReplyLoading(true);

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
