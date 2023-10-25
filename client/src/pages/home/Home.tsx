import { useEffect, useState } from "react";
import PageLoading from "../../components/PageLoading";
import HomeHeader from "./components/HomeHeader";
import StoryBar from "./components/container/StoryBar";
import PostsContainer from "./components/container/PostsContainer";
import { get } from "../../services/crud";

export default function Home() {
  const [pageLoading, setPageLoading] = useState(true);
  const [feed, setFeed] = useState([]);
  const [lastDate, setLastDate] = useState(null);
  const [lastPostId, setLastPostId] = useState([]);

  useEffect(() => {
    get("post/feed", {
      // TODO: use authenticated user's ID
      // TODO: fetch more feed on scroll
      userId: "6535242d5968d6f6c3cc491f",
      pageSize: 4,
      lastDate,
      lastPostId,
    })
      .then((res) => {
        console.log(res);
        setFeed(res.data);
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
      <HomeHeader />

      {/* Sidebar  */}
      {/* TODO: figure out the sidebar - it shows on home page header btn click */}
      {/* Sidebar End  */}

      {/* Page Content  */}
      <div className="page-content">
        <div className="content-inner pt-0">
          <div className="container bottom-content">
            {/* STORY  */}
            <StoryBar />

            {/* POSTS */}
            <PostsContainer feed={feed} />
          </div>
        </div>
      </div>
      {/* Page Content End */}
    </>
  );
}
