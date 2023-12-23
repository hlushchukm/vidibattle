import { useState } from "react";
import BottomModalContainer from "./BottomModalContainer";

export default function ReportModal({
  reportPost,
}: {
  reportPost: (comment: string) => void;
}) {
  const [comment, setComment] = useState("");

  return (
    <BottomModalContainer
      onClose={() => {
        console.log("closed");
        setComment("");
      }}
    >
      <div className="">
        <textarea
          className="w-100 form-control"
          name="comment"
          placeholder="Write your comment about the post ... "
          rows={8}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="d-flex justify-content-center align-items-center py-2 mt-1">
          <button
            onClick={() => reportPost(comment)}
            className="btn btn-primary w-100"
            style={{
              maxWidth: "500px",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            Submit Report
          </button>
        </div>
      </div>
    </BottomModalContainer>
  );
}
