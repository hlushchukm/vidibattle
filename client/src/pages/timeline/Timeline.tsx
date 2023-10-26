import { useEffect, useState } from "react";
import PageLoading from "../../components/PageLoading";
import TimelineHeader from "./components/TimelineHeader";
import { get } from "../../services/crud";
import { env } from "../../env";
import PhotoAlbum from "react-photo-album";

export default function Timeline() {
  const [pageLoading, setPageLoading] = useState(true);
  const [photos, setPhotos] = useState<any[]>([]);
  const [lastDate, setLastDate] = useState(null);
  const [lastPostId, setLastPostId] = useState([]);

  // TODO:

  /**
   * 1. search by posts by their caption. current user posts or other posts
   * 2. on video thumbnails, add a play icon and on click, take them to the explore page
   */

  useEffect(() => {
    // TODO: change id
    get("post/timeline/653a5e9300ecfb67556b51aa", {
      pageSize: 21,
      lastDate,
      lastPostId,
    })
      .then((res) => {
        console.log(res);
        const photos = res.data.map((data: any) => {
          if (data.media.length > 0) {
            const media = data.media[0];
            if (media?.type === "video") {
              data.src = `${env.VITE_API_URL}/file/${media?.thumbnail[0]?.filename}`;
            } else {
              data.src = `${env.VITE_API_URL}/file/${media?.filename}`;
            }
            data.width = 800;
            data.height = 600;
            console.log(data);
            // TODO: delete later
            data.src = "/assets/images/post/pic5.png";
          }
          return data;
        });
        setPhotos(photos);
        setLastDate(res.lastDate);
        setLastPostId(res.lastPostId);
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setPageLoading(false);
      });
  }, []);

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
        </div>
      </div>
    </>
  );
}
