import { formatResourceURL, handleProfileImageError } from "../../../../services/asset-paths";
import { getUser } from "../../../../services/auth";

export default function CommentInput({
  commentText,
  sendingComment,
  onChange,
  onSubmit,
}: {
  commentText: string;
  sendingComment: boolean;
  onChange: (e: string) => void;
  onSubmit: (e: any) => void;
}) {
  return (
    <>
      <div className="commnet-footer d-flex align-items-center justify-space-between w-100">
        <div className="d-flex align-items-center flex-1">
          <div className="media media-35 rounded-circle">
            <img
              src={formatResourceURL(getUser().profile_img)}
              onError={handleProfileImageError}
              alt="/"
            />
          </div>
          <form
            className="d-flex flex-grow-1 border-primary ms-3"
            style={{ borderBottom: "1px solid" }}
            onSubmit={onSubmit}
          >
            <div className="flex-grow-1">
              <input
                type="text"
                className="h-auto py-1 pe-2 border-0 bg-transparent w-100"
                placeholder="Write your comment"
                autoFocus={true}
                value={commentText}
                onChange={(e) => onChange(e.target.value)}
                disabled={sendingComment}
              />
            </div>
            <button
              className={`btn p-1 ${commentText.length > 0 ? "" : "disabled"}`}
              type="submit"
              style={{
                cursor: "pointer",
              }}
            >
              {sendingComment && (
                <i
                  className="fa fa-spinner fa-spin fa-lg text-primary"
                  aria-hidden="true"
                ></i>
              )}
              {!sendingComment && (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21.4499 11.11L3.44989 2.11C3.27295 2.0187 3.07279 1.9823 2.87503 2.00546C2.67728 2.02862 2.49094 2.11029 2.33989 2.24C2.18946 2.37064 2.08149 2.54325 2.02982 2.73567C1.97815 2.9281 1.98514 3.13157 2.04989 3.32L4.99989 12L2.09989 20.68C2.05015 20.8267 2.03517 20.983 2.05613 21.1364C2.0771 21.2899 2.13344 21.4364 2.2207 21.5644C2.30797 21.6924 2.42378 21.7984 2.559 21.874C2.69422 21.9496 2.84515 21.9927 2.99989 22C3.15643 21.9991 3.31057 21.9614 3.44989 21.89L21.4499 12.89C21.6137 12.8061 21.7512 12.6786 21.8471 12.5216C21.9431 12.3645 21.9939 12.184 21.9939 12C21.9939 11.8159 21.9431 11.6355 21.8471 11.4784C21.7512 11.3214 21.6137 11.1939 21.4499 11.11ZM4.70989 19L6.70989 13H16.7099L4.70989 19ZM6.70989 11L4.70989 5L16.7599 11H6.70989Z"
                    fill="var(--primary)"
                  ></path>
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
