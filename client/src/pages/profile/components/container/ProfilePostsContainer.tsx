import { Link } from "react-router-dom";
import PlayBtn from "../../../../components/PlayBtn";
import PresentationModeBtns from "../ui/PresentationModeBtns";
import BlinkingLoadingCircles from "../../../../components/BlinkingLoadingCircles";
import {
  defaultPost,
  defaultThumbnail,
  handlePostImageError,
} from "../../../../services/asset-paths";

export default function ProfilePostsContainer({
  posts,
  loading,
  showMoreBtn,
  loadMore,
}: {
  posts: any;
  loading: boolean;
  showMoreBtn: boolean;
  loadMore: () => void;
}) {
  if (posts.length === 0 && !loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-light my-4 h1 text-secondary rounded"
        style={{ height: "250px", opacity: 0.7 }}
      >
        No Posts
      </div>
    );
  }

  return (
    <>
      <div className="title-bar my-2">
        <h6 className="mb-0">My Posts</h6>
        <div className="dz-tab style-2">
          <PresentationModeBtns />
        </div>
      </div>
      <div className="tab-content mb-5" id="myTabContent3">
        <div
          className="tab-pane fade show active"
          id="home-tab-pane3"
          role="tabpanel"
          aria-labelledby="home-tab"
          tabIndex={0}
        >
          <div className="dz-lightgallery style-2" id="lightgallery">
            {posts.map((post: any) => (
              <Link
                key={post._id}
                className="gallery-box position-relative"
                to={"/post/" + post._id}
                style={{
                  minHeight: "110px",
                  maxWidth: "350px",
                  background: "#77777730",
                }}
              >
                <img
                  src={
                    post.src ??
                    (post.media?.[0]?.type === "video"
                      ? defaultThumbnail
                      : defaultPost)
                  }
                  onError={handlePostImageError}
                />
                {post.media?.[0]?.type === "video" && <PlayBtn />}
              </Link>
            ))}
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="profile-tab-pane3"
          role="tabpanel"
          aria-labelledby="profile-tab"
          tabIndex={0}
        >
          <div className="dz-lightgallery" id="lightgallery-2">
            {posts.map((post: any) => (
              <Link
                key={post._id}
                className="gallery-box position-relative"
                to={"/post/" + post._id}
                style={{ minHeight: "200px", background: "#77777730" }}
              >
                <img
                  src={
                    post.src ??
                    (post.media?.[0]?.type === "video"
                      ? defaultThumbnail
                      : defaultPost)
                  }
                  onError={handlePostImageError}
                />
                {post.media?.[0]?.type === "video" && (
                  <div>
                    <PlayBtn />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div>
        {loading && <BlinkingLoadingCircles />}
        {!loading && showMoreBtn && (
          <div className="d-flex justify-content-center py-3">
            <button className="btn btn-secondary btn-sm" onClick={loadMore}>
              <i className="fa fa-repeat me-2"></i>
              <span>Show More</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
