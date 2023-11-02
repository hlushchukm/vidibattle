import { useEffect, useState } from "react";
import { getUserId } from "../../services/auth";
import { useParams } from "react-router-dom";
import NavTabs from "./components/ui/NavTabs";
import ProfilePostsContainer from "./components/container/ProfilePostsContainer";
import BasicInfo from "./components/container/BasicInfo";
import ProfileHeader from "./components/ProfileHeader";
import PageLoading from "../../components/PageLoading";
import { create, get } from "../../services/crud";
import UserNotFound from "../../components/UserNotFound";

export default function Profile() {
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userId, setUserId] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [noUserFound, setNoUserFound] = useState(false);
  const params = useParams();

  useEffect(() => {
    setLoggedIn(getUserId() !== null && getUserId() !== null);

    if (params.id && params.id !== getUserId()) {
      setIsOwnProfile(false);
      setUserId(params.id);
    } else {
      setIsOwnProfile(true);
      setUserId(getUserId() ?? "");
    }

    const dummyPosts = [
      { _id: 1, src: "/assets/images/post/pic1.png" },
      { _id: 2, src: "/assets/images/post/pic2.png" },
      { _id: 3, src: "/assets/images/post/pic3.png" },
      { _id: 4, src: "/assets/images/post/pic4.png" },
      { _id: 5, src: "/assets/images/post/pic5.png" },
      { _id: 6, src: "/assets/images/post/pic6.png" },
    ];

    setPosts(dummyPosts);
  }, []);

  useEffect(() => {
    if (userId) fetchProfileInfo(userId);
  }, [userId]);

  const fetchProfileInfo = (id: string) => {
    get("user/profileInfo/" + id)
      .then((res) => {
        setProfileData(res.data);
        setPageLoading(false);
      })
      .catch((e) => {
        if (e.response?.status) {
          setNoUserFound(true);
        }
        setPageLoading(false);
      });
  };

  const toggleBlock = (is_block: boolean) => {
    setProfileData((profile: any) => ({
      ...profile,
      is_blocked: is_block,
    }));

    create("user/" + (is_block ? "block/" : "unblock/") + profileData._id, {})
      .then()
      .catch((e) => {
        console.log(e);
        setProfileData((profile: any) => ({
          ...profile,
          is_blocked: !is_block,
        }));
      });
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  if (noUserFound) {
    return (
      <>
        <ProfileHeader />
        <UserNotFound />;
      </>
    );
  }

  // TODO: on follow/unfollow update followers count and is_followed property

  return (
    <>
      <ProfileHeader />

      <div className="page-content">
        <div className="container profile-area">
          <BasicInfo
            profile={profileData}
            isLoggedIn={isLoggedIn}
            isOwnProfile={isOwnProfile}
            toggleBlock={() => toggleBlock(!profileData.is_blocked)}
          />
          <div className="contant-section">
            {/* Posts, followers and following buttons */}
            <NavTabs
              posts={profileData?.posts_count}
              followers={profileData?.followers_count}
              following={profileData?.following_count}
              userId={isOwnProfile ? null : userId}
            />

            <ProfilePostsContainer posts={posts} />
          </div>
        </div>
      </div>
    </>
  );
}
