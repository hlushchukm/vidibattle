import { useEffect, useRef, useState } from "react";
import PageLoading from "../../components/PageLoading";
import TimelineHeader from "./components/TimelineHeader";
import { get } from "../../services/crud";
import { env } from "../../env";
import PhotoAlbum from "react-photo-album";
import { getUserId } from "../../services/auth";
import BlinkingLoadingCircles from "../../components/BlinkingLoadingCircles";

export default function Timeline() {
  const [pageLoading, setPageLoading] = useState(true);
  const [photos, setPhotos] = useState<any[]>([]);
  const lastDate = useRef<string | null>(null);
  const lastPostId = useRef<string | null>(null);
  const [loadingAdditionalPosts, setLoadingAdditionalPosts] = useState(false);

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
    return get("post/timeline/" + getUserId(), {
      pageSize: 21,
      lastDate: lastDate.current,
      lastPostId: lastPostId.current,
    })
      .then((res) => {
        if (res.data.length === 0) {
          window.removeEventListener("scroll", handleScroll);
        }
        const photos = res.data.map((data: any) => {
          if (data.media.length > 0) {
            const media = data.media[0];
            if (media?.type === "video") {
              data.src = `${env.VITE_API_URL}/media/${media?.thumbnail?.filename}`;
            } else {
              data.src = `${env.VITE_API_URL}/media/${media?.filename}`;
            }
            data.width = 400;
            data.height = 300;
            console.log(data);
          }
          return data;
        });
        setPhotos((p) => [...p, ...photos]);
        lastDate.current = res.lastDate;
        lastPostId.current = res.lastPostId;
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setPageLoading(false);
      });
  };

  // Fetch more posts when the user reaches the bottom of the page
  const handleScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      !loadingAdditionalPosts
    ) {
      setLoadingAdditionalPosts(true);
      await getTimeline();
      setLoadingAdditionalPosts(false);
    }
  };

  if (pageLoading) {
    return <PageLoading />;
  }
  return (
    <>
      <TimelineHeader />

      <div className="page-content vh-100">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            <PhotoAlbum
              layout="rows"
              targetRowHeight={250}
              spacing={4}
              photos={photos}
            />
          </div>
          {loadingAdditionalPosts && <BlinkingLoadingCircles />}
        </div>
      </div>
    </>
  );
}
