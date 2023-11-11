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
import { formatResourceURL } from "../../services/asset-paths";

export default function Profile() {
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userId, setUserId] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [noUserFound, setNoUserFound] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [lastDate, setLastDate] = useState();
  const [lastPostId, setLastPostId] = useState();
  const [noMorePosts, setNoMorePosts] = useState(false);
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
  }, []);

  useEffect(() => {
    if (userId) {
      fetchProfileInfo(userId);
      fetchPosts(userId);
    }
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

  const fetchPosts = (id: string) => {
    setPostsLoading(true);
    const pageSize = 15;
    return get("post/timeline/" + id, {
      pageSize,
      lastDate,
      lastPostId,
    })
      .then((res) => {
        if (res.data.length === 0 || res.data.length < pageSize) {
          setPostsLoading(false);
          setNoMorePosts(true);
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
        setPosts((p) => [...p, ...photos]);
        setLastDate(res.lastDate);
        setLastPostId(res.lastPostId);
        setPostsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setPostsLoading(false);
      });
  };

  const toggleBlock = (is_block: boolean) => {
    setProfileData((profile: any) => ({
      ...profile,
      is_blocked: is_block,
    }));

    create(
      "user/" + (is_block ? "block/" : "unblock/") + profileData._id,
      {}
    ).catch((e) => {
      console.log(e);
      setProfileData((profile: any) => ({
        ...profile,
        is_blocked: !is_block,
      }));
    });
  };

  const toggleFollow = (is_follow: boolean) => {
    setProfileData((profile: any) => ({
      ...profile,
      is_followed: is_follow,
      followers_count: is_follow
        ? profile.followers_count + 1
        : profile.followers_count - 1,
    }));

    create(
      "user/" + (is_follow ? "follow/" : "unfollow/") + profileData._id,
      {}
    ).catch((e) => {
      console.log(e);
      setProfileData((profile: any) => ({
        ...profile,
        is_followed: !is_follow,
        followers_count: !is_follow
          ? profile.followers_count + 1
          : profile.followers_count - 1,
      }));
    });
  };

  if (pageLoading) {
    return <PageLoading />;
  }

  if (noUserFound) {
    return (
      <>
        <ProfileHeader isOwnProfile={isOwnProfile} />
        <UserNotFound />;
      </>
    );
  }

  return (
    <>
      <ProfileHeader isOwnProfile={isOwnProfile} />

      <div className="page-content">
        <div className="container profile-area">
          <BasicInfo
            profile={profileData}
            isLoggedIn={isLoggedIn}
            isOwnProfile={isOwnProfile}
            toggleBlock={() => toggleBlock(!profileData.is_blocked)}
            toggleFollow={() => toggleFollow(!profileData.is_followed)}
          />
          <div className="contant-section pb-5">
            {/* Posts, followers and following buttons */}
            <NavTabs
              posts={profileData?.posts_count}
              followers={profileData?.followers_count}
              following={profileData?.following_count}
              userId={isOwnProfile ? null : userId}
            />

            <ProfilePostsContainer
              posts={posts}
              loading={postsLoading}
              showMoreBtn={!noMorePosts}
              loadMore={() => fetchPosts(userId)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
