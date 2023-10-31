import { useEffect, useState, useRef } from "react";
import PageLoading from "../../components/PageLoading";
import HomeHeader from "./components/HomeHeader";
import StoryBar from "./components/container/StoryBar";
import PostsContainer from "./components/container/PostsContainer";
import { get } from "../../services/crud";
import BlinkingLoadingCircles from "../../components/BlinkingLoadingCircles";

export default function Home() {
  const [pageLoading, setPageLoading] = useState(true);
  const [loadingAdditionalPosts, setLoadingAdditionalPosts] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const lastDate = useRef<string | null>(null);
  const lastPostId = useRef<string | null>(null);

  useEffect(() => {
    getFeed();

    // add event listener for scorll event to fetch additional posts on the bottom of the page
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch more posts when the user reaches the bottom of the page
  const handleScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      !loadingAdditionalPosts
    ) {
      setLoadingAdditionalPosts(true);
      await getFeed();
      setLoadingAdditionalPosts(false);
    }
  };

  const getFeed = async () => {
    return get("post/feed", {
      pageSize: 10,
      lastDate: lastDate.current,
      lastPostId: lastPostId.current,
    })
      .then((res) => {
        if (res.data.length === 0) {
          window.removeEventListener("scroll", handleScroll);
        }
        setFeed((f) => [...f, ...res.data]);
        lastDate.current = res.lastDate;
        lastPostId.current = res.lastPostId;
        setPageLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setPageLoading(false);
      });
  };

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

            {loadingAdditionalPosts && <BlinkingLoadingCircles />}
          </div>
        </div>
      </div>
      {/* Page Content End */}
    </>
  );
}
