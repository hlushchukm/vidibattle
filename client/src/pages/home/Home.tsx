import { useEffect, useState } from "react";
import PageLoading from "../../components/PageLoading";
import HomeHeader from "./components/HomeHeader";
import HomeFooterNav from "../../components/HomeFooterNav";
import StoryBar from "./components/container/StoryBar";
import PostsContainer from "./components/container/PostsContainer";

export default function Home() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    setPageLoading(false);
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
            <PostsContainer />
          </div>
        </div>
      </div>
      {/* Page Content End */}

      {/* Menubar  */}
      <HomeFooterNav />
      {/* Menubar  */}
    </>
  );
}
