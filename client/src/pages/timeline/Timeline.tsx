import { useEffect, useRef, useState } from "react";
import PageLoading from "../../components/PageLoading";
import TimelineHeader from "./components/TimelineHeader";
import { get } from "../../services/crud";
import { getUsername } from "../../services/auth";
import BlinkingLoadingCircles from "../../components/BlinkingLoadingCircles";
import DisplayModeBtns from "../../components/DisplayModeBtns";
import { useNavigate } from "react-router-dom";
import PlayBtn from "../../components/PlayBtn";
import {
  defaultPost,
  defaultThumbnail,
  formatResourceURL,
  handlePostImageError,
} from "../../services/asset-paths";
import { toast } from "react-toastify";

export default function Timeline() {
  const [pageLoading, setPageLoading] = useState(true);
  const [photos, setPhotos] = useState<any[]>([]);
  const lastDate = useRef<string | null>(null);
  const lastPostId = useRef<string | null>(null);
  const loadingAdditionalPosts = useRef<boolean>(false);
  // const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();

  // TODO:
  /**
   * 1. search by posts by their caption. current user posts or other posts
   * 2. on video thumbnails, add a play icon and on click, take them to the explore page
   */

  useEffect(() => {
    getTimeline();

    // add event listener for scorll event to fetch additional posts on the bottom of the page
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getTimeline = async () => {
    // setShowLoading(true);
    const pageSize = 15;
    return get("post/timeline/" + getUsername(), {
      pageSize,
      lastDate: lastDate.current,
      lastPostId: lastPostId.current,
    })
      .then((res) => {
        if (res.data.length === 0 || res.data.length < pageSize) {
          loadingAdditionalPosts.current = false;
          window.removeEventListener("scroll", handleScroll);
        }
        const photos = res.data.map((data: any) => {
          if (data.media.length > 0) {
            const media = data.media[0];
            if (media?.type === "video") {
              data.src = media?.thumbnail?.filename
                ? formatResourceURL(media?.thumbnail?.filename)
                : null;
            } else {
              data.src = media?.filename
                ? formatResourceURL(media?.filename)
                : null;
            }
          }
          return data;
        });
        setPhotos((p) => [...p, ...photos]);
        lastDate.current = res.lastDate;
        lastPostId.current = res.lastPostId;
        setPageLoading(false);
        // setShowLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response?.data?.message ?? "Error fetching posts");
        setPageLoading(false);
        // setShowLoading(false);
      });
  };

  // Fetch more posts when the user reaches the bottom of the page
  const handleScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 5 &&
      !loadingAdditionalPosts.current
    ) {
      loadingAdditionalPosts.current = true;
      await getTimeline();
      loadingAdditionalPosts.current = false;
    }
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  return (
    <>
      <TimelineHeader />

      <div className="page-content min-vh-100">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <div className="title-bar my-2">
              <h6 className="mb-0">My Posts</h6>
              <div className="dz-tab style-2">
                <DisplayModeBtns />
              </div>
            </div>

            <div className="tab-content" id="myTabContent2">
              <div
                className="tab-pane fade show active"
                id="grid2"
                role="tabpanel"
                aria-labelledby="home-tab"
                tabIndex={0}
              >
                <div className="dz-lightgallery style-2" id="lightgallery">
                  {photos.map((photo) => (
                    <a
                      key={photo._id}
                      className="gallery-box position-relative"
                      style={{ cursor: "pointer", background: "#77777730" }}
                      onClick={() => navigate("/post/" + photo._id)}
                    >
                      <img
                        src={
                          photo.src ??
                          (photo.media?.[0]?.type === "video"
                            ? defaultThumbnail
                            : defaultPost)
                        }
                        onError={handlePostImageError}
                      />
                      {photo.media?.[0]?.type === "video" && <PlayBtn />}
                    </a>
                  ))}
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="list2"
                role="tabpanel"
                aria-labelledby="profile-tab"
                tabIndex={0}
              >
                <div className="dz-lightgallery" id="lightgallery-2">
                  {photos.map((photo) => (
                    <a
                      key={photo._id}
                      className="gallery-box position-relative"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/post/" + photo._id)}
                    >
                      <img
                        src={
                          photo.src ??
                          (photo.media?.[0]?.type === "video"
                            ? defaultThumbnail
                            : defaultPost)
                        }
                        onError={handlePostImageError}
                      />
                      {photo.media?.[0]?.type === "video" && <PlayBtn />}
                    </a>
                  ))}
                </div>
              </div>
              {loadingAdditionalPosts.current && <BlinkingLoadingCircles />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
